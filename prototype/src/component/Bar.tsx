import * as d3 from 'd3';

interface BarProps {
    allShapValues: number[][],
    featureNames: string[],
    width: number,
    height: number,
    id: string,
    offsets: number[]

}

export default function Bar(props: BarProps) {
    let margin = [40, 10, 40, 10]

    const { allShapValues, featureNames, height, width, id, offsets } = props;
    let avgShapeValues: { [featureName: string]: number } = {}
    for (let i = 0; i < allShapValues.length; i++) {
        avgShapeValues[featureNames[i]] = allShapValues.map((val, index) => Math.abs(val[i])).reduce((a, b) => a + b, 0) / allShapValues.length
    }

    let sortedAvgShapeValues = Object.entries(avgShapeValues).sort((a, b) => a[1] - b[1])

    const yScale = d3.scaleBand().domain(featureNames).range([margin[1], height - margin[3]]).padding(0.1)
    const xScale = d3.scaleLinear().domain([0, d3.max(sortedAvgShapeValues, d => d[1]) as number]).range([margin[0], width - margin[2]])


    return <g
        className="bar"
        id={id}
        transform={`translate(${offsets[0]}, ${offsets[1]})`}
    >
        <g className='bars'>
            {sortedAvgShapeValues.map(([featureName, value], index) => {
                return <g k={featureName}>
                    <text y={yScale(featureName) as number + yScale.bandwidth() * 0.8} >{featureName}</text>
                    <rect
                        key={featureName}
                        x={xScale(0)}
                        y={yScale(featureName)}
                        width={xScale(value)}
                        height={yScale.bandwidth()}
                        fill='steelblue'
                    />
                </g>
            })}
        </g>
    </g>
}