const bluetooth = require('node-bluetooth');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();
device.listPairedDevices((devices) => {
    const carDevice = devices.filter(device => device.name = 'HC-06')[0];
    console.info('Found:', carDevice);

    const address = carDevice.address;
    console.info(address);
    device.findSerialPortChannel(address, function (channel) {
        console.log('Found RFCOMM channel for serial port on %s: ', name, channel);

        // make bluetooth connect to remote device
        bluetooth.connect(address, channel, function (err, connection) {
            if (err) return console.error(err);
            console.info('Connected!')
            // connection.write(new Buffer('Hello!', 'utf-8'));
        });
    });
});
