# Differences caused by the choice of Kernels

# %%
import time

import numpy as np
from sklearn.model_selection import train_test_split

import shap
import pandas as pd
import altair as alt

X, y = shap.datasets.diabetes()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)


def print_accuracy(f):
    '''
    print the accuracy of a model f on the test data X_test, y_test
    '''
    print(
        f"Root mean squared test error = {np.sqrt(np.mean((f(X_test) - y_test) ** 2))}"
    )
    time.sleep(0.5)  # to let the print get out before any progress bars


shap.initjs()
# %%
from sklearn.ensemble import RandomForestRegressor


rforest = RandomForestRegressor(
    n_estimators=1000, max_depth=None, min_samples_split=2, random_state=0
)
rforest.fit(X_train, y_train)
print_accuracy(rforest.predict)

explainer = shap.TreeExplainer(rforest)

# # rather than use the whole training set to estimate expected values, we summarize with
# # a set of weighted kmeans, each weighted by the number of points they represent.
# X_train_summary = shap.kmeans(X_train, 10)
# explainer = shap.PermutationExplainer(model.predict, X_train_summary)
# explainer = shap.KernelExplainer(model.predict, X_train_summary)

shap_values = explainer(X)

#%%
import json
data = {}
data['shap_values'] = shap_values.values.tolist()
data['feature_names'] = X.columns.tolist()
data['feature_values'] = X.values.tolist()
data['prediction'] = rforest.predict(X).tolist()
data['ground_truth'] = y.tolist()

with open('shap_diabetes.json', 'w') as outfile:
    json.dump(data, outfile)

#%%
shap.plots.waterfall(shap_values[0])

#%%
    # shap_values = explainer.shap_values(X_test[0:1])
shap.summary_plot(shap_values, X)
    # shap.force_plot(explainer.expected_value, shap_values, X_test[0:1])


# %%
feature_index = 2 # 2 is the index of the feature "bmi"
# 3 is the index of the feature "bp"
# feature_index = 8 # 8 is the index of the feature "s5"
feature_shap_values = shap_values[:, feature_index].values
feature_values = X.iloc[:, feature_index].values
df = pd.DataFrame({
    'X': feature_values,
    'Y': feature_shap_values
})
df['index'] = df.index

scatter = alt.Chart(df).mark_point().encode(
    x=alt.X('X:Q', scale=alt.Scale(domain=(-0.2, 0.2)), title='feature values'),
    y=alt.Y('Y:Q', scale=alt.Scale(domain=(-50, 90)), title='SHAP value'),
    tooltip=['index:Q']
).interactive()

x_rule = alt.Chart(df).mark_rule(color='black', strokeWidth=2).encode(
    x='a:Q'
).transform_calculate(
    a="0"
)

y_rule = alt.Chart(df).mark_rule(color='black', strokeWidth=2).encode(
    y='a:Q'
).transform_calculate(
    a="0"
)

chart = (x_rule + y_rule + scatter).properties(
    title = 'blood pressure'
)
chart

# %%
feature_index = 2 # 2 is the index of the feature "bmi"
# 3 is the index of the feature "bp"
# feature_index = 8 # 8 is the index of the feature "s5"
feature_shap_values = shap_values[:, feature_index].values
feature_values = X.iloc[:, feature_index].values
df = pd.DataFrame({
    'X': feature_values,
    'Y': feature_shap_values
})
df['index'] = df.index

line = alt.Chart(df).mark_line().encode(
    x='X',
    y='mean(Y)'
)

band = alt.Chart(df).mark_errorband(extent='ci').encode(
    x=alt.X('X').title('BMI'),
    y=alt.Y('Y').title('average SHAP value with 95% CI'),
)

band + line
# %%
a= shap_values[:, 2].values #bmi
b = shap_values[:, 8].values #s5
indices = [index for index in range(len(a)) if abs(b[index]) > abs(20 * a[index]) ]
# indices = [index for index in range(len(a)) if abs(a[index]) > abs(20 * b[index]) ]
# %%

feature_index = 8
feature_values = X.iloc[:, feature_index].values
shap_index = np.argsort(np.argsort(np.abs(shap_values.values), axis=1), axis=1)[:, feature_index] #use np.argsort twice to get the ranking index

df = pd.DataFrame({
    'X': feature_values,
    'Y': -1 * shap_index + 10
})
df['index'] = df.index

alt.Chart(df).mark_point().encode(
    x=alt.X('X:Q', scale=alt.Scale(domain=(-0.2, 0.2)), title='feature values'),
    y=alt.Y('Y:Q', scale=alt.Scale(domain=(10, 1)),title='SHAP Ranking'),
    color=alt.condition(alt.datum.Y <= 1, 
                                alt.ColorValue('green'), 
                                alt.ColorValue('orange')),
    tooltip=['index:Q']
)
# %%
# from interpret.glassbox import ExplainableBoostingRegressor

# ebm = ExplainableBoostingRegressor()
# ebm.fit(X, y)

# from interpret import show

# ebm_global = ebm.explain_global()
# show(ebm_global)
# %%
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import PartialDependenceDisplay

est = HistGradientBoostingRegressor()
est.fit(X, y)
PartialDependenceDisplay.from_estimator(est, X, [feature_index])
# %%
# partial dependency
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.inspection import PartialDependenceDisplay

est = GradientBoostingRegressor()
est.fit(X, y)
PartialDependenceDisplay.from_estimator(est, X, [feature_index])
# %%
# the larger the BMI, the smaller the absolute SHAP value of gender 
shap.plots.scatter(shap_values[:, 'sex'],color=shap_values[:, 'bmi'], x_jitter=0.5)

#%%
gender_shap_values = shap_values[:, 1].values
BMI_values = X.iloc[:, 2].values
gender_values = ['female' if i>0 else 'male' for i in X.iloc[:, 1].values]

df = pd.DataFrame({
    'X': BMI_values,
    'Y': gender_shap_values,
    'color': gender_values
})
df['index'] = df.index

alt.Chart(df).mark_point().encode(
    x=alt.X('X:Q', title='BMI'),
    y=alt.Y('Y:Q', title='SHAP value of Gender'),
    color=alt.Color('color:N'),
    tooltip=['index:Q']
    )
# %%

from scipy.stats import pearsonr

bmi_shape_values = shap_values[:, 2].values
BMI_values = X.iloc[:, 2].values
# correlation, p_value = pearsonr(BMI_values, bmi_shape_values)
# mask = (BMI_values < 0.06) & (BMI_values > 0.03)
mask = (BMI_values < -0.04)
filtered_bmi_shape_values = bmi_shape_values[mask]
filtered_BMI_values = BMI_values[mask]
pearsonr(filtered_BMI_values, filtered_bmi_shape_values)
# %%

sex_values = X.iloc[:, 1].values
sex_shape_values = shap_values[:, 1].values
BMI_values = X.iloc[:, 2].values
mask = (sex_values<0)
filtered_BMI_values = BMI_values[mask]
filtered_sex_shape_values = sex_shape_values[mask]
pearsonr(filtered_BMI_values, filtered_sex_shape_values)
# %%
pearsonr(BMI_values, sex_shape_values)
# %%
