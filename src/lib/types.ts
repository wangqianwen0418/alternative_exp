/**
 * lib/types
 *
 * Shared TypeScript types used across the app.
 *
 * These types primarily describe:
 * - the structured "insight" schema produced from free-text user statements,
 * - visualization configuration (`TGraph` and `TAnnotation`),
 * - and common page/case shapes used by the UI.
 */

export type TPageBase = {
  userText: string;
  initVis: TGraph;
  secondVis: 'beeswarm' | 'bar' | 'scatter' | string | undefined;
  insight: TInsight;
};

export type TCase = TPageBase & {
  pageName: string; // show on the drawer
  href: string;
};

export type TQuestion = TPageBase & {
  pageName: 'question';
  testCondition: 'random vis' | 'ours';
  index: number;
  groundTruth: boolean;
  newVis?: TGraph;
  condition?: 'RANDOM' | 'OPTIMAL';
};

export type TAnnotation =
  | {
      type: 'highlightDataPoints';
      dataPoints: number[]; // An array of data points to highlight
      label?: string;
    }
  | {
      type: 'highlightRange';
      xRange?: [number, number];
      yRange?: [number, number];
      label?: string;
      feature?: string;
    } // A range along X axis
  | {
      type: 'singleLine';
      xValue?: number;
      yValue?: number;
      label?: string;
    } // A vertical line at a specific X/Y value
  | {
      type: 'twoColorRange';
      range: Array<[number, number]>;
      label?: string;
    };

export type TGraph = {
  /**
   * High-level visualization type chosen by the LLM.
   * Consumers map this onto concrete chart components.
   */
  graphType: 'SWARM' | 'SCATTER' | 'BAR' | 'HEATMAP' | 'TWO-SCATTER';
  xValues: string;
  yValues: string;
  annotation?: TAnnotation;
  featuresToHighlight?: string[];
  featuresToShow?: string[];
  colorValues?: string;
};

export type TInsight =
  | TInsight1
  | TInsight2
  | TInsight3
  | TInsight4
  | undefined;

export type TInsight1 = {
  type: 'read';
  variables: [TVariable, number];
  relation: 'greater than' | 'less than' | 'equal to';
  condition: { featureName: string; range: [number, number] } | undefined;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};

export type TInsight2 = {
  type: 'comparison';
  variables: [TVariable, TVariable];
  relation: 'greater than' | 'less than' | 'equal to';
  condition: { featureName: string; range: [number, number] } | undefined;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};

export type TInsight3 = {
  type: 'correlation';
  variables: [TVariable, TVariable];
  relation:
    | 'positively correlated'
    | 'negatively correlated'
    | 'not correlated';
  condition: { featureName: string; range: [number, number] } | undefined;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};

export type TInsight4 = {
  type: 'featureInteraction';
  variables: [TVariable, TVariable];
  relation: 'same' | 'different';
  condition: { featureName: string; range: [number, number][] } | undefined;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};

export type TVariable = {
  featureName: string;
  transform: 'average' | 'deviation of' | '' | undefined; // relax
  type:
    | 'value of'
    | 'contribution to the prediction of'
    | `number of instances ${string} of`
    | '';
};
