from flask import render_template,jsonify
from app import app

import lightpack_control as ctrl






@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Miguel'}
    return  render_template('index.html', title='Home', user=user)


@app.route('/info', methods=['GET'])
def info():
    return jsonify({
        'status': 'success',
        'info': ctrl.getInfo()
    })

@app.route('/getMode',methods=['GET'])
def getMode():
    return jsonify({
        'mode': ctrl.getMode()
    })

