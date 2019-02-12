Website for controlling Prismatik in Lightpack projects (Work in progress)
---------

*Python Flask backend that comunicates with  [psieg Prismatiks](https://github.com/psieg/Lightpack/releases) telnet api (Version 5.11.2.19)*




**Lightpack** is a fully open-source and simple hardware implementation of the backlight for any computer. It's a USB content-driven ambient lighting system.

**Prismatik** is an open-source software we buid to control Lightpack devices. It grabs the screen, analyzes the picture,
calculates resulting colors, and provides soft and gentle lighting with a Lightpack device. Moreover, you can
handle other devices with Prismatik such as Adalight, Ardulight, or even Alienware LightFX system.

##### Main Features:
* Fully open-source under GPLv3
* Attemps to reconnect when socket dies
* Web interface for changing profiles, modes, smooth and brigthness


#### Build instructions(still in progress):
Clone proyect
Create a virtual environment(optional)
Install Flask  
Run proyect (flask run)

####TODO
*modes and profiles working*
*statick color picker not working*
*brightness working*
*nedst to be compiled*
*connection settings still harcoded*