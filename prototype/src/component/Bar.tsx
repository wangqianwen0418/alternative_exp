import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { TAnnotation } from "../util/types";

interface BarProps {
  allShapValues: number[][];
  featureNames: string[];
  width: number;
  height: number;
  id: string;
  offsets: number[];
  annotation?: TAnnotation;
  featuresToHighlight?: string[];
  featuresToShow?: string[];
}

export default function Bar(props: BarProps) {
  // Reduced right margin significantly
  const margin = useMemo(
    () => [125, 10, 20, 40] as [number, number, number, number],
    []
  );

  const {
    allShapValues,
    featureNames,
    height,
    width,
    id,
    offsets,
    annotation,
    featuresToHighlight: featuresToHighlight,
    featuresToShow: featuresToShow,
  } = props;

  const [selectedBars, setSelectedBars] = useState<string[]>([]);
  const brushGroupRef = useRef<any>(null);

  const labelFontSize = 13;
  const maxLabelWidth = 100;

  const canvasContext = useMemo(() => {
    if (typeof document !== "undefined") {
      return document.createElement("canvas").getContext("2d");
    }
    return null;
  }, []);

  const effectiveFeaturesToShow = useMemo(() => {
    return (featuresToShow && featuresToShow.length > 0)
      ? featuresToShow
      : ["serum triglycerides level", "bmi", "blood pressure", "age", "sex", "low-density lipoproteins"]; //default array
  }, [featuresToShow]);

  const filteredIndices = useMemo(() => {
    return featureNames.reduce((acc: number[], name, idx) => {
      if (effectiveFeaturesToShow.includes(name)) {
        acc.push(idx);
      }
      return acc;
    }, []);
  }, [featureNames, effectiveFeaturesToShow]);

  const filteredFeatureNames = useMemo(() => {
    return filteredIndices.map((i) => featureNames[i]);
  }, [filteredIndices, featureNames]);

  const filteredShapValues = useMemo(() => {
    return allShapValues.map((row) => filteredIndices.map((i) => row[i]));
  }, [allShapValues, filteredIndices]);

  const truncatedLabels = useMemo(() => {
    if (!canvasContext) {
      return filteredFeatureNames.map((f) =>
        f.length > 5 ? f.slice(0, 5) + "..." : f
      );
    }
    canvasContext.font = `${labelFontSize}px sans-serif`;
    return filteredFeatureNames.map((f) => {
      let label = f;
      while (
        canvasContext.measureText(label).width > maxLabelWidth &&
        label.length > 1
      ) {
        label = label.slice(0, -1);
      }
      if (label !== f && !label.endsWith("...")) {
        while (
          canvasContext.measureText(label + "...").width > maxLabelWidth &&
          label.length > 1
        ) {
          label = label.slice(0, -1);
        }
        label = label + "...";
      }
      return label;
    });
  }, [filteredFeatureNames, canvasContext, labelFontSize, maxLabelWidth]);

  const truncatedLabelsMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    filteredFeatureNames.forEach((f, i) => {
      map[f] = truncatedLabels[i];
    });
    return map;
  }, [filteredFeatureNames, truncatedLabels]);

  const sortedAvgShapeValues = useMemo(() => {
    let avgShapeValues: { [featureName: string]: number } = {};
    for (let j = 0; j < filteredFeatureNames.length; j++) {
      const featureName = filteredFeatureNames[j];
      const values = filteredShapValues.map((row) => Math.abs(row[j]));
      avgShapeValues[featureName] =
        values.reduce((a, b) => a + b, 0) / values.length;
    }

    return Object.entries(avgShapeValues)
      .sort((a, b) => b[1] - a[1]); // Sorted descending by average value
  }, [filteredFeatureNames, filteredShapValues]);

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(sortedAvgShapeValues.map((d) => d[0]))
        .range([margin[1], height - margin[3]])
        .padding(0.1),
    [sortedAvgShapeValues, margin, height]
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([
          0,
          Math.min(
            35,
            Math.max(...allShapValues.flat().map((d) => Math.abs(d)))
          ),
        ])
        .range([margin[0], width - margin[2]]),
    [allShapValues, margin, width]
  );

  const confidenceIntervals = useMemo(() => {
    const intervals: { [key: string]: [number, number] } = {};
    filteredFeatureNames.forEach((featureName, j) => {
      const values = filteredShapValues.map((row) => Math.abs(row[j]));
      const mean = d3.mean(values) as number;
      const stdDev = d3.deviation(values) as number;
      const n = values.length;
      const t = 1.96;
      const confidenceInterval = t * (stdDev / Math.sqrt(n));
      intervals[featureName] = [
        mean - confidenceInterval,
        mean + confidenceInterval,
      ];
    });
    return intervals;
  }, [filteredFeatureNames, filteredShapValues]);

  const maxXValue = useMemo(() => {
    const flatValues = filteredShapValues.flat();
    return flatValues.length ? Math.max(...flatValues.map((d) => Math.abs(d))) : 0;
  }, [filteredShapValues]);

  useEffect(() => {
    d3.select(`g.bar#${id}`).selectAll("g.x-axis").remove();
    const xAxisGroup = d3
      .select(`g.bar#${id}`)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin[3]})`);

    xAxisGroup.call(d3.axisBottom(xScale));
  }, [xScale, id, height, margin]);

  useEffect(() => {
    if (
      !annotation &&
      (!featuresToHighlight || featuresToHighlight.length === 0)
    ) {
      if (!brushGroupRef.current) {
        const brushGroup = d3
          .select(`g.bar#${id}`)
          .append("g")
          .attr("class", "brush");

        brushGroupRef.current = brushGroup;

        const brushEnd = (event: any) => {
          const selection = event.selection;

          if (!selection) {
            setSelectedBars([]);
            d3.selectAll(`g.bar#${id} .bars g.bar-group`).attr("opacity", 1);
            return;
          }

          const [y0, y1] = selection;

          const brushedBars = sortedAvgShapeValues
            .filter(([featureName]) => {
              const yPos = yScale(featureName);
              if (yPos === undefined) return false;
              return (
                y0 <= yPos + yScale.bandwidth() / 2 &&
                yPos + yScale.bandwidth() / 2 <= y1
              );
            })
            .map(([featureName]) => featureName);

          setSelectedBars(brushedBars);

          d3.selectAll(`g.bar#${id} .bars g.bar-group`).each(function () {
            const featureName = d3.select(this).attr("data-feature-name");
            const isSelected = brushedBars.includes(featureName);
            d3.select(this).attr("opacity", isSelected ? 1 : 0.3);
          });
        };

        const brush = d3
          .brushY()
          .extent([
            [margin[0], margin[1]],
            [width - margin[2], height - margin[3]],
          ])
          .on("end", brushEnd);

        brushGroup
          .call(brush)
          .selectAll(".selection")
          .style("fill", "rgba(128, 128, 128, 0.2)")
          .style("stroke", "rgba(128, 128, 128, 0.2)");
      }
    }
    // else if (annotation.type === "highlightBars") {
    //   if (brushGroupRef.current) {
    //     brushGroupRef.current.remove();
    //     brushGroupRef.current = null;
    //   }
    //   setSelectedBars(annotation.labels);
    // }
  }, [
    id,
    annotation,
    sortedAvgShapeValues,
    yScale,
    margin,
    width,
    height,
    setSelectedBars,
  ]);

  useEffect(() => {
    // If there are highlighted features, set them as selected bars
    if (featuresToHighlight && featuresToHighlight.length > 0) {
      // console.log("FEATURES TO HIGHLIGHT: " + highlightedFeatures);
      setSelectedBars(featuresToHighlight);
      d3.selectAll(`g.bar#${id} .bars g.bar-group`).each(function () {
        const featureName = d3.select(this).attr("data-feature-name");
        const isSelected = featuresToHighlight.includes(featureName);
        d3.select(this).attr("opacity", isSelected ? 1 : 0.3);
      });
    } else {
      // If no highlighted features, reset the selection
      setSelectedBars([]);
      d3.selectAll(`g.bar#${id} .bars g.bar-group`).attr("opacity", 1);
    }
  }, [featuresToHighlight, id]);

  return (
    <g
      className="bar"
      id={id}
      transform={`translate(${offsets[0]}, ${offsets[1]})`}
    >
      <rect
        className="background"
        width={width}
        height={height}
        fill="white"
        stroke="gray"
      />

      <g className="bars">
        {sortedAvgShapeValues.map(([featureName, value]) => {
          const isSelected =
            selectedBars.length > 0 ? selectedBars.includes(featureName) : true;
          const textStyle =
            featuresToHighlight && featuresToHighlight.length > 0
              ? isSelected
                ? { fill: "black", fontWeight: "bold" }
                : { fill: "gray", fontWeight: "normal" }
              : { fill: "black", fontWeight: "normal" };
          // console.log(featureName);
          // console.log(isSelected);
          return (
            <g
              key={featureName}
              className="bar-group"
              data-feature-name={featureName}
              opacity={isSelected ? 1 : 0.3}
            >
              <text
                x={margin[0] - 2}
                y={(yScale(featureName) as number) + yScale.bandwidth() * 0.8}
                textAnchor="end"
                style={textStyle}
                fontSize={labelFontSize}
              >
                {truncatedLabelsMap[featureName]}
              </text>
              <rect
                className="bar-rect"
                x={xScale(0)}
                y={yScale(featureName)}
                width={xScale(value) - xScale(0)}
                height={yScale.bandwidth()}
                fill="steelblue"
              />
              <line
                className="error-bar"
                x1={xScale(confidenceIntervals[featureName][0])}
                x2={xScale(confidenceIntervals[featureName][1])}
                y1={(yScale(featureName) as number) + yScale.bandwidth() / 2}
                y2={(yScale(featureName) as number) + yScale.bandwidth() / 2}
                stroke="black"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </g>
      <text
        x={(margin[0] + width - margin[2]) / 2}
        y={height - 7.5}
        textAnchor="middle"
        fontSize={labelFontSize}
      >
        |Average SHAP (Contribution)| Value
      </text>

      {annotation?.type === "singleLine" && (
        <>
          <line
            x1={xScale(annotation.xValue ?? 0)}
            y1={margin[1]}
            x2={xScale(annotation.xValue ?? 0)}
            y2={height - margin[3]}
            stroke="black"
            strokeDasharray="4,2"
          />

          <text
            x={xScale(annotation.xValue ?? 0) + 5} // Position slightly to the right of the line
            y={margin[1] + 200} // Position slightly below the top
            fill="black"
            fontSize="12px"
          >
            {`val=${(annotation.xValue ?? 0).toFixed(2)}`} {/* Add the label */}
          </text>
        </>
      )}
    </g>
  );
}
