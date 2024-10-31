import * as d3 from "d3";
import { useEffect } from "react";

interface BarProps {
  allShapValues: number[][];
  featureNames: string[];
  width: number;
  height: number;
  id: string;
  offsets: number[];
  annotation?: Annotation;
}

type Annotation = { type: "verticalLine"; xValue: number };

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
    const t = 1.96; // 95% confidence interval
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
  }, [allShapValues, featureNames, height, width, id, offsets]);

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
          return (
            <g key={featureName}>
              <text
                x={margin[0] - 2}
                y={(yScale(featureName) as number) + yScale.bandwidth() * 0.8}
                textAnchor="end"
              >
                {featureName}
              </text>
              <rect
                key={featureName}
                x={xScale(0)}
                y={yScale(featureName)}
                width={xScale(value) - xScale(0)}
                height={yScale.bandwidth()}
                fill="steelblue"
              />
              <line
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
        <line
          x1={xScale(annotation.xValue)}
          y1={margin[1]}
          x2={xScale(annotation.xValue)}
          y2={height - margin[3]}
          stroke="black"
          strokeDasharray="4,2"
        />
      )}
    </g>
  );
}
