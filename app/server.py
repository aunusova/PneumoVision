import aiohttp
import asyncio
import os
from flask import Flask, render_template, request
from flask import send_from_directory
from fastai import *
from fastai.vision import *
from io import BytesIO

export_file_name = 'export.pkl'

classes = ['normal', 'positive']
path = Path(__file__).parent

app = Flask(__name__, static_folder='app/static', root_path='/static')


def setup_learner():
    try:
        learn = load_learner(path, export_file_name)
        return learn
    except RuntimeError as e:
        if len(e.args) > 0 and 'CPU-only machine' in e.args[0]:
            print(e)
            message = "\n\nThis model was trained with an old version of fastai and will not work in a CPU environment.\n\nPlease update the fastai library in your training environment and export your model again.\n\nSee instructions for 'Returning to work' at https://course.fast.ai."
            raise RuntimeError(message)
        else:
            raise


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/analyze', methods=['POST', 'GET'])
def analyze():
    if request.method == 'GET':
		return render_template('index.html')

    if request.method == 'POST':
        img_data = await request.form()
        img_bytes = await (img_data['file'].read())
        img = open_image(BytesIO(img_bytes))
        prediction = learn.predict(img)[0]
        return render_template('result.html', label = prediction, image_path = img)


if __name__ == '__main__':
    app.run(debug = True)