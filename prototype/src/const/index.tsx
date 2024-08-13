import React from "react";

export const CASES = [
    {
        name: "Case 1",
        href: "/case1",
        userText: 'BMI is the more important than age for predicting diabetes progression.',
        initVis: "beeswarm",
        insight: {
            variables: [
                { name: "bmi", transform: "average", type: "feature attribution" },
                { name: "age", transform: "average", type: "feature attribution" }
            ],
            type: "comparison",
            relation: "greater",
            condition: undefined
        }
    },
    {
        name: "Case 2",
        href: "/case2",
        userText: 'bmi always contributes positively for predicting diabetes progression.',
        initVis: "bar",
        insight: {
            variables: [
                { name: "bmi", type: "feature attribution" },
                0
            ],
            type: "read value",
            relation: "greater",
            condition: undefined
        }
    },
    {
        name: "Case 3",
        href: "/case3",
        userText: 'the larger the age, the more likely to have greater diabetes progression.',
        initVis: "bee swarm",
        Insights: {
            variables: [
                { name: "age", type: "feature value" },
                { name: "age", type: "feature atrribution" }
            ],
            type: "correlation",
            relation: "positive",
            condition: undefined
        }
    },
    {
        name: "Free Exploration",
        href: "/free",
        userText: '',
        initVis: "random",
    }
]

export const TextTemplates = {
    read: (insight: TInsight1) => {
        const [var1, var2] = insight.variables;
        return <span> The <span className="transform">{var1.transform}</span> value of <span className="featureName">{var1.featureName}</span> is <span className="relation">{insight.relation}</span> than <span className="constant">{var2}</span>. </span>
    },
    comparison: (insight: TInsight2) => {
        const [var1, var2] = insight.variables;
        return <span> The <span className="transform">{var1.transform}</span> value of <span className="featureName">{var1.featureName}</span> is <span className="relation">{insight.relation}</span> the <span className="transform">{var2.transform}</span> value of <span className="featureName">{var2.featureName}</span>. </span>
    },
    correlation: (insight: TInsight3) => {
        const [var1, var2] = insight.variables;
        return `As the ${var1.featureName} increases, it will ${insight.relation == 'positively' ? 'more' : 'less'} to the prediction.`
    },
    fetureaInteraction: (insight: TInsight4) => {
        const [var1, var2] = insight.variables;
        return `The ${var1.featureName} is ${insight.relation} with ${var2}.`
    }
}

export type TCase = {
    name: string,
    href: string,
    userText: string,
    initVis: "beeswarm" | "bar" | "scatter" | string,
    insight: TInsight
}

export type TInsight = TInsight1 | TInsight2 | TInsight3 | TInsight4 | undefined

export type TInsight1 = {
    variables: [TVariable, TConstant],
    type: "read",
    relation: "greater than" | "less than" | "equal to",
    condition: { featureName: string, range: [number, number] } | undefined,
}

export type TInsight2 = {
    variables: [TVariable, TVariable],
    type: "comparison",
    relation: "greater" | "less" | "equal",
    condition: { featureName: string, range: [number, number] } | undefined,
}

export type TInsight3 = {
    variables: [TVariable, TVariable],
    type: "correlation",
    relation: "positively" | "negatively",
    condition: { featureName: string, range: [number, number] } | undefined,
}

export type TInsight4 = {
    variables: [TVariable, TVariable],
    type: "fetureaInteraction",
    relation: "same" | "different",
    condition: { featureName: string, range: [number, number][] } | undefined,
}

export type TVariable = {
    featureName: string,
    transform: "average" | undefined,
    type: "feature value" | "feature attribution",
}

export type TConstant = number


