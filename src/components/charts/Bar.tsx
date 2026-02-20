import * as d3 from 'd3';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState, useMemo } from 'react';

import { uuidAtom } from 'app/atoms';
import { useLogging } from 'lib/utility/logging';
import type { TAnnotation } from 'lib/types';
import { seededShuffle } from 'research/questions/questionBalance';
import {
  getEffectiveFeaturesToShow,
  getFilteredIndices,
} from 'components/charts/featureUtils';

/**
 * src/components/charts/Bar
 *
 * Horizontal bar chart for SHAP-style feature importances.
 *
 * Notes:
 * - Feature filtering uses `featureUtils` so defaults match other charts.
 * - UUID-seeded shuffling is used in study mode to counterbalance ordering.
 */

const MARGIN: [number, number, number, number] = [125, 10, 20, 40];

interface BarProps {
  allShapValues: number[][];
  featureNames: string[];
  width: number;
  height: number;
  id: string;
  offsets: number[];
  annotation?: TAnnotation;
  featuresToHighlight?: string[];
  featuresToShow?: string[];
}

export default function Bar(props: BarProps) {
  const {
    allShapValues,
    featureNames,
    height,
    width,
    id,
    offsets,
    annotation,
    featuresToHighlight,
    featuresToShow,
  } = props;

  const [selectedBars, setSelectedBars] = useState<string[]>([]);
  const brushGroupRef = useRef<any>(null);
  const [uuid] = useAtom(uuidAtom);

  const log = useLogging();

  const labelFontSize = 13;
  const maxLabelWidth = 100;

  const canvasContext = useMemo(() => {
    if (typeof document !== 'undefined') {
      return document.createElement('canvas').getContext('2d');
    }
    return null;
  }, []);

  const effectiveFeaturesToShow = useMemo(
    () => getEffectiveFeaturesToShow(featuresToShow),
    [featuresToShow],
  );

  const filteredIndices = useMemo(
    () => getFilteredIndices(featureNames, effectiveFeaturesToShow),
    [featureNames, effectiveFeaturesToShow],
  );

  const filteredFeatureNames = useMemo(() => {
    return filteredIndices.map((i) => featureNames[i]);
  }, [filteredIndices, featureNames]);

  const filteredShapValues = useMemo(() => {
    return allShapValues.map((row) => filteredIndices.map((i) => row[i]));
  }, [allShapValues, filteredIndices]);

  const truncatedLabels = useMemo(() => {
    if (!canvasContext) {
      return filteredFeatureNames.map((f) =>
        f.length > 5 ? f.slice(0, 5) + '...' : f,
      );
    }

    canvasContext.font = `${labelFontSize}px sans-serif`;
    return filteredFeatureNames.map((f) => {
      let label = f;
      while (
        canvasContext.measureText(label).width > maxLabelWidth &&
        label.length > 1
      ) {
        label = label.slice(0, -1);
      }
      if (label !== f && !label.endsWith('...')) {
        while (
          canvasContext.measureText(label + '...').width > maxLabelWidth &&
          label.length > 1
        ) {
          label = label.slice(0, -1);
        }
        label = label + '...';
      }
      return label;
    });
  }, [filteredFeatureNames, canvasContext, labelFontSize, maxLabelWidth]);

  const truncatedLabelsMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    filteredFeatureNames.forEach((f, i) => {
      map[f] = truncatedLabels[i];
    });
    return map;
  }, [filteredFeatureNames, truncatedLabels]);

  const sortedAvgShapeValues = useMemo(() => {
    const avgShapeValues: { [featureName: string]: number } = {};
    for (let j = 0; j < filteredFeatureNames.length; j++) {
      const featureName = filteredFeatureNames[j];
      const values = filteredShapValues.map((row) => Math.abs(row[j]));
      avgShapeValues[featureName] =
        values.reduce((a, b) => a + b, 0) / values.length;
    }

    if (uuid) {
      return seededShuffle(Object.entries(avgShapeValues), uuid);
    }
    return Object.entries(avgShapeValues).sort((a, b) => b[1] - a[1]);
  }, [filteredFeatureNames, filteredShapValues, uuid]);

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(sortedAvgShapeValues.map((d) => d[0]))
        .range([MARGIN[1], height - MARGIN[3]])
        .padding(0.1),
    [sortedAvgShapeValues, height],
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([
          0,
          Math.min(
            35,
            Math.max(...allShapValues.flat().map((d) => Math.abs(d))),
          ),
        ])
        .range([MARGIN[0], width - MARGIN[2]]),
    [allShapValues, width],
  );

  const confidenceIntervals = useMemo(() => {
    const intervals: { [key: string]: [number, number] } = {};
    filteredFeatureNames.forEach((featureName, j) => {
      const values = filteredShapValues.map((row) => Math.abs(row[j]));
      const mean = d3.mean(values) as number;
      const stdDev = d3.deviation(values) as number;
      const n = values.length;
      const t = 1.96;
      const confidenceInterval = t * (stdDev / Math.sqrt(n));
      intervals[featureName] = [
        mean - confidenceInterval,
        mean + confidenceInterval,
      ];
    });
    return intervals;
  }, [filteredFeatureNames, filteredShapValues]);

  useEffect(() => {
    d3.select(`g.bar#${id}`).selectAll('g.x-axis').remove();
    const xAxisGroup = d3
      .select(`g.bar#${id}`)
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - MARGIN[3]})`);

    xAxisGroup.call(d3.axisBottom(xScale));
  }, [xScale, id, height]);

  useEffect(() => {
    if (
      !annotation &&
      (!featuresToHighlight || featuresToHighlight.length === 0)
    ) {
      if (!brushGroupRef.current) {
        const brushGroup = d3
          .select(`g.bar#${id}`)
          .append('g')
          .attr('class', 'brush');

        brushGroupRef.current = brushGroup;

        const brushEnd = (event: any) => {
          log('Bar Selection', 'User used brush on Bar chart.');

          const selection = event.selection;

          if (!selection) {
            setSelectedBars([]);
            d3.selectAll(`g.bar#${id} .bars g.bar-group`).attr('opacity', 1);
            return;
          }

          const [y0, y1] = selection;

          const brushedBars = sortedAvgShapeValues
            .filter(([featureName]) => {
              const yPos = yScale(featureName);
              if (yPos === undefined) return false;
              return (
                y0 <= yPos + yScale.bandwidth() / 2 &&
                yPos + yScale.bandwidth() / 2 <= y1
              );
            })
            .map(([featureName]) => featureName);

          setSelectedBars(brushedBars);

          d3.selectAll(`g.bar#${id} .bars g.bar-group`).each(function () {
            const featureName = d3.select(this).attr('data-feature-name');
            const isSelected = brushedBars.includes(featureName);
            d3.select(this).attr('opacity', isSelected ? 1 : 0.3);
          });
        };

        const brush = d3
          .brushY()
          .extent([
            [MARGIN[0], MARGIN[1]],
            [width - MARGIN[2], height - MARGIN[3]],
          ])
          .on('end', brushEnd);

        brushGroup
          .call(brush)
          .selectAll('.selection')
          .style('fill', 'rgba(128, 128, 128, 0.2)')
          .style('stroke', 'rgba(128, 128, 128, 0.2)');
      }
    }
  }, [
    id,
    annotation,
    featuresToHighlight,
    sortedAvgShapeValues,
    yScale,
    width,
    height,
    setSelectedBars,
    log,
  ]);

  useEffect(() => {
    // If there are highlighted features, set them as selected bars
    if (featuresToHighlight && featuresToHighlight.length > 0) {
      setSelectedBars(featuresToHighlight);
      d3.selectAll(`g.bar#${id} .bars g.bar-group`).each(function () {
        const featureName = d3.select(this).attr('data-feature-name');
        const isSelected = featuresToHighlight.includes(featureName);
        d3.select(this).attr('opacity', isSelected ? 1 : 0.3);
      });
    } else {
      // If no highlighted features, reset the selection
      setSelectedBars([]);
      d3.selectAll(`g.bar#${id} .bars g.bar-group`).attr('opacity', 1);
    }
  }, [featuresToHighlight, id]);

  return (
    <g
      className="bar"
      id={id}
      transform={`translate(${offsets[0]}, ${offsets[1]})`}
    >
      <rect
        className="background"
        width={width}
        height={height}
        fill="white"
        stroke="gray"
      />

      <g className="bars">
        {sortedAvgShapeValues.map(([featureName, value]) => {
          const isSelected =
            selectedBars.length > 0 ? selectedBars.includes(featureName) : true;
          const textStyle =
            featuresToHighlight && featuresToHighlight.length > 0
              ? isSelected
                ? { fill: 'black', fontWeight: 'bold' }
                : { fill: 'gray', fontWeight: 'normal' }
              : { fill: 'black', fontWeight: 'normal' };

          return (
            <g
              key={featureName}
              className="bar-group"
              data-feature-name={featureName}
              opacity={isSelected ? 1 : 0.3}
            >
              <text
                x={MARGIN[0] - 2}
                y={(yScale(featureName) as number) + yScale.bandwidth() * 0.6}
                textAnchor="end"
                style={textStyle}
                fontSize={labelFontSize}
              >
                {truncatedLabelsMap[featureName]}
              </text>
              <rect
                className="bar-rect"
                x={xScale(0)}
                y={yScale(featureName)}
                width={xScale(value) - xScale(0)}
                height={yScale.bandwidth()}
                fill="steelblue"
              />
              <line
                className="error-bar"
                x1={xScale(confidenceIntervals[featureName][0])}
                x2={xScale(confidenceIntervals[featureName][1])}
                y1={(yScale(featureName) as number) + yScale.bandwidth() / 2}
                y2={(yScale(featureName) as number) + yScale.bandwidth() / 2}
                stroke="black"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </g>

      <text
        x={(MARGIN[0] + width - MARGIN[2]) / 2}
        y={height - 7.5}
        textAnchor="middle"
        fontSize={labelFontSize}
      >
        |Average SHAP (Contribution)| Value
      </text>

      {annotation?.type === 'singleLine' && (
        <>
          <line
            x1={xScale(annotation.xValue ?? 0)}
            y1={MARGIN[1]}
            x2={xScale(annotation.xValue ?? 0)}
            y2={height - MARGIN[3]}
            stroke="black"
            strokeDasharray="4,2"
          />

          <text
            x={xScale(annotation.xValue ?? 0) + 5}
            y={MARGIN[1] + 100}
            fill="black"
            fontSize="12px"
          >
            {`val=${(annotation.xValue ?? 0).toFixed(2)}`} {/* Add the label */}
          </text>
        </>
      )}
    </g>
  );
}
