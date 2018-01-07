const express = require('express');
const app = express();
const SerialPort = require('serialport');

let wheelL = 0;
let wheelR = 0;

const port = new SerialPort('/dev/tty.HC-06-DevB', {
    baudRate: 9600
}, function (err) {
    if (err) {
        reopen();
        return console.log('Error opening port: ', err);
    }
    console.info('Connected')
    setInterval(function () {
        port.write(new Buffer([15, wheelR, wheelL, 127, 0]), function (err) {
            if (err) {
                //
                // setTimeout(() => port.open(), 500);
                if (err.disconnected) {
                    reopen();
                }
                return console.log('Error on write: ', err.message);
            }
        });

    }, 50);
});

function reopen() {
    console.info('reopen...');
    port.open((e) => {
        if (e) {
            if (e.message === 'Already open') {
                console.info('Closing');
                port.close(() => {
                    console.info('Closed')
                    reopen();
                });
            } else {
                setTimeout(reopen, 100);
            }
        } else {
            console.info('Connected');
        }
    });
}

port.on('data', function (data) {
    console.log('Data:', data);
});

// Open errors will be emitted as an error event
port.on('error', function () {
    console.log('error event: ', arguments);
});


app.get('/move/:left,:right', (req, res) => {
    wheelL = parseInt(req.params.left);
    wheelR = parseInt(req.params.right);
    res.json({wheelL, wheelR});
});
app.use(express.static('client'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));