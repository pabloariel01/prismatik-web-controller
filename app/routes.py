from flask import render_template,jsonify
from app import app



import lightpack, time
lpack = lightpack.lightpack('127.0.0.1', 3636, list(range(50)),'{c2ef0ccd-dd8a-4e25-8ab3-8d17ce25b20c}' )
lpack.connect()

print("Lock: %s" % lpack.lock())
print("turnOn: %s" % lpack.turnOn())


@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Miguel'}
    return  render_template('index.html', title='Home', user=user)


@app.route('/info', methods=['GET'])
def info():
    return jsonify({
        'status': 'success',
        'books': lpack.getAPIStatus()
    })



def getInfo():
    status={}
    status.profiles=lpack.getProfiles()
    status.actProfile=lpack.getProfile()
    status.mode=lpack.getMode()