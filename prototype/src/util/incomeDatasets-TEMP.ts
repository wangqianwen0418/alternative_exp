import shap_income from "../assets/shap_income.json";

const income_capitalGain = "Capital Gain",
  income_capitalGain_featureIndex =
    shap_income["feature_names"].indexOf(income_capitalGain),
  income_capitalGain_featureValues = shap_income["feature_values"].map(
    (row) => row[income_capitalGain_featureIndex]
  ),
  income_capitalGain_shapValues = shap_income["shap_values"].map(
    (row) => row[income_capitalGain_featureIndex]
  );

const income_educationNum = "Education-Num",
  income_educationNum_featureIndex =
    shap_income["feature_names"].indexOf(income_educationNum),
  income_educationNum_featureValues = shap_income["feature_values"].map(
    (row) => row[income_educationNum_featureIndex]
  ),
  income_educationNum_shapValues = shap_income["shap_values"].map(
    (row) => row[income_educationNum_featureIndex]
  );

const income_age = "Age",
  income_age_featureIndex = shap_income["feature_names"].indexOf(income_age),
  income_age_featureValues = shap_income["feature_values"].map(
    (row) => row[income_age_featureIndex]
  ),
  income_age_shapValues = shap_income["shap_values"].map(
    (row) => row[income_age_featureIndex]
  );

const income_occupation = "Occupation",
  income_occupation_featureIndex =
    shap_income["feature_names"].indexOf(income_occupation),
  income_occupation_featureValues = shap_income["feature_values"].map(
    (row) => row[income_occupation_featureIndex]
  ),
  income_occupation_shapValues = shap_income["shap_values"].map(
    (row) => row[income_occupation_featureIndex]
  );

const income_relationship = "Relationship",
  income_relationship_featureIndex =
    shap_income["feature_names"].indexOf(income_relationship),
  income_relationship_featureValues = shap_income["feature_values"].map(
    (row) => row[income_relationship_featureIndex]
  ),
  income_relationship_shapValues = shap_income["shap_values"].map(
    (row) => row[income_relationship_featureIndex]
  );

const income_capitalLoss = "Capital Loss",
  income_capitalLoss_featureIndex =
    shap_income["feature_names"].indexOf(income_capitalLoss),
  income_capitalLoss_featureValues = shap_income["feature_values"].map(
    (row) => row[income_capitalLoss_featureIndex]
  ),
  income_capitalLoss_shapValues = shap_income["shap_values"].map(
    (row) => row[income_capitalLoss_featureIndex]
  );

const income_hoursPerWeek = "Hours per week",
  income_hoursPerWeek_featureIndex =
    shap_income["feature_names"].indexOf(income_hoursPerWeek),
  income_hoursPerWeek_featureValues = shap_income["feature_values"].map(
    (row) => row[income_hoursPerWeek_featureIndex]
  ),
  income_hoursPerWeek_shapValues = shap_income["shap_values"].map(
    (row) => row[income_hoursPerWeek_featureIndex]
  );

export const incomeShapValues = [
  income_capitalGain_shapValues,
  income_educationNum_shapValues,
  income_age_shapValues,
  income_occupation_shapValues,
  income_relationship_shapValues,
  income_capitalLoss_shapValues,
  income_hoursPerWeek_shapValues,
];

export const incomeFeatureValues = [
  income_capitalGain_featureValues,
  income_educationNum_featureValues,
  income_age_featureValues,
  income_occupation_featureValues,
  income_relationship_featureValues,
  income_capitalLoss_featureValues,
  income_hoursPerWeek_featureValues,
];

export const incomeLabels = [
  income_capitalGain,
  income_educationNum,
  income_age,
  income_occupation,
  income_relationship,
  income_capitalLoss,
  income_hoursPerWeek,
];
