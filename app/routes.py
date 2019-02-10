from flask import render_template,jsonify
from app import app

import lightpack_control as ctrl






@app.route('/')
@app.route('/index')
def index():
    
    return  render_template('index.html', title='Home')


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

