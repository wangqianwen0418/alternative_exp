#%%
import xgboost
import shap

# train XGBoost model
X,y = shap.datasets.adult()
model = xgboost.XGBClassifier().fit(X, y)

# compute SHAP values
explainer = shap.TreeExplainer(model)
shap_values = explainer(X)
# %%
shap.plots.scatter(shap_values[:, 'Age'],color=shap_values[:, 'Education-Num'])
# %%
import json
data = {}
data['shap_values'] = shap_values.values.tolist()
data['feature_names'] = X.columns.tolist()
data['feature_values'] = X.values.tolist()

with open('shap_income.json', 'w') as outfile:
    json.dump(data, outfile)