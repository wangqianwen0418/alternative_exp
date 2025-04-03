import xgboost
import numpy as np
import shap
import json

X, y = shap.datasets.diabetes()
model = xgboost.XGBRegressor().fit(X, y)

# # compute SHAP values
explainer = shap.Explainer(model, X)
shap_values = explainer(X)

# print((shap_values[0]))

# shap.plots.beeswarm(shap_values, max_display=3, color_bar=True)


features = X.columns.tolist()
shap_data = {
    feature: {
        'shap_values': shap_values[:, i].values.tolist(),
        'values': X.iloc[:, i].tolist()
    } for i, feature in enumerate(features)
}

# Save to file
with open('shap_beeswarm_data.json', 'w') as f:
    json.dump(shap_data, f)
