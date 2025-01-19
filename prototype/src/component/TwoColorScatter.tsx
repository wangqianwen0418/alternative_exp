import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

interface TwoColorScatterProps {
  xValues: number[];
  yValues: number[];
  colorValues: number[];
  width: number;
  height: number;
  label: string;
  colorLabel: string;
}

export default function TwoColorScatter(props: TwoColorScatterProps) {
  const { xValues, yValues, colorValues, width, height, label, colorLabel } =
    props;

  const margin = useMemo(() => [22.5, 10, 40, 52.5], []);
  const labelFontSize = 13;
  const chartLeft = margin[3];
  const chartRight = width - margin[1] - 90;

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(xValues) as [number, number])
      .range([chartLeft, chartRight]);
  }, [xValues, chartLeft, chartRight]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(yValues) as [number, number])
      .range([height - margin[2], margin[0]]);
  }, [yValues, height, margin, chartRight]);

  const [minColor, maxColor] = d3.extent(colorValues) as [number, number];
  const colorScale = useMemo(() => {
    return d3
      .scaleLinear<string>()
      .domain([minColor, maxColor])
      .range(["#008bfc", "#ff0051"]);
  }, [minColor, maxColor]);

  const [sliderRange, setSliderRange] = useState<[number, number]>([
    minColor,
    maxColor,
  ]);
  const [sliderEnabled, setSliderEnabled] = useState<boolean>(true);

  const legendWidth = 20;
  const legendHeight = height - margin[0] - margin[2];
  const legendX = chartRight + 30;
  const legendY = margin[0];

  const legendScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([minColor, maxColor])
      .range([legendHeight, 0]);
  }, [minColor, maxColor, legendHeight]);

  const legendRef = useRef<SVGGElement>(null);
  const handleMinRef = useRef<SVGRectElement>(null);
  const handleMaxRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    setSliderRange([minColor, maxColor]);
  }, [minColor, maxColor]);

  function createDragHandle(isMinHandle: boolean) {
    return d3
      .drag<SVGRectElement, unknown>()
      .on("drag", (event) => {
        const yClamped = Math.max(0, Math.min(legendHeight, event.y));
        const newValue = legendScale.invert(yClamped);
        setSliderRange(([low, high]) => {
          if (isMinHandle) {
            low = Math.min(newValue, high);
          } else {
            high = Math.max(newValue, low);
          }
          return [low, high];
        });
      })
      .on("end", () => {});
  }

  useEffect(() => {
    if (handleMinRef.current) {
      d3.select(handleMinRef.current).call(createDragHandle(true));
    }
    if (handleMaxRef.current) {
      d3.select(handleMaxRef.current).call(createDragHandle(false));
    }
  }, [handleMinRef.current, handleMaxRef.current, legendScale]);

  useEffect(() => {
    d3.select(`g.twoColorScatter#${label}`).selectAll("g.x-axis").remove();
    d3.select(`g.twoColorScatter#${label}`).selectAll("g.y-axis").remove();

    const xAxisGroup = d3
      .select(`g.twoColorScatter#${label}`)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(-10,${height - margin[2]})`);

    xAxisGroup.call(d3.axisBottom(xScale));

    xAxisGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("x", (chartLeft + chartRight) / 2)
      .attr("y", 30)
      .attr("fill", "black")
      .attr("font-size", labelFontSize)
      .text(`Feature Value (${label})`);

    const yAxisGroup = d3
      .select(`g.twoColorScatter#${label}`)
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin[3] - 10},0)`);

    yAxisGroup.call(d3.axisLeft(yScale));

    yAxisGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", -((height - margin[2] + margin[0]) / 2))
      .attr("y", -27.5)
      .attr("fill", "black")
      .attr("font-size", labelFontSize)
      .text(`SHAP Value (${label})`);
  }, [
    xScale,
    yScale,
    width,
    height,
    margin,
    labelFontSize,
    label,
    chartLeft,
    chartRight,
  ]);

  function getCircleOpacity(val: number) {
    if (!sliderEnabled) return 0.8;
    const [low, high] = sliderRange;
    return val >= low && val <= high ? 0.8 : 0.1;
  }

  const toggleWidth = 120;
  const toggleHeight = 20;
  const sliderToggleX = (chartLeft + chartRight) / 2 - toggleWidth / 2;
  const sliderToggleY = margin[0] / 2;
  const ticks = legendScale.ticks(10);

  return (
    <g className="twoColorScatter" id={label}>
      <rect width={width} height={height} fill="white" stroke="black" />
      <g transform={`translate(${sliderToggleX}, ${sliderToggleY})`}>
        <foreignObject width={toggleWidth} height={toggleHeight}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={sliderEnabled}
              onChange={() => setSliderEnabled(!sliderEnabled)}
              style={{ marginRight: 4 }}
            />
            <span style={{ fontSize: "12px" }}>Enable Slider</span>
          </div>
        </foreignObject>
      </g>
      <g className="points">
        {xValues.map((x, i) => {
          const cx = xScale(x);
          const cy = yScale(yValues[i]);
          const cVal = colorValues[i];
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={3}
              fill={colorScale(cVal)}
              opacity={getCircleOpacity(cVal)}
            />
          );
        })}
      </g>
      <g
        ref={legendRef}
        className="legend"
        transform={`translate(${legendX}, ${legendY})`}
      >
        <defs>
          <linearGradient
            id={`color-gradient-${label}`}
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#008bfc" />
            <stop offset="100%" stopColor="#ff0051" />
          </linearGradient>
        </defs>
        <g>
          {ticks.map((tickVal, idx) => {
            const yPos = legendScale(tickVal);
            return (
              <g key={idx} transform={`translate(0,${yPos})`}>
                <text textAnchor="end" x={-5} fontSize={10} dy=".32em">
                  {tickVal}
                </text>
                <line x1={-2} x2={0} stroke="black" />
              </g>
            );
          })}
        </g>
        <rect
          x={10}
          y={0}
          width={legendWidth}
          height={legendHeight}
          fill={`url(#color-gradient-${label})`}
        />
        <rect
          ref={handleMinRef}
          x={5}
          y={legendScale(sliderRange[0]) - 2}
          width={legendWidth + 10}
          height={4}
          fill="black"
          style={{ cursor: "grab" }}
        />
        <rect
          ref={handleMaxRef}
          x={5}
          y={legendScale(sliderRange[1]) - 2}
          width={legendWidth + 10}
          height={4}
          fill="black"
          style={{ cursor: "grab" }}
        />
        <text
          x={legendWidth + 40}
          y={legendHeight / 2 - 12}
          fontSize={labelFontSize}
          textAnchor="middle"
          transform={`rotate(-90, ${legendWidth + 40}, ${legendHeight / 2})`}
          dy=".35em"
        >
          SHAP Value ({colorLabel})
        </text>
      </g>
    </g>
  );
}
