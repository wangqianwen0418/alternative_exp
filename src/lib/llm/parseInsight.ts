import { TGraph, TInsight, TVariable } from 'lib/types';

/**
 * lib/llm/parseInsight
 *
 * Defensive parser/normalizer for the JSON returned by the LLM.
 *
 * The LLM output isn't guaranteed to perfectly match our TypeScript types, so
 * this file contains small helpers to:
 * - validate shapes,
 * - coerce common string/number variants,
 * - normalize enums (graph type, relationship),
 * - and return `undefined` when the response can't be trusted.
 */

type RawLLM = Record<string, unknown>;

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function normalizeGraphType(raw: unknown): TGraph['graphType'] | undefined {
  if (typeof raw !== 'string') return undefined;
  const v = raw.trim().toUpperCase();
  if (v === 'SWARM') return 'SWARM';
  if (v === 'SCATTER') return 'SCATTER';
  if (v === 'BAR') return 'BAR';
  if (v === 'HEATMAP') return 'HEATMAP';
  if (v === 'TWO-SCATTER' || v === 'TWO_SCATTER' || v === 'TWO SCATTER')
    return 'TWO-SCATTER';
  if (v === 'SWARM') return 'SWARM';
  return undefined;
}

function normalizeRelationForType(type: string, raw: unknown): any {
  if (typeof raw !== 'string') return undefined;
  const v = raw.trim().toLowerCase();

  if (type === 'correlation') {
    if (v.includes('positive')) return 'positively correlated';
    if (v.includes('negative')) return 'negatively correlated';
    if (v.includes('not')) return 'not correlated';
    if (v === 'positively') return 'positively correlated';
    if (v === 'negatively') return 'negatively correlated';
    return undefined;
  }

  if (v.includes('greater') || v.includes('larger') || v.includes('more'))
    return 'greater than';
  if (v.includes('less') || v.includes('smaller') || v.includes('fewer'))
    return 'less than';
  if (v.includes('equal') || v.includes('same')) return 'equal to';
  return undefined;
}

function normalizeType(
  raw: RawLLM,
): 'read' | 'comparison' | 'correlation' | 'featureInteraction' | undefined {
  const typeRaw = raw['Type'];
  if (typeof typeRaw === 'string') {
    const t = typeRaw.trim().toLowerCase();
    if (t === 'read') return 'read';
    if (t === 'comparison') return 'comparison';
    if (t === 'correlation') return 'correlation';
    if (t === 'featureinteraction' || t === 'feature interaction')
      return 'featureInteraction';
  }

  const cat = raw['Category'];
  const catNum = toNumber(cat);
  if (catNum === 1) return 'read';
  if (catNum === 2) return 'comparison';
  if (catNum === 3) return 'correlation';
  if (catNum === 4) return 'featureInteraction';
  return undefined;
}

function parseVariables(raw: unknown): TVariable[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const vars: TVariable[] = [];
  for (const item of raw) {
    if (!isObject(item)) continue;
    const featureName = item.featureName;
    const transform = item.transform;
    const type = item.type;

    if (typeof featureName !== 'string') continue;
    if (typeof type !== 'string') continue;

    vars.push({
      featureName,
      transform: typeof transform === 'string' ? (transform as any) : undefined,
      type: type as any,
    });
  }
  return vars.length ? vars : [];
}

function parseGraph(raw: RawLLM): TGraph | undefined {
  const graphType = normalizeGraphType(raw['GraphType'] ?? raw['graphType']);
  const xValues = raw['XValues'] ?? raw['xValues'];
  const yValues = raw['YValues'] ?? raw['yValues'];

  if (!graphType) return undefined;
  if (typeof xValues !== 'string') return undefined;
  if (typeof yValues !== 'string') return undefined;

  const graph: TGraph = {
    graphType,
    xValues,
    yValues,
  };

  const fth = raw['FeaturesToHighlight'] ?? raw['featuresToHighlight'];
  if (Array.isArray(fth))
    graph.featuresToHighlight = fth.filter(
      (x): x is string => typeof x === 'string',
    );

  const fts = raw['FeaturesToShow'] ?? raw['featuresToShow'];
  if (Array.isArray(fts))
    graph.featuresToShow = fts.filter(
      (x): x is string => typeof x === 'string',
    );

  const cv = raw['ColorValues'] ?? raw['colorValues'];
  if (typeof cv === 'string') graph.colorValues = cv;

  const ann = raw['Annotation'] ?? raw['annotation'];
  if (isObject(ann) && Object.keys(ann).length > 0)
    graph.annotation = ann as any;

  return graph;
}

/**
 * Convert an unknown JSON payload (from the LLM) into a typed `TInsight`.
 *
 * Returns `undefined` when required fields are missing/invalid or when the LLM
 * explicitly signaled an error.
 */
export function parseInsightFromLLMJson(raw: unknown): TInsight {
  /**
   * Main entry point used by the UI.
   *
   * Returns a typed `TInsight` if the LLM response can be validated, otherwise
   * returns `undefined` so callers can show an error or ask for re-entry.
   */
  if (!isObject(raw)) return undefined;

  if (raw['features'] === 'ERROR' || raw['prediction'] === 'ERROR')
    return undefined;

  const type = normalizeType(raw);
  if (!type) return undefined;

  const vars = parseVariables(raw['Variables'] ?? raw['variables']);
  if (!vars) return undefined;

  const condition = isObject(raw['Condition'] ?? raw['condition'])
    ? ((raw['Condition'] ?? raw['condition']) as any)
    : undefined;

  const optimalGraph = parseGraph(raw);
  if (!optimalGraph) return undefined;

  const relation = normalizeRelationForType(
    type,
    raw['Relationship'] ?? raw['relation'],
  );
  if (!relation) return undefined;

  const numbersRaw = raw['Numbers'] ?? raw['numbers'];
  const numbers = Array.isArray(numbersRaw)
    ? numbersRaw.map(toNumber).filter((n): n is number => n !== undefined)
    : [];

  if (type === 'read') {
    const first = vars[0];
    const n = numbers[0];
    if (!first || n === undefined) return undefined;
    return {
      type,
      variables: [first, n],
      relation,
      condition,
      optimalGraph,
    } as any;
  }

  if (type === 'comparison') {
    const a = vars[0];
    const b = vars[1];
    if (!a || !b) return undefined;
    return {
      type,
      variables: [a, b],
      relation,
      condition,
      optimalGraph,
    } as any;
  }

  if (type === 'correlation') {
    const a = vars[0];
    const b = vars[1];
    if (!a || !b) return undefined;
    return {
      type,
      variables: [a, b],
      relation,
      condition,
      optimalGraph,
    } as any;
  }

  const a = vars[0];
  const b = vars[1];
  if (!a || !b) return undefined;
  const relRaw = raw['Relationship'];
  let rel: 'same' | 'different' | undefined;
  if (typeof relRaw === 'string') {
    const v = relRaw.toLowerCase();
    if (v.includes('same')) rel = 'same';
    if (v.includes('different') || v.includes('diff')) rel = 'different';
  }
  return {
    type: 'featureInteraction',
    variables: [a, b],
    relation: rel ?? 'different',
    condition,
    optimalGraph,
  } as any;
}
