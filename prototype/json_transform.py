import json

with open("src/assets/shap_diabetes.json", 'r') as file:
    data = json.load(file)

shap_values = data['shap_values']
feature_names = data['feature_names']

transformed_data = {feature: [] for feature in feature_names}

for datapoint in shap_values:
    for i, feature in enumerate(feature_names):
        transformed_data[feature].append(datapoint[i])


with open('ridgeline_diabetes.json', 'w') as output:
    json.dump(transformed_data, output, indent=4)