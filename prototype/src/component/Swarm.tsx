import * as d3 from "d3";
import { useEffect, useState, useMemo, useRef } from "react";
import { TAnnotation } from "../util/types";

interface SwarmProps {
  xValues: number[][];
  colorValues: number[][];
  width: number;
  height: number;
  ids: string[];
  selectedIndices: number[];
  annotation?: TAnnotation;
  featuresToShow?: string[];
  setSelectedIndices: (index: number[]) => void;
}

export default function Swarm(props: SwarmProps) {
  const svgRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [brushSelection, setBrushSelection] = useState<[number, number] | null>(
    null
  );

  const {
    xValues,
    colorValues,
    width,
    height,
    ids,
    selectedIndices,
    setSelectedIndices,
    featuresToShow,
    annotation,
  } = props;
  console.log("IDs: " + ids);

  const labelFontSize = 11;
  const maxLabelWidth = 50;

  const canvasContext = useMemo(() => {
    if (typeof document !== "undefined") {
      return document.createElement("canvas").getContext("2d");
    }
    return null;
  }, []);

  // // Filter features based on the `featuresToShow` prop (if provided)
  const filteredFeaturesIndices = useMemo(() => {
    // If featuresToShow is not provided or is empty, show all features
    return ids.map((_, index) => index);
  }, [featuresToShow, ids]);

  const truncatedLabels = useMemo(() => {
    if (!canvasContext) {
      return ids.map((id) => (id.length > 5 ? id.slice(0, 5) + "..." : id));
    }

    canvasContext.font = `${labelFontSize}px sans-serif`;
    return ids.map((id) => {
      let label = id;
      while (
        canvasContext.measureText(label).width > maxLabelWidth &&
        label.length > 1
      ) {
        label = label.slice(0, -1);
      }
      if (label !== id) {
        label = label.slice(0, -3) + "...";
      }
      return label;
    });
  }, [ids, canvasContext, labelFontSize, maxLabelWidth]);

  const truncatedSelectedLabels = useMemo(() => {
    if (!canvasContext) {
      return featuresToShow?.map((id) =>
        id.length > 5 ? id.slice(0, 5) + "..." : id
      );
    }

    canvasContext.font = `${labelFontSize}px sans-serif`;
    return featuresToShow?.map((id) => {
      let label = id;
      while (
        canvasContext.measureText(label).width > maxLabelWidth &&
        label.length > 1
      ) {
        label = label.slice(0, -1);
      }
      if (label !== id) {
        label = label.slice(0, -3) + "...";
      }
      return label;
    });
  }, [ids, canvasContext, labelFontSize, maxLabelWidth, featuresToShow]);
  console.log("TRUNCATED SELECTED LABELS:");
  console.log(truncatedSelectedLabels);

  const leftTitleMargin = maxLabelWidth + 10;
  const margin = useMemo(
    () => [35, 80, 45, leftTitleMargin],
    [leftTitleMargin]
  );

  const baseRadius = 3;
  const radius = useMemo(() => Math.max(1.5, baseRadius), [baseRadius]);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    dataX: number;
  } | null>(null);

  // Use filtered xValues and colorValues
  const flatXValues = useMemo(
    () => filteredFeaturesIndices.map((i) => xValues[i]).flat(),
    [xValues, filteredFeaturesIndices]
  );

  const flatColorValues = useMemo(
    () => filteredFeaturesIndices.map((i) => colorValues[i]).flat(),
    [colorValues, filteredFeaturesIndices]
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(flatXValues) as [number, number])
        .range([margin[3], width - margin[1]]),
    [flatXValues, width, margin]
  );

  const colorScale = useMemo(
    () =>
      d3
        .scaleSequential()
        .domain(d3.extent(flatColorValues) as [number, number])
        .interpolator(
          d3.interpolateHcl(
            d3.hcl((4.6588 * 180) / Math.PI, 70, 54),
            d3.hcl((0.35470565 * 180) / Math.PI, 90, 54)
          )
        ),
    [flatColorValues]
  );

  const sortedDatasetIndices = useMemo(() => {
    // Sort using only the filtered features
    const datasetIndices = filteredFeaturesIndices;
    return datasetIndices.sort((a, b) => {
      const avgA = d3.mean(xValues[a], (d) => Math.abs(d)) || 0;
      const avgB = d3.mean(xValues[b], (d) => Math.abs(d)) || 0;
      return avgB - avgA;
    });
  }, [xValues, filteredFeaturesIndices]);

  const numDatasets = filteredFeaturesIndices.length;
  console.log("number of datasets: " + numDatasets);

  const maxPlotHeight = 50;
  const plotHeight = useMemo(() => {
    const calculatedPlotHeight = (height - margin[0] - margin[2]) / numDatasets;
    return Math.min(calculatedPlotHeight, maxPlotHeight);
  }, [height, margin, numDatasets]);

  const totalPlotHeight = plotHeight * numDatasets + margin[0] + margin[2];

  const yCenters = useMemo(
    () =>
      sortedDatasetIndices.map((_, datasetIndex) => {
        return margin[0] + plotHeight * datasetIndex + plotHeight / 2;
      }),
    [sortedDatasetIndices, margin, plotHeight]
  );

  const bucketWidth = 1;
  const yValsArray = useMemo(
    () =>
      xValues.map((datasetXValues) => {
        let yVals = new Array(datasetXValues.length);
        const buckets: {
          [key: string]: { value: number; index: number }[];
        } = {};
        datasetXValues.forEach((val, index) => {
          const bucketKey = Math.floor(val / bucketWidth);
          if (!buckets[bucketKey]) {
            buckets[bucketKey] = [];
          }
          buckets[bucketKey].push({ value: val, index: index });
        });
        for (const key in buckets) {
          const bucket = buckets[key];
          bucket.sort((a, b) => a.value - b.value);
          bucket.forEach((item, height) => {
            const half = Math.floor(bucket.length / 2);
            const position = height - half;
            yVals[item.index] = position;
          });
        }
        return yVals;
      }),
    [xValues, bucketWidth]
  );

  const yScales = useMemo(
    () =>
      sortedDatasetIndices.map((dataIndex, datasetIndex) => {
        const yVals = yValsArray[dataIndex];
        const yExtent = d3.extent(yVals) as [number, number];

        if (yExtent[0] === yExtent[1]) {
          yExtent[0] -= 1;
          yExtent[1] += 1;
        }

        return d3
          .scaleLinear()
          .domain(yExtent)
          .range([
            yCenters[datasetIndex] + plotHeight / 2 - radius - 2,
            yCenters[datasetIndex] - plotHeight / 2 + radius + 2,
          ]);
      }),
    [sortedDatasetIndices, yValsArray, yCenters, plotHeight, radius]
  );

  function handleMouseOver(event: any, datasetIndex: number, i: number) {
    const dataIndex = sortedDatasetIndices[datasetIndex];
    const xPos = xScale(xValues[dataIndex][i]);
    const yPos = yScales[datasetIndex](yValsArray[dataIndex][i]);
    setTooltip({
      x: xPos,
      y: yPos,
      dataX: xValues[dataIndex][i],
    });
  }

  function handleMouseOut() {
    setTooltip(null);
  }

  function formatValue(value: number | undefined): string {
    if (value === undefined || isNaN(value)) {
      return "";
    }
    if (Math.abs(value) < 0.005) {
      value = 0;
    }
    return value.toFixed(2);
  }

  const [datasetStats, setDatasetStats] = useState<{
    min: number;
    max: number;
    avg: number;
  } | null>(null);

  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState<
    number | null
  >(null);

  const highlightedIndices = useMemo(() => {
    if (annotation) {
      const dataIndex = ids.indexOf(annotation.label!);
      console.log("LABEL: ");
      console.log(annotation.label!);
      if (dataIndex !== -1) {
        const datasetXValues = xValues[dataIndex];
        let indices: number[] = [];
        if (annotation.type === "highlightDataPoints") {
          indices = datasetXValues
            .map((x, i) => (annotation.dataPoints.includes(x) ? i : -1))
            .filter((i) => i !== -1);
        } else if (annotation.type === "highlightRange") {
          if (annotation.yRange) {
            throw new Error(
              "yValueRange is not supported in the Swarm plot. Use xValueRange instead."
            );
          }
          const [minRange, maxRange] = annotation.xRange!;
          let minR = minRange;
          let maxR = maxRange;
          if (minRange === -Infinity) minR = xScale.domain()[0];
          if (maxRange === Infinity) maxR = xScale.domain()[1];
          indices = datasetXValues
            .map((x, i) => {
              const inRange =
                (isFinite(minR) ? x >= minR : true) &&
                (isFinite(maxR) ? x <= maxR : true);
              return inRange ? i : -1;
            })
            .filter((i) => i !== -1);
        } else if (annotation.type === "singleLine") {
          indices = datasetXValues.map((_, i) => i);
        }
        return indices;
      }
      else{
        console.log("Annotation logic not executed oops")
      }
    }
    return [];
  }, [annotation, ids, xValues, xScale]);

  useEffect(() => {
    if (annotation) {
      if (highlightedIndices.length > 0) {
        const dataIndex = ids.indexOf(annotation.label!);
        if (dataIndex !== -1) {
          const datasetXValues = xValues[dataIndex];
          const xHighlightedValues = highlightedIndices.map(
            (i) => datasetXValues[i]
          );
          const min = d3.min(xHighlightedValues) ?? 0;
          const max = d3.max(xHighlightedValues) ?? 0;
          const avg = d3.mean(xHighlightedValues) ?? 0;
          setDatasetStats({
            min,
            max,
            avg,
          });
        }
      } else {
        setDatasetStats(null);
      }
    }
  }, [annotation, highlightedIndices, ids, xValues]);

  useEffect(() => {
    d3.select("g.swarm g.x-axis").remove();
    d3.select("g.swarm text.x-axis-label").remove();
    d3.selectAll("g.swarm .brush").remove();

    const svg = d3.select("svg");
    if (totalPlotHeight + 60 > height) {
      svg.attr("height", totalPlotHeight + 60);
    }

    const xAxis = d3.axisBottom(xScale);
    d3.select("g.swarm")
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${totalPlotHeight - margin[2] + 5})`)
      .call(xAxis);

    d3.select("g.swarm")
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", (width - margin[1] - margin[3]) / 2 + margin[3])
      .attr("y", totalPlotHeight - margin[2] + 35)
      .attr("text-anchor", "middle")
      .attr("font-size", labelFontSize)
      .text("SHAP Value");

    const defs = d3.select("g.swarm").select("defs");
    if (defs.empty()) {
      const newDefs = d3.select("g.swarm").append("defs");
      const gradient = newDefs
        .append("linearGradient")
        .attr("id", "color-legend-gradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "100%")
        .attr("y2", "0%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(colorScale.domain()[0]));
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(colorScale.domain()[1]));
    }

    const legendWidth = 20;
    const legendHeight = totalPlotHeight - margin[0] - margin[2] - 20;
    const legendX = width - margin[1] + 30;
    const middleY = margin[0] + (totalPlotHeight - margin[0] - margin[2]) / 2;
    const legendY = middleY - legendHeight / 2;

    d3.select("g.swarm .legend").remove();
    d3.select("g.swarm .legend-title").remove();
    d3.select("g.swarm .legend-label").remove();

    d3.select("g.swarm")
      .append("rect")
      .attr("class", "legend")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "url(#color-legend-gradient)");

    d3.select("g.swarm")
      .append("text")
      .attr("class", "legend-title")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", middleY - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", labelFontSize)
      .attr("transform", `rotate(90, ${legendX + legendWidth / 2}, ${middleY})`)
      .text("Feature Value");

    d3.select("g.swarm")
      .append("text")
      .attr("class", "legend-label")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY + legendHeight + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", labelFontSize)
      .text(formatValue(colorScale.domain()[0]));

    d3.select("g.swarm")
      .append("text")
      .attr("class", "legend-label")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", labelFontSize)
      .text(formatValue(colorScale.domain()[1]));

    if (!annotation) {
      const brushes: any[] = [];

      sortedDatasetIndices.forEach((dataIndex, datasetIndex) => {
        const yCenter = yCenters[datasetIndex];
        const yStart = yCenter - plotHeight / 2;
        const yEnd = yCenter + plotHeight / 2;

        const brush = d3
          .brushX()
          .extent([
            [margin[3], yStart],
            [width - margin[1], yEnd],
          ])
          .on("start", function (event) {
            brushes.forEach((b, i) => {
              if (i !== datasetIndex) {
                d3.select(`g.swarm .brush-${i}`).call(b.move, null);
              }
            });
          })
          .on("end", function (event) {
            try {
              const selection = event.selection;
              if (!selection) {
                setSelectedIndices([]);
                setSelectedDatasetIndex(null);
                d3.selectAll("g.swarm .points circle").attr("opacity", 1);
                setDatasetStats(null);
                return;
              }
              const [x0, x1] = selection;
              const brushedIndices: number[] = [];
              const brushedValues: number[] = [];
              xValues[dataIndex].forEach((val, i) => {
                const x = xScale(val);
                if (x0 <= x && x <= x1) {
                  brushedIndices.push(i);
                  brushedValues.push(val);
                }
              });
              setSelectedIndices(brushedIndices);
              setSelectedDatasetIndex(datasetIndex);

              const min = d3.min(brushedValues) ?? 0;
              const max = d3.max(brushedValues) ?? 0;
              const avg = d3.mean(brushedValues) ?? 0;
              setDatasetStats({
                min,
                max,
                avg,
              });

              sortedDatasetIndices.forEach((dataIdx, idx) => {
                d3.selectAll(`g.swarm .points-${idx} circle`).attr(
                  "opacity",
                  (d, i) => {
                    return brushedIndices.includes(i) ? 1 : 0.3;
                  }
                );
              });
            } catch (error) {
              console.error("Brush event error:", error);
            }
          });

        brushes.push(brush);

        const brushGroup = d3
          .select("g.swarm")
          .append("g")
          .attr("class", `brush brush-${datasetIndex}`);

        brushGroup
          .call(brush)
          .selectAll(".selection")
          .style("fill", "rgba(128, 128, 128, 0.2)")
          .style("stroke", "rgba(128, 128, 128, 0.2)");
      });
    }

    return () => {
      d3.selectAll("g.swarm .brush").remove();
    };
  }, [
    xValues,
    colorValues,
    height,
    width,
    colorScale,
    margin,
    setSelectedIndices,
    xScale,
    plotHeight,
    yCenters,
    sortedDatasetIndices,
    totalPlotHeight,
    numDatasets,
    annotation,
  ]);

  useEffect(() => {
    if (annotation && highlightedIndices.length > 0) {
      sortedDatasetIndices.forEach((dataIdx, idx) => {
        d3.selectAll(`g.swarm .points-${idx} circle`).attr(
          "opacity",
          (d, i) => {
            return highlightedIndices.includes(i) ? 1 : 0.3;
          }
        );
      });
    } else if (selectedIndices.length > 0 && selectedDatasetIndex !== null) {
      sortedDatasetIndices.forEach((dataIdx, idx) => {
        d3.selectAll(`g.swarm .points-${idx} circle`).attr(
          "opacity",
          (d, i) => {
            return selectedIndices.includes(i) ? 1 : 0.3;
          }
        );
      });
    } else {
      d3.selectAll("g.swarm .points circle").attr("opacity", 1);
    }
  }, [
    annotation,
    highlightedIndices,
    sortedDatasetIndices,
    selectedIndices,
    selectedDatasetIndex,
  ]);

  return (
    <g className="swarm">
      <rect
        className="background"
        width={width}
        height={totalPlotHeight}
        fill="white"
        stroke="black"
      />

      <g className="annotations">
        {datasetStats ? (
          <text
            x={(width - margin[1] - margin[3]) / 2 + margin[3]}
            y={margin[0] - 10}
            textAnchor="middle"
            fontSize={labelFontSize}
            fill="black"
          >
            {`X - Avg: ${formatValue(datasetStats.avg)}, Min: ${formatValue(
              datasetStats.min
            )}, Max: ${formatValue(datasetStats.max)}`}
          </text>
        ) : (
          <text
            x={(width - margin[1] - margin[3]) / 2 + margin[3]}
            y={margin[0] - 10}
            textAnchor="middle"
            fontSize={labelFontSize}
            fill="black"
          >
            No data selected
          </text>
        )}
      </g>

      {sortedDatasetIndices.map((dataIndex, datasetIndex) => {
        const datasetXValues = xValues[dataIndex];
        const datasetYVals = yValsArray[dataIndex];
        const datasetColorValues = colorValues[dataIndex];
        const datasetID = ids[dataIndex];
        const truncatedLabel = truncatedLabels[dataIndex];

        const yScale = yScales[datasetIndex];

        const isAnnotationForDataset =
          annotation && annotation.label === datasetID;

        console.log("next check: " + annotation + ", label: " + annotation?.label);

        return (
          <g
            className={`points points-${datasetIndex}`}
            key={`dataset-${datasetIndex}`}
          >
            <text
              x={margin[3] - 5}
              y={yCenters[datasetIndex]}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={labelFontSize}
              fontWeight={
                truncatedSelectedLabels?.includes(truncatedLabel)
                  ? "bold"
                  : "normal"
              }
              fill={
                truncatedSelectedLabels?.includes(truncatedLabel)
                  ? "black"
                  : "gray"
              }
            >
              {truncatedLabel}
            </text>

            {isAnnotationForDataset && annotation && (
              <>
                {annotation.type === "singleLine" &&
                  annotation.xValue !== undefined && (
                    <line
                      x1={xScale(annotation.xValue!)}
                      x2={xScale(annotation.xValue!)}
                      y1={yCenters[datasetIndex] - plotHeight / 2}
                      y2={yCenters[datasetIndex] + plotHeight / 2}
                      stroke="black"
                      strokeDasharray="4,2"
                    />
                  )}
                {annotation.type === "highlightRange" && (
                  <>
                    {isFinite(annotation.xRange![0]) && (
                      <line
                        x1={xScale(annotation.xRange![0])}
                        x2={xScale(annotation.xRange![0])}
                        y1={yCenters[datasetIndex] - plotHeight / 2}
                        y2={yCenters[datasetIndex] + plotHeight / 2}
                        stroke="black"
                        strokeDasharray="4,2"
                      />
                    )}
                    {isFinite(annotation.xRange![1]) && (
                      <line
                        x1={xScale(annotation.xRange![1])}
                        x2={xScale(annotation.xRange![1])}
                        y1={yCenters[datasetIndex] - plotHeight / 2}
                        y2={yCenters[datasetIndex] + plotHeight / 2}
                        stroke="black"
                        strokeDasharray="4,2"
                      />
                    )}
                  </>
                )}
              </>
            )}

            {datasetXValues.map((x, i) => {
              let isHighlighted = true;

              if (selectedIndices.length > 0 && selectedDatasetIndex !== null) {
                isHighlighted = selectedIndices.includes(i);
              } else if (annotation && isAnnotationForDataset) {
                isHighlighted = highlightedIndices.includes(i);
              }

              return (
                <circle
                  key={i}
                  cx={xScale(x)}
                  cy={yScale(datasetYVals[i])}
                  r={radius}
                  fill={colorScale(datasetColorValues[i])}
                  opacity={isHighlighted ? 1 : 0.3}
                  onMouseOver={(event) =>
                    handleMouseOver(event, datasetIndex, i)
                  }
                  onMouseOut={handleMouseOut}
                />
              );
            })}
          </g>
        );
      })}

      {tooltip && (
        <g
          className="tooltip"
          transform={`translate(${tooltip.x + 10}, ${tooltip.y - 10})`}
        >
          <rect
            x={0}
            y={-19}
            width={80}
            height={20}
            fill="white"
            stroke="black"
            opacity={0.9}
          />
          <text x={5} y={-5} fontSize="10px" fill="black">
            {`X: ${formatValue(tooltip.dataX)}`}
          </text>
        </g>
      )}
    </g>
  );
}
