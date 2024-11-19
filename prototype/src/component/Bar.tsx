import * as d3 from "d3";
import { useEffect, useState } from "react";
import { TAnnotation } from "../util/types";

interface BarProps {
  allShapValues: number[][];
  featureNames: string[];
  width: number;
  height: number;
  id: string;
  offsets: number[];
  annotation?: TAnnotation;
}

export default function Bar(props: BarProps) {
  const margin = [200, 10, 100, 40];

  const {
    allShapValues,
    featureNames,
    height,
    width,
    id,
    offsets,
    annotation,
  } = props;

  const [selectedBars, setSelectedBars] = useState<string[]>([]);

  let avgShapeValues: { [featureName: string]: number } = {};
  for (let i = 0; i < featureNames.length; i++) {
    avgShapeValues[featureNames[i]] =
      allShapValues.map((val) => Math.abs(val[i])).reduce((a, b) => a + b, 0) /
      allShapValues.length;
  }

  let sortedAvgShapeValues = Object.entries(avgShapeValues)
    .sort((a, b) => a[1] - b[1])
    .reverse();

  const yScale = d3
    .scaleBand()
    .domain(sortedAvgShapeValues.map((d) => d[0]))
    .range([margin[1], height - margin[3]])
    .padding(0.1);

  const xScale = d3
    .scaleLinear()
    .domain([0, Math.max(...allShapValues.flat().map((d) => Math.abs(d)))])
    .range([margin[0], width - margin[2]]);

    // Calculate the 95% confidence interval for each feature
  const confidenceIntervals: { [key: string]: [number, number] } = {};
  featureNames.forEach((featureName, index) => {
    const values = allShapValues.map((val) => Math.abs(val[index]));
    const mean = d3.mean(values) as number;
    const stdDev = d3.deviation(values) as number;
    const n = values.length;
    const t = 1.96;
    const confidenceInterval = t * (stdDev / Math.sqrt(n));
    confidenceIntervals[featureName] = [
      mean - confidenceInterval,
      mean + confidenceInterval,
    ];
  });

  useEffect(() => {
    d3.select(`g.bar#${id}`).selectAll("g.x-axis").remove();
    const xAxisGroup = d3
      .select(`g.bar#${id}`)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin[3]})`);

    xAxisGroup.call(d3.axisBottom(xScale));

    if (!annotation || annotation.type !== "highlightBars") {
      d3.select(`g.bar#${id}`).selectAll("g.brush").remove();

      const brushGroup = d3
        .select(`g.bar#${id}`)
        .append("g")
        .attr("class", "brush");

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
          if (brushedBars.length === 0) {
            d3.select(this).attr("opacity", 1);
          } else {
            const isSelected = brushedBars.includes(featureName);
            d3.select(this).attr("opacity", isSelected ? 1 : 0.3);
          }
        });
      };

      const brush = d3
        .brushY()
        .extent([
          [margin[0], margin[1]],
          [width - margin[2], height - margin[3]],
        ])
        .on("end", brushEnd);

      brushGroup.call(brush);

      return () => {
        d3.select(`g.bar#${id} .brush`).remove();
      };
    } else if (annotation.type === "highlightBars") {
      d3.select(`g.bar#${id}`).selectAll("g.brush").remove();
      setSelectedBars(annotation.labels);
    }
  }, [
    allShapValues,
    featureNames,
    height,
    width,
    id,
    offsets,
    annotation,
    sortedAvgShapeValues,
    yScale,
  ]);

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
        {sortedAvgShapeValues.map(([featureName, value], index) => {
          const isSelected =
            selectedBars.length > 0 ? selectedBars.includes(featureName) : true;
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
              >
                {featureName}
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
      <text x={width / 2} y={height - 5} textAnchor="middle">
        Average contribution to the prediction
      </text>

      {annotation?.type === "verticalLine" && (
        <>
          <line
            x1={xScale(annotation.value)}
            y1={margin[1]}
            x2={xScale(annotation.value)}
            y2={height - margin[3]}
            stroke="black"
            strokeDasharray="4,2"
          />

          <text
            x={xScale(annotation.value) + 5} // Position slightly to the right of the line
            y={margin[1] + 75} // Position slightly below the top
            fill="black"
            fontSize="12px"
          >
            {`val=${annotation.value.toFixed(2)}`} {/* Add the label */}
          </text>
        </>
      )}
    </g>
  );
}
