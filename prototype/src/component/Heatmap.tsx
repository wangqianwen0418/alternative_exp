import React, { useEffect, useRef, useState, useMemo } from "react";
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
  const svgRef = useRef(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [leftMargin, setLeftMargin] = useState<number>(100);
  const groupRef = useRef<SVGGElement>(null);

  const scaleFactor = 0.98;

  const datasets = useMemo(() => {
    const averageShapValues = shapValuesArray.map(
      (shapValues) => d3.mean(shapValues.map(Math.abs)) ?? 0
    );

    const combinedDatasets = shapValuesArray.map((shapValues, idx) => ({
      shapValues,
      featureValues: featureValuesArray[idx],
      label: labels[idx],
      averageShap: averageShapValues[idx],
    }));

    combinedDatasets.sort((a, b) => b.averageShap - a.averageShap);

    const sortedIndices = d3
      .range(combinedDatasets[0].shapValues.length)
      .sort(
        (a, b) =>
          combinedDatasets[0].shapValues[b] - combinedDatasets[0].shapValues[a]
      );

    combinedDatasets.forEach((dataset) => {
      dataset.shapValues = sortedIndices.map((i) => dataset.shapValues[i]);
      dataset.featureValues = sortedIndices.map(
        (i) => dataset.featureValues[i]
      );
    });

    return combinedDatasets;
  }, [shapValuesArray, featureValuesArray, labels]);

  const [sortedShapValuesArray, sortedFeatureValuesArray, sortedLabels] =
    useMemo(
      () => [
        datasets.map((d) => d.shapValues),
        datasets.map((d) => d.featureValues),
        datasets.map((d) => d.label),
      ],
      [datasets]
    );

  const [minShap, maxShap] = useMemo(() => [-2, 2], []);

  const colorScale = useMemo(
    () =>
      d3
        .scaleLinear<string>()
        .domain([minShap, 0, maxShap])
        .range([
          "#008bfc", // blue
          "#ffffff", // white
          "#ff0051", // red
        ])
        .clamp(true),
    [minShap, maxShap]
  );

  const totalHeight = useMemo(
    () =>
      sortedShapValuesArray.length * height +
      (sortedShapValuesArray.length - 1) * 10,
    [sortedShapValuesArray, height]
  );

  const maxBarWidth = 25;
  const barWidthScale = useMemo(
    () => d3.scaleLinear().domain([minShap, maxShap]).range([0, maxBarWidth]),
    [minShap, maxShap]
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg
      .selectAll(".label-text")
      .data(sortedLabels)
      .join("text")
      .attr("class", "label-text") // Added class for selection
      .attr("font-size", "12px")
      .attr("opacity", 0) // Hide it from view since it's just for measurement
      .text((d) => d)
      .each(function () {
        const labelWidth = (this as SVGTextElement).getBBox().width;
        setLeftMargin((prevMargin) => Math.max(prevMargin, labelWidth + 10));
      });
  }, [sortedLabels]);

  useEffect(() => {
    if (!groupRef.current) return; // Changed from svgRef to groupRef

    const brush = d3
      .brushX()
      .extent([
        [leftMargin, 40],
        [width + leftMargin, totalHeight + 40],
      ])
      .on("brush end", ({ selection }) => {
        if (!selection) {
          setSelectedIndexes([]);
          return;
        }

        const [x0, x1] = selection;
        const rectWidth = width / sortedShapValuesArray[0].length;
        const newSelectedIndexes = d3.range(
          Math.floor((x0 - leftMargin) / rectWidth),
          Math.ceil((x1 - leftMargin) / rectWidth)
        );

        setSelectedIndexes(newSelectedIndexes);
        console.log("Selected Points:", newSelectedIndexes);
      });

    const group = d3.select(groupRef.current);
    group.selectAll(".brush").remove();
    group.append("g").attr("class", "brush").call(brush);

    return () => {
      group.select(".brush").remove();
    };
  }, [width, leftMargin, totalHeight, sortedShapValuesArray, groupRef]);

  return (
    <svg
      ref={svgRef}
      width={(width + leftMargin + maxBarWidth + 100) * scaleFactor}
      height={(totalHeight + 70) * scaleFactor}
    >
      <g ref={groupRef} transform={`scale(${scaleFactor})`}>
        {" "}
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
          const yOffset = idx * (rectHeight + 10) + 40;

          const averageShap = datasets[idx].averageShap;
          const normalizedBarWidth = barWidthScale(averageShap);

          return (
            <g key={idx} transform={`translate(${leftMargin}, ${yOffset})`}>
              {shapValues.map((shapValue, i) => {
                const isSelected =
                  selectedIndexes.length === 0 || selectedIndexes.includes(i);
                return (
                  <rect
                    key={i}
                    x={i * rectWidth}
                    y={0}
                    width={rectWidth}
                    height={rectHeight}
                    fill={colorScale(shapValue)}
                    opacity={isSelected ? 1 : 0.3}
                  />
                );
              })}

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
        <text
          x={width + leftMargin + 15}
          y={totalHeight + height + 10}
          textAnchor="middle"
          fontSize="12"
        >
          |Avg. SHAP|
        </text>
        <text
          x={width + leftMargin + maxBarWidth + 50 + 10}
          y={totalHeight / 2 + 40}
          textAnchor="middle"
          fontSize="13"
          transform={`rotate(-90, ${width + leftMargin + maxBarWidth + 70}, ${
            totalHeight / 2 + 40
          })`}
        >
          SHAP Values
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
      </g>
    </svg>
  );
}