from flask import render_template,jsonify,request
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

@app.route('/setProfile',methods=['POST'])
def setProfile():
    result= ctrl.setProfile(request.form['profile'])
    return jsonify(result)

@app.route('/setstatus',methods=['POST'])
def setstatus():
    result= ctrl.setstatus(request.form['status'])
    return result

@app.route('/setbrightness',methods=['POST'])
def setbrightness():
    result = ctrl.setBrightness(int(request.form['data']))
    return result

@app.route('/setsmooth',methods=['POST'])
def setsmooth():
    result= ctrl.setsmoth(int(request.form['data']))
    return result

@app.route('/setmode',methods=['POST'])
def setMode():
    print(request.form['data'])
    return ctrl.setMode(request.form['data'])
