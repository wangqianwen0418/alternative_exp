import * as d3 from "d3";
import { useEffect } from "react";

interface SwarmProps {
    xValues: number[];
    colorValues: number[];
    width: number;
    height: number;
    id: string; // make sure accurate d3 selection with multiple swarms on the same page
}

export default function Swarm(SwarmProps: SwarmProps) {
    let margin = [10, 10, 40, 10], radius = 3, leftTitleMargin = 40;
    const {xValues, colorValues, height, width, id} = SwarmProps;
    let xScale = d3
      .scaleLinear()
      .domain(d3.extent(xValues) as [number, number])
      .range([margin[3] + leftTitleMargin, width - margin[1]]);
      
    let colorScale = d3.scaleSequential()
    .domain(d3.extent(colorValues) as [number, number])
    // .interpolator(d3.interpolatePuRd);
    .interpolator(d3.interpolateHcl(d3.hcl('008BFF'), d3.hcl('FF004C')))

    useEffect(
        () => {
        d3.select(`svg.swarm#${id}`).append("g")
        .attr("class", 'x-axis')
        .attr("transform", `translate(0,${height/2 + radius*2 + 5})`)
        .call(d3.axisBottom(xScale))

        d3.select(`svg.swarm#${id}`)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "axis-title")
        .attr("y", height-6)
        .attr("x", leftTitleMargin + width/2)
        .text("shap value");



        }, 
        [xValues, height, width]
    )

    return <svg className="swarm" id={id} width={width} height={height}>
        <rect className="background" width={width} height={height} fill="white" stroke="black"/>
        <g className="plot">
            <text x={leftTitleMargin} y={height/2 + radius*2} textAnchor="end">{id}</text>
            {xValues.map((x, i) => {
                return <circle cx={xScale(x)} cy={height / 2} r={3} fill={colorScale(colorValues[i])} />
            })}
        </g>

        </svg>
}