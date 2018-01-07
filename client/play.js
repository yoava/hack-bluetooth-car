import {getMapping} from 'gamepad-api-mappings';

const $d = document.getElementById('debug'); // fake, overwritten

const MAX_POWER = 12;
const MINIMAL_MOVE_AXIS = 0.05;
const MINIMAL_TURN_AXIS = 0.25;

window.addEventListener('load', () => {
    debug('waiting for gamepad...');

    let check = setInterval(() => {
        let gamepads = window.navigator.getGamepads();
        if (!gamepads.length) return; //ffox no gamepad
        if (gamepads[0] === null) return; // chrome no gamepaD
        clearInterval(check);
        debug('gamepad detected !');
    }, 100);

});

const debug = (text) => {
    $d.innerHTML = text;
};

const stats = document.getElementById('stats');
const line = document.getElementById('line');
const wheelLBar = document.getElementById('wheelL');
const wheelRBar = document.getElementById('wheelR');

let prevAxes;
let prevButtons;
setInterval(() => {
    const gamepad = window.navigator.getGamepads()[0];

    // get buttons
    let deviceMap = getMapping(gamepad.id, gamepad.mapping);
    const buttons = {};
    gamepad.buttons.forEach((b, i) => {
        if (b.pressed === true) {
            buttons[deviceMap.buttons[i]] = true;
        }
    });
    const buttonsJSON = JSON.stringify(buttons);

    if (prevAxes != gamepad.axes || prevButtons != buttonsJSON) {
        prevAxes = gamepad.axes;
        prevButtons = buttonsJSON;

        let xAxis = gamepad.axes[0];
        let yAxis = gamepad.axes[1];
        if (buttons.left) {
            xAxis = -1;
        } else if (buttons.right) {
            xAxis = 1;
        }
        if (buttons.up) {
            yAxis = -1;
        } else if (buttons.down) {
            yAxis = 1;
        }
        if (Math.abs(xAxis) <= MINIMAL_MOVE_AXIS) {
            xAxis = 0;
        }
        if (Math.abs(yAxis) <= MINIMAL_MOVE_AXIS) {
            yAxis = 0;
        }
        line.style.display = xAxis == 0 && yAxis == 0 ? 'none' : '';

        // update arrow
        const x1 = 50 - 50 * xAxis / 2;
        const x2 = 50 + 50 * xAxis / 2;
        const y1 = 50 - 50 * yAxis / 2;
        const y2 = 50 + 50 * yAxis / 2;
        line.setAttribute('x1', x1);
        line.setAttribute('x2', x2);
        line.setAttribute('y1', y1);
        line.setAttribute('y2', y2);

        const moveData = getWheels(xAxis, yAxis);
        stats.innerHTML = 'axis = ' + JSON.stringify({
                l: {
                    x: gamepad.axes[0].toFixed(4),
                    y: gamepad.axes[1].toFixed(4),
                },
                r: {
                    x: gamepad.axes[2].toFixed(4),
                    y: gamepad.axes[3].toFixed(4),
                }
            })
            + '\nbuttons = ' + buttonsJSON
            + '\nmotors = ' + JSON.stringify(moveData);

        console.info(moveData);

        // update engine bars
        const lBarHeight = -moveData.left / MAX_POWER * 50;
        wheelLBar.setAttribute('height', Math.abs(lBarHeight));
        const rBarHeight = -moveData.right / MAX_POWER * 50;
        wheelRBar.setAttribute('height', Math.abs(rBarHeight));
        wheelLBar.setAttribute('y', 50 - Math.max(0, lBarHeight));
        wheelRBar.setAttribute('y', 50 - Math.max(0, rBarHeight));
        wheelLBar.style.fill = Math.abs(lBarHeight) > 50 ? 'red' : 'black';
        wheelRBar.style.fill = Math.abs(rBarHeight) > 50 ? 'red' : 'black';

        $.ajax(`/move/${moveData.wheelL},${moveData.wheelR}`);
    }
}, 25);


function toWheelValue(axisValue) {
    if (axisValue == 0) {
        return 0;
    }
    return (axisValue < 0 ? 32 - axisValue : 64 + axisValue);
}

function getDir(x) {
    if (x < -MINIMAL_TURN_AXIS) {
        return -1;
    } else if (x > MINIMAL_TURN_AXIS) {
        return 1;
    } else {
        return 0;
    }
}

function getWheels(x, y) {
    const power = Math.min(Math.sqrt(x * x + y * y), 1) * MAX_POWER | 0;
    let dirX = getDir(x);
    let dirY = getDir(y);

    let left = 0;
    let right = 0;
    if (dirX == 0) {
        left = dirY * power;
        right = dirY * power;
    } else if (dirY == 0) {
        left = -dirX * power;
        right = dirX * power;
    } else {
        if (dirX < 0) {
            right = dirY * power;
        } else {
            left = dirY * power;
        }
    }

    const wheelL = toWheelValue(left);
    const wheelR = toWheelValue(right);

    return {power, dirX, dirY, left, right, wheelL, wheelR};
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