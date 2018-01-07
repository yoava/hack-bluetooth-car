## links ##############################
- https://decyborg.wordpress.com/2013/09/08/bluetooth-serial-communication-with-arduino-jy-mcu-bluetooth-and-macbook-pro/
- http://www.martyncurrey.com/arduino-and-hc-06-zs-040/

## TODO ###########

chrome:
- Enable "Experimental Web Platform Features:
    chrome://flags/#enable-experimental-web-platform-features
 
## device info:
name: HC-06
address: 71-a9-01-12-c4-a5
services: JL_A2DP, JL_A2DP, JL_HID + 3 more


## x/y value ##############################
- forward: 32+0 to 32+15 (47) (20 to 2f)
- backward: 64+0 to 64+15 (79) (40 to 4f)
     
## command ##############################
```js
new Buffer(15, x, y, 127, 0)
// <Buffer 0f x y 7f 00>
```

```bash
#\x0f\x00\x00\x7f\x00
echo -n -e '\x0f\x00\x00\x7f\x00' > /dev/tty.HC-06-DevB
```

"xbox-controller": "^0.7.0"
"better-xbox-controller": "^0.1.3",
"gamecontroller": "0.0.2",
"node-hid": "^0.7.0",
