import * as d3 from 'd3';
import { useLogging } from 'lib/utility/logging';
import type { TAnnotation } from 'lib/types';
import {
  appendAxis,
  appendAxisTitle,
  clearGroups,
  formatFixed2,
} from './d3Utils';
import { useEffect, useState, useMemo } from 'react';

/**
 * src/components/charts/Scatter
 *
 * Scatterplot used for comparing a feature (x) against SHAP/target values (y).
 *
 * Notes:
 * - Uses shared D3 helpers in `d3Utils` to reduce boilerplate.
 * - Selection indices are owned by the parent; this component only updates them.
 */

const MARGIN: [number, number, number, number] = [22.5, 10, 40, 52.5];
const LABEL_FONT_SIZE = 13;

interface ScatterProps {
  offsets: number[];
  xValues: number[];
  yValues: number[];
  width: number;
  height: number;
  id: string;
  xLabel: string;
  yLabel: string;
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
    xLabel,
    yLabel,
  } = props;

  const margin = MARGIN;
  const labelFontSize = LABEL_FONT_SIZE;

  const log = useLogging();

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(xValues) as [number, number])
      .range([margin[3], width - margin[1]]);
  }, [xValues, width, margin]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(yValues) as [number, number])
      .range([height - margin[2], margin[0]]);
  }, [yValues, height, margin]);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    dataX: number;
    dataY: number;
  } | null>(null);

  useEffect(() => {
    const container = d3.select(`g.scatter#${id}`) as any;
    clearGroups(container, ['g.x-axis', 'g.y-axis', 'g.brush']);

    const xAxisGroup = appendAxis(
      container,
      'x-axis',
      `translate(0, ${height - margin[2]})`,
      d3.axisBottom(xScale),
    );
    appendAxisTitle(xAxisGroup, xLabel, {
      x: (margin[3] + (width - margin[1])) / 2,
      y: 30,
      'font-size': labelFontSize,
    });

    const yAxisGroup = appendAxis(
      container,
      'y-axis',
      `translate(${margin[3]}, 0)`,
      d3.axisLeft(yScale),
    );
    appendAxisTitle(yAxisGroup, yLabel, {
      transform: 'rotate(-90)',
      x: -((height - margin[2] + margin[0]) / 2),
      y: -35,
      'font-size': labelFontSize,
    });

    const brushGroup = container.append('g').attr('class', 'brush');
    if (!annotation) {
      const brush = d3
        .brush()
        .extent([
          [margin[3], margin[0]],
          [width - margin[1], height - margin[2]],
        ])
        .on('start', () => {
          log('Scatter Selection', 'User used brush on Scatter chart.');
          brushGroup.call(brush.move, null);
        })
        .on('end', (event) => {
          const selection = event.selection;
          if (!selection) {
            setSelectedIndices([]);
            return;
          }
          const [[x0, y0], [x1, y1]] = selection;
          const brushedIndices: number[] = [];
          xValues.forEach((x, i) => {
            const cx = xScale(x);
            const cy = yScale(yValues[i]);
            if (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) {
              brushedIndices.push(i);
            }
          });
          setSelectedIndices(brushedIndices);
        });

      brushGroup
        .call(brush)
        .selectAll('.selection')
        .style('fill', 'rgba(128, 128, 128, 0.2)')
        .style('stroke', 'rgba(128, 128, 128, 0.2)');

      return () => {
        container.selectAll('g.brush').remove();
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
    xLabel,
    yLabel,
    log,
    labelFontSize,
  ]);

  function isPointHighlighted(i: number): boolean {
    if (selectedIndices.length > 0) {
      return selectedIndices.includes(i);
    } else if (annotation) {
      if (annotation.type === 'highlightRange') {
        let xOk = true,
          yOk = true;
        if (annotation.xRange) {
          const [xMin, xMax] = annotation.xRange;
          if (Number.isFinite(xMin)) xOk = xValues[i] >= xMin;
          if (Number.isFinite(xMax)) xOk = xOk && xValues[i] <= xMax;
        }
        if (annotation.yRange) {
          const [yMin, yMax] = annotation.yRange;
          if (Number.isFinite(yMin)) yOk = yValues[i] >= yMin;
          if (Number.isFinite(yMax)) yOk = yOk && yValues[i] <= yMax;
        }
        return xOk && yOk;
      } else if (annotation.type === 'highlightDataPoints') {
        return annotation.dataPoints.includes(xValues[i]);
      }
    }
    return true;
  }

  function renderAnnotations() {
    const elements = [];
    let highlightedIndices: number[] = [];

    if (selectedIndices.length > 0) {
      highlightedIndices = selectedIndices;
    } else if (annotation) {
      highlightedIndices = xValues
        .map((_, i) => (isPointHighlighted(i) ? i : -1))
        .filter((i) => i !== -1);
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
      const statsText = `X - Avg: ${formatFixed2(xAvgVal)}, Min: ${formatFixed2(
        xMinVal,
      )}, Max: ${formatFixed2(xMaxVal)} | Y - Avg: ${formatFixed2(
        yAvgVal,
      )}, Min: ${formatFixed2(yMinVal)}, Max: ${formatFixed2(yMaxVal)}`;

      elements.push(
        <>
          <text
            key="highlightSelectedCount"
            x={(margin[3] + (width - margin[1])) / 2}
            y={margin[0] / 2 + 3}
            fill="black"
            fontSize={labelFontSize}
            textAnchor="middle"
          >
            Selected Points: {selectedIndices.length}
          </text>
          <text
            key="highlightStats"
            x={(margin[3] + (width - margin[1])) / 2}
            y={margin[0] / 2 + 17}
            fill="black"
            fontSize={labelFontSize}
            textAnchor="middle"
          >
            {statsText}
          </text>
        </>,
      );
    } else {
      elements.push(
        <text
          key="noDataStats"
          x={(margin[3] + (width - margin[1])) / 2}
          y={margin[0] / 2 + 3}
          fill="black"
          fontSize={labelFontSize}
          textAnchor="middle"
        >
          No data selected
        </text>,
      );
    }

    if (annotation && annotation.type === 'highlightRange') {
      const { xRange, yRange } = annotation;
      const hasX = !!xRange;
      const hasY = !!yRange;
      if (hasX && hasY) {
        const [xMin, xMax] = xRange as [number, number];
        const [yMin, yMax] = yRange as [number, number];
        const xStart = Number.isFinite(xMin) ? xScale(xMin) : margin[3];
        const xEnd = Number.isFinite(xMax) ? xScale(xMax) : width - margin[1];
        const yStart = Number.isFinite(yMin)
          ? yScale(yMin)
          : height - margin[2];
        const yEnd = Number.isFinite(yMax) ? yScale(yMax) : margin[0];
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
          />,
        );
      } else if (hasX) {
        const [xMin, xMax] = xRange as [number, number];
        if (Number.isFinite(xMin)) {
          const xVal = xScale(xMin);
          elements.push(
            <line
              key="xMinLine"
              x1={xVal}
              y1={margin[0]}
              x2={xVal}
              y2={height - margin[2]}
              stroke="black"
              strokeDasharray="4,2"
            />,
          );
        }
        if (Number.isFinite(xMax)) {
          const xVal = xScale(xMax);
          elements.push(
            <line
              key="xMaxLine"
              x1={xVal}
              y1={margin[0]}
              x2={xVal}
              y2={height - margin[2]}
              stroke="black"
              strokeDasharray="4,2"
            />,
          );
        }
      } else if (hasY) {
        const [yMin, yMax] = yRange as [number, number];
        if (Number.isFinite(yMin)) {
          const yVal = yScale(yMin);
          elements.push(
            <line
              key="yMinLine"
              x1={margin[3]}
              y1={yVal}
              x2={width - margin[1]}
              y2={yVal}
              stroke="black"
              strokeDasharray="4,2"
            />,
          );
        }
        if (Number.isFinite(yMax)) {
          const yVal = yScale(yMax);
          elements.push(
            <line
              key="yMaxLine"
              x1={margin[3]}
              y1={yVal}
              x2={width - margin[1]}
              y2={yVal}
              stroke="black"
              strokeDasharray="4,2"
            />,
          );
        }
      }
    } else if (annotation && annotation.type === 'singleLine') {
      if (annotation.xValue !== undefined) {
        const xPos = xScale(annotation.xValue);
        elements.push(
          <line
            key="xSingleLine"
            x1={xPos}
            y1={margin[0]}
            x2={xPos}
            y2={height - margin[2]}
            stroke="black"
            strokeDasharray="4,2"
          />,
        );
      } else if (annotation.yValue !== undefined) {
        const yPos = yScale(annotation.yValue);
        elements.push(
          <line
            key="ySingleLine"
            x1={margin[3]}
            y1={yPos}
            x2={width - margin[1]}
            y2={yPos}
            stroke="black"
            strokeDasharray="4,2"
          />,
        );
      }
    }

    return elements;
  }

  function handleMouseOver(i: number) {
    if (annotation) {
      const xPos = xScale(xValues[i]);
      const yPos = yScale(yValues[i]);
      setTooltip({
        x: xPos,
        y: yPos,
        dataX: xValues[i],
        dataY: yValues[i],
      });
    }
  }

  function handleMouseOut() {
    if (annotation) {
      setTooltip(null);
    }
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
            opacity={isPointHighlighted(i) ? 0.8 : 0.1}
            onMouseOver={() => handleMouseOver(i)}
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
            {`X: ${formatFixed2(tooltip.dataX)}`}
          </text>
          <text x={5} y={10} fontSize="10px" fill="black">
            {`Y: ${formatFixed2(tooltip.dataY)}`}
          </text>
        </g>
      )}
    </g>
  );
}
