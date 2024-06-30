import * as d3 from "d3";
import { useEffect } from "react";

interface ScatterProps {
    offsets: number[];
    xValues: number[];
    yValues: number[];
    width: number;
    height: number;
    id: string; // make sure accurate d3 selection with multiple swarms on the same page
}

export default function Scatter(props: ScatterProps) {
    let margin = [10, 10, 40, 10],
        radius = 3,
        leftTitleMargin = 40;
    const { xValues, yValues, height, width, id, offsets } = props;
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
                            fill="none"
                            opacity={0.8}
                        />
                    );
                })}
            </g>
        </g>
    );
}
