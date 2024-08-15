import React from "react";
import { TCase, TInsight } from "./types";

export const GenerateTextTemplates = (insight: TInsight) => {
  if (!insight) return "";

  if (insight?.type === "read") {
    const [var1, var2] = insight.variables;
    return (
      <span className="formatted">
        {" "}
        The{" "}
        <span className="label transform">
          {var1.transform} {var1.type}{" "}
        </span>{" "}
        of <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> than{" "}
        <span className="label constant">{var2}</span>.{" "}
      </span>
    );
  } else if (insight?.type === "comparison") {
    const [var1, var2] = insight.variables;
    return (
      <span className="formatted">
        {" "}
        The{" "}
        <span className="label transform">
          {" "}
          {var1.transform} {var1.type}{" "}
        </span>{" "}
        of <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> the{" "}
        <span className="label transform">
          {var2.transform} {var1.type}{" "}
        </span>{" "}
        of
        <span className="label featureName">{var2.featureName}</span>.{" "}
      </span>
    );
  } else if (insight?.type === "correlation") {
    const [var1, var2] = insight.variables;
    return `As the ${var1.featureName} increases, it will ${
      insight.relation == "positively" ? "more" : "less"
    } to the prediction.`;
  } else if (insight?.type === "fetureaInteraction") {
    const [var1, var2] = insight.variables;
    return `The ${var1.featureName} is ${insight.relation} with ${var2}.`;
  }
};
