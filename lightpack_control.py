import lightpack, time
from functools import wraps
lpack = lightpack.lightpack('127.0.0.1', 3636, list(range(50)),'{c2ef0ccd-dd8a-4e25-8ab3-8d17ce25b20c}' )
lpack.connect()


# print("turnOn: %s" % lpack.turnOn())

def retryConnect(exceptions, tries=4, delay=3, backoff=2,):
    """
    Retry calling the decorated function using an exponential backoff.

    Args:
        exceptions: The exception to check. may be a tuple of
            exceptions to check.
        tries: Number of times to try (not retry) before giving up.
        delay: Initial delay between retries in seconds.
        backoff: Backoff multiplier (e.g. value of 2 will double the delay
            each retry).
    """
    def deco_retry(func):

        @wraps(func)
        def new_func(*original_args, **original_kwargs):
            mtries, mdelay = tries, delay
            # check reconnect
            msj="error"
            while mtries > 1:
                try:
                    return func(*original_args, **original_kwargs)
                except Exception as e:
                    
                   
                    print('{}, Retrying in {} seconds...'.format(e, mdelay))
                    msj='{}...'.format(e)
                    lpack.coseCon()
                    lpack.connect()
                    
                    time.sleep(mdelay)
                    mtries -= 1
                    mdelay *= backoff
                    if(mtries<1):
                        return '{}...'.format(e, mdelay)
                    
            return msj
            # return func(*original_args, **original_kwargs)
            
        return new_func

    return deco_retry

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

@retryConnect(Exception, tries=2)
def getInfo():
    status={}
    status['profiles']=lpack.getProfiles()
    status['actProfile']=lpack.getProfile().rstrip()
    status['mode']=lpack.getMode().rstrip()
    status['status']=lpack.getStatus().rstrip()
    status['brightness']=lpack.getBrightness().rstrip()
    status['smooth']=lpack.getSmooth().rstrip()
    status['persistent']=lpack.getPersistColors().rstrip()
    status['apiStatus']=lpack.getAPIStatus().rstrip()
    # print(status)

    return status


@retryConnect(Exception,tries=2)
def getSoundvizInfo():
    info={}
    info['max']=lpack.getsoundvizcolors().split(';')[0].rstrip()
    info['min']=lpack.getsoundvizcolors().split(';')[1].rstrip()
    info['liquid']=lpack.getsoundvizliquid().rstrip()

    return info


@retryConnect(Exception, tries=6)
@trySetMethod
def setProfile(profile):
    return lpack.setProfile(profile)

@retryConnect(Exception, tries=6)
@trySetMethod
def setstatus(status):
    if(status=='on'):
        print('set on')
        return lpack.turnOn()
    else:
        print('set off')
        return lpack.turnOff()


@retryConnect(Exception, tries=6)
@trySetMethod
def setBrightness(bgrt):
    return lpack.setBrightness(bgrt)

@retryConnect(Exception, tries=6)
@trySetMethod
def setsmoth(smth):
    rta = lpack.setSmooth(smth)
    return rta

# setpersistonunlock on para que quede el mismo, off para cambiar
@retryConnect(Exception, tries=3)
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



@retryConnect(Exception, tries=3)
@trySetMethod
def setColor(colors):
    print('colorsd:',colors)
    return lpack.setColorToAll(colors.split(',')[0],colors.split(',')[1],colors.split(',')[2])

