import * as d3 from 'd3';
import { useEffect } from 'react';
type props = {
    allShapValues: number[][],
    featureNames: string[],
    width: number,
    height: number,
    id: string,
    offsets: number[]

}

export default function PCP(props: props) {
    const { allShapValues, featureNames, height, width, id, offsets } = props;
    const margin = [200, 20, 20, 20]

    let avgShapeValues: { [featureName: string]: number } = {}
    for (let i = 0; i < featureNames.length; i++) {
        avgShapeValues[featureNames[i]] = allShapValues.map((val, index) => Math.abs(val[i])).reduce((a, b) => a + b, 0) / allShapValues.length
    }

    let sortedFeatureNames = Object.entries(avgShapeValues).sort((a, b) => a[1] - b[1]).reverse().map(d => d[0])

    // const yScale = d3.scaleBand().domain(featureNames).range([margin[1], height - margin[3]]).padding(0.1)
    const yScale = d3.scaleBand().domain(sortedFeatureNames).range([margin[1], height - margin[3]]).padding(0.1)
    const xScale = d3.scaleLinear().domain([0, Math.max(...allShapValues.flat().map(d => Math.abs(d)))]).range([margin[0], width - margin[2]])

    useEffect(() => {
        d3.select(`g.PCP#${id}`).selectAll("g.x-axis").remove();
        for (let i = 0; i < featureNames.length; i++) {
            const xAxisGroup = d3
                .select(`g.PCP#${id}`)
                .append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${yScale(featureNames[i])})`);

            xAxisGroup.call(d3.axisBottom(xScale));
        }
    }, [allShapValues, featureNames, height, width, id, offsets])

    const isSupport = (shapeValues: number[]) => {

        return shapeValues[8] === Math.max(...shapeValues)
    }

    return <><g transform={`translate(${offsets[0]}, ${offsets[1]} )`} className='PCP' id={id}>
        <rect x={0} y={0} width={width} height={height} fill='white' stroke='gray' className="background" />
        <g className='lines' >
            {allShapValues.map((shapValues, index) => {
                const color = isSupport(shapValues) ? 'green' : 'orange'
                const points = shapValues.map((shapValue, i) => [xScale(Math.abs(shapValue)), yScale(featureNames[i])]).sort((a, b) => a[1]! - b[1]!).reverse()

                return <polyline points={points.map(point => `${point[0]}, ${point[1]}`).join(' ')} fill='none' stroke={color} opacity={0.3} />
            })}
        </g>
        <g className='feature names'>
            {featureNames.map((featureName, index) => {
                return <text x={margin[0] - 2} y={yScale(featureName) as number + yScale.bandwidth() * 0.2} textAnchor='end'>{featureName}</text>
            })}
        </g>
        <text x={width / 2} y={height - 5} textAnchor='middle'> Contribution to the prediction</text>
    </g>
        <g className='ranking'>

        </g>
    </>
}