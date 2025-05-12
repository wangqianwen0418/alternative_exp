import { TInsight, TVariable } from "./types";

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
        <span className="label relation">{insight.relation}</span>{" "}
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
    if (typeof(var2) === 'number'){
      return (
        <span className="formatted">
          {" "}
          The{" "}
          <span className="label transform">
            {" "}
            {var1.transform} {var1.type}{" "}
          </span>{" "}
          <span className="label featureName">{var1.featureName}</span> is{" "}
          <span className="label relation">{insight.relation}</span> {" "}
          
          <span className="label constant">{var2}</span>.{" "}
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
    }
    else{
    return (
      <span className="formatted">
        {" "}
        The{" "}
        <span className="label transform">
          {" "}
          {var1.transform} {var1.type}{" "}
        </span>{" "}
        <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> the{" "}
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
  }
  } else if (insight?.type === "correlation") {
    const [var1, var2] = insight.variables;

    return (
      <span className="formatted">
        The{" "}
        <span className="label transform">
        {var1.transform && `${var1.transform} `} {var1.type}
        </span>
        <span className="label featureName">{var1.featureName}</span>
        is <span className="label relation">{insight.relation}</span> with the
        <span className="label transform">
        {var2.transform && `${var2.transform} `} {var2.type}
        </span>
        <span className="label featureName">{var2.featureName}</span>
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
  }else {
    return (
      <span className="formatted error-message">
        The provided insight statement doesn't match our categorization scheme.
        Please enter an insight that belongs to one of the three categories and
        try again.
      </span>
    );
  }
};
