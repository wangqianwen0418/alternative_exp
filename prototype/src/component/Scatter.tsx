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
  | { type: "highlightPoints"; featureValues: number[] }
  | { type: "highlightRange"; featureRange: [number, number] }
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

    if (annotation.type === "highlightRange") {
      const [minRange, maxRange] = annotation.featureRange;
      return x >= minRange && x <= maxRange;
    } else if (annotation.type === "highlightPoints") {
      return annotation.featureValues.includes(x);
    } else {
      return true;
    }
  }

  function renderAnnotations() {
    if (!annotation) {
      return null;
    }

    const lineStartY = 0;
    const lineEndY = height;

    if (annotation.type === "verticalLine") {
      const xPos = xScale(annotation.xValue);
      return (
        <line
          x1={xPos}
          y1={lineStartY}
          x2={xPos}
          y2={lineEndY}
          stroke="black"
          strokeDasharray="4, 2"
        />
      );
    } else if (annotation.type === "highlightRange") {
      const [minRange, maxRange] = annotation.featureRange;
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
        </>
      );
    }
    return null;
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
