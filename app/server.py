import aiohttp
import asyncio
import os
from flask import Flask, render_template, request
from flask import send_from_directory
from fastai import *
from fastai.vision import *
from io import BytesIO
import sys
from typing import List, Dict, Union, ByteString, Any
import requests
import torch
import json

#classes = ['НОРМА', 'ПНЕВМОНИЯ']
path = Path(__file__).parent

app = Flask(__name__, static_folder='app/static', root_path='/static')


def load_model(path=".", model_name="export.pkl"):
        learn = load_learner(path, file=model_name)
        return learn

def load_image_url(url: str) -> Image:
    response = requests.get(url)
    img = open_image(BytesIO(response.content))
    return img

def load_image_bytes(raw_bytes: ByteString) -> Image:
    img = open_image(BytesIO(raw_bytes))
    return img

def predict(img, n: int = 3) -> Dict[str, Union[str, List]]:
    pred_class, pred_idx, outputs = model.predict(img)[0]
    pred_probs = outputs / sum(outputs)
    pred_probs = pred_probs.tolist()
    predictions = []
    for image_class, output, prob in zip(model.data.classes, outputs.tolist(), pred_probs):
        output = round(output, 1)
        prob = round(prob, 2)
        predictions.append(
            {"class": image_class.replace("_", " "), "output": output, "prob": prob}
        )

    predictions = sorted(predictions, key=lambda x: x["output"], reverse=True)
    predictions = predictions[0:1]
    return {"class": str(pred_class), "predictions": predictions}


@app.route('/')
def homepage():
    return render_template('index.html')

def before_request():
    app.jinja_env.cache = {}

torch.nn.Module.dump_patches = True
model = load_model(path="app/models", model_name="export.pkl")

@app.route('/api/classes', methods=['GET'])
def classes():
    classes = sorted(model.data.classes)
    return flask.jsonify(classes)

@app.route('/<path:path>')
def static_file(path):
    if ".js" in path or ".css" in path:
        return app.send_static_file(path)

@app.route('/api/classify', methods=['POST', 'GET'])
#def analyze():
#   if request.method == 'GET':
#	    return render_template('index.html')
 #   else:
  #      img_data = request.form()
   #     img_bytes = img_data['file'].read()
    #    img = open_image(BytesIO(img_bytes))
     #   prediction = learn.predict(img)[0]
   # return render_template('result.html', label = prediction, image_path = img)

def upload_file():
    if flask.request.method == 'GET':
        url = flask.request.args.get("url")
        img = load_image_url(url)
    else:
        bytes = flask.request.files['file'].read()
        img = load_image_bytes(bytes)
    res = predict(img)
    return flask.jsonify(res)

if __name__ == '__main__':
    port = os.environ.get('PORT', 5000)

    if "prepare" not in sys.argv:
        app.jinja_env.auto_reload = True
        app.config['TEMPLATES_AUTO_RELOAD'] = True
        app.run(debug=False, host='0.0.0.0', port=port)
