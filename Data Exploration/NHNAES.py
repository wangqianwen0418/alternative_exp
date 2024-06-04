# %%
import matplotlib.pylab as pl
import numpy as np
import xgboost
from sklearn.model_selection import train_test_split

import shap
import pandas as pd

# %%
X, y = shap.datasets.nhanesi()
xgb_full = xgboost.DMatrix(X, label=y)

# create a train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=7)
xgb_train = xgboost.DMatrix(X_train, label=y_train)
xgb_test = xgboost.DMatrix(X_test, label=y_test)

def c_statistic_harrell(pred, labels):
    total = 0
    matches = 0
    for i in range(len(labels)):
        for j in range(len(labels)):
            if labels[j] > 0 and abs(labels[i]) > labels[j]:
                total += 1
                if pred[j] > pred[i]:
                    matches += 1
    return matches / total

# %%    
params = {"eta": 0.002, "max_depth": 3, "objective": "survival:cox", "subsample": 0.5, "tree_method": "exact"}

# %%
model_train = xgboost.train(
    params, xgb_train, 10000, evals=[(xgb_test, "test")], verbose_eval=1000
)

# see how well we can order people by survival
acc = c_statistic_harrell(model_train.predict(xgb_test), y_test)
print(f" C-statistic: {acc}")

# # train final model on the full data set for the model explanation
# model = xgboost.train(
#     params, xgb_full, 10000, evals=[(xgb_full, "test")], verbose_eval=1000
# )
# explain the model's predictions using SHAP values
shap_values = shap.TreeExplainer(model_train).shap_values(X)

shap.summary_plot(shap_values, X, max_display=40)
# %%
# cluster based on shape values
import seaborn as sns
# %%
sns.clustermap(shap_values[:, :20], cmap="vlag", vmin=-1, vmax=1)
# %%
feature_index = []
for i in range(len(shap_values[0])):
    if shap_values[:, i].min() < -0.3 or shap_values[:, i].max() > 0.3:
        feature_index.append(i)


# %%
shap_values_df = pd.DataFrame(shap_values, columns=X.columns)      
sns.clustermap(shap_values_df.iloc[:, feature_index], cmap="vlag", vmin=-1, vmax=1)

# %%
# import numpy as np
# from matplotlib import pyplot as plt
# from scipy.cluster.hierarchy import dendrogram

# from sklearn.cluster import AgglomerativeClustering

# def get_dendrogram(model):
#     # Create linkage matrix and then plot the dendrogram

#     # create the counts of samples under each node
#     counts = np.zeros(model.children_.shape[0])
#     n_samples = len(model.labels_)
#     for i, merge in enumerate(model.children_):
#         current_count = 0
#         for child_idx in merge:
#             if child_idx < n_samples:
#                 current_count += 1  # leaf node
#             else:
#                 current_count += counts[child_idx - n_samples]
#         counts[i] = current_count

#     linkage_matrix = np.column_stack(
#         [model.children_, model.distances_, counts]
#     ).astype(float)
#     return linkage_matrix

#     # Plot the corresponding dendrogram
    

# # %%
# cluster_model = AgglomerativeClustering(distance_threshold=0, n_clusters=None)

# cluster_model = cluster_model.fit(shap_values_df.iloc[:, feature_index])

# # plot the top three levels of the dendrogram

# linkage_matrix = get_dendrogram(cluster_model)
# dendrogram(linkage_matrix, truncate_mode="level", p=3)
# plt.xlabel("Number of points in node (or index of point if no parenthesis).")
# # change figure width
# fig = plt.gcf()
# fig.set_size_inches(20, 10)
# plt.show()
# %%
from sklearn.cluster import AgglomerativeClustering
N_CLUSTERS = 5

cluster_model = AgglomerativeClustering(n_clusters=N_CLUSTERS)

cluster_model = cluster_model.fit(shap_values_df.iloc[:, feature_index])

for i in range(N_CLUSTERS):
    shap_values_masks = np.zeros(shap_values_df.shape)
    shap_values_masks[cluster_model.labels_ == i, :] = shap_values[cluster_model.labels_ == i, :]
    shap.summary_plot(shap_values_masks, X, max_display=15)
# %%
