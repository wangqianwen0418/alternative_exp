import json
import numpy as np


# Load the JSON data
with open('shap_diabetes.json', 'r') as f:
    data = json.load(f)


feature_names = data['feature_names']
shap_values = np.array(data['shap_values'])  # Convert to numpy array for easier calculations
feature_values = np.array(data['feature_values'])  # Convert to numpy array for easier calculations

average_shap = {}
average_shap_magnitude = {}
median_shap = {}
average_feature_values = {}
average_feature_values_magnitude = {}
median_feature_values = {}

for i, feature in enumerate(feature_names):
    # Extract the column of SHAP values and feature values for the current feature
    shap_column = shap_values[:, i]
    abs_shap_column = np.abs(shap_values[:,i])
    feature_column = feature_values[:, i]
    abs_feature_column = np.abs(feature_values[:,i])
    
    # Calculate average and median for SHAP values
    average_shap[feature] = np.mean(shap_column)
    average_shap_magnitude[feature] = np.mean(abs_shap_column)
    median_shap[feature] = np.median(shap_column)
    
    # Calculate average and median for feature values
    average_feature_values[feature] = np.mean(feature_column)
    average_feature_values_magnitude[feature] = np.mean(abs_feature_column)
    median_feature_values[feature] = np.median(feature_column)
    

print("Average and Median Feature Values:")
for feature in feature_names:
    print(f"{feature}:")
    print(f"  Average Feature Value: {average_feature_values[feature]}")
    print(f"  Average (magnitude) Feature Value: {average_feature_values_magnitude[feature]}")
    print(f"  Median Feature Value: {median_feature_values[feature]}")

print("\nAverage and Median SHAP Values:")
for feature in feature_names:
    print(f"{feature}:")
    print(f"  Average SHAP Value: {average_shap[feature]}")
    print(f"  Average (magnitude) SHAP Value: {average_shap_magnitude[feature]}")
    print(f"  Median SHAP Value: {median_shap[feature]}")
    

total_avg = 0
total_magnitude_avg = 0
for feature in feature_names:
    total_avg += (average_shap[feature])
    total_magnitude_avg += (average_shap_magnitude[feature])
    

total_avg /= 10
total_magnitude_avg /= 10

print(f"total average SHAP value: {total_avg}")
print(f"total average (magnitude) SHAP value: {total_magnitude_avg}")