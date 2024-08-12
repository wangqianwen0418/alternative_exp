export const CASES = [
    {
        name: "Case 1",
        href: "/case1",
        userText: 'BMI is the more important than age for predicting diabetes progression.',
        initVis: "beeswarm",
        insight: {
            variables: [
                {name: "bmi", transform: "average", type: "feature attribution"},
                {name: "age", transform: "average", type: "feature attribution"}
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
                {name: "bmi", type: "feature attribution"},
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
        userText: '',
        initVis: "scatter"
    },
    {
        name: "Free Exploration",
        href: "/free",
        userText: '',
        initVis: "random",
    }
]

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
    type: "read value",
    relation: "greater" | "less" | "equal",
    condition: {featureName: string, range: [number, number]} | undefined,
}

export type TInsight2 = {
    variables: [TVariable, TVariable],
    type: "comparison",
    relation: "greater" | "less" | "equal",
    condition: {featureName: string, range: [number, number]} | undefined,
}

export type TInsight3 = {
    variables: [TVariable, TVariable],
    type: "correlation",
    relation: "positive" | "negative",
    condition: {featureName: string, range: [number, number]} | undefined,
}

export type TInsight4 = {
    variables: [TVariable, TVariable],
    type: "feturea interaction",
    relation: "same" | "different",
    condition: {featureName: string, range: [number, number][]} | undefined,
}

export type TVariable = {
    featureName: string,
    transform: "average" | undefined,
    type: "feature value" | "feature attribution",
}

export type TConstant = number


