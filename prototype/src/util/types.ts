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
  newVis?: TGraph
  condition?: "RANDOM" | "OPTIMAL",
};

export type TAnnotation =
  | { type: "highlightDataPoints"; dataPoints: number[]; label?: string } // An array of data points to highlight
  | {
      type: "highlightRange";
      xRange?: [number, number];
      yRange?: [number, number];
      label?: string, feature?: string;
    } // A range along X axis
  | { type: "singleLine"; xValue?: number; yValue?: number; label?: string } // A vertical line at a specific X/Y value
  | { type: "twoColorRange"; range: Array<[number,number]>; label?: string };

export type TGraph = {
  graphType: "SWARM" | "SCATTER" | "BAR" | "HEATMAP" | "TWO-SCATTER";
  xValues: string;
  yValues: string;
  annotation?: TAnnotation;
  featuresToHighlight?: string[];
  featuresToShow?: string[];
  colorValues?: string;
};

export type TCondition = {
  featureName: string;
  range: [number, number] | [undefined, number] | [number, undefined];
}

export type TInsight =
  | TInsight1
  | TInsight2
  | TInsight3
  | undefined;

export type TInsight1 = {
  variables: [TVariable, number];
  type: "read";
  relation: "is";
  condition?: TCondition;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};

export type TInsight2 = {
  variables: [TVariable, TVariable] | [TVariable, number];
  type: "comparison";
  relation: "greater than" | "less than" | "equal to";
  condition?:TCondition;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};

export type TInsight3 = {
  variables: [TVariable, TVariable];
  type: "correlation";
  relation: "positively correlated" | "negatively correlated" | "not correlated";
  condition?: TCondition;
  optimalGraph: TGraph;
  randomGraph?: TGraph;
};



export type TVariable = {
  featureName: string;
  transform: "average" | "deviation of" | "" | undefined; //relax
  type: "value of" | "attribution of" | `number of instances ${string} of` | "";
};