# 
# Configuration of zones placement for ultrawide
# @2560x1080

import lightpack, time
import ctypes
user32 = ctypes.windll.user32
lpack = lightpack.lightpack('127.0.0.1', 3636, list(range(50)),'{c2ef0ccd-dd8a-4e25-8ab3-8d17ce25b20c}' )

print("Width =", user32.GetSystemMetrics(0))
print("Height =", user32.GetSystemMetrics(1))

def setleds(totleds,ledsx,ledsy,screenWidth,screenHeigth,xMargin,yMargin,sidesWidth,topBotHeigth):
    maxwidth=user32.GetSystemMetrics(0)
    maxheight=user32.GetSystemMetrics(1)
    lpack.connect()

    print("Lock: %s" % lpack.lock())
    
    # sets de x
    # print(maxwidth,maxwidth-xMargin*2,round((maxwidth-xMargin*2)/ledsx))
    # print(maxheight,ledsy,round((maxheight-yMargin*2)/ledsy))


    xWidth=round((maxwidth-xMargin*2)/ledsx)

    arr=[None] * totleds
    x,y=0+xMargin,screenHeigth
    w,h=xWidth,topBotHeigth

    # set xleds- 1 al 9
    for i in range(9,0,-1):
        tmp= str((i)) +"-"+str(x)+","+str(y)+","+str(w)+","+str(h)+";"
        x=x+w
        arr[i-1]=tmp

    # "43 al 50"
    for i in range(50,42,-1):
        tmp= str((i)) +"-"+str(x)+","+str(y)+","+str(w)+","+str(h)+";"
        x=x+w
        arr[i-1]=tmp

    # set xleds+ 18 al 34
    x,y=0+xMargin,0
    for i in range(18,36):
        tmp= str((i)) +"-"+str(x)+","+str(y)+","+str(w)+","+str(h)+";"
        x=x+w
        arr[i-1]=tmp

    # sets y
    # sets y- 10 al 17
    # 8
    x,y=0+xMargin,94
    w,h=384,108

    for i in range(17,9,-1):
        tmp= str((i)) +"-"+str(x)+","+str(y)+","+str(w)+","+str(h)+";"
        y=y+h
        arr[i-1]=tmp

    # sets y+ 35 al 42
    x,y=screenWidth-xMargin,94
    w,h=384,108

    for i in range(35,43):
        tmp= str((i)) +"-"+str(x)+","+str(y)+","+str(w)+","+str(h)+";"
        y=y+h
        arr[i-1]=tmp
        

    # print(arr)
    cmd=""
    for z in range(0,50):
        # print(z)
        cmd+=arr[z]
    # print(cmd)
    lpack.setLeds(cmd)


    lpack.disconnect()

# videos with sidebars
# setleds(50,17,8,2176,905,320,94,384,175)

#full screen capture
setleds(50,17,8,2176,905,0,94,384,175)

