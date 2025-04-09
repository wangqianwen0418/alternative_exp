import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { TAnnotation } from "../util/types";
import { useLogging } from "../util/logging";

interface TwoColorScatterProps {
  xValues: number[];
  yValues: number[];
  colorValues: number[];
  width: number;
  height: number;
  id: string;
  xLabel: string;
  yLabel: string;
  colorLabel: string;
  annotation?: TAnnotation; // [[low, high]] or [[low1, high1], [low2, high2]]
}

export default function TwoColorScatter(props: TwoColorScatterProps) {
  const {
    xValues,
    yValues,
    colorValues,
    width,
    height,
    id,
    xLabel,
    yLabel,
    colorLabel,
    annotation,
  } = props;
  const annotationArray: Array<[number, number]> | undefined =
    annotation?.type === "twoColorRange" ? annotation.range : undefined;

  const margin = [22.5, 10, 40, 52.5];
  const labelFontSize = 13;
  const chartLeft = margin[3];
  const chartRight = width - margin[1] - 90;

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(xValues) as [number, number])
      .range([chartLeft, chartRight]);
  }, [xValues, chartLeft, chartRight]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(yValues) as [number, number])
      .range([height - margin[2], margin[0]]);
  }, [yValues, height, margin]);

  const [minColor, maxColor] = d3.extent(colorValues) as [number, number];
  const zeroOffset = (0 - minColor) / (maxColor - minColor);
  const colorScale = useMemo(() => {
    return d3
      .scaleDiverging<string>()
      .domain([minColor, 0, maxColor])
      .interpolator((t) =>
        t < 0.5
          ? d3.interpolateRgb("#008bfc", "#f2faff")(t * 2)
          : d3.interpolateRgb("#f2faff", "#ff0051")((t - 0.5) * 2)
      );
  }, [minColor, maxColor]);

  const [sliderRange, setSliderRange] = useState<[number, number]>([
    minColor,
    maxColor,
  ]);

  useEffect(() => {
    if (annotationArray) {
      setSliderRange([minColor, maxColor]);
    }
  }, [annotationArray, minColor, maxColor]);

  const legendWidth = 20;
  const legendHeight = height - margin[0] - margin[2];
  const legendX = chartRight + 30;
  const legendY = margin[0];
  const legendScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([minColor, maxColor])
      .range([legendHeight, 0]);
  }, [minColor, maxColor, legendHeight]);

  const handleMinRef = useRef<SVGRectElement>(null);
  const handleMaxRef = useRef<SVGRectElement>(null);

  const log = useLogging();

  function createDragHandle(isMinHandle: boolean) {
    return d3
      .drag<SVGRectElement, unknown>()
      .on("drag", (event) => {
        const yClamped = Math.max(0, Math.min(legendHeight, event.y));
        const newValue = legendScale.invert(yClamped);
        setSliderRange(([low, high]) => {
          if (isMinHandle) {
            low = Math.min(newValue, high);
          } else {
            high = Math.max(newValue, low);
          }
          return [low, high];
        });
      })
      .on("end", () => {
        log("Two Color Selection", "User adjusted range on Two Color chart.");
      });
  }

  useEffect(() => {
    if (!annotationArray) {
      if (handleMinRef.current) {
        d3.select(handleMinRef.current).call(createDragHandle(true));
      }
      if (handleMaxRef.current) {
        d3.select(handleMaxRef.current).call(createDragHandle(false));
      }
    }
  }, [annotationArray, createDragHandle]);

  useEffect(() => {
    const container = d3.select(`g.twoColorScatter#${id}`);
    container.selectAll("g.x-axis").remove();
    container.selectAll("g.y-axis").remove();

    const xAxisGroup = container
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(-10,${height - margin[2]})`);
    xAxisGroup.call(d3.axisBottom(xScale));
    xAxisGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("x", (chartLeft + chartRight) / 2)
      .attr("y", 30)
      .attr("fill", "black")
      .attr("font-size", labelFontSize)
      .text(xLabel);

    const yAxisGroup = container
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin[3] - 10},0)`);
    yAxisGroup.call(d3.axisLeft(yScale));
    yAxisGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", -((height - margin[2] + margin[0]) / 2))
      .attr("y", -27.5)
      .attr("fill", "black")
      .attr("font-size", labelFontSize)
      .text(yLabel);
  }, [
    xScale,
    yScale,
    xLabel,
    yLabel,
    height,
    margin,
    chartLeft,
    chartRight,
    labelFontSize,
  ]);

  function getCircleOpacity(val: number) {
    if (annotationArray) {
      for (let [low, high] of annotationArray) {
        if (val >= low && val <= high) return 0.8;
      }
      return 0;
    } else {
      const [low, high] = sliderRange;
      return val >= low && val <= high ? 0.8 : 0;
    }
  }

  const ticks = legendScale.ticks(10);

  return (
    <g className="twoColorScatter" id={id}>
      <rect width={width} height={height} fill="white" stroke="black" />
      <g className="points">
        {xValues.map((x, i) => {
          const cx = xScale(x);
          const cy = yScale(yValues[i]);
          const cVal = colorValues[i];
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={3}
              fill={colorScale(cVal)}
              opacity={getCircleOpacity(cVal)}
            />
          );
        })}
      </g>
      <g transform={`translate(${legendX}, ${legendY})`}>
        <defs>
          <linearGradient
            id={`color-gradient-${id}`}
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#008bfc" />
            <stop offset={`${zeroOffset * 100}%`} stopColor="#f2faff" />
            <stop offset="100%" stopColor="#ff0051" />
          </linearGradient>
        </defs>
        <g>
          {ticks.map((tickVal, idx) => {
            const yPos = legendScale(tickVal);
            return (
              <g key={idx} transform={`translate(0,${yPos})`}>
                <text textAnchor="end" x={-5} fontSize={10} dy=".32em">
                  {tickVal}
                </text>
                <line x1={-2} x2={0} stroke="black" />
              </g>
            );
          })}
        </g>
        <rect
          x={10}
          y={0}
          width={legendWidth}
          height={legendHeight}
          fill={`url(#color-gradient-${id})`}
        />
        {annotationArray
          ? (() => {
              let intervals = annotationArray.map(([low, high]) => {
                const t = legendScale(Math.max(low, high));
                const b = legendScale(Math.min(low, high));
                return [
                  Math.max(0, Math.min(legendHeight, t)),
                  Math.max(0, Math.min(legendHeight, b)),
                ] as [number, number];
              });
              intervals.sort((a, b) => a[0] - b[0]);

              const overlays: JSX.Element[] = [];
              let currentY = 0;

              intervals.forEach(([topY, bottomY], idx) => {
                if (topY > currentY) {
                  overlays.push(
                    <rect
                      key={`gap-${idx}`}
                      x={10}
                      y={currentY}
                      width={legendWidth}
                      height={topY - currentY}
                      fill="white"
                      opacity={0.6}
                    />
                  );
                }
                currentY = bottomY;
              });
              if (currentY < legendHeight) {
                overlays.push(
                  <rect
                    key="gap-last"
                    x={10}
                    y={currentY}
                    width={legendWidth}
                    height={legendHeight - currentY}
                    fill="white"
                    opacity={0.6}
                  />
                );
              }
              return overlays;
            })()
          : (() => {
              const [low, high] = sliderRange;
              const topVal = Math.max(low, high);
              const bottomVal = Math.min(low, high);
              const yTop = legendScale(topVal);
              const yBottom = legendScale(bottomVal);

              const overlays: JSX.Element[] = [];
              if (yTop > 0) {
                overlays.push(
                  <rect
                    key="above"
                    x={10}
                    y={0}
                    width={legendWidth}
                    height={yTop}
                    fill="white"
                    opacity={0.7}
                  />
                );
              }
              if (yBottom < legendHeight) {
                overlays.push(
                  <rect
                    key="below"
                    x={10}
                    y={yBottom}
                    width={legendWidth}
                    height={legendHeight - yBottom}
                    fill="white"
                    opacity={0.7}
                  />
                );
              }
              return overlays;
            })()}
        {annotationArray ? (
          annotationArray.map(([low, high], i) => {
            const yTop = legendScale(high) - 2;
            const yBottom = legendScale(low) - 2;
            return (
              <g key={`annotationHandle-${i}`}>
                <rect
                  x={5}
                  y={yTop}
                  width={legendWidth + 10}
                  height={4}
                  fill="black"
                />
                <rect
                  x={5}
                  y={yBottom}
                  width={legendWidth + 10}
                  height={4}
                  fill="black"
                />
              </g>
            );
          })
        ) : (
          <>
            <rect
              ref={handleMinRef}
              x={5}
              y={legendScale(sliderRange[0]) - 2}
              width={legendWidth + 10}
              height={4}
              fill="black"
              style={{ cursor: "grab" }}
            />
            <rect
              ref={handleMaxRef}
              x={5}
              y={legendScale(sliderRange[1]) - 2}
              width={legendWidth + 10}
              height={4}
              fill="black"
              style={{ cursor: "grab" }}
            />
          </>
        )}
        <text
          x={legendWidth + 40}
          y={legendHeight / 2 - 12}
          fontSize={labelFontSize}
          textAnchor="middle"
          transform={`rotate(-90, ${legendWidth + 40}, ${legendHeight / 2})`}
          dy=".35em"
        >
          {colorLabel}
        </text>
      </g>
    </g>
  );
}
