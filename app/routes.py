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
def setStatus():
    result= ctrl.setstatus(request.form['status'])
    return result