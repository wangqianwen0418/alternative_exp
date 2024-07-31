#%%
import xgboost
import shap
import pandas as pd
import altair as alt

# train XGBoost model
X,y = shap.datasets.adult()
model = xgboost.XGBClassifier().fit(X, y)

# compute SHAP values
explainer = shap.TreeExplainer(model)
shap_values = explainer(X[:1000])
X= X[:1000]
# %%
shap.plots.scatter(shap_values[:, 'Hours per week'],color=shap_values[:, 'Age'])
# %%
hr_values = X['Hours per week'].values
hr_shape_values = shap_values[:, 'Hours per week'].values
mask = (hr_values < 40) 
filtered_hr_shape_values = hr_shape_values[mask]
filtered_age_values = X['Age'].values[mask]
df = pd.DataFrame({
    'X': filtered_age_values,
    'Y': filtered_hr_shape_values
})
df['index'] = df.index
chart_a = alt.Chart(df).mark_point().encode(
    x=alt.X('X:Q', title='bp'),
    y=alt.Y('Y:Q', title='SHAP value of BMI'),
    tooltip=['index:Q']
)


mask = (hr_values > 40) 
filtered_hr_shape_values = hr_shape_values[mask]
filtered_age_values = X['Age'].values[mask]
df = pd.DataFrame({
    'X': filtered_age_values,
    'Y': filtered_hr_shape_values
})
df['index'] = df.index
chart_b = alt.Chart(df).mark_point().encode(
    x=alt.X('X:Q', title='bp'),
    y=alt.Y('Y:Q', title='SHAP value of BMI'),
    tooltip=['index:Q']
)
chart_a | chart_b
# %%
