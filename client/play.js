import {getMapping} from 'gamepad-api-mappings';

let $d = document.createElement('div'); // fake, overwritten

const MAX_POWER = 12;
const DEAD_AXIS = 0.05;

window.addEventListener('load', () => {
    $d = document.querySelector('#debug');
    debug('waiting for gamepad...');

    let check = setInterval(() => {
        let gamepads = window.navigator.getGamepads();
        if (!gamepads.length) return; //ffox no gamepad
        if (gamepads[0] === null) return; // chrome no gamepaD
        clearInterval(check);
        debug('gamepad detected !');
        gmap();
    }, 1000);

});

const debug = (text) => {
    const $line = document.createElement('div');
    $line.innerText = text;
    $d.appendChild($line);
};

const gmap = () => {
    let gamepad = window.navigator.getGamepads()[0];
    const deadZonesTable = [];
    console.log(gamepad);

    let deviceMap = getMapping(gamepad.id, gamepad.mapping);
    let deadZones = deadZonesTable[deviceMap.deadZone];
    console.log(deviceMap)
    listen();
};

const listen = () => {
    let gamepad = window.navigator.getGamepads()[0];
    let deviceMap = getMapping(gamepad.id, gamepad.mapping);
    gamepad.buttons.forEach((b, i) => {
        if (b.pressed === true) {
            debug(`${deviceMap.buttons[i]} is down`);
        }
    });
    setTimeout(() => listen(), 200);
};

const cords = document.getElementById('cords');
const line = document.getElementById('line');
const wheelLBar = document.getElementById('wheelL');
const wheelRBar = document.getElementById('wheelR');

let prevAxes = [];
setInterval(() => {
    const gamepad = window.navigator.getGamepads()[0];

    if (prevAxes != gamepad.axes) {
        cords.innerHTML = JSON.stringify(gamepad.axes, null, ' ');
        prevAxes = gamepad.axes;

        let xAxis = gamepad.axes[0];
        let yAxis = gamepad.axes[1];

        if (Math.abs(xAxis) <= DEAD_AXIS) {
            xAxis = 0;
        }
        if (Math.abs(yAxis) <= DEAD_AXIS) {
            yAxis = 0;
        }
        line.style.display = xAxis == 0 && yAxis == 0 ? 'none' : '';

        const x1 = 50 - 50 * xAxis / 2;
        const x2 = 50 + 50 * xAxis / 2;
        const y1 = 50 - 50 * yAxis / 2;
        const y2 = 50 + 50 * yAxis / 2;
        line.setAttribute('x1', x1);
        line.setAttribute('x2', x2);
        line.setAttribute('y1', y1);
        line.setAttribute('y2', y2);

        const moveData = getWheels(xAxis, yAxis);
        cords.innerHTML += '\n' + JSON.stringify(moveData);
        console.info(moveData);

        const lBarHeight = -moveData.left / MAX_POWER * 50;
        wheelLBar.setAttribute('height', Math.abs(lBarHeight));
        const rBarHeight = -moveData.right / MAX_POWER * 50;
        wheelRBar.setAttribute('height', Math.abs(rBarHeight));
        wheelLBar.setAttribute('y', 50 - Math.max(0, lBarHeight));
        wheelRBar.setAttribute('y', 50 - Math.max(0, rBarHeight));

        $.ajax(`/move/${moveData.wheelL},${moveData.wheelR}`);
    }
}, 1);


function toWheelValue(axisValue) {
    if (axisValue == 0) {
        return 0;
    }
    return (axisValue < 0 ? 32 - axisValue : 64 + axisValue);
}

function getWheels(x, y) {
    let left = y * MAX_POWER;
    let right = y * MAX_POWER;
    if (Math.abs(y) <= DEAD_AXIS * 3) {
        left = x * MAX_POWER;
        right = -x * MAX_POWER;
    } else {
        if (x < 0) {
            left += x * MAX_POWER;
        } else {
            right -= x * MAX_POWER;
        }
    }

    left = left | 0;
    right = right | 0;
    const wheelL = toWheelValue(left);
    const wheelR = toWheelValue(right);

    return {left, right, wheelL, wheelR};
}

// function getWheels(x, y) {
//     let wheelR, wheelL;
//     if (x > 0) {
//         wheelR = (x*12 | 0) + 32;
//         wheelL = (x*12 | 0) + 64;
//     } else {
//         wheelR = (x*12 | 0) + 64;
//         wheelL = (x*12 | 0) + 32;
//     }
//
//     return {wheelL, wheelR};
// }