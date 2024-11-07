// Scatter.tsx
import * as d3 from "d3";
import { useEffect } from "react";

interface ScatterProps {
  offsets: number[];
  xValues: number[];
  yValues: number[];
  width: number;
  height: number;
  id: string; // ensure accurate d3 selection with multiple scatters on the same page
  selectedIndices: number[];
  setSelectedIndices: (indices: number[]) => void;
  annotation?: Annotation;
}

type Annotation =
  | { type: "highlightPoints"; xValues: number[] }
  | {
      type: "highlightRange";
      xValueRange?: [number, number];
      yValueRange?: [number, number];
    }
  | { type: "verticalLine"; xValue: number };

export default function Scatter(props: ScatterProps) {
  const {
    xValues,
    yValues,
    height,
    width,
    id,
    offsets,
    selectedIndices,
    setSelectedIndices,
    annotation,
  } = props;

  const margin = [10, 10, 40, 10];

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(xValues) as [number, number])
    .range([margin[3], width - margin[1]]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yValues) as [number, number])
    .range([height - margin[2], margin[0]]);

  useEffect(() => {
    d3.select(`g.scatter#${id}`).selectAll("g.x-axis").remove();
    d3.select(`g.scatter#${id}`).selectAll("g.y-axis").remove();
    d3.select(`g.scatter#${id} .brush`).remove();

    const xAxisGroup = d3
      .select(`g.scatter#${id}`)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`);

    xAxisGroup.call(d3.axisBottom(xScale));
    xAxisGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("y", -5)
      .attr("x", width / 2)
      .attr("fill", "black")
      .text("Feature Values");

    const yAxisGroup = d3
      .select(`g.scatter#${id}`)
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(0,0)`);

    yAxisGroup.call(d3.axisRight(yScale));

    yAxisGroup
      .append("text")
      .attr("text-anchor", "start")
      .attr("class", "axis-title")
      .attr("transform", `rotate(-90) translate(${-height / 2}, -35)`)
      .attr("fill", "black")
      .text("Contributions");

    if (!annotation) {
      const brush = d3
        .brush()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("start", (event) => brushstart(event))
        .on("end", (event) => brushended(event));

      const brushGroup = d3
        .select(`g.scatter#${id}`)
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
        const [[x0, y0], [x1, y1]] = selection;

        d3.selectAll(`g.scatter#${id} .points circle`)
          .attr("opacity", (d: any, i: number) => {
            const x = xScale(xValues[i]);
            const y = yScale(yValues[i]);
            const isInBrush = x0 <= x && x <= x1 && y0 <= y && y <= y1;
            return isInBrush ? 0.8 : 0.3;
          })
          .each(function (d: any, i: number) {
            const x = xScale(xValues[i]);
            const y = yScale(yValues[i]);
            if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
              brushedIndices.push(i);
            }
          });

        setSelectedIndices(brushedIndices);
      };

      return () => {
        d3.select(`g.scatter#${id} .brush`).remove();
      };
    }
  }, [xValues, height, width, annotation]);

  function isPointHighlighted(i: number): boolean {
    if (!annotation) {
      return true;
    }

    const x = xValues[i];
    const y = yValues[i];

    if (annotation.type === "highlightRange") {
      let xHighlighted = true;
      let yHighlighted = true;

      if (annotation.xValueRange) {
        const [xMin, xMax] = annotation.xValueRange;
        xHighlighted = x >= xMin && x <= xMax;
      }

      if (annotation.yValueRange) {
        const [yMin, yMax] = annotation.yValueRange;
        yHighlighted = y >= yMin && y <= yMax;
      }

      return xHighlighted && yHighlighted;
    } else if (annotation.type === "highlightPoints") {
      return annotation.xValues.includes(x);
    } else {
      return true;
    }
  }

  function renderAnnotations() {
    if (!annotation) {
      return null;
    }

    const elements = [];

    if (annotation.type === "verticalLine") {
      const xPos = xScale(annotation.xValue);
      elements.push(
        <line
          key="verticalLine"
          x1={xPos}
          y1={0}
          x2={xPos}
          y2={height}
          stroke="black"
          strokeDasharray="4, 2"
        />
      );
    } else if (annotation.type === "highlightRange") {
      const hasXRange = annotation.xValueRange !== undefined;
      const hasYRange = annotation.yValueRange !== undefined;

      if (hasXRange && hasYRange) {
        const [xMin, xMax] = annotation.xValueRange!;
        const xStart = xScale(xMin);
        const xEnd = xScale(xMax);
        const [yMin, yMax] = annotation.yValueRange!;
        const yStart = yScale(yMin);
        const yEnd = yScale(yMax);

        elements.push(
          <rect
            key="highlightRect"
            x={Math.min(xStart, xEnd)}
            y={Math.min(yStart, yEnd)}
            width={Math.abs(xEnd - xStart)}
            height={Math.abs(yEnd - yStart)}
            fill="none"
            stroke="black"
            strokeDasharray="4,2"
          />
        );
      } else if (hasXRange) {
        const [xMin, xMax] = annotation.xValueRange!;
        const xStart = xScale(xMin);
        const xEnd = xScale(xMax);

        elements.push(
          <line
            key="xMinLine"
            x1={xStart}
            y1={0}
            x2={xStart}
            y2={height}
            stroke="black"
            strokeDasharray="4, 2"
          />
        );
        elements.push(
          <line
            key="xMaxLine"
            x1={xEnd}
            y1={0}
            x2={xEnd}
            y2={height}
            stroke="black"
            strokeDasharray="4, 2"
          />
        );
      } else if (hasYRange) {
        const [yMin, yMax] = annotation.yValueRange!;
        const yStart = yScale(yMin);
        const yEnd = yScale(yMax);

        elements.push(
          <line
            key="yMinLine"
            x1={0}
            y1={yStart}
            x2={width}
            y2={yStart}
            stroke="black"
            strokeDasharray="4, 2"
          />
        );
        elements.push(
          <line
            key="yMaxLine"
            x1={0}
            y1={yEnd}
            x2={width}
            y2={yEnd}
            stroke="black"
            strokeDasharray="4, 2"
          />
        );
      }
    }

    return elements;
  }

  return (
    <g
      className="scatter"
      id={id}
      transform={`translate(${offsets[0]}, ${offsets[1]})`}
    >
      <rect
        className="background"
        width={width}
        height={height}
        fill="white"
        stroke="black"
      />
      <g className="points">
        {xValues.map((x, i) => {
          return (
            <circle
              key={i}
              cx={xScale(x)}
              cy={yScale(yValues[i])}
              r={3}
              stroke="steelblue"
              fill="steelblue"
              opacity={isPointHighlighted(i) ? 1 : 0.3}
            />
          );
        })}
      </g>
      {renderAnnotations()}
    </g>
  );
}
