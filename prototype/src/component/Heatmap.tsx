import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface HeatmapProps {
  shapValues: number[];
  featureValues: number[];
  width: number;
  height: number;
  title: string;
}

export default function Heatmap(HeatmapProps: HeatmapProps) {
  const { shapValues, featureValues, width, height, title } = HeatmapProps;
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const numFeatures = featureValues.length;
    const rectWidth = width / numFeatures;
    const rectHeight = height;

    const data = featureValues.map((value, i) => ({
      value,
      shapValue: shapValues[i],
      x: i % numFeatures,
      y: Math.floor(i / numFeatures),
    }));

    const sortedData = [...data].sort((a, b) =>
      d3.descending(a.value, b.value)
    );

    const xScale = d3
      .scaleBand<number>()
      .domain(sortedData.map((d) => d.x))
      .range([0, width])
      .padding(0);

    const yScale = d3
      .scaleBand<number>()
      .domain(sortedData.map((d) => d.y))
      .range([0, height])
      .padding(0);

    const colorScale = d3
      .scaleSequential()
      .domain(d3.extent(shapValues) as [number, number])
      .interpolator(
        d3.interpolateHcl(
          d3.hcl((4.6588 * 180) / Math.PI, 70, 54),
          d3.hcl((0.35470565 * 180) / Math.PI, 90, 54)
        )
      );

    svg
      .selectAll("rect")
      .data(sortedData)
      .join("rect")
      .attr("x", (d) => xScale(d.x)!)
      .attr("y", (d) => yScale(d.y)!)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("fill", (d) => colorScale(d.shapValue));

    svg
      .selectAll("text.title")
      .data([title])
      .join("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", 70)
      .attr("text-anchor", "middle")
      .text((d) => d);
  }, [shapValues, featureValues, width, height, title]);

  return <svg ref={svgRef} width={width} height={height + 30} />;
}
