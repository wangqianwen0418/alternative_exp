import json
import numpy as np


# Load the JSON data
with open('shap_diabetes.json', 'r') as f:
    data = json.load(f)
    
    
feature_values = np.array(data['feature_values'])  # Convert to numpy array for easier calculations

print(np.average(feature_values))
for feature in feature_values:
    print(max(feature))
    print(min(feature))
    print("--------")
