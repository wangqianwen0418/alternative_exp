import * as d3 from 'd3';

/**
 * src/components/charts/d3Utils
 *
 * Small D3 helpers shared across chart components.
 *
 * These helpers are intentionally lightweight and imperative—designed to reduce
 * repeated boilerplate (axes, cleanup, formatting) without changing the
 * structure or calculations of any chart.
 */

export function clearGroups(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  selectors: string[],
) {
  selectors.forEach((s) => container.selectAll(s).remove());
}

export function appendAxis(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  className: string,
  transform: string,
  axis:
    | d3.Axis<number | { valueOf(): number }>
    | d3.Axis<string>
    | d3.Axis<any>,
) {
  const g = container
    .append('g')
    .attr('class', className)
    .attr('transform', transform);
  // d3 axis typing is messy; keep the call generic.
  (g as any).call(axis);
  return g;
}

export function appendAxisTitle(
  axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  text: string,
  attrs: Record<string, string | number>,
) {
  const t = axisGroup
    .append('text')
    .attr('class', 'axis-title')
    .attr('text-anchor', 'middle')
    .attr('fill', 'black');

  Object.entries(attrs).forEach(([k, v]) => t.attr(k, v as any));
  t.text(text);
}

export function formatFixed2(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '';
  const v = Math.abs(value) < 0.005 ? 0 : value;
  return v.toFixed(2);
}

/**
 * Truncate labels to fit within a pixel width using Canvas text measurement.
 *
 * Defensive for SSR environments (returns original labels when `document` or
 * Canvas isn't available).
 */
export function truncateLabels(
  labels: string[],
  maxWidthPx: number,
  fontPx: number,
  fontFamily = 'sans-serif',
): string[] {
  if (typeof document === 'undefined') return labels;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return labels;

  ctx.font = `${fontPx}px ${fontFamily}`;

  return labels.map((label) => {
    let truncated = label;

    while (
      ctx.measureText(truncated).width > maxWidthPx &&
      truncated.length > 1
    ) {
      truncated = truncated.slice(0, -1);
    }

    if (truncated !== label) {
      while (
        ctx.measureText(truncated + '...').width > maxWidthPx &&
        truncated.length > 1
      ) {
        truncated = truncated.slice(0, -1);
      }
      truncated += '...';
    }

    return truncated;
  });
}
