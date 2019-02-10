import lightpack, time
lpack = lightpack.lightpack('127.0.0.1', 3636, list(range(50)),'{c2ef0ccd-dd8a-4e25-8ab3-8d17ce25b20c}' )
lpack.connect()

# print("Lock: %s" % lpack.lock())
# print("turnOn: %s" % lpack.turnOn())

def retryConnect(func_to_decorate):
    def new_func(*original_args, **original_kwargs):
        # check reconnect
        while True:
            try:
                return func_to_decorate(*original_args, **original_kwargs)
            except :
                print("CONNECTION ERROR, RETRYING...")
                lpack.connect()
                time.sleep(5)
                # return func_to_decorate(*original_args, **original_kwargs)
        
    return new_func

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

    return status

@retryConnect
def getMode():
    return lpack.getMode().rstrip()

# setpersistonunlock on para que quede el mismo, off para cambiar