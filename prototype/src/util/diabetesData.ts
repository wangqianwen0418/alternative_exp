import shap_diabetes from "../assets/shap_diabetes.json";

export const diabetes_s5 = "serum triglycerides level",
  diabetes_s5_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s5),
  diabetes_s5_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s5_featureIndex]
  ),
  diabetes_s5_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s5_featureIndex]
  );

export const diabetes_bmi = "bmi",
  diabetes_bmi_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_bmi),
  diabetes_bmi_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_bmi_featureIndex]
  ),
  diabetes_bmi_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_bmi_featureIndex]
  );

export const diabetes_bp = "blood pressure",
  diabetes_bp_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_bp),
  diabetes_bp_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_bp_featureIndex]
  ),
  diabetes_bp_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_bp_featureIndex]
  );

export const diabetes_s3 = "high-density lipoproteins",
  diabetes_s3_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s3),
  diabetes_s3_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s3_featureIndex]
  ),
  diabetes_s3_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s3_featureIndex]
  );

export const diabetes_s6 = "blood sugar level",
  diabetes_s6_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s6),
  diabetes_s6_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s6_featureIndex]
  ),
  diabetes_s6_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s6_featureIndex]
  );

export const diabetes_age = "age",
  diabetes_age_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_age),
  diabetes_age_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_age_featureIndex]
  ),
  diabetes_age_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_age_featureIndex]
  );

export const diabetes_s2 = "low-density lipoproteins",
  diabetes_s2_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s2),
  diabetes_s2_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s2_featureIndex]
  ),
  diabetes_s2_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s2_featureIndex]
  );

export const diabetes_sex = "sex",
  diabetes_sex_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_sex),
  diabetes_sex_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_sex_featureIndex]
  ),
  diabetes_sex_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_sex_featureIndex]
  );

export const diabetes_s1 = "serum cholesterol",
  diabetes_s1_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s2),
  diabetes_s1_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s1_featureIndex]
  ),
  diabetes_s1_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s1_featureIndex]
  );

export const diabetes_s4 = "total/HDL cholesterol ratio",
  diabetes_s4_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s2),
  diabetes_s4_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s4_featureIndex]
  ),
  diabetes_s4_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s4_featureIndex]
  );

export const diabetesShapValues = [
  diabetes_s5_shapValues,
  diabetes_bmi_shapValues,
  diabetes_bp_shapValues,
  diabetes_s3_shapValues,
  diabetes_s6_shapValues,
  diabetes_age_shapValues,
  diabetes_s2_shapValues,
  diabetes_sex_shapValues,
  diabetes_s1_shapValues,
  diabetes_s4_shapValues,
];

export const diabetesFeatureValues = [
  diabetes_s5_featureValues,
  diabetes_bmi_featureValues,
  diabetes_bp_featureValues,
  diabetes_s3_featureValues,
  diabetes_s6_featureValues,
  diabetes_age_featureValues,
  diabetes_s2_featureValues,
  diabetes_sex_featureValues,
  diabetes_s1_featureValues,
  diabetes_s4_featureValues,
];

export const diabetesLabels = [
  diabetes_s5,
  diabetes_bmi,
  diabetes_bp,
  diabetes_s3,
  diabetes_s6,
  diabetes_age,
  diabetes_s2,
  diabetes_sex,
  diabetes_s1,
  diabetes_s4,
];

// export const diabetesShapValues = [
//   diabetes_s5_shapValues,
//   diabetes_bmi_shapValues,
//   diabetes_bp_shapValues,
//   diabetes_age_shapValues,
//   diabetes_sex_shapValues,
//   diabetes_s2_shapValues
// ];

// export const diabetesFeatureValues = [
//   diabetes_s5_featureValues,
//   diabetes_bmi_featureValues,
//   diabetes_bp_featureValues,
//   diabetes_age_featureValues,
//   diabetes_sex_featureValues,
//   diabetes_s2_featureValues
// ];

// export const diabetesLabels = [
//   diabetes_s5,
//   diabetes_bmi,
//   diabetes_bp,
//   diabetes_age,
//   diabetes_sex,
//   diabetes_s2
// ];

function getRandomPoints(arr: number[]) {
  if (arr.length < 25) {
    throw new Error("Array has fewer than 25 points.");
  }

  const randomPoints = [];
  const randomIndices = new Set();

  while (randomIndices.size < 25) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    if (!randomIndices.has(randomIndex)) {
      randomIndices.add(randomIndex);
      randomPoints.push(arr[randomIndex]);
    }
  }

  return randomPoints;
}

export const test_random_shap = getRandomPoints(diabetes_bmi_shapValues);
export const test_random_feature = getRandomPoints(diabetes_bmi_featureValues);

export const test_swarm_shapValues = [
  diabetes_bmi_shapValues,
  diabetes_bp_shapValues,
  diabetes_age_shapValues,
  diabetes_sex_shapValues,
  diabetes_s2_shapValues,
];

export const s2DiabetesFeatureValues = [
  diabetes_s5_featureValues,
  diabetes_bmi_featureValues,
  diabetes_bp_featureValues,
  diabetes_age_featureValues,
  diabetes_sex_featureValues,
  diabetes_s2_featureValues,
];

export const s2DiabetesLabels = [
  diabetes_s5,
  diabetes_bmi,
  diabetes_bp,
  diabetes_age,
  diabetes_sex,
  diabetes_s2,
];

export const variableMapping: { [key: string]: number[] } = {
  "BMI Feature Values": diabetes_bmi_featureValues,
  "BMI SHAP (Contribution) Values": diabetes_bmi_shapValues,
  "Age Feature Values": diabetes_age_featureValues,
  "Age SHAP (Contribution) Values": diabetes_age_shapValues,
  "Serum Triglycerides Feature Values": diabetes_s5_featureValues,
  "Serum Triglycerides SHAP (Contribution) Values": diabetes_s5_shapValues,
  "Blood Pressure Feature Values": diabetes_bp_featureValues,
  "Blood Pressure SHAP (Contribution) Values" : diabetes_bp_shapValues,
  "Sex Feature Values": diabetes_sex_featureValues,
  "Sex SHAP (Contribution) Values" : diabetes_sex_shapValues,
  "HDL Feature Values" : diabetes_s3_featureValues,
  "HDL SHAP (Contribution) Values" : diabetes_s3_shapValues,
  "Blood Sugar Feature Values" : diabetes_s6_featureValues,
  "Blood Sugar SHAP (Contribution) Values" : diabetes_s6_shapValues,
  "LDL Feature Values" : diabetes_s2_featureValues,
  "LDL SHAP (Contribution) Values" : diabetes_s2_shapValues,
  "Serum Cholesterol Feature Values" : diabetes_s1_featureValues,
  "Serum Cholesterol SHAP (Contribution) Values" : diabetes_s1_shapValues,
  "Cholesterol Ratio Feature Values" : diabetes_s4_featureValues,
  "Cholesterol Ratio SHAP (Contribution) Values" : diabetes_s4_shapValues,
};

export const variableList = Object.keys(variableMapping);
 