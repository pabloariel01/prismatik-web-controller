import lightpack, time
from functools import wraps
lpack = lightpack.lightpack('127.0.0.1', 3636, list(range(50)),'{c2ef0ccd-dd8a-4e25-8ab3-8d17ce25b20c}' )
lpack.connect()


# print("turnOn: %s" % lpack.turnOn())

def retryConnect(func):
    @wraps(func)
    def new_func(*original_args, **original_kwargs):
        # check reconnect
        while True:
            try:
                return func(*original_args, **original_kwargs)
            except Exception as e:
                print("CONNECTION ERROR, RETRYING...",e)
                lpack.coseCon()
                lpack.connect()
                time.sleep(2)
                # return func_to_decorate(*original_args, **original_kwargs)
        
    return new_func

def trySetMethod(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
  
        print("Lock: %s" % lpack.lock())
        result=func(*args,**kwargs)

        print("unLock: %s" % lpack.unlock())

        # print('arguments',*args, **kwargs)

        return result

        # return status
        
    return wrapper

@retryConnect
def getInfo():
    status={}
    status['profiles']=lpack.getProfiles()
    status['actProfile']=lpack.getProfile().rstrip()
    status['mode']=lpack.getMode().rstrip()
    status['status']=lpack.getStatus().rstrip()
    status['brightness']=lpack.getBrightness().rstrip()
    status['smooth']=lpack.getSmooth().rstrip()
    status['persistent']=lpack.getPersistColors().rstrip()
    # print(status)

    return status

# //no anda porque no esta locked

@retryConnect
@trySetMethod
def setProfile(profile):
    return lpack.setProfile(profile)

@retryConnect
@trySetMethod
def setstatus(status):
    if(status=='on'):
        print('set on')
        return lpack.turnOn()
    else:
        print('set off')
        return lpack.turnOff()


@retryConnect
@trySetMethod
def setBrightness(bgrt):
    return lpack.setBrightness(bgrt)

@retryConnect
@trySetMethod
def setsmoth(smth):
    rta = lpack.setSmooth(smth)
    return rta

# setpersistonunlock on para que quede el mismo, off para cambiar
@retryConnect
@trySetMethod
def setMode(mode):
    print(mode)
    if(mode=="ambilight"):  #screen capure
        rta=lpack.setMode("ambilight")
    elif(mode=="moodlamp"): #dynamic
        lpack.setMode("moodlamp")
        rta=lpack.setPersistonUnlock('off')
    elif(mode=="soundviz"): #sound captura
        rta=lpack.setMode("soundviz")
        #check liquid sound on or off
    else:       #static color
        lpack.setMode("moodlamp")
        rta=lpack.setPersistonUnlock('on')
    return rta

            #    "setmode:ambilight"
            #      "setmode:moodlamp"
            #      "setmode:soundviz"
			# 		<option data-lang="screen-capture"  value="ambilight"></option>
			# 		<option data-lang="static"  value="moodlamp-static"></option>
			# 		<option data-lang="dynamic"  value="moodlamp"></option>
			# 		<option data-lang="color-music"  value="soundviz"></option>


@retryConnect
@trySetMethod
def setColor(colors):
    print('colorsd:',colors)
    return lpack.setColorToAll(colors.split(',')[0],colors.split(',')[1],colors.split(',')[2])