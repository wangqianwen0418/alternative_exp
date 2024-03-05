# Differences caused by the choice of Kernels

# %%
import time

import numpy as np
from sklearn.model_selection import train_test_split

import shap

X, y = shap.datasets.diabetes()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# rather than use the whole training set to estimate expected values, we summarize with
# a set of weighted kmeans, each weighted by the number of points they represent.
X_train_summary = shap.kmeans(X_train, 10)


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

# explain all the predictions in the test set
def generate_exp(model, X, explanation, INPUT_INDEX):
    '''
    model: model to explain
    X: input data
    explanation: type of explanation, "tree" or "kernel"
    INPUT_INDEX: index of the input data to explain
    '''
    assert explanation in ["tree", "kernel"], "Invalid explanation type"
    if explanation == "tree":
        explainer = shap.TreeExplainer(model)
    elif explanation == "permutation":
        explainer = shap.PermutationExplainer(model.predict, X_train_summary)
    else :
        explainer = shap.KernelExplainer(model.predict, X_train_summary)
    shap_values = explainer(X)
    shap.plots.waterfall(shap_values[INPUT_INDEX])

    # shap_values = explainer.shap_values(X_test[0:1])
    # shap.summary_plot(shap_values, X)
    # shap.force_plot(explainer.expected_value, shap_values, X_test[0:1])


# %%
input_index = 20
generate_exp(rforest, X_test, "tree", input_index)
# %%
generate_exp(rforest, X_test, "kernel", input_index)
# %%
