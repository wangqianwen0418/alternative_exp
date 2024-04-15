# Differences caused by the choice of Kernels

# %%
import time

import numpy as np
from sklearn.model_selection import train_test_split

import shap
import pandas as pd

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
a= shap_values[:, 2].values #bmi
b = shap_values[:, 8].values #s5
indices = [index for index in range(len(a)) if abs(b[index]) > abs(20 * a[index]) ]
# indices = [index for index in range(len(a)) if abs(a[index]) > abs(20 * b[index]) ]
# %%
