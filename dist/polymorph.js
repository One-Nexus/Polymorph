(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/utilities/isValidCssProperty.js
/**
 * Determine if a string is a valid CSS property
 * 
 * @param {String} query
 */
function isValidCssProperty(query) {
  var el = document.createElement('div');
  el.style[query] = 'initial';
  return !!el.style.cssText;
}
// CONCATENATED MODULE: ./src/utilities/stringifyState.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Stringify a polymorph state
 * 
 * @see https://stackoverflow.com/a/48254637/2253888
 * 
 * @param {Object} state 
 */
/* harmony default export */ var stringifyState = (function (state) {
  var cache = new Set();
  return JSON.stringify(state, function (key, value) {
    // Do not attempt to serialize DOM elements as the bloat causes browser to crash
    if (value instanceof HTMLElement) {
      value = '[HTMLElement]';
    }

    if (_typeof(value) === 'object' && value !== null) {
      if (cache.has(value)) {
        // Circular reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (err) {
          // discard key if value cannot be deduped
          return;
        }
      } // Store value in our set


      cache.add(value);
    }

    return value;
  });
});
;
// CONCATENATED MODULE: ./src/polymorph.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return polymorph; });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function polymorph_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { polymorph_typeof = function _typeof(obj) { return typeof obj; }; } else { polymorph_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return polymorph_typeof(obj); }



/**
 * Set a module's styles on a DOM element instance
 */

function polymorph(element) {
  var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = arguments.length > 2 ? arguments[2] : undefined;
  var globals = arguments.length > 3 ? arguments[3] : undefined;
  var parentElement = arguments.length > 4 ? arguments[4] : undefined;
  var specificity = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (typeof sQuery === 'undefined') {
    return console.error('Polymorph requires the sQuery libray');
  }

  var values = polymorph_typeof(styles) === 'object' ? styles : styles(element, config, globals);
  var componentGlue = config && config.componentGlue || window.Synergy && Synergy.componentGlue || '_';
  var modifierGlue = config && config.modifierGlue || window.Synergy && Synergy.modifierGlue || '-';
  /**
   * Setup `repaint` method on parent element
   */

  if (!parentElement && !element.repaint) {
    element.repaint = function (custom) {
      /**
       * Merge default + custom options
       */
      var options = Object.assign({
        clean: false
      }, custom);
      /**
       * Get child components
       */

      var components = sQuery.getComponents.bind({
        DOMNodes: element,
        componentGlue: componentGlue,
        modifierGlue: modifierGlue,
        parentElement: element
      })();
      /**
       * Get child sub-components
       */

      var subComponents = sQuery.getSubComponents.bind({
        DOMNodes: element,
        componentGlue: componentGlue,
        modifierGlue: modifierGlue,
        parentElement: element
      })();
      /**
       * Remove styles that were not added by polymorph
       */

      if (options.clean) {
        element.style.cssText = null;
        components.forEach(function (component) {
          return component.style.cssText = null;
        });
      }
      /**
       * Clean parent element/module
       */


      element.data && Object.keys(element.data.properties).forEach(function (property) {
        element.style[property] = null;
      });
      element.data.properties = {};
      /**
       * Clean child components
       */

      components.forEach(function (component) {
        component.data && Object.keys(component.data.properties).forEach(function (property) {
          component.style[property] = null;
        });
        component.data = null;
      });
      /**
       * Clean child sub-components
       */

      subComponents.forEach(function (component) {
        component.data && Object.keys(component.data.properties).forEach(function (property) {
          component.style[property] = null;
        });
        component.data = null;
      });
      /**
       * Repaint the module
       */

      polymorph(element, styles, config, globals);

      if (element.repaint.states.length) {
        element.repaint.states.forEach(function (style) {
          return style();
        });
      }

      element.dispatchEvent(new Event('moduledidrepaint'));
    };

    element.repaint.states = [];
  }
  /**
   * Handle array of top-level rule sets/stylesheets
   */


  if (styles.constructor === Array) {
    return styles.forEach(function (stylesheet) {
      return polymorph(element, stylesheet, config, globals, parentElement, specificity);
    });
  }
  /**
   * Handle array of object values for cascading effect
   */


  if (values.constructor === Array) {
    if (values.every(function (value) {
      return value.constructor == Object;
    })) {
      values.forEach(function (value) {
        return polymorph(element, value, false, globals);
      });
    }
  }
  /**
   * Initialise data interface
   */


  element.data = element.data || {
    states: [],
    properties: {}
  };
  /**
   * Determine the parent element/module
   */

  parentElement = parentElement || element;
  /**
   * Loop through rule set
   */

  var _arr = Object.entries(values);

  var _loop = function _loop() {
    var _arr$_i = _slicedToArray(_arr[_i], 2),
        key = _arr$_i[0],
        value = _arr$_i[1];

    var matchedComponents = sQuery.getComponents.bind({
      DOMNodes: element,
      componentGlue: componentGlue,
      modifierGlue: modifierGlue,
      parentElement: parentElement
    })(key);
    var matchedSubComponents = sQuery.getSubComponents.bind({
      DOMNodes: element,
      componentGlue: componentGlue,
      modifierGlue: modifierGlue,
      parentElement: parentElement
    })(key);
    /**
     * Handle object of CSS properties / function that will return an object
     * of CSS properties
     */

    if (typeof value === 'function' || polymorph_typeof(value) === 'object') {
      /**
       * Handle case where desired element for styles to be applied needs to be
       * manually controlled
       */
      if (value instanceof Array) {
        if (value[0] instanceof HTMLElement) {
          polymorph(value[0], value[1], false, globals, parentElement, specificity);
        }

        if (value[0] instanceof NodeList) {
          value[0].forEach(function (node) {
            return polymorph(node, value[1], false, globals, parentElement, specificity);
          });
        }
      }
      /**
       * Handle `modifiers`
       */
      else if (key.indexOf('modifier(') > -1) {
          var modifier = key.replace('modifier(', '').replace(/\)/g, '');

          if (sQuery.hasModifier.bind({
            DOMNodes: element,
            componentGlue: componentGlue,
            modifierGlue: modifierGlue
          })(modifier)) {
            specificity++;
            polymorph(element, value, false, globals, parentElement, specificity);
          }
        }
        /**
         * Smart handle `components`
         */
        else if (matchedComponents.length) {
            matchedComponents.forEach(function (_component) {
              if (polymorph_typeof(value) === 'object') {
                polymorph(_component, value, false, globals, parentElement);
              } else if (typeof value === 'function') {
                polymorph(_component, value(_component), false, globals, parentElement);
              }
            });
          }
          /**
           * Handle `sub-components`
           */
          else if (key.indexOf('subComponent(') > -1) {
              var subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
              var subComponents = sQuery.getSubComponents.bind({
                DOMNodes: element,
                componentGlue: componentGlue,
                modifierGlue: modifierGlue,
                parentElement: parentElement
              })(subComponent);

              if (subComponents.length) {
                subComponents.forEach(function (_component) {
                  if (polymorph_typeof(value) === 'object') {
                    polymorph(_component, value, false, globals, parentElement);
                  } else if (typeof value === 'function') {
                    polymorph(_component, value(_component), false, globals, parentElement);
                  }
                });
              }

              return {
                v: void 0
              };
            }
            /**
             * Smart handle `sub-components`
             */
            else if (matchedSubComponents.length) {
                if (value.disableCascade) {
                  matchedSubComponents = matchedSubComponents.filter(function (subComponent) {
                    if (!element.getAttribute('data-component')) {
                      console.warn("".concat(element, " does not have data-component attribute so disableCascade option in ").concat(value, " may not reliably work"));
                    }

                    var componentName = element.getAttribute('data-component') || _toConsumableArray(element.classList).reduce(function (accumulator, currentValue) {
                      if (currentValue.indexOf(componentGlue) > 1) {
                        currentValue = currentValue.substring(currentValue.lastIndexOf(componentGlue) + 1, currentValue.length);
                        return currentValue.substring(0, currentValue.indexOf(modifierGlue));
                      }
                    }, []);

                    var parentSubComponent = sQuery.parent.bind({
                      DOMNodes: subComponent,
                      modifierGlue: modifierGlue,
                      componentGlue: componentGlue
                    })(componentName);
                    return element === parentSubComponent;
                  });
                }

                matchedSubComponents.forEach(function (_component) {
                  if (polymorph_typeof(value) === 'object') {
                    polymorph(_component, value, false, globals, parentElement);
                  } else if (typeof value === 'function') {
                    polymorph(_component, value(_component), false, globals, parentElement);
                  }
                });
              }
              /**
               * Handle module `group` and `wrapper`
               */
              else if (key === 'group' || key === 'wrapper') {
                  // @TODO this currently runs for each item in the group/wrapper,
                  // should ideally run just once per group/wrapper
                  element.parentNode.classList.forEach(function (className) {
                    if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                      var wrapperValues = polymorph_typeof(value) === 'object' ? value : value(element.parentNode);
                      var childValues = polymorph_typeof(value) === 'object' ? value : value(element); // apply styles to wrapper/group element

                      polymorph(element.parentNode, wrapperValues, false, globals, parentElement); // apply styles to child modules

                      polymorph(element, childValues, false, globals, parentElement);
                    }
                  });
                  return {
                    v: void 0
                  };
                }
                /**
                 * Handle `hover` interaction
                 */
                else if (key === ':hover') {
                    var stringifiedState = stringifyState(values);
                    var isHoverState = parentElement.data.states.some(function (state) {
                      return state.type === 'mouseover' && state.element === element && state.value === stringifiedState;
                    });

                    if (!isHoverState) {
                      parentElement.data.states.push({
                        type: 'mouseover',
                        element: element,
                        value: stringifiedState
                      });
                      element.addEventListener('mouseover', function mouseover() {
                        element.removeEventListener('mouseover', mouseover);
                        parentElement.repaint.states.push(function () {
                          return polymorph(element, value, false, globals, parentElement);
                        });
                        polymorph(element, value, false, globals, parentElement);
                      }, false);
                      element.addEventListener('mouseout', function mouseout() {
                        element.removeEventListener('mouseout', mouseout);
                        parentElement.data.states = parentElement.data.states.filter(function (state) {
                          return !(state.type === 'mouseover' && state.element === element && state.value === stringifiedState);
                        });
                        parentElement.repaint.states = [];
                        parentElement.repaint();
                      }, false);
                    }
                  }
                  /**
                   * Handle `focus` interaction
                   */
                  else if (key === ':focus') {
                      // handleState(parentElement, element, ['focus', 'blur'], value, globals);
                      var isFocusState = parentElement.data.states.some(function (state) {
                        return state.type === 'focus' && state.element === element;
                      });

                      if (!isFocusState) {
                        parentElement.data.states.push({
                          type: 'focus',
                          element: element
                        });
                        element.addEventListener('focus', function focus() {
                          element.removeEventListener('focus', focus);
                          polymorph(element, value, false, globals, parentElement);
                        }, true);
                        element.addEventListener('blur', function blur() {
                          element.removeEventListener('blur', blur);
                          parentElement.data.states = parentElement.data.states.filter(function (state) {
                            return !(state.type === 'focus' && state.element === element);
                          });
                          parentElement.repaint();
                        }, true);
                      }
                    }
                    /**
                     * Handle `before` pseudo element
                     */
                    // else if (key === ':before') {
                    //     console.log(value);
                    // }

                    /**
                     * Handle case where CSS `value` to be applied to `element` is a function
                     */
                    else if (typeof value === 'function') {
                        if (!element.data.properties[key] || element.data.properties[key].specificity < specificity) {
                          if (isValidCssProperty(key)) {
                            element.style[key] = value(element.style[key]);
                            element.data.properties[key] = {
                              value: value(element.style[key]),
                              specificity: specificity
                            };
                          }
                        } else {// @TODO handle condition (what is it?)
                        }
                      } else {// @TODO handle condition (what is it?)
                        }
    }
    /**
     * Handle CSS property
     */
    else {
        var props = element.data.properties;

        if (!props[key] || !props[key].specificity || props[key].specificity < specificity) {
          element.style[key] = value;
          props[key] = {
            value: value,
            specificity: specificity
          };
        }
      }
  };

  for (var _i = 0; _i < _arr.length; _i++) {
    var _ret = _loop();

    if (polymorph_typeof(_ret) === "object") return _ret.v;
  }
  /**
   * Dispatch initial event when styles first mount
   */


  if (element === parentElement && config !== false) {
    element.dispatchEvent(new Event('stylesdidmount'));
  }
}

/***/ })
/******/ ]);
});