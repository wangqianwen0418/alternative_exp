import { useRef, useState, useMemo } from "react";
import * as d3 from "d3";

interface HeatmapProps {
  shapValuesArray: number[][];
  featureValuesArray: number[][];
  labels: string[];
  boldFeatureNames?: string[];
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
  const groupRef = useRef<SVGGElement>(null);

  const labelFontSizePx = 13;
  const maxLabelWidth = 100;

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
    // Filter shapValuesArray and featureValuesArray to keep only the selected features
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

  const [top, right, bottom, left, rowSpace] = useMemo(() => {
    const top = 40;
    const bottom = 40;
    const right = 100;
    const rowSpace = 10;
    const left = maxLabelWidth + 20;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return [top, right, bottom, left, rowSpace];
    }
    ctx.font = `${labelFontSizePx}px sans-serif`;

    return [top, right, bottom, left, rowSpace];
  }, []);

  const numRows = sortedShapValuesArray.length;
  const numFeatures = numRows > 0 ? sortedShapValuesArray[0].length : 0;

  const plotWidth = numFeatures > 0 ? totalWidth - left - right : 0;
  const plotHeight = totalHeight - top - bottom;
  const rectHeight =
    numRows > 0 ? (plotHeight - (numRows - 1) * rowSpace) / numRows : 0;
  const rectWidth = numFeatures > 0 ? plotWidth / numFeatures : 0;

  const truncatedLabels = useMemo(() => {
    if (typeof document === "undefined") {
      return sortedLabels;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return sortedLabels;

    ctx.font = `${labelFontSizePx}px sans-serif`;
    return sortedLabels.map((label) => {
      let truncated = label;
      while (
        ctx.measureText(truncated).width > maxLabelWidth &&
        truncated.length > 1
      ) {
        truncated = truncated.slice(0, -1);
      }

      if (truncated !== label) {
        while (
          ctx.measureText(truncated + "...").width > maxLabelWidth &&
          truncated.length > 1
        ) {
          truncated = truncated.slice(0, -1);
        }
        truncated += "...";
      }
      return truncated;
    });
  }, [sortedLabels]);

  const truncatedSelectedLabels = useMemo(() => {
    if (typeof document === "undefined") {
      return featuresToShow;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return sortedLabels;

    ctx.font = `${labelFontSizePx}px sans-serif`;
    if (!featuresToShow || featuresToShow.length === 0) {
      return [];
    }
    return featuresToShow.map((label) => {
      let truncated = label;
      while (
        ctx.measureText(truncated).width > maxLabelWidth &&
        truncated.length > 1
      ) {
        truncated = truncated.slice(0, -1);
      }

      if (truncated !== label) {
        while (
          ctx.measureText(truncated + "...").width > maxLabelWidth &&
          truncated.length > 1
        ) {
          truncated = truncated.slice(0, -1);
        }
        truncated += "...";
      }
      return truncated;
    });
  }, [sortedLabels]);

  const totalBarAreaHeight = numRows * rectHeight + (numRows - 1) * rowSpace;
  const textXOffset = left + plotWidth + 10;

  const centerY = top + totalBarAreaHeight / 2;

  const legendHeight = totalBarAreaHeight;
  const legendBarWidth = 10;
  const legendXOffset = textXOffset + 20;
  const legendYStart = centerY - legendHeight / 2;

  const legendTopLabelY = legendYStart - 5;
  const legendBottomLabelY = legendYStart + legendHeight + 15;
  const legendMidY = centerY;
  const shapValuesLabelX = legendXOffset + 30;

  // brush effect do not remove
  // useEffect(() => {
  //   if (!groupRef.current) return;

  //   const brush = d3
  //     .brushX()
  //     .extent([
  //       [left, top],
  //       [left + plotWidth, top + totalBarAreaHeight],
  //     ])
  //     .on("brush end", ({ selection }) => {
  //       if (!selection) {
  //         setSelectedIndexes([]);
  //         return;
  //       }

  //       const [x0, x1] = selection;
  //       const newSelectedIndexes = d3.range(
  //         Math.floor((x0 - left) / rectWidth),
  //         Math.ceil((x1 - left) / rectWidth)
  //       );

  //       setSelectedIndexes(newSelectedIndexes);
  //     });

  //   const group = d3.select(groupRef.current);
  //   group.selectAll(".brush").remove();

  //   const brushGroup = group.append("g").attr("class", "brush");
  //   brushGroup.call(brush);

  //   brushGroup
  //     .selectAll(".selection")
  //     .style("fill", "rgba(128, 128, 128, 0.2)")
  //     .style("stroke", "rgba(128, 128, 128, 0.2)");

  //   return () => {
  //     group.select(".brush").remove();
  //   };
  // }, [left, plotWidth, rectWidth, top, totalBarAreaHeight, groupRef]);

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
          x={left + plotWidth / 2}
          y={20}
          textAnchor="middle"
          fontWeight="bold"
          fontSize={labelFontSizePx}
        >
          {title}
        </text>

        {datasets.map((dataset, idx) => {
          const shapValues = dataset.shapValues;
          const averageShap = dataset.averageShap;
          const yOffset = top + idx * (rectHeight + rowSpace);
          const textY = yOffset + rectHeight / 2 + 3;

          return (
            <g key={idx}>
              {shapValues.map((shapValue, i) => {
                const isSelected =
                  selectedIndexes.length === 0 || selectedIndexes.includes(i);
                return (
                  <rect
                    key={i}
                    x={left + i * rectWidth}
                    y={yOffset}
                    width={rectWidth}
                    height={rectHeight}
                    fill={colorScale(shapValue)}
                    opacity={isSelected ? 1 : 0.3}
                  />
                );
              })}
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
          fontSize={labelFontSizePx}
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
          fontSize={labelFontSizePx}
          textAnchor="start"
        >
          {minShap.toFixed(2)}+
        </text>
        <text
          x={shapValuesLabelX}
          y={legendMidY}
          fontSize={labelFontSizePx}
          textAnchor="middle"
          transform={`rotate(-90, ${shapValuesLabelX}, ${legendMidY})`}
        >
          SHAP Values
        </text>

        {truncatedLabels.map((label, idx) => {
          // Check if this feature is among the selectedIndexes
          const isSelected =
            selectedIndexes.length > 0 && selectedIndexes.includes(idx);

          // console.log(idx);
          // console.log("Is selected: " + selectedIndexes.includes(idx));
          // console.log(selectedIndexes);

          return (
            <text
              key={idx}
              x={left - 7.5}
              y={top + idx * (rectHeight + rowSpace) + rectHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={labelFontSizePx}
              fontWeight={
                truncatedSelectedLabels && truncatedSelectedLabels.length > 0
                  ? truncatedSelectedLabels?.includes(label)
                    ? "bold"
                    : "normal"
                  : "normal"
              }
              fill={
                truncatedSelectedLabels && truncatedSelectedLabels.length > 0
                  ? truncatedSelectedLabels?.includes(label)
                    ? "black"
                    : "gray"
                  : "black"
              }
            >
              {label}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
