import * as d3 from "d3";
import { useEffect , useState, useMemo } from "react";
import { TAnnotation } from "../util/types";

interface ScatterProps {
  offsets: number[];
  xValues: number[];
  yValues: number[];
  width: number;
  height: number;
  id: string; // ensure accurate d3 selection with multiple scatters on the same page
  selectedIndices: number[];
  setSelectedIndices: (indices: number[]) => void;
  annotation?: TAnnotation;
}

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

  const margin = useMemo(() => [30, 10, 40, 10], []);

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(xValues) as [number, number])
        .range([margin[3], width - margin[1]]),
    [xValues, width, margin]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(yValues) as [number, number])
        .range([height - margin[2], margin[0]]),
    [yValues, height, margin]
  );

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    dataX: number;
    dataY: number;
  } | null>(null);

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
      const brushGroup = d3
        .select(`g.scatter#${id}`)
        .append("g")
        .attr("class", "brush");

      const brush = d3
        .brush()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("start", function (event) {
          brushGroup.call(brush.move, null);
        })
        .on("end", function (event) {
          const selection = event.selection;
          if (!selection) {
            setSelectedIndices([]);
            d3.selectAll(`g.scatter#${id} .points circle`).attr("opacity", 0.8);
            return;
          }
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
        });

      brushGroup
        .call(brush)
        .selectAll(".selection")
        .style("fill", "rgba(128, 128, 128, 0.2)")
        .style("stroke", "rgba(128, 128, 128, 0.2)");

      return () => {
        d3.select(`g.scatter#${id} .brush`).remove();
      };
    }
  }, [
    xValues,
    yValues,
    height,
    width,
    annotation,
    id,
    setSelectedIndices,
    xScale,
    yScale,
    margin,
  ]);

  function isPointHighlighted(i: number): boolean {
    if (!annotation) {
      return true;
    }

    const x = xValues[i];
    const y = yValues[i];

    if (annotation.type === "highlightRange") {
      let xHighlighted = true;
      let yHighlighted = true;

      if (annotation.xRange) {
        const [xMin, xMax] = annotation.xRange;
        xHighlighted = x >= xMin && x <= xMax;
      }

      if (annotation.yRange) {
        const [yMin, yMax] = annotation.yRange;
        yHighlighted = y >= yMin && y <= yMax;
      }

      return xHighlighted && yHighlighted;
    } else if (annotation.type === "highlightDataPoints") {
      return annotation.dataPoints.includes(x);
    } else {
      return true;
    }
  }

  function formatValue(value: number | undefined): string {
    if (value === undefined || isNaN(value)) {
      return "";
    }
    if (Math.abs(value) < 0.005) {
      value = 0;
    }
    return value.toFixed(2);
  }

  function renderAnnotations() {
    const elements = [];
    let highlightedIndices: number[] = [];

    if (annotation) {
      highlightedIndices = xValues
        .map((x, i) => (isPointHighlighted(i) ? i : -1))
        .filter((i) => i !== -1);
    }

    if (selectedIndices.length > 0) {
      highlightedIndices = selectedIndices;
    }

    if (highlightedIndices.length > 0) {
      const xHighlightedValues = highlightedIndices.map((i) => xValues[i]);
      const yHighlightedValues = highlightedIndices.map((i) => yValues[i]);

      const xMinVal = d3.min(xHighlightedValues);
      const xMaxVal = d3.max(xHighlightedValues);
      const xAvgVal = d3.mean(xHighlightedValues);

      const yMinVal = d3.min(yHighlightedValues);
      const yMaxVal = d3.max(yHighlightedValues);
      const yAvgVal = d3.mean(yHighlightedValues);

      const statsText = `X - Avg: ${formatValue(xAvgVal)}, Min: ${formatValue(
        xMinVal
      )}, Max: ${formatValue(xMaxVal)} | Y - Avg: ${formatValue(
        yAvgVal
      )}, Min: ${formatValue(yMinVal)}, Max: ${formatValue(yMaxVal)}`;

      elements.push(
        <text
          key="highlightStats"
          x={width / 2}
          y={15}
          fill="black"
          fontSize="10px"
          textAnchor="middle"
        >
          {statsText}
        </text>
      );
    } else {
      elements.push(
        <text
          key="noDataStats"
          x={width / 2}
          y={15}
          fill="black"
          fontSize="10px"
          textAnchor="middle"
        >
          No data selected
        </text>
      );
    }

    if (annotation) {
      if (annotation.type === "singleLine") {
        if (annotation.xValue !== undefined) {
          const xPos = xScale(annotation.xValue);
          elements.push(
            <line
              key="xSingleLine"
              x1={xPos}
              y1={0}
              x2={xPos}
              y2={height}
              stroke="black"
              strokeDasharray="4, 2"
            />
          );
        } else if (annotation.yValue !== undefined) {
          const yPos = yScale(annotation.yValue);
          elements.push(
            <line
              key="ySingleLine"
              x1={0}
              y1={yPos}
              x2={width}
              y2={yPos}
              stroke="black"
              strokeDasharray="4, 2"
            />
          );
        }
      } else if (annotation.type === "highlightRange") {
        let hasXRange = annotation.xRange !== undefined;
        let hasYRange = annotation.yRange !== undefined;

        if (hasXRange && annotation.xRange) {
          const [xMin, xMax] = annotation.xRange;
          if (!isFinite(xMin) && !isFinite(xMax)) {
            hasXRange = false;
          }
        }

        if (hasYRange && annotation.yRange) {
          const [yMin, yMax] = annotation.yRange;
          if (!isFinite(yMin) && !isFinite(yMax)) {
            hasYRange = false;
          }
        }

        if (hasXRange && hasYRange) {
          if (hasXRange && hasYRange) {
            const [xMin, xMax] = annotation.xRange!;
            const [yMin, yMax] = annotation.yRange!;

            const xStart = isFinite(xMin) ? xScale(xMin) : 0;
            const xEnd = isFinite(xMax) ? xScale(xMax) : width;
            const yStart = isFinite(yMin) ? yScale(yMin) : height;
            const yEnd = isFinite(yMax) ? yScale(yMax) : 0;

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
          const [xMin, xMax] = annotation.xRange!;
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
            const [yMin, yMax] = annotation.yRange!;
            const yStart = isFinite(yMin) ? yScale(yMin) : height;
            const yEnd = isFinite(yMax) ? yScale(yMax) : 0;

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
      }
    }

    return elements;
  }

  function handleMouseOver(event: any, i: number) {
    const xPos = xScale(xValues[i]);
    const yPos = yScale(yValues[i]);
    setTooltip({
      x: xPos,
      y: yPos,
      dataX: xValues[i],
      dataY: yValues[i],
    });
  }

  function handleMouseOut() {
    setTooltip(null);
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
        {xValues.map((x, i) => (
          <circle
            key={i}
            cx={xScale(x)}
            cy={yScale(yValues[i])}
            r={3}
            stroke="steelblue"
            fill="steelblue"
            opacity={isPointHighlighted(i) ? 0.8 : 0.3}
            onMouseOver={(event) => handleMouseOver(event, i)}
            onMouseOut={handleMouseOut}
          />
        ))}
      </g>
      {renderAnnotations()}
      {tooltip && (
        <g
          className="tooltip"
          transform={`translate(${tooltip.x + 10}, ${tooltip.y - 10})`}
        >
          <rect
            x={0}
            y={-19}
            width={80}
            height={35}
            fill="white"
            stroke="black"
            opacity={0.9}
          />
          <text x={5} y={-5} fontSize="10px" fill="black">
            {`X: ${formatValue(tooltip.dataX)}`}
          </text>
          <text x={5} y={10} fontSize="10px" fill="black">
            {`Y: ${formatValue(tooltip.dataY)}`}
          </text>
        </g>
      )}
    </g>
  );
}
