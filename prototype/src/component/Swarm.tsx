import * as d3 from "d3";
import { useEffect, useState, useMemo } from "react";
import { TAnnotation } from "../util/types";

interface SwarmProps {
  xValues: number[];
  colorValues: number[];
  width: number;
  height: number;
  id: string;
  selectedIndices: number[];
  setSelectedIndices: (index: number[]) => void;
  annotation?: TAnnotation;
}

export default function Swarm(props: SwarmProps) {
  let margin = [10, 40, 40, 10],
    radius = 2,
    leftTitleMargin = 40;
    const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
    const [brushSelection, setBrushSelection] = useState<[number, number] | null>(
      null
  );

  const {
    xValues,
    colorValues,
    height,
    width,
    id,
    selectedIndices,
    setSelectedIndices,
    annotation,
  } = props;

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    dataX: number;
  } | null>(null);

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(xValues) as [number, number])
        .range([margin[3] + leftTitleMargin, width - margin[1] - 40]),
    [xValues, width]
  );

  const colorScale = useMemo(
    () =>
      d3
        .scaleSequential()
        .domain(d3.extent(colorValues) as [number, number])
        .interpolator(
          d3.interpolateHcl(
            d3.hcl((4.6588 * 180) / Math.PI, 70, 54),
            d3.hcl((0.35470565 * 180) / Math.PI, 90, 54)
          )
        ),
    [colorValues]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .range([
          (height / 2 - radius) * 0.7 + 14,
          (height / 2 + radius) * 0.7 + 14,
        ]),
    [height]
  );

  useEffect(() => {
    d3.select(`g.swarm#${id} g.x-axis`).remove();
    d3.select(`g.swarm#${id} g.brush`).remove();

    const xAxis = d3.axisBottom(xScale);
    d3.select(`g.swarm#${id}`)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height / 2 + radius * 2 + 5})`)
      .call(xAxis);

    const defs = d3.select(`g.swarm#${id}`).select("defs");
    if (defs.empty()) {
      const newDefs = d3.select(`g.swarm#${id}`).append("defs");
      const gradient = newDefs
        .append("linearGradient")
        .attr("id", `color-legend-gradient-${id}`)
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
    const legendHeight = 50;
    const legendX = width - legendWidth - 30;
    const legendY = height / 2 - 60;
    const xAxisTextSize = 12;

    if (d3.select(`g.swarm#${id} .legend`).empty()) {
      d3.select(`g.swarm#${id}`)
        .append("rect")
        .attr("class", "legend")
        .attr("x", legendX)
        .attr("y", legendY)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", `url(#color-legend-gradient-${id})`);

      d3.select(`g.swarm#${id}`)
        .append("text")
        .attr("class", "legend-title")
        .attr("x", legendX + legendWidth / 2)
        .attr("y", legendY - 25)
        .attr("text-anchor", "middle")
        .attr("font-size", xAxisTextSize)
        .text("Feature Value");

      d3.select(`g.swarm#${id}`)
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendX + legendWidth / 2)
        .attr("y", legendY + legendHeight + 15)
        .attr("text-anchor", "middle")
        .attr("font-size", xAxisTextSize)
        .text(colorScale.domain()[0].toFixed(2));

      d3.select(`g.swarm#${id}`)
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendX + legendWidth / 2)
        .attr("y", legendY - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", xAxisTextSize)
        .text(colorScale.domain()[1].toFixed(2));
    }

    if (!annotation) {
      const brushGroup = d3
        .select(`g.swarm#${id}`)
        .append("g")
        .attr("class", "brush");

      const brush = d3
        .brushX()
        .extent([
          [margin[3] + leftTitleMargin, 0],
          [width - margin[1] - 40, height],
        ])
        .on("start", function (event) {
          brushGroup.call(brush.move, null);
        })
        .on("end", function (event) {
          const selection = event.selection;
          if (!selection) {
            setSelectedIndices([]);
            d3.selectAll(`g.swarm#${id} .points circle`).attr("opacity", 1);
            return;
          }
          const brushedIndices: number[] = [];
          const [x0, x1] = selection;

          d3.selectAll(`g.swarm#${id} .points circle`)
            .attr("opacity", (d: any, i: number) => {
              const x = xScale(xValues[i]);
              const isInBrush = x0 <= x && x <= x1;
              return isInBrush ? 1 : 0.3;
            })
            .each(function (d: any, i: number) {
              const x = xScale(xValues[i]);
              if (x0 <= x && x <= x1) {
                brushedIndices.push(i);
              }
            });

          setSelectedIndices(brushedIndices);
        });

      brushGroup.call(brush);
    }

    return () => {
      d3.select(`g.swarm#${id} .brush`).remove();
    };
  }, [xValues, colorValues, height, width, annotation]);

  const bucketWidth = 1;
  const buckets: { [key: number]: { value: number; index: number }[] } = {};

  xValues.forEach((val, index) => {
    const bucketKey = Math.floor(val / bucketWidth);
    if (!buckets[bucketKey]) {
      buckets[bucketKey] = [];
    }
    buckets[bucketKey].push({ value: val, index: index });
  });
  const yVals = new Array(xValues.length);

  for (const key in buckets) {
    const bucket = buckets[key];
    bucket.sort((a, b) => a.value - b.value);
    bucket.forEach((item, height) => {
      const half = Math.floor(bucket.length / 2);
      const position = height < half ? height : height - bucket.length;
      yVals[item.index] = position;
    });
  }

  function isPointHighlighted(i: number): boolean {
    if (!annotation) {
      return true;
    }

    if (annotation.type === "highlightRange") {
      const x = xValues[i];
      const [minRange, maxRange] = annotation.shapRange;
      return x >= minRange && x <= maxRange;
    } else if (annotation.type === "highlightPoints") {
      const x = xValues[i];
      return annotation.shapValues.includes(x);
    } else {
      return true;
    }
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

  function renderAnnotations() {
    const elements = [];
    const lineStartY = height / 2 + radius * 2 + 5;
    const lineEndY = 65;

    let highlightedIndices: number[] = [];

    if (annotation) {
      highlightedIndices = xValues
        .map((x, i) => (isPointHighlighted(i) ? i : -1))
        .filter((i) => i !== -1);
    }

    if (selectedIndices.length > 0) {
      highlightedIndices = selectedIndices;
    }

    if (highlightedIndices.length > 0) {
      const xHighlightedValues = highlightedIndices.map((i) => xValues[i]);

      const xMinVal = d3.min(xHighlightedValues);
      const xMaxVal = d3.max(xHighlightedValues);
      const xAvgVal = d3.mean(xHighlightedValues);

      const statsText = `X - Avg: ${formatValue(xAvgVal)}, Min: ${formatValue(
        xMinVal
      )}, Max: ${formatValue(xMaxVal)}`;

      elements.push(
        <text
          key="highlightStats"
          x={width / 2}
          y={15}
          fill="black"
          fontSize="10px"
          textAnchor="middle"
        >
          {statsText}
        </text>
      );
    } else {
      elements.push(
        <text
          key="noDataStats"
          x={width / 2}
          y={15}
          fill="black"
          fontSize="10px"
          textAnchor="middle"
        >
          No data selected
        </text>
      );
    }

    if (annotation) {
      if (annotation.type === "singleLine") {
        if (annotation.xValue !== undefined) {
          const xPos = xScale(annotation.xValue);
          elements.push(
            <line
              key="xSingleLine"
              x1={xPos}
              y1={lineStartY}
              x2={xPos}
              y2={lineEndY}
              stroke="black"
              strokeDasharray="4, 2"
            />
          );
        } else if (annotation.yValue !== undefined) {
          const yPos = yScale(annotation.yValue);
          elements.push(
            <line
              key="ySingleLine"
              x1={margin[3] + leftTitleMargin}
              y1={yPos}
              x2={width - margin[1] - 40}
              y2={yPos}
              stroke="black"
              strokeDasharray="4, 2"
            />
          );
        }
      } else if (annotation.type === "highlightRange") {
        const [minRange, maxRange] = annotation.shapRange;
        const xStart = xScale(minRange);
        const xEnd = xScale(maxRange);

        elements.push(
          <line
            key="xMinLine"
            x1={xStart}
            y1={lineStartY}
            x2={xStart}
            y2={lineEndY}
            stroke="black"
            strokeDasharray="4, 2"
          />,
          <line
            key="xMaxLine"
            x1={xEnd}
            y1={lineStartY}
            x2={xEnd}
            y2={lineEndY}
            stroke="black"
            strokeDasharray="4, 2"
          />
        );
      }
    }

    return elements;
  }

  function handleMouseOver(event: any, i: number) {
    const xPos = xScale(xValues[i]);
    const yPos = yScale(yVals[i]);
    setTooltip({
      x: xPos,
      y: yPos,
      dataX: xValues[i],
    });
  }

  function handleMouseOut() {
    setTooltip(null);
  }

  const avgYPosition = (Math.min(...yVals) + Math.max(...yVals)) / 2;

  return (
    <g className="swarm" id={id}>
      <rect
        className="background"
        width={width}
        height={height}
        fill="white"
        stroke="black"
      />
      <g className="points">
        <text
          x={leftTitleMargin - 10}
          y={yScale(avgYPosition)}
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {id}
        </text>
        {xValues.map((x, i) => (
          <circle
            key={i}
            cx={xScale(x)}
            cy={yScale(yVals[i])}
            r={3}
            fill={colorScale(colorValues[i])}
            opacity={isPointHighlighted(i) ? 1 : 0.3}
            onMouseOver={(event) => handleMouseOver(event, i)}
            onMouseOut={handleMouseOut}
          />
        ))}
      </g>
      {renderAnnotations()}
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
