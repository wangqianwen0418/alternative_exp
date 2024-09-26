import React from "react";
import { TCase, TInsight } from "./types";

export const GenerateTextTemplates = (insight: TInsight) => {
  if (!insight) return "";

  if (insight?.type === "read") {
    const [var1, var2] = insight.variables;
    return (
      <span className="formatted">
        The{" "}
        <span className="label transform">
          {var1.transform} {var1.type}{" "}
        </span>{" "}
        <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> than{" "}
        <span className="label constant">{var2}</span>{" "}
        {/* Add condition to check if insight.condition is not empty */}
        {insight.condition && Object.keys(insight.condition).length > 0 && (
          <>
            {" "}
            when{" "}
            <span className="label featureName">
              {insight.condition.featureName}
            </span>{" "}
            is in the interval{" "}
            <span className="label condition-range">
              [{insight.condition.range[0]}, {insight.condition.range[1]}]
            </span>
          </>
        )}
        .
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
        <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> than the{" "}
        <span className="label transform">
          {var2.transform} {var1.type}{" "}
        </span>{" "}
        
        <span className="label featureName">{var2.featureName}</span>.{" "}
        {/* Add condition to check if insight.condition is not empty */}
        {insight.condition && Object.keys(insight.condition).length > 0 && (
          <>
            {" "}
            when{" "}
            <span className="label featureName">
              {insight.condition.featureName}
            </span>{" "}
            is in the interval{" "}
            <span className="label condition-range">
              [{insight.condition.range[0]}, {insight.condition.range[1]}]
            </span>
            .
          </>
        )}
      </span>
    );
  } else if (insight?.type === "correlation") {
    const [var1, var2] = insight.variables;
    console.log("VAR 2: ");
    console.log(var2);

    return (
      <span className="formatted">
        The{" "}
        <span className="label transform">
          {var1.transform} {var1.type}
        </span>
        <span className="label featureName">{var1.featureName}</span>
        is <span className="label relation">{insight.relation}</span> correlated
        with the
        <span className="label transform">
          {var2.transform} {var2.type}
        </span>
        <span className="label featureName">{var2.featureName}</span>.
        {/* Add condition to check if insight.condition is not empty */}
        {insight.condition && Object.keys(insight.condition).length > 0 && (
          <>
            {" "}
            when{" "}
            <span className="label featureName">
              {insight.condition.featureName}
            </span>{" "}
            is in the interval{" "}
            <span className="label condition-range">
              [{insight.condition.range[0]}, {insight.condition.range[1]}]
            </span>
            .
          </>
        )}
      </span>
    );
  } else if (insight?.type === "featureInteraction") {
    const [var1, var2] = insight.variables;
    return (
      <span className="formatted">
        The interaction between
        <span className="label featureName">{var1.featureName}</span>
        and <span className="label featureName">{var2.featureName}</span>
        is <span className="label relation">{insight.relation}</span>.
        {/* Handle multiple condition ranges */}
        {insight.condition && Object.keys(insight.condition).length > 0 && (
          <>
            {" "}
            when{" "}
            <span className="label featureName">
              {insight.condition.featureName}
            </span>{" "}
            is in the interval{" "}
            <span className="label condition-range range-1">
              [{insight.condition.range[0][0]}, {insight.condition.range[0][1]}]
            </span>{" "}
            compared to {" "}
            <span className="label condition-range range-2">
              [{insight.condition.range[1][0]}, {insight.condition.range[1][1]}]
            </span>
            .
          </>
        )}
      </span>
    );
  }
};
