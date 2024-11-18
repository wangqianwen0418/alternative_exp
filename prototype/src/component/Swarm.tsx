import * as d3 from "d3";
import { useEffect, useState } from "react";
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

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(xValues) as [number, number])
    .range([margin[3] + leftTitleMargin, width - margin[1] - 40]);

  const colorScale = d3
    .scaleSequential()
    .domain(d3.extent(colorValues) as [number, number])
    .interpolator(
      d3.interpolateHcl(
        d3.hcl((4.6588 * 180) / Math.PI, 70, 54),
        d3.hcl((0.35470565 * 180) / Math.PI, 90, 54)
      )
    );

  const yScale = d3
    .scaleLinear()
    .range([
      (height / 2 - radius) * 0.7 + 14,
      (height / 2 + radius) * 0.7 + 14,
    ]);

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
      const brush = d3
        .brushX()
        .extent([
          [margin[3] + leftTitleMargin, 0],
          [width - margin[1] - 40, height],
        ])
        .on("start", (event) => brushstart(event))
        .on("end", (event) => brushended(event));

      const brushGroup = d3
        .select(`g.swarm#${id}`)
        .append("g")
        .attr("class", "brush")
        .call(brush);

      const brushstart = (event: any) => {
        brushGroup.call(brush.move, null);
      };

      const brushended = (event: any) => {
        const selection = event.selection;
        if (!selection) return;
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
        brushGroup.call(brush.move, null);
      };

      brush.on("brush", (event) => {
        const selection = event.selection;
        if (selection) {
          const [x0, x1] = selection;
          const selectedIndices = xValues.reduce((acc: number[], x, i) => {
            if (x0 <= xScale(x) && xScale(x) <= x1) {
              acc.push(i);
            }
            return acc;
          }, []);
          setSelectedPoints(selectedIndices);
          setBrushSelection([x0, x1]);
        } else {
          setSelectedPoints([]);
          setBrushSelection(null);
        }
      });
    }

    return () => {
      d3.select(`g.swarm#${id} .brush`).remove();
    };
  }, [xValues, height, width, annotation]);

  let bucketWidth = 1;
  let buckets: { [key: number]: { value: number; index: number }[] } = {};

  xValues.forEach((val, index) => {
    let bucketKey = Math.floor(val / bucketWidth);
    if (!buckets[bucketKey]) {
      buckets[bucketKey] = [];
    }
    buckets[bucketKey].push({ value: val, index: index });
  });
  let yVals = new Array(xValues.length);

  for (let key in buckets) {
    let bucket = buckets[key];
    bucket.sort((a, b) => a.value - b.value);
    bucket.forEach((item, height) => {
      let half = Math.floor(bucket.length / 2);
      let position = height < half ? height : height - bucket.length;
      yVals[item.index] = position;
    });
  }

  function isPointHighlighted(i: number): boolean {
    if (!annotation) {
      return true;
    }

    if (annotation.type === "highlightXRange") {
      const x = xValues[i];
      const [minRange, maxRange] = annotation.range;
      return x >= minRange && x <= maxRange;
    } else if (annotation.type === "highlightDataPoints") {
      const x = xValues[i];
      return annotation.dataPoints.includes(x);
    } else {
      return true;
    }
  }

  function renderAnnotations() {
    if (!annotation) {
      return null;
    }

    const lineStartY = height / 2 + radius * 2 + 5;
    const lineEndY = 65;

    if (annotation.type === "verticalLine") {
      const xPos = xScale(annotation.value);
      return (
        <>
          <line
            x1={xPos}
            y1={lineStartY}
            x2={xPos}
            y2={lineEndY}
            stroke="black"
            strokeDasharray="4, 2"
          />

          <text
            x={xPos + 5} // Position slightly to the right of the line
            y={lineStartY + 15} // Position slightly below the top
            fill="black"
            fontSize="12px"
          >
            {`val=${annotation.value.toFixed(2)}`} {/* Add the label */}
          </text>
        </>
      );
    } else if (annotation.type === "highlightXRange") {
      const [minRange, maxRange] = annotation.range;
      const xStart = xScale(minRange);
      const xEnd = xScale(maxRange);

      return (
        <>
          <line
            x1={xStart}
            y1={lineStartY}
            x2={xStart}
            y2={lineEndY}
            stroke="black"
            strokeDasharray="4, 2"
          />
          <line
            x1={xEnd}
            y1={lineStartY}
            x2={xEnd}
            y2={lineEndY}
            stroke="black"
            strokeDasharray="4, 2"
          />

          {/* Label for the start of the range */}
          <text x={xStart + 5} y={lineStartY + 15} fill="black" fontSize="12px">
            {`min=${minRange.toFixed(2)}`}
          </text>
          {/* Label for the end of the range */}
          <text x={xEnd + 5} y={lineStartY + 15} fill="black" fontSize="12px">
            {`max=${maxRange.toFixed(2)}`}
          </text>
        </>
      );
    }
    return null;
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
          />
        ))}
      </g>
      {renderAnnotations()}
    </g>
  );
}
