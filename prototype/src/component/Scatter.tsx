import * as d3 from "d3";
import { useEffect, useState} from "react";

interface ScatterProps {
  offsets: number[];
  xValues: number[];
  yValues: number[];
  width: number;
  height: number;
  id: string; // make sure accurate d3 selection with multiple swarms on the same page
  selectedIndices: number[];
  setSelectedIndices: (indices: number[]) => void;
}

export default function Scatter(props: ScatterProps) {
  let margin = [10, 10, 40, 10],
    radius = 3,
    leftTitleMargin = 40;
  const {
    xValues,
    yValues,
    height,
    width,
    id,
    offsets,
    selectedIndices,
    setSelectedIndices,
  } = props;
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
      .text("BMI values");

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
      .attr("transform", `rotate(-90) translate(${(-height * 2) / 3}, 40)`)
      .attr("fill", "black")
      .text("Contributions of BMI to the prediction");

    // Brush functionality for selection
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("start", brushstart)
      .on("end", brushended);

    // Append the brush to the SVG group
    const brushGroup = d3
      .select(`g.scatter#${id}`)
      .append("g")
      .attr("class", "brush")
      .call(brush);

    function brushstart(event: any) {
      brushGroup.call(brush.move, null);
    }

    // Function to handle the brush selection
    function brushended(event: any) {
      const selection = event.selection;
      if (!selection) return; // Exit if no selection
      const brushedIndices: number[] = [];
      const [[x0, y0], [x1, y1]] = selection;

      d3.selectAll(`g.scatter#${id} .points circle`)
        .attr("stroke-width", (d: any, i: number) => {
          const x = xScale(xValues[i]);
          const y = yScale(yValues[i]);
          return x0 <= x && x <= x1 && y0 <= y && y <= y1 ? 3 : 1;
        })
        .each(function (d: any, i: number) {
          const x = xScale(xValues[i]);
          const y = yScale(yValues[i]);
          if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
            brushedIndices.push(i);
            console.log(`Selected: (${xValues[i]}, ${yValues[i]})`);
          }
        });

      setSelectedIndices(brushedIndices);
    }
  }, [xValues, height, width]);

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
              fill={
                props.selectedIndices.includes(i) ? "steelblue" : "transparent"
              }
              opacity={
                props.selectedIndices.length == 0 ||
                props.selectedIndices.includes(i)
                  ? 0.8
                  : 0.3
              }
              onMouseEnter={() => {
                props.setSelectedIndices([i]);
              }}
              onMouseLeave={() => {
                props.setSelectedIndices([]);
              }}
            />
          );
        })}
      </g>
    </g>
  );
}
