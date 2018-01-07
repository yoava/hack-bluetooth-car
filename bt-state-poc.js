const bluetooth = require('bluetooth');

bluetooth.isOn().then(state => {
    console.log(state);
    //=> false
});

bluetooth.on().then(state => {
    console.log('Bluetooth state changed to on');
});

bluetooth.off().then(state => {
    console.log('Bluetooth state changed to off');
});

bluetooth.toggle().then(state => {
    console.log('Bluetooth state changed to on');
});
