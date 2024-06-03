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
