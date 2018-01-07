/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            i: moduleId,
            /******/            l: false,
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/                configurable: false,
                /******/                enumerable: true,
                /******/                get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
            /******/            function getDefault() {
                return module['default'];
            } :
            /******/            function getModuleExports() {
                return module;
            };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 2);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";


        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.raw = raw;
        exports.normalise = normalise;
        exports.axial = axial;
        exports.radial = radial;
        exports.way8 = way8;
        exports.way4 = way4;
        exports.vertical = vertical;
        exports.horizontal = horizontal;

        function raw(scalar) {
            return scalar;
        }

        function normalise(scalar) {
            var deadzone = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (scalar === 0) {
                return scalar;
            }

            var absScalar = Math.abs(scalar);
            var normalised = (absScalar - deadzone) / (1 - deadzone);

            return scalar < 0 ? -normalised : normalised;
        }

        function axial(scalar) {
            var deadzone = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var post = arguments.length <= 2 || arguments[2] === undefined ? raw : arguments[2];

            var magnitude = Math.sqrt(scalar * scalar);

            if (magnitude <= deadzone) {
                return 0;
            }

            if (magnitude > 1) {
                return scalar < 0 ? -1 : 1;
            }

            return scalar < 0 ? -post(magnitude, deadzone) : post(magnitude, deadzone);
        }

        function radial(coord) {
            var deadzone = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var post = arguments.length <= 2 || arguments[2] === undefined ? raw : arguments[2];

            var angle = Math.atan2(coord.y, coord.x);
            var magnitude = Math.sqrt(coord.x * coord.x + coord.y * coord.y);

            if (magnitude <= deadzone) {
                return {x: 0, y: 0};
            }

            if (magnitude > 1) {
                magnitude = 1;
            }

            return {
                x: Math.cos(angle) * post(magnitude, deadzone),
                y: Math.sin(angle) * post(magnitude, deadzone)
            };
        }

        function snapToRadian(coord, deadzone, axes) {
            var post = arguments.length <= 3 || arguments[3] === undefined ? raw : arguments[3];

            var angle = Math.atan2(coord.y, coord.x);
            var snapRadians = Math.PI / axes;
            var newAngle = snapRadians * Math.round(angle / snapRadians);
            var magnitude = Math.sqrt(coord.x * coord.x + coord.y * coord.y);

            if (magnitude <= deadzone) {
                return {x: 0, y: 0};
            }

            if (magnitude > 1) {
                magnitude = 1;
            }

            return {
                x: Math.cos(newAngle) * post(magnitude, deadzone),
                y: Math.sin(newAngle) * post(magnitude, deadzone)
            };
        }

        function way8(coord) {
            var deadzone = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var post = arguments.length <= 2 || arguments[2] === undefined ? raw : arguments[2];

            return snapToRadian(coord, deadzone, 4, post);
        }

        function way4(coord) {
            var deadzone = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var post = arguments.length <= 2 || arguments[2] === undefined ? raw : arguments[2];

            return snapToRadian(coord, deadzone, 2, post);
        }

        function vertical(coord, deadzone) {
            var post = arguments.length <= 2 || arguments[2] === undefined ? raw : arguments[2];

            return {
                x: 0,
                y: snapToRadian(coord, deadzone, 2, post).y
            };
        }

        function horizontal(coord, deadzone) {
            var post = arguments.length <= 2 || arguments[2] === undefined ? raw : arguments[2];

            return {
                x: snapToRadian(coord, deadzone, 2, post).x,
                y: 0
            };
        }

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports) {

        module.exports = {
            "deadZones": {
                "Xbox 360 Wired Controller": {
                    "left-stick": 0.24,
                    "right-stick": 0.27,
                    "left-trigger": 0.12,
                    "right-trigger": 0.12
                }, "RetroLink": {"left-stick": 0.2, "right-stick": 0.2, "left-trigger": 0.1, "right-trigger": 0.1}
            },
            "Xbox 360 Wired Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)-standard": {
                "deadZone": "Xbox 360 Wired Controller",
                "axes": [{"id": "left-stick", "prop": "x"}, {"id": "left-stick", "prop": "y"}, {
                    "id": "right-stick",
                    "prop": "x"
                }, {"id": "right-stick", "prop": "y"}],
                "buttons": ["face-bottom", "face-right", "face-left", "face-top", "left-shoulder", "right-shoulder", "left-trigger", "right-trigger", "select-back", "start-forward", "left-stick-button", "right-stick-button", "up", "down", "left", "right", "home"]
            },
            "45e-28e-Xbox 360 Wired Controller-": {
                "deadZone": "Xbox 360 Wired Controller",
                "axes": [{"id": "left-stick", "prop": "x"}, {
                    "id": "left-stick",
                    "prop": "y"
                }, {"id": "left-trigger"}, {"id": "right-stick", "prop": "x"}, {
                    "id": "right-stick",
                    "prop": "y"
                }, {"id": "right-trigger"}],
                "buttons": ["up", "down", "left", "right", "start-forward", "select-back", "left-stick-button", "right-stick-button", "left-shoulder", "right-shoulder", "home", "face-bottom", "face-right", "face-left", "face-top"]
            },
            "Generic   USB  Joystick   (STANDARD GAMEPAD Vendor: 0079 Product: 0006)-standard": {
                "description": "RetroLink gamecube Controller",
                "deadZone": "RetroLink",
                "axes": [{"id": "right-stick", "prop": "x"}, {"id": "right-stick", "prop": "y"}, {
                    "id": "left-stick",
                    "prop": "x"
                }, {"id": "left-stick", "prop": "y"}],
                "buttons": ["face-top", "face-right", "face-bottom", "face-left", "left-trigger", "right-trigger", "right-shoulder", "unknown", "unknown", "home", "unknown", "unknown", "up", "down", "left", "right"]
            },
            "standard": {
                "deadZone": "Xbox 360 Wired Controller",
                "axes": [{"id": "left-stick", "prop": "x"}, {"id": "left-stick", "prop": "y"}, {
                    "id": "right-stick",
                    "prop": "x"
                }, {"id": "right-stick", "prop": "y"}],
                "buttons": ["face-bottom", "face-right", "face-left", "face-top", "left-shoulder", "right-shoulder", "left-trigger", "right-trigger", "select-back", "start-forward", "left-stick-button", "right-stick-button", "up", "down", "left", "right", "home"]
            }
        }

        /***/
    }),
    /* 2 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        Object.defineProperty(__webpack_exports__, "__esModule", {value: true});
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0_gamepad_api_mappings__ = __webpack_require__(3);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0_gamepad_api_mappings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gamepad_api_mappings__);


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
            let deviceMap = Object(__WEBPACK_IMPORTED_MODULE_0_gamepad_api_mappings__["getMapping"])(gamepad.id, gamepad.mapping);
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

        /***/
    }),
    /* 3 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";


        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.axialVector = axialVector;
        exports.getDeadzoneAlgorithm = getDeadzoneAlgorithm;
        var getMapping = exports.getMapping = __webpack_require__(4).getMapping;
        var deadZones = exports.deadZones = __webpack_require__(1).deadZones;

        var raw = exports.raw = __webpack_require__(0).raw;
        var normalise = exports.normalise = __webpack_require__(0).normalise;
        var normalize = exports.normalize = __webpack_require__(0).normalise;

        var axial = exports.axial = __webpack_require__(0).axial;
        var radial = exports.radial = __webpack_require__(0).radial;
        var way8 = exports.way8 = __webpack_require__(0).way8;
        var way4 = exports.way4 = __webpack_require__(0).way4;
        var vertical = exports.vertical = __webpack_require__(0).vertical;
        var horizontal = exports.horizontal = __webpack_require__(0).horizontal;

        var postMapping = {
            'raw': raw,
            'normalised': normalise,
            'normalized': normalize
        };

        function axialVector(coord, deadzone, post) {
            return {
                x: axial(coord.x, deadzone, post),
                y: axial(coord.y, deadzone, post)
            };
        }

        var algorithms = {
            'axial': axialVector,
            'radial': radial,
            '8-way': way8,
            '4-way': way4,
            'horizontal': horizontal,
            'vertical': vertical
        };

        function build(algorithm) {
            var mapper = arguments.length <= 1 || arguments[1] === undefined ? postMapping.normalised : arguments[1];

            return function applyAlgorithmAndMapping(coord, deadzone) {
                return algorithm(coord, deadzone, mapper);
            };
        }

        function getDeadzoneAlgorithm(algorithm, mapper) {
            return build(algorithms[algorithm], postMapping[mapper]);
        }

        /***/
    }),
    /* 4 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";


        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.getMapping = getMapping;
        var mappingTable = __webpack_require__(1);

        function getMapping(id, mapping) {

            var deviceMap = mappingTable[id + '-' + mapping];
            if (!deviceMap) {
                deviceMap = mappingTable[mapping];
            }
            if (!deviceMap) {
                deviceMap = mappingTable.standard;
            }

            return deviceMap;
        }

        /***/
    })
    /******/]);