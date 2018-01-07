const SerialPort = require('serialport');
const port = new SerialPort('/dev/tty.HC-06-DevB', {
    baudRate: 9600
}, function (err) {
    if (err) {
        return console.log('Error opening port: ', err);
    }

    let x = 0;
    let y = 0;

    setInterval(function () {
        x++;
        if (x == 32 + 16) {
            x = 32;
            y = 32 + (y + 1) % 16;
        }

        console.info('x=', x, 'y=', y);
        port.write(new Buffer([15, x, y, 127, 0]), function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
            // port.close((e) => console.info('Port closed', e));
        });

    }, 500);

});

port.on('data', function (data) {
    console.log('Data:', data);
});

// Open errors will be emitted as an error event
port.on('error', function () {
    console.log('error event: ', arguments);
});
