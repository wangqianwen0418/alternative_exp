import shap_diabetes from "../assets/shap_diabetes_new.json";

const diabetes_s5 = "s5",
  diabetes_s5_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s5),
  diabetes_s5_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s5_featureIndex]
  ),
  diabetes_s5_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s5_featureIndex]
  );

const diabetes_bmi = "bmi",
  diabetes_bmi_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_bmi),
  diabetes_bmi_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_bmi_featureIndex]
  ),
  diabetes_bmi_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_bmi_featureIndex]
  );

const diabetes_bp = "bp",
  diabetes_bp_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_bp),
  diabetes_bp_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_bp_featureIndex]
  ),
  diabetes_bp_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_bp_featureIndex]
  );

const diabetes_s3 = "s3",
  diabetes_s3_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s3),
  diabetes_s3_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s3_featureIndex]
  ),
  diabetes_s3_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s3_featureIndex]
  );

const diabetes_s6 = "s6",
  diabetes_s6_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s6),
  diabetes_s6_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s6_featureIndex]
  ),
  diabetes_s6_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s6_featureIndex]
  );

const diabetes_age = "age",
  diabetes_age_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_age),
  diabetes_age_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_age_featureIndex]
  ),
  diabetes_age_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_age_featureIndex]
  );

const diabetes_s2 = "s2",
  diabetes_s2_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s2),
  diabetes_s2_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s2_featureIndex]
  ),
  diabetes_s2_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s2_featureIndex]
  );

const diabetes_sex = "sex",
  diabetes_sex_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s2),
  diabetes_sex_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_sex_featureIndex]
  ),
  diabetes_sex_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_sex_featureIndex]
  );

const diabetes_s1 = "s1",
  diabetes_s1_featureIndex =
    shap_diabetes["feature_names"].indexOf(diabetes_s2),
  diabetes_s1_featureValues = shap_diabetes["feature_values"].map(
    (row) => row[diabetes_s1_featureIndex]
  ),
  diabetes_s1_shapValues = shap_diabetes["shap_values"].map(
    (row) => row[diabetes_s1_featureIndex]
  );

const diabetes_s4 = "s4",
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
