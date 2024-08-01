import React, { useState } from "react";
import * as d3 from "d3";

interface HeatmapProps {
  shapValuesArray: number[][];
  featureValuesArray: number[][];
  labels: string[];
  width: number;
  height: number;
  title: string;
}

export default function Heatmap({
  shapValuesArray,
  featureValuesArray,
  labels,
  width,
  height,
  title,
}: HeatmapProps) {
  const [, setHoveredBar] = useState<{
    label: string;
    shapValue: number;
  } | null>(null);

  const averageShapValues = shapValuesArray.map(
    (shapValues) => d3.mean(shapValues) ?? 0
  );

  const datasets = shapValuesArray.map((shapValues, idx) => ({
    shapValues,
    featureValues: featureValuesArray[idx],
    label: labels[idx],
    averageShap: averageShapValues[idx],
  }));

  datasets.sort((a, b) => b.averageShap - a.averageShap);

  const sortedShapValuesArray = datasets.map((d) => d.shapValues);
  const sortedFeatureValuesArray = datasets.map((d) => d.featureValues);
  const sortedLabels = datasets.map((d) => d.label);
  const sortedAverageShapValues = datasets.map((d) => d.averageShap);

  // const combinedData = shapValuesArray.map((shapValues, idx) => ({
  //   shapValues,
  //   featureValues: featureValuesArray[idx],
  //   label: labels[idx],
  //   averageShap: averageShapValues[idx],
  // }));
  // const allShapValues = combinedData.flatMap((d) => d.shapValues);
  // const [minShap, maxShap] = d3.extent(allShapValues) as [number, number];
  const [minShap, maxShap] = [-2, 2];

  const colorScale = d3
    .scaleLinear<string>()
    .domain([minShap, 0, maxShap])
    .range([
      "#008bfc", // blue
      "#ffffff", // white
      "#ff0051", // red
    ])
    .clamp(true);

  const [minShapSorted, maxShapSorted] = d3.extent(sortedAverageShapValues) as [
    number,
    number
  ];

  const totalHeight =
    sortedShapValuesArray.length * height +
    (sortedShapValuesArray.length - 1) * 10;

  const maxBarWidth = 25;
  const barWidthScale = d3
    .scaleLinear()
    .domain([minShapSorted, maxShapSorted])
    .range([0, maxBarWidth]);

  const leftMargin = 100;

  const handleMouseOver = (datasetLabel: string, shapValue: number) => {
    setHoveredBar({ label: datasetLabel, shapValue });
    console.log(`Dataset: ${datasetLabel}, SHAP Value: ${shapValue}`);
  };

  const handleMouseOut = () => {
    setHoveredBar(null);
  };

  return (
    <svg
      width={width + leftMargin + maxBarWidth + 100}
      height={totalHeight + 60}
    >
      <text
        className="title"
        x={(width + leftMargin + maxBarWidth + 100) / 2}
        y={20}
        textAnchor="middle"
        fontWeight="bold"
      >
        {title}
      </text>

      {sortedShapValuesArray.map((shapValues, idx) => {
        const featureValues = sortedFeatureValuesArray[idx];
        const numFeatures = featureValues.length;
        const rectWidth = width / numFeatures;
        const rectHeight = height;
        const data = featureValues.map((value, i) => ({
          value,
          shapValue: shapValues[i],
          originalIndex: i,
        }));

        const sortedData = [...data].sort((a, b) => b.value - a.value);

        const yOffset = idx * (rectHeight + 10) + 40;

        const averageShap = sortedAverageShapValues[idx];
        const normalizedBarWidth = barWidthScale(averageShap);

        return (
          <g key={idx} transform={`translate(${leftMargin}, ${yOffset})`}>
            {sortedData.map((d, i) => (
              <rect
                key={d.originalIndex}
                x={i * rectWidth}
                y={0}
                width={rectWidth}
                height={rectHeight}
                fill={colorScale(d.shapValue)}
                onMouseOver={() =>
                  handleMouseOver(sortedLabels[idx], d.shapValue)
                }
                onMouseOut={handleMouseOut}
              />
            ))}

            <rect
              x={width}
              y={rectHeight / 2 - 5}
              width={normalizedBarWidth + 3}
              height={15}
              fill="black"
            />

            <text
              x={width + 15}
              y={rectHeight / 2 - 15}
              textAnchor="middle"
              fontSize="12"
              fill="#000"
            >
              {averageShap.toFixed(2)}
            </text>
          </g>
        );
      })}

      <defs>
        <linearGradient id="legend-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colorScale(maxShap)} />
          <stop offset="50%" stopColor={colorScale(0)} />
          <stop offset="100%" stopColor={colorScale(minShap)} />
        </linearGradient>
      </defs>

      <rect
        x={width + leftMargin + maxBarWidth + 30}
        y={40}
        width={10}
        height={totalHeight}
        fill="url(#legend-gradient)"
      />

      <text
        x={width + leftMargin + maxBarWidth + 50}
        y={40}
        textAnchor="start"
        fontSize="12"
      >
        {maxShap.toFixed(2)}+
      </text>
      <text
        x={width + leftMargin + maxBarWidth + 50}
        y={totalHeight + 40}
        textAnchor="start"
        fontSize="12"
      >
        {minShap.toFixed(2)}+
      </text>

      {sortedLabels.map((label, idx) => (
        <text
          key={idx}
          x={leftMargin / 2}
          y={idx * (height + 10) + height / 2 + 40}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="12"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
