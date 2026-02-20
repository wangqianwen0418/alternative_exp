/**
 * src/components/charts/featureUtils
 *
 * Shared helpers for feature selection/filtering.
 *
 * Multiple charts accept `featuresToShow` and need a consistent default list.
 * Centralizing this logic prevents drift between visualizations.
 */

export const DEFAULT_FEATURES_TO_SHOW = [
  'serum triglycerides level',
  'bmi',
  'blood pressure',
  'age',
  'sex',
];

export function getEffectiveFeaturesToShow(featuresToShow?: string[]) {
  return featuresToShow && featuresToShow.length > 0
    ? featuresToShow
    : DEFAULT_FEATURES_TO_SHOW;
}

export function getFilteredIndices(
  allLabels: string[],
  featuresToShow: string[],
) {
  return allLabels.reduce((acc: number[], name, idx) => {
    if (featuresToShow.includes(name)) acc.push(idx);
    return acc;
  }, []);
}
