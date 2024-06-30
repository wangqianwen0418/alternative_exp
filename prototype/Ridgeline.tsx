import * as d3 from "d3";
import React from "react";
import { useEffect } from "react";

interface RidgelineProps {
    data: { [key: string]: number[] };
    width: number;
    height: number;
    id: string; // make sure accurate d3 selection with multiple swarms on the same page
    bandwidth: number;
    groupNames: string[];

}

function kernelDensity(values, bandwidth) {
    const kernel = (u) => {
      return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    };
  
    const density = (x) => {
      let sum = 0;
      for (let i = 0; i < values.length; i++) {
        sum += kernel((x - values[i]) / bandwidth);
      }
      return sum / (values.length * bandwidth);
    };
  
    return density;
  }

export default function Ridgeline(props: RidgelineProps){

    let margin = [10, 10, 40, 10],
    radius = 3,
    leftTitleMargin = 40;
    const { data, width, height, id, bandwidth, groupNames } = props;
    const xScale = d3.scaleLinear().range([margin[3], width - margin[1]]);
    const yScale = d3.scaleBand().range([height - margin[2], margin[0]]);

    

    const keys = Object.keys(data);
    const values = keys.map((key) => data[key]);

    useEffect(() => {
        d3.select(`g.ridgeline#${id}`).selectAll("g.axis").remove();
        // Calculate the density estimates for each group
        const densityEstimates = groupNames.map((groupName, i) => {
            const values = data[groupName];
            const density = kernelDensity(values, bandwidth);
            const xValues = d3.range(xScale.domain()[0], xScale.domain()[1], 0.1);
            const yValues = xValues.map(density);
            return yValues.map((y, j) => [xValues[j], y]);
        });

        const allValues = Object.values(data).flat();
        xScale.domain(d3.extent(allValues) as [number, number]);
        yScale.domain(groupNames);

        const axisGroup = d3
        .select(`g.ridgeline#${id}`)
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`);

        axisGroup.call(d3.axisBottom(xScale));
        axisGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "axis-title")
        .attr("y", -5)
        .attr("x", width / 2)
        .attr("fill", "black")
        .text("Shap Values");

    // Draw the ridgeline plots
    const ridgelineGroup = d3
     .select(`g.ridgeline#${id}`)
     .append("g")
     .attr("class", "ridgelines");

    ridgelineGroup
     .selectAll("path")
     .data(densityEstimates)
     .enter()
     .append("path")
     .attr("d", (d, i) => {
        const line = d3.
        line()
        .curve(d3.curveBasis)
         .x((d) => xScale(d[0]))
         .y((d, i) => yScale(groupNames[i]))
         .y0(yScale.bandwidth() / 2)
         .y1(yScale.bandwidth() / 2)
          (d);
      })
     .attr("fill", "steelblue")
     .attr("stroke", "none")
     .attr("opacity", 0.8);
  }, [data, width, height]);
    

    
    return (
    <g
        className="ridgeline"
        id={id}
        transform={`translate(${margin[3]}, ${margin[0]})`}
    >
        <rect
        className="background"
        width={width - margin[3] - margin[1]}
        height={height - margin[0] - margin[2]}
        fill="white"
        stroke="black"
        />
    </g>
    );
      
    }