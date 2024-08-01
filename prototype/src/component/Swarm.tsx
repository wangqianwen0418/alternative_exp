import * as d3 from "d3";
import { useEffect, useState} from "react";

interface SwarmProps {
  xValues: number[];
  colorValues: number[];
  width: number;
  height: number;
  id: string; // make sure accurate d3 selection with multiple swarms on the same page
  selectedIndices: number[];
  setSelectedIndices: (index: number[]) => void;
}


export default function Swarm(SwarmProps: SwarmProps) { 
  let margin = [10, 10, 40, 10],
    radius = 3,
    leftTitleMargin = 40;
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [brushSelection, setBrushSelection] = useState<[number, number] | null>(null);

  const { xValues, colorValues, height, width, id } = SwarmProps;
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(xValues) as [number, number])
    .range([margin[3] + leftTitleMargin, width - margin[1]]);

  const colorScale = d3
    .scaleSequential()
    .domain(d3.extent(colorValues) as [number, number])
    // .interpolator(d3.interpolatePuRd);
    // .interpolator(d3.interpolateHcl(d3.hcl('#008BFB'), d3.hcl('#FF004C')))
    .interpolator(
      d3.interpolateHcl(
        d3.hcl((4.6588 * 180) / Math.PI, 70, 54), // blue
        d3.hcl((0.35470565 * 180) / Math.PI, 90, 54) // red
      )
    );
  
  const yScale = d3.scaleLinear().range([(height / 2 - radius)*0.7+14, (height / 2 + radius)*0.7+14]);
      
  useEffect(() => {
    d3.select("g.x-axis").remove();
    d3.select("text.axis-title").remove();

    d3.select("svg")
      .select(`g.swarm#${id}`)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height / 2 + radius * 2 + 5})`)
      .call(d3.axisBottom(xScale));

    d3.select(`g.swarm#${id}`)
      .append("text")
      .attr("class", "axis-title")
      .attr("y", height - 6)
      .attr("x", leftTitleMargin + margin[3])
      .text("contribution of bmi to the predicted diabetes progression");
    const legendWidth = 20;
    const legendHeight = height - margin[0] - margin[2];
    const legendX = width - margin[1] - legendWidth;
    const legendY = margin[0];

    const gradient = d3.select(`g.swarm#${id}`)
      .append("linearGradient")
      .attr("id", "color-legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .selectAll("stop")
      .data([
          { offset: "0%", color: colorScale.domain()[0] },
          { offset: "100%", color: colorScale.domain()[1] },
        ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => colorScale(d.color));

    d3.select(`g.swarm#${id}`)
      .append("rect")
      .attr("class", "legend")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "url(#color-legend-gradient)");

    d3.select(`g.swarm#${id}`)
      .append("text")
      .attr("class", "legend-title")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY - 10)
      .text("Feature Value");
    
    d3.select(`g.swarm#${id}`)
      .append("text")
      .attr("class", "legend-label")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY + legendHeight)
      .text(colorScale.domain()[0].toFixed(2));
    
    d3.select(`g.swarm#${id}`)
    .append("text")
    .attr("class", "legend-label")
    .attr("x", legendX + legendWidth / 2)
    .attr("y", legendY)
    .text(colorScale.domain()[1].toFixed(2));
   
    const points = d3.select(`g.points#${id}`);
    points.selectAll("circle").on("click", (i: number) => {
      const index = i;
      const isSelected = selectedPoints.includes(index);
      if (isSelected) {
        setSelectedPoints(selectedPoints.filter((j) => j !== index));
      }
      else{
        setSelectedPoints([...selectedPoints, index]);
      }
    });

    const brush = d3.brushX().extent([
      [margin[3] + leftTitleMargin, 0],
      [width - margin[1], height],
    ]);

    points.append("g").attr("class", "brush").call(brush);

    brush.on("brush", (event) => {
      const selection = event.selection;
      if (selection) {
        const [x0, x1] = selection;
        const selectedIndices = xValues.reduce((acc: number[], x, i) => {
          if (x0 <= xScale(x) && xScale(x) <= x1){
            acc.push(i);
          }
          return acc;
        },[]);
        setSelectedPoints(selectedIndices);
        setBrushSelection([x0, x1]);
      } else{
        setSelectedPoints([]);
        setBrushSelection(null);
      }
    });

    return () => {
      points.selectAll("circle").on("click", null);
      brush.on("brush", null);
    };
  }, [xValues, height, width]);

  useEffect(() => {
    if (selectedPoints.length > 0){
      console.log("Selected Points: ");
      console.log(selectedPoints.map((i) => ({id: i, value: xValues[i], color: colorValues[i]})));
    }
  }, [selectedPoints, xValues, colorValues]);

  let bucketWidth = 1;
  let buckets: { [key: number]: { value: number, index: number }[] } = {};
  
  xValues.forEach((val, index) => {
    let bucketKey = Math.floor(val/bucketWidth);
    if (!buckets[bucketKey]) {
      buckets[bucketKey] = [];
    }
    buckets[bucketKey].push({value: val, index: index});
  });
  let yVals = new Array(xValues.length);

  for (let key in buckets){
    let bucket = buckets[key];
    bucket.sort((a, b) => a.value - b.value);
    bucket.forEach((item, height) => {
      let half = Math.floor(bucket.length / 2);
      let position = height < half ? height : height - bucket.length
      yVals[item.index] = position;
    });
  }

  
  


  // Update the y-values by iterating through the x-values and incrementing the y-value for each point
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
        <text x={leftTitleMargin} y={height / 2 + radius * 2} textAnchor="end">
          {id}
        </text>
        {xValues.map((x, i) => {
          return (
            <circle
              key={i}
              cx={xScale(x)}
              cy={yScale(yVals[i])}
              r={3}
              fill={colorScale(colorValues[i])}
              opacity={
                SwarmProps.selectedIndices.length == 0 ||
                SwarmProps.selectedIndices.includes(i)
                  ? 1
                  : 0.3
              }
              onMouseEnter={() => {
                SwarmProps.setSelectedIndices([i]);
              }}
              onMouseLeave={() => {
                SwarmProps.setSelectedIndices([]);
              }}
            />
          );
        })}
      </g>
    </g>
  );
}