type TPageBase = {
  userText: string;
  initVis: TGraph;
  secondVis: "beeswarm" | "bar" | "scatter" | string | undefined;
  insight: TInsight;
};

export type TCase = TPageBase & {
  pageName: string; // show on the drawer
  href: string;
};

export type TQuestion = TPageBase & {
  pageName: "question";
  testCondition: "random vis" | "ours";
  index: number;
  groundTruth: boolean;
  firstVis?: TGraph;
  newVis?: TGraph
};

export type TAnnotation =
  | { type: "highlightDataPoints"; dataPoints: number[]; label?: string } // An array of data points to highlight
  | {
      type: "highlightRange";
      xRange?: [number, number];
      yRange?: [number, number];
      label?: string, feature?: string;
    } // A range along X axis
  | { type: "singleLine"; xValue?: number; yValue?: number; label?: string }; // A vertical line at a specific X value

export type TGraph = {
  graphType: "Swarm" | "Scatter" | "Bar" | "Heatmap" | "two-scatter";
  xValues: string;
  yValues: string;
  annotation?: TAnnotation[];
  features?: string[];
};

export type TInsight =
  | TInsight1
  | TInsight2
  | TInsight3
  | TInsight4
  | undefined;

export type TInsight1 = {
  variables: [TVariable, number];
  type: "read";
  relation: "greater than" | "less than" | "equal to";
  condition: { featureName: string; range: [number, number] } | undefined;
  graph: TGraph;
};

export type TInsight2 = {
  variables: [TVariable, TVariable];
  type: "comparison";
  relation: "greater than" | "less than" | "equal to";
  condition: { featureName: string; range: [number, number] } | undefined;
  graph: TGraph;
};

export type TInsight3 = {
  variables: [TVariable, TVariable];
  type: "correlation";
  relation: "positively correlated" | "negatively correlated" | "not correlated";
  condition: { featureName: string; range: [number, number] } | undefined;
  graph: TGraph;
};

export type TInsight4 = {
  variables: [TVariable, TVariable];
  type: "featureInteraction";
  relation: "same" | "different";
  condition: { featureName: string; range: [number, number][] } | undefined;
  graph: TGraph;
};

export type TVariable = {
  featureName: string;
  transform: "average" | "deviation of" | "" | undefined; //relax
  type: "value of" | "contribution to the prediction of" | `number of instances ${string} of` | "";
};