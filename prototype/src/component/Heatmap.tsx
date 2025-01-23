import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";

interface HeatmapProps {
  shapValuesArray: number[][];
  featureValuesArray: number[][];
  labels: string[];
  width: number;
  height: number;
  title: string;
  featuresToShow?: string[];
}

export default function Heatmap({
  shapValuesArray,
  featureValuesArray,
  labels,
  width: totalWidth,
  height: totalHeight,
  title,
  featuresToShow,
}: HeatmapProps) {
  const svgRef = useRef(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [leftMargin, setLeftMargin] = useState<number>(100);
  const groupRef = useRef<SVGGElement>(null);

  const topMargin = 40;
  const bottomMargin = 40;
  const rowSpacing = 10;
  const legendBarWidth = 10;
  const fontSize = 10;

  const [minShap, maxShap] = useMemo(() => [-50, 50], []);
  const colorScale = useMemo(
    () =>
      d3
        .scaleLinear<string>()
        .domain([minShap, 0, maxShap])
        .range(["#008bfc", "#ffffff", "#ff0051"])
        .clamp(true),
    [minShap, maxShap]
  );

  const datasets = useMemo(() => {
    const selectedFeatureIndices = featuresToShow
      ? featuresToShow
          .map((feature) => labels.indexOf(feature))
          .filter((index) => index !== -1)
      : labels.map((_, index) => index);

    // Filter shapValuesArray and featureValuesArray to keep only the selected features
    const filteredShapValuesArray = shapValuesArray.map((shapValues) =>
      selectedFeatureIndices.map((i) => shapValues[i])
    );

    const filteredFeatureValuesArray = featureValuesArray.map((featureValues) =>
      selectedFeatureIndices.map((i) => featureValues[i])
    );

    const filteredLabels = selectedFeatureIndices.map((i) => labels[i]);

    const filteredAverageShapValues = filteredShapValuesArray.map(
      (shapValues) => d3.mean(shapValues.map(Math.abs)) ?? 0
    );

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

  const [sortedShapValuesArray, , sortedLabels] = useMemo(
    () => [
      datasets.map((d) => d.shapValues),
      datasets.map((d) => d.featureValues),
      datasets.map((d) => d.label),
    ],
    [datasets]
  );

  const numRows = sortedShapValuesArray.length;
  const numFeatures = numRows > 0 ? sortedShapValuesArray[0].length : 0;

  const plotWidth = numFeatures > 0 ? totalWidth * 0.6 : 0;
  const rectHeight =
    numRows > 0
      ? (totalHeight - topMargin - bottomMargin - (numRows - 1) * rowSpacing) /
        numRows
      : 0;
  const rectWidth = numFeatures > 0 ? plotWidth / numFeatures : 0;

  const textXOffset = leftMargin + plotWidth + 10;

  const totalBarAreaHeight = numRows * rectHeight + (numRows - 1) * rowSpacing;
  const centerY = topMargin + totalBarAreaHeight / 2;

  const legendHeight = totalBarAreaHeight;
  const legendXOffset = textXOffset + 45;
  const legendYStart = centerY - legendHeight / 2;

  const legendTopLabelY = legendYStart - 5;
  const legendBottomLabelY = legendYStart + legendHeight + 15;

  const legendMidY = centerY;
  const shapValuesLabelX = legendXOffset + 30;

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg
      .selectAll(".label-text")
      .data(sortedLabels)
      .join("text")
      .attr("class", "label-text")
      .attr("font-size", "12px")
      .attr("opacity", 0)
      .text((d) => d)
      .each(function () {
        const labelWidth = (this as SVGTextElement).getBBox().width;
        setLeftMargin((prevMargin) => Math.max(prevMargin, labelWidth + 10));
      });
  }, [sortedLabels]);

  useEffect(() => {
    if (!groupRef.current) return;

    const brush = d3
      .brushX()
      .extent([
        [leftMargin, topMargin],
        [leftMargin + plotWidth, topMargin + totalBarAreaHeight],
      ])
      .on("brush end", ({ selection }) => {
        if (!selection) {
          setSelectedIndexes([]);
          return;
        }

        const [x0, x1] = selection;
        const newSelectedIndexes = d3.range(
          Math.floor((x0 - leftMargin) / rectWidth),
          Math.ceil((x1 - leftMargin) / rectWidth)
        );

        setSelectedIndexes(newSelectedIndexes);
      });

    const group = d3.select(groupRef.current);
    group.selectAll(".brush").remove();

    const brushGroup = group.append("g").attr("class", "brush");
    brushGroup.call(brush);

    brushGroup
      .selectAll(".selection")
      .style("fill", "rgba(128, 128, 128, 0.2)")
      .style("stroke", "rgba(128, 128, 128, 0.2)");

    return () => {
      group.select(".brush").remove();
    };
  }, [
    leftMargin,
    plotWidth,
    rectWidth,
    topMargin,
    totalBarAreaHeight,
    groupRef,
  ]);

  return (
    <svg ref={svgRef} width={totalWidth} height={totalHeight}>
      <rect
        x={0}
        y={0}
        width={totalWidth}
        height={totalHeight}
        fill="none"
        stroke="black"
      />
      <g ref={groupRef}>
        <text
          className="title"
          x={(leftMargin + (leftMargin + plotWidth)) / 2}
          y={20}
          textAnchor="middle"
          fontWeight="bold"
          fontSize={12}
        >
          {title}
        </text>

        {sortedShapValuesArray.map((shapValues, idx) => {
          const averageShap = datasets[idx].averageShap;
          const yOffset = topMargin + idx * (rectHeight + rowSpacing);
          const textY = yOffset + rectHeight / 2 + 3;

          return (
            <g key={idx}>
              {shapValues.map((shapValue, i) => {
                const isSelected =
                  selectedIndexes.length === 0 || selectedIndexes.includes(i);
                return (
                  <rect
                    key={i}
                    x={leftMargin + i * rectWidth}
                    y={yOffset}
                    width={rectWidth}
                    height={rectHeight}
                    fill={colorScale(shapValue)}
                    opacity={isSelected ? 1 : 0.3}
                  />
                );
              })}
              <text
                x={textXOffset}
                y={textY}
                textAnchor="start"
                fontSize={fontSize}
                fill="black"
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

        <text
          x={legendXOffset}
          y={legendTopLabelY}
          fontSize={fontSize}
          textAnchor="start"
        >
          {maxShap.toFixed(2)}+
        </text>
        <rect
          x={legendXOffset}
          y={legendYStart}
          width={legendBarWidth}
          height={legendHeight}
          fill="url(#legend-gradient)"
        />
        <text
          x={legendXOffset}
          y={legendBottomLabelY}
          fontSize={fontSize}
          textAnchor="start"
        >
          {minShap.toFixed(2)}+
        </text>
        <text
          x={shapValuesLabelX}
          y={legendMidY}
          fontSize={fontSize}
          textAnchor="middle"
          transform={`rotate(-90, ${shapValuesLabelX}, ${legendMidY})`}
        >
          SHAP Values
        </text>
        <text
          x={10 + textXOffset}
          y={topMargin + totalBarAreaHeight + 20}
          textAnchor="middle"
          fontSize={fontSize}
        >
          |Avg. SHAP|
        </text>

        {sortedLabels.map((label, idx) => (
          <text
            key={idx}
            x={leftMargin / 2}
            y={topMargin + idx * (rectHeight + rowSpacing) + rectHeight / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={12}
          >
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
}
