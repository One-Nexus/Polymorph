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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getNamespace; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getNamespace(query, strict, config) {
  config = Object.assign(this || {}, config || {});
  var _config = config,
      namespace = _config.namespace,
      modifierGlue = _config.modifierGlue,
      componentGlue = _config.componentGlue;

  if (query instanceof HTMLElement) {
    if (query.hasAttribute('data-module')) {
      return query.getAttribute('data-module');
    }

    if (query.classList.length) {
      var targetClass;

      if (namespace) {
        targetClass = [].slice.call(query.classList).filter(function (className) {
          return className.indexOf(namespace) === 0;
        })[0];
      }

      if (!namespace || !targetClass) {
        targetClass = query.classList[0];
      }

      if (strict) {
        return targetClass.split(modifierGlue)[0];
      }

      return targetClass.split(modifierGlue)[0].split(componentGlue)[0];
    }

    if (namespace) {
      return namespace;
    }
  }

  if (typeof query === 'string' && query.match("^[a-zA-Z0-9_-]+$")) {
    return query;
  }

  if (query && _typeof(query) === 'object' && query.name) {
    return query.name;
  }

  if (query && query.constructor === Array) {
    return query[1];
  }
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return parent; });
/* harmony import */ var _utilities_getNamespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

function parent(node, query, config) {
  config = Object.assign(this || {}, config || {});

  if (node instanceof NodeList || node instanceof Array) {
    return [].slice.call(node).map(function (node) {
      return parent(node, query, config);
    });
  }

  var _config = config,
      componentGlue = _config.componentGlue,
      modifierGlue = _config.modifierGlue;
  var namespace = config.namespace || Object(_utilities_getNamespace__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(node, false, config);
  var $query = query || namespace;

  if ($query !== namespace) {
    $query = namespace + componentGlue + $query;
  }

  var parentComponent = $query && node.closest(".".concat($query, ", [class*='").concat($query + modifierGlue, "']"));

  if (parentComponent) {
    return parentComponent;
  }

  namespace = config.namespace || Object(_utilities_getNamespace__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(node, true, config);

  if (namespace && namespace.indexOf(query > -1)) {
    $query = namespace.substring(0, namespace.indexOf(query) + query.length);
  }

  var parentSubComponent = $query && node.closest(".".concat($query, ", [class*='").concat($query + modifierGlue, "']"));

  if (parentSubComponent) {
    return parentSubComponent;
  }
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@onenexus/squery/src/utilities/getNamespace.js
var getNamespace = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/@onenexus/squery/src/api/parent.js
var api_parent = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/@onenexus/squery/src/utilities/filterElements.js


function filterElements(node, elements, subComponent, config) {
  var namespace = config.namespace || Object(getNamespace["a" /* default */])(node, subComponent, config);
  var sourceParent = Object(api_parent["default"])(node, namespace, config);
  if (!sourceParent) return elements;
  elements = [].slice.call(elements).filter(function (element) {
    var targetParent = Object(api_parent["default"])(element, namespace, config);

    if (!targetParent) {
      return true;
    }

    return targetParent === sourceParent;
  });
  return elements;
}
// CONCATENATED MODULE: ./node_modules/@onenexus/squery/src/utilities/isValidSelector.js
function isValidSelector(selector) {
  if (!selector || typeof selector !== 'string') return false;
  var stub = document.createElement('br');
  stub.textContent = 'Hello!';

  try {
    selector && stub.querySelector(selector);
  } catch (e) {
    return false;
  }

  return true;
}
// CONCATENATED MODULE: ./node_modules/@onenexus/squery/src/api/getComponents.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getComponents; });
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




function getComponents(node, componentName, config) {
  config = Object.assign(this || {}, config || {});
  if (componentName && !isValidSelector(componentName)) return [];

  if (node instanceof NodeList || node instanceof Array) {
    return [].slice.call(node).reduce(function (matches, node) {
      return matches.concat([].slice.call(getComponents(node, componentName, config)));
    }, []);
  }

  var _config = config,
      subComponent = _config.subComponent,
      modifierGlue = _config.modifierGlue,
      componentGlue = _config.componentGlue;
  var namespace = config.namespace || Object(getNamespace["a" /* default */])(node, subComponent, config);
  var components;

  if (!componentName) {
    components = node.querySelectorAll("[class*='".concat(namespace + componentGlue, "']"));
  } else {
    var query = namespace + componentGlue + componentName;
    components = node.querySelectorAll(".".concat(query, ", [class*='").concat(query + modifierGlue, "']"));
  }

  components = [].slice.call(components).filter(function (element) {
    var sourceNamespace = Object(getNamespace["a" /* default */])(node, true, _objectSpread({}, config, {
      namespace: namespace
    }));
    var targetNamespace = Object(getNamespace["a" /* default */])(element, true, _objectSpread({}, config, {
      namespace: namespace
    }));
    var sourceDepth = (sourceNamespace.match(new RegExp(componentGlue, 'g')) || []).length;
    var targetDepth = (targetNamespace.match(new RegExp(componentGlue, 'g')) || []).length; // Special condition: if no componentName passed and we want sub-components,
    // find ALL child sub-components, as parent modules cannot have direct
    // descendant sub-components

    if (subComponent && !componentName && sourceNamespace.indexOf(componentGlue) === -1) {
      return true;
    }

    if (subComponent && !sourceDepth) {
      return false;
    }

    if (subComponent || !sourceDepth) {
      sourceDepth++;
    }

    var modifierCriteria = true;
    var targetClass = [].slice.call(element.classList).filter(function (className) {
      return className.indexOf(namespace) === 0;
    })[0];

    if (config.modifier) {
      modifierCriteria = targetClass.indexOf(config.modifier) > -1;
    }

    if (!subComponent && sourceDepth > 1) {
      if (targetClass.split(componentGlue).length - 1 > 1) {
        return false;
      }

      return modifierCriteria;
    }

    return modifierCriteria && targetDepth === sourceDepth;
  });
  components = filterElements(node, components, subComponent, config);
  return components;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return polymorph; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sQuery = typeof window !== 'undefined' && window.sQuery; // `process` and `require` are exploited to help reduce bundle size

if (!sQuery || typeof process !== 'undefined' && !process.env.SYNERGY) {
  sQuery = {
    getComponents: __webpack_require__(2).default,
    getSubComponents: __webpack_require__(4).default,
    hasModifier: __webpack_require__(5).default,
    parent: __webpack_require__(1).default
  };
}

function polymorph(element, styles) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var globals = arguments.length > 3 ? arguments[3] : undefined;
  var Synergy = window.Synergy || {};
  var modifierGlue = config.modifierGlue || Synergy.modifierGlue || '-';
  var componentGlue = config.componentGlue || Synergy.componentGlue || '_';
  var CONFIG = {
    componentGlue: componentGlue,
    modifierGlue: modifierGlue
  };
  var STYLESHEET = styles;

  if (typeof styles === 'function') {
    STYLESHEET = styles(element, config, globals);
  }

  if (styles.constructor === Array) {
    STYLESHEET = styles.map(function (style) {
      return typeof style === 'function' ? style(element, config, globals) : style;
    });
  }

  if (STYLESHEET.constructor === Array) {
    if (STYLESHEET.every(function (value) {
      return value && value.constructor === Object;
    })) {
      STYLESHEET.forEach(function (value) {
        return handleStyleSheet(element, value, CONFIG);
      });
    }
  } else {
    handleStyleSheet(element, STYLESHEET, CONFIG);
  }

  element.repaint();
}
/**
 * 
 */

function handleStyleSheet(element, stylesheet, config) {
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  if (!element.polymorph) {
    var WRAPPER_ELEMENT = [].slice.call(element.parentNode.classList).some(function (className) {
      return className.indexOf('group') === 0 || className.indexOf('wrapper') === 0;
    }) && element.parentNode;
    element.polymorph = {
      rules: [],
      COMPONENTS: sQuery.getComponents.bind(_objectSpread({}, config))(element),
      SUB_COMPONENTS: sQuery.getSubComponents.bind(_objectSpread({}, config))(element)
    };
    var _element$polymorph = element.polymorph,
        COMPONENTS = _element$polymorph.COMPONENTS,
        SUB_COMPONENTS = _element$polymorph.SUB_COMPONENTS;

    element.repaint = function (disableDependentElements) {
      var allDependentElements = [];

      if (WRAPPER_ELEMENT && WRAPPER_ELEMENT.repaint) {
        WRAPPER_ELEMENT.repaint(true);
      }

      [element].concat(_toConsumableArray(COMPONENTS), _toConsumableArray(SUB_COMPONENTS)).forEach(function (el) {
        if (el.polymorph) {
          el.polymorph.rules.forEach(function (rule) {
            if (rule.context.every(function (ruleContext) {
              if (ruleContext.value === 'hover') {
                return ruleContext.source.polymorph.isHovered;
              }

              if (ruleContext.value === 'focus') {
                return ruleContext.source.polymorph.isFocused;
              }

              return sQuery.hasModifier.bind(_objectSpread({}, config))(ruleContext.source, ruleContext.value);
            })) {
              var _allDependentElements;

              var dependentElements = doStyles(el, rule.styles) || [];
              dependentElements.length && (_allDependentElements = allDependentElements).push.apply(_allDependentElements, _toConsumableArray(dependentElements));
            }
          });

          if (allDependentElements.includes(el)) {
            allDependentElements.filter(function (item) {
              return item !== el;
            });
          }
        }
      });

      if (!disableDependentElements && allDependentElements.length) {
        allDependentElements = allDependentElements.filter(function (item, pos) {
          return allDependentElements.indexOf(item) == pos;
        });
        allDependentElements.forEach(function (el) {
          return el.repaint && el.repaint(true);
        });
      }
    };
  }

  element.polymorph.rules = element.polymorph.rules.concat({
    context: context,
    styles: stylesheet
  });

  if (typeof stylesheet === 'function') {
    stylesheet = stylesheet(element);
  }

  if (!stylesheet) return;
  Object.entries(stylesheet).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    var COMPONENTS = sQuery.getComponents.bind(_objectSpread({}, config))(element, key);
    var SUB_COMPONENTS = sQuery.getSubComponents.bind(_objectSpread({}, config))(element, key); //Handle case where desired element for styles to be applied is manually controlled

    if (value instanceof Array && value[0]) {
      if (value[0] instanceof HTMLElement) {
        handleStyleSheet(value[0], value[1], config, context);
      }

      if (value[0] instanceof NodeList) {
        value[0].forEach(function (el) {
          return handleStyleSheet(el, value[1], config, context);
        });
      }

      return;
    } // Smart handle `components`


    if (COMPONENTS.length) {
      if (value.disableCascade) {
        COMPONENTS = COMPONENTS.filter(function (component) {
          return COMPONENTS.every(function (_component) {
            return component.contains(_component);
          });
        });
      }

      return COMPONENTS.forEach(function (component) {
        return handleStyleSheet(component, value, config, context);
      });
    } // Smart handle `sub-components`


    if (SUB_COMPONENTS.length) {
      if (value.disableCascade) {
        SUB_COMPONENTS = SUB_COMPONENTS.filter(function (subComponent) {
          var componentName = _toConsumableArray(element.classList).reduce(function ($, currentValue) {
            if (currentValue.indexOf(config.componentGlue) > 1) {
              var glueLength = config.componentGlue.length;
              var nameStart = currentValue.lastIndexOf(config.componentGlue) + glueLength;
              currentValue = currentValue.substring(nameStart, currentValue.length);
              return currentValue.substring(0, currentValue.indexOf(config.modifierGlue));
            }
          }, []);

          var parentSubComponent = sQuery.parent.bind(_objectSpread({}, config))(subComponent, componentName);
          return element === parentSubComponent;
        });
      }

      return SUB_COMPONENTS.forEach(function (component) {
        return handleStyleSheet(component, value, config, context);
      });
    } // Handle `sub-components`


    if (key.indexOf('subComponent(') > -1) {
      var subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
      var subComponents = sQuery.getSubComponents.bind(_objectSpread({}, config))(element, subComponent);
      return subComponents.forEach(function (component) {
        return handleStyleSheet(component, value, config, context);
      });
    } // Handle `modifiers`


    if (key.indexOf('modifier(') > -1) {
      var modifier = key.replace('modifier(', '').replace(/\)/g, '');
      return handleStyleSheet(element, value, config, context.concat({
        source: element,
        value: modifier
      }));
    } // Handle `hover` interaction


    if (key === ':hover') {
      handleStyleSheet(element, value, config, context.concat({
        source: element,
        value: 'hover'
      }));
      element.addEventListener('mouseenter', function (event) {
        element.polymorph.isHovered = true;
        element.repaint();
      });
      element.addEventListener('mouseleave', function (event) {
        element.polymorph.isHovered = false;
        element.repaint();
      });
      return;
    } // Handle `focus` interaction


    if (key === ':focus') {
      handleStyleSheet(element, value, config, context.concat({
        source: element,
        value: 'focus'
      }));
      element.addEventListener('focus', function (event) {
        element.polymorph.isFocused = true;
        element.repaint();
      });
      element.addEventListener('blur', function (event) {
        element.polymorph.isFocused = false;
        element.repaint();
      });
      return;
    } // Handle Group/Wrapper elements


    if (key === 'group' || key === 'wrapper') {
      var wrapper = element.parentNode;
      return wrapper.classList.forEach(function (className) {
        if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
          handleStyleSheet(wrapper, value, config, context);
        }
      });
    }
  });
  element.polymorph.rules.sort(function (a, b) {
    if (!a.context.length && !b.context.length) {
      return 0;
    }

    if (a.context.length && !b.context.length) {
      return 1;
    }

    if (!a.context.length && b.context.length) {
      return -1;
    }

    if (a.context.some(function (c) {
      return c.value === 'hover';
    }) && b.context.some(function (c) {
      return c.value === 'hover';
    })) {
      return 0;
    }

    if (b.context.some(function (c) {
      return c.value === 'hover';
    })) {
      return -1;
    }

    return 0;
  });
}
/**
 * 
 */


function doStyles(el, styles) {
  if (typeof styles === 'function') {
    styles = styles(el);
  }

  if (!styles) return;
  Object.entries(styles).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    if (typeof value === 'function') {
      try {
        return el.style[key] = value(el.style[key]);
      } catch (error) {
        return error;
      }
    }

    return el.style[key] = value;
  });
  var dependentElements = Object.values(styles).reduce(function (accumulator, currentValue) {
    if (currentValue instanceof Array && currentValue[0]) {
      if (currentValue[0] instanceof NodeList || currentValue[0] instanceof Array) {
        return accumulator.concat.apply(accumulator, _toConsumableArray(currentValue[0]));
      }

      return accumulator.concat(currentValue[0]);
    }

    return accumulator;
  }, []);
  return dependentElements;
}
/**
 * Wrapper for sQuery `hasModifier()`
 */


polymorph.modifier = function (element, modifier, modifierGlue, componentGlue) {
  var Synergy = window.Synergy || {};
  modifierGlue = modifierGlue || Synergy.modifierGlue || '-';
  componentGlue = componentGlue || Synergy.componentGlue || '_';
  return sQuery.hasModifier.bind({
    modifierGlue: modifierGlue,
    componentGlue: componentGlue
  })(element, modifier);
};
/**
 * Attach to Window
 */


if (typeof window !== 'undefined') {
  window.polymorph = polymorph;
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getSubComponents; });
/* harmony import */ var _getComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getSubComponents(node, subComponentName, config) {
  config = Object.assign(this || {}, config || {});
  config.subComponent = true;
  return Object(_getComponents__WEBPACK_IMPORTED_MODULE_0__["default"])(node, subComponentName, config);
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hasModifier; });
/* harmony import */ var _utilities_getNamespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

function hasModifier(node, modifier, config) {
  config = Object.assign(this || {}, config || {});
  if (!modifier) return;

  if (modifier.constructor === Array) {
    return modifier.every(function (modifier) {
      return hasModifier(node, modifier, config);
    });
  }

  if (node instanceof NodeList || node instanceof Array) {
    return [].slice.call(node).every(function (node) {
      return hasModifier(node, modifier, config);
    });
  }

  var _config = config,
      modifierGlue = _config.modifierGlue;
  var namespace = config.namespace || node.namespace || Object(_utilities_getNamespace__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(node, false, config);
  return [].slice.call(node.classList).some(function (className) {
    var matchIndex = className.indexOf(modifierGlue + modifier);
    var namespaceMatch = className.indexOf(namespace) === 0;
    var isModifierTest1 = className.indexOf(modifierGlue + modifier + modifierGlue) > -1;
    var isModifierTest2 = matchIndex > -1 && matchIndex === className.length - modifier.length - modifierGlue.length;
    return namespaceMatch && (isModifierTest1 || isModifierTest2);
  });
}

/***/ })
/******/ ]);
});