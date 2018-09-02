/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getModuleNamespace;
/**
 * Get the Module name from a Synergy query/DOM element
 * 
 * @param {*} query 
 * @param {Bool} strict
 */
function getModuleNamespace(query) {
    var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (query instanceof HTMLElement) {
        if (query.closest('[data-module]')) {
            return query.closest('[data-module]').getAttribute('data-module');
        }

        if (query.classList.length) {
            if (strict) {
                return query.classList[0].split(/-(.+)/)[0].split(/_(.+)/)[0];
            }

            return query.classList[0].split(/-(.+)/)[0];
        }
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = polymorph;

var _hasModifier = __webpack_require__(2);

var _hasModifier2 = _interopRequireDefault(_hasModifier);

var _getComponents = __webpack_require__(3);

var _getComponents2 = _interopRequireDefault(_getComponents);

var _getModuleNamespace = __webpack_require__(0);

var _getModuleNamespace2 = _interopRequireDefault(_getModuleNamespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Set a module's styles on a DOM element instance
 * 
 * @param {*} element 
 * @param {*} styles 
 * @param {*} globals 
 * @param {*} config 
 * @param {*} parentElement 
 */
function polymorph(element, styles, config, globals, parentElement) {
    var values = (typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) === 'object' ? styles : styles(element, config, globals);

    if (values.constructor === Array) {
        if (values.every(function (value) {
            return value.constructor == Object;
        })) {
            values.forEach(function (value) {
                return polymorph(element, value, false, globals);
            });
        }
    }

    var stylesDidMount = new Event('stylesdidmount');
    var moduleDidRepaint = new Event('moduledidrepaint');

    // initialise data interface
    element.data = element.data || { states: [] };

    // determine parent element
    parentElement = parentElement || element;

    // attach repaint methods to parent element
    if (element === parentElement && config !== false) {
        parentElement.repaint = function () {
            element.style.cssText = null;

            polymorph(parentElement, (typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) === 'object' ? styles : styles(element, config, globals), false, globals);

            parentElement.dispatchEvent(moduleDidRepaint);
        };
    }

    var _loop = function _loop(key, value) {
        var subComponent = [].concat(_toConsumableArray(element.querySelectorAll('[class*="_' + key + '"]'))).filter(function (subComponent) {
            return [].concat(_toConsumableArray(subComponent.classList)).some(function (className) {
                return className.indexOf((0, _getModuleNamespace2.default)(parentElement)) === 0;
            });
        });

        if (typeof value === 'function' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            if (key.indexOf('modifier(') > -1) {
                var modifier = key.replace('modifier(', '').replace(/\)/g, '');

                if ((0, _hasModifier2.default)({ element: element, modifier: modifier, modifierGlue: '-' })) {
                    polymorph(element, value, false, globals, parentElement);
                }
            } else if (key === 'group' || key === 'wrapper') {
                // @TODO this currently runs for each item in the group/wrapper,
                // should ideally run just once per group/wrapper
                element.parentNode.classList.forEach(function (className) {
                    if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                        // apply styles to wrapper/group element
                        polymorph(element.parentNode, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? value : value(element.parentNode), false, globals, parentElement);
                        // apply styles to child modules
                        polymorph(element, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? value : value(element)[element.getAttribute('data-module')], false, globals, parentElement);
                    }
                });

                return {
                    v: void 0
                };
            }

            // if target element contains child components matching `key`
            // @TODO be more transparent, don't depend upon the below logic
            // being indictative of the desired condition
            else if ((0, _getComponents2.default)({ element: element, componentName: key, componentGlue: '_' }).length) {
                    (0, _getComponents2.default)({ element: element, componentName: key, componentGlue: '_' }).forEach(function (_component) {
                        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                            polymorph(_component, value, false, globals, parentElement);
                        } else if (typeof value === 'function') {
                            // @TODO getParameterNames(value), pass to `value(...)`
                            polymorph(_component, value(_component), false, globals, parentElement);
                        }
                    });
                } else if (subComponent.length) {
                    [].concat(_toConsumableArray(subComponent)).forEach(function (query) {
                        return polymorph(query, value, false, globals, parentElement);
                    });
                } else if (key === ':hover') {
                    var hoverState = JSON.stringify(value);

                    if (!element.data.states.includes(hoverState)) {
                        element.data.states.push(hoverState);

                        element.addEventListener('mouseenter', function mouseEnter() {
                            polymorph(element, value, false, globals, parentElement);

                            element.removeEventListener('mouseenter', mouseEnter);
                        }, false);

                        element.addEventListener('mouseleave', function mouseLeave() {
                            element.removeEventListener('mouseleave', mouseLeave);

                            element.data.states = element.data.states.filter(function (item) {
                                return item !== hoverState;
                            });

                            parentElement.repaint();
                        }, false);
                    }
                } else if (value instanceof Array) {
                    if (value[0] instanceof HTMLElement) {
                        polymorph(value[0], value[1], false, globals, parentElement);
                    }
                } else if (typeof value === 'function') {
                    element.style[key] = value(element.style[key]);
                } else {}
        } else {
            element.style[key] = value;
        }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            var _ret = _loop(key, value);

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (element === parentElement && config !== false) {
        element.dispatchEvent(stylesDidMount);
    }
}

polymorph.modifier = _hasModifier2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hasModifier;

var _getModuleNamespace = __webpack_require__(0);

var _getModuleNamespace2 = _interopRequireDefault(_getModuleNamespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function hasModifier(_ref) {
    var element = _ref.element,
        namespace = _ref.namespace,
        modifier = _ref.modifier,
        modifierGlue = _ref.modifierGlue;

    var matches = [];

    matches.push.apply(matches, _toConsumableArray([].concat(_toConsumableArray(element.classList)).filter(function (className) {
        return className.indexOf(namespace || (0, _getModuleNamespace2.default)(element)) === 0;
    }).map(function (target) {
        return target.split(modifierGlue).slice(1);
    })[0]));

    return matches.includes(modifier);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getComponents;

var _getModuleNamespace = __webpack_require__(0);

var _getModuleNamespace2 = _interopRequireDefault(_getModuleNamespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @param {*} componentName 
 */
function getComponents(_ref) {
    var _ref2;

    var element = _ref.element,
        _ref$componentName = _ref.componentName,
        componentName = _ref$componentName === undefined ? '' : _ref$componentName,
        modifier = _ref.modifier,
        namespace = _ref.namespace,
        componentGlue = _ref.componentGlue;

    var query = (namespace || (0, _getModuleNamespace2.default)(element, 'strict')) + (componentName ? componentGlue + componentName : '');

    return (_ref2 = []).concat.apply(_ref2, _toConsumableArray([].concat(_toConsumableArray(element.querySelectorAll('[class*="' + query + '"]'))).filter(function (component) {
        return [].concat(_toConsumableArray(component.classList)).some(function (className) {
            var isComponent = className.split(componentGlue).length - 1 === 1;
            var isQueryMatch = className.indexOf(query) === 0;

            if (modifier) {
                return isQueryMatch && isComponent && className.indexOf(modifier) > -1;
            } else {
                return isQueryMatch && isComponent;
            }
        });
    })));
}

/***/ })
/******/ ]);