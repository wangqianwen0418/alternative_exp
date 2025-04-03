# # Differences caused by the choice of Hyperparameters

# %%
import json

import numpy as np
import torch
from torchvision import models
from torchvision.models.vgg import vgg16, VGG16_Weights

import shap

# %%
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]


def normalize(image):
    if image.max() > 1:
        image /= 255
    image = (image - mean) / std
    # in addition, roll the axis so that they suit pytorch
    return torch.tensor(image.swapaxes(-1, 1).swapaxes(2, 3)).float()

# %%
N_SAMPLES = 20 # default 200
LOCAL_SMOOTHING=0.9 # [0, 1] 0 for no smoothing
LAYER_INDEX = 6
INPUT_INDEX = 41

# load the model
model = vgg16(weights = VGG16_Weights.DEFAULT).eval()

X, y = shap.datasets.imagenet50()

X /= 255

# %%

def generate_exp(model, X, LAYER_INDEX, INPUT_INDEX, N_SAMPLES, LOCAL_SMOOTHING):
   
    # to_explain = X[[30, 32]]
    to_explain = X[INPUT_INDEX: INPUT_INDEX+1]

    # load the ImageNet class names
    url = "https://s3.amazonaws.com/deep-learning-models/image-models/imagenet_class_index.json"
    fname = shap.datasets.cache(url)
    with open(fname) as f:
        class_names = json.load(f)

    e = shap.GradientExplainer((model, model.features[LAYER_INDEX]), normalize(X), local_smoothing=LOCAL_SMOOTHING)

    shap_values, indexes = e.shap_values(
        normalize(to_explain), ranked_outputs=3, nsamples=N_SAMPLES
    )

    # get the names for the classes
    index_names = np.vectorize(lambda x: class_names[str(x)][1])(indexes)

    # plot the explanations
    shap_values = [np.swapaxes(np.swapaxes(s, 2, 3), 1, -1) for s in shap_values]

    shap.image_plot(shap_values, to_explain, index_names)
# %%
N_SAMPLES = 20 # default 200
LOCAL_SMOOTHING=1 # [0, 1] 0 for no smoothing
LAYER_INDEX = 3
INPUT_INDEX = 41

generate_exp(model, X, LAYER_INDEX, INPUT_INDEX, N_SAMPLES, LOCAL_SMOOTHING)

# %%
