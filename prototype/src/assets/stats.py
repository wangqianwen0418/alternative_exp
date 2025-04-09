import json
import numpy as np


# Load the JSON data
with open('shap_diabetes.json', 'r') as f:
    data = json.load(f)
    
    
feature_values = np.array(data['feature_values'])  # Convert to numpy array for easier calculations

print(np.average(feature_values))

print(np.shape(feature_values))

average_values = np.max(feature_values, axis=0)
print(np.array([data['feature_names']]))
print(average_values)