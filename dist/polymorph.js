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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getModuleNamespace;
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Get the Module name from a Synergy query
 * 
 * @param {*} query 
 * @param {Bool} strict
 */
function getModuleNamespace(query, componentGlue, modifierGlue) {
  var strict = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (query instanceof HTMLElement) {
    if (query.hasAttribute('data-module')) {
      return query.getAttribute('data-module');
    }

    if (query.classList.length) {
      if (strict) {
        return query.classList[0].split(modifierGlue)[0].split(componentGlue)[0];
      }

      return query.classList[0].split(modifierGlue)[0];
    }
  }

  if (typeof query === 'string' && query.match("^[a-zA-Z0-9_-]+$")) {
    return query;
  }

  if (_typeof(query) === 'object' && 'name' in query) {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = getComponents;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_isValidSelector__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__parent__ = __webpack_require__(7);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }




/**
 * @param {*} componentName 
 */

function getComponents() {
  var _this = this;

  var componentName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var modifier = arguments.length > 1 ? arguments[1] : undefined;
  var namespace = arguments.length > 2 ? arguments[2] : undefined;
  if (componentName && !Object(__WEBPACK_IMPORTED_MODULE_1__utilities_isValidSelector__["a" /* default */])(componentName)) return [];

  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).reduce(function (matches, node) {
      return matches.concat.apply(matches, _toConsumableArray(getComponents.bind(Object.assign(_this, {
        DOMNodes: node
      }))(componentName, modifier, namespace)));
    }, []);
  }

  if (componentName.indexOf('modifier(') === 0) return;
  namespace = namespace || this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(this.DOMNodes, this.componentGlue, this.modifierGlue, 'strict');
  var query = namespace + (componentName ? this.componentGlue + componentName : '');
  var selector = ".".concat(query, ", [class*=\"").concat(query + this.modifierGlue, "\"]");

  if (!componentName) {
    selector = "[class*=\"".concat(query + this.componentGlue, "\"]");
  }

  var subComponents = _toConsumableArray(this.DOMNodes.querySelectorAll(selector)).filter(function (component) {
    var parentModule = __WEBPACK_IMPORTED_MODULE_2__parent__["a" /* default */].bind(Object.assign(_this, {
      DOMNodes: component
    }))(namespace);
    var parentElementIsModule = _this.parentElement ? _this.parentElement.matches(".".concat(namespace, ", [class*=\"").concat(namespace, "-\"]")) : false;

    if (parentElementIsModule && _this.parentElement !== parentModule) {
      return false;
    }

    return _toConsumableArray(component.classList).some(function (className) {
      var isComponent = className.split(_this.componentGlue).length - 1 === 1;
      var isQueryMatch = className.indexOf(query) === 0;

      if (modifier) {
        return isQueryMatch && isComponent && className.indexOf(modifier) > -1;
      } else {
        return isQueryMatch && isComponent;
      }
    });
  }); // console.log(subComponents)


  return subComponents;
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isComponent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {*} componentName 
 */

function isComponent(componentName) {
  var _this = this;

  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).every(function (DOMNodes) {
      return isComponent.bind(Object.assign(_this, {
        DOMNodes: DOMNodes
      }))(componentName);
    });
  }

  return _toConsumableArray(this.DOMNodes.classList).some(function (className) {
    var isAComponent = className.split(_this.componentGlue).length - 1 === 1;
    var query = (_this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(_this.DOMNodes, _this.componentGlue, _this.modifierGlue, 'strict')) + _this.componentGlue + componentName;
    var isMatch = query.indexOf(_this.componentGlue + componentName) > -1;
    return className.indexOf(query) === 0 && isAComponent && isMatch;
  });
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getSubComponts;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_isValidSelector__ = __webpack_require__(6);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



/**
 * @param {*} subComponentName 
 */

function getSubComponts(subComponentName) {
  var _this = this;

  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var modifier = arguments.length > 2 ? arguments[2] : undefined;
  if (subComponentName && !Object(__WEBPACK_IMPORTED_MODULE_1__utilities_isValidSelector__["a" /* default */])(subComponentName)) return [];

  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).reduce(function (matches, DOMNodes) {
      return matches.concat.apply(matches, _toConsumableArray(getSubComponts.bind(Object.assign(_this, {
        DOMNodes: DOMNodes
      }))(subComponentName, context, modifier)));
    }, []);
  }

  var namespace = this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(this.DOMNodes, this.componentGlue, this.modifierGlue) || '';
  var depth = namespace.split(this.componentGlue).length - 1;

  if (context.length) {
    namespace = [namespace].concat(context, [subComponentName]).join(this.componentGlue);
  } else if (subComponentName) {
    namespace = namespace + this.componentGlue + subComponentName;
  }

  var selector = ".".concat(namespace, ", [class*=\"").concat(namespace + this.modifierGlue, "\"]");

  if (!subComponentName) {
    selector = "[class*=\"".concat(namespace + this.componentGlue, "\"]");
  }

  return _toConsumableArray(this.DOMNodes.querySelectorAll(selector)).filter(function (subComponent) {
    return _toConsumableArray(subComponent.classList).some(function (className) {
      if ((className.match(new RegExp(_this.componentGlue, 'g')) || []).length < 2) {
        return false;
      }

      var namespaceMatch;

      if (modifier) {
        namespaceMatch = className.indexOf(namespace) === 0 && className.indexOf(modifier) > -1;
      } else {
        namespaceMatch = className.indexOf(namespace) === 0;
      }

      var depthMatch = className.split(_this.componentGlue).length - 1 === (context.length ? depth : depth + 1);
      return depth ? namespaceMatch && depthMatch : namespaceMatch;
    });
  });
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = hasModifier;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {*} modifier 
 */

function hasModifier(modifier) {
  var _this = this;

  if (modifier) {
    if (modifier.constructor === Array) {
      return modifier.every(function (_modifier) {
        return hasModifier.bind(_this)(_modifier);
      });
    }

    if (this.DOMNodes instanceof NodeList) {
      return _toConsumableArray(this.DOMNodes).every(function (DOMNodes) {
        return hasModifier.bind(Object.assign(_this, {
          DOMNodes: DOMNodes
        }))(modifier);
      });
    }

    var node = this.DOMNodes;
    return _toConsumableArray(node.classList).some(function (className) {
      var namespace = _this.namespace || node.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(node, _this.modifierGlue, _this.componentGlue);
      var matchIndex = className.indexOf(_this.modifierGlue + modifier);
      var namespaceMatch = className.indexOf(namespace) === 0;
      var isModifierTest1 = className.indexOf(_this.modifierGlue + modifier + _this.modifierGlue) > -1;
      var isModifierTest2 = matchIndex > -1 && matchIndex === className.length - modifier.length - 1;
      return namespaceMatch && (isModifierTest1 || isModifierTest2);
    });
  }
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = addModifier;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);

/**
 * @param {(String|Array)} modifier 
 */

function addModifier(modifier) {
  var _this = this;

  if (this.DOMNodes instanceof NodeList) {
    return this.DOMNodes.forEach(function (node) {
      return addModifier.bind(Object.assign(_this, {
        DOMNodes: node
      }))(modifier);
    });
  }

  if (modifier.constructor === Array) {
    modifier = modifier.join(this.modifierGlue);
  }

  var namespace = this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(this.DOMNodes, this.componentGlue, this.modifierGlue);
  this.DOMNodes.classList.add(namespace + this.modifierGlue + modifier);
  return this.DOMNodes;
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isValidSelector;
/**
 * Test the validity (not existance) of a CSS selector
 * 
 * @param {String} selector - the selector to test for validity
 * 
 * @returns {Bool}
 * 
 * @example isValidSelector('[data-foo-bar]') // returns true
 * @example isValidSelector(4) // returns false
 */
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

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {(String|'module'|'component')} query 
 */

function parent(query, namespace) {
  var _this = this;

  if (query === 'module') {
    return _toConsumableArray(this.DOMNodes).map(function (node) {
      return node.parentNode.closest('[data-module]');
    });
  }

  if (query === 'component') {
    return _toConsumableArray(this.DOMNodes).map(function (node) {
      return node.parentNode.closest('[data-component]');
    });
  }

  if (typeof query === 'string') {
    var moduleMatch = function moduleMatch() {
      var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.DOMNodes;
      var parentModule;

      if (nodes instanceof NodeList) {
        return _toConsumableArray(nodes).map(function (node) {
          return moduleMatch(node);
        });
      }

      parentModule = nodes.parentNode.closest("[data-module=\"".concat(query, "\"]"));

      if (parentModule) {
        return parentModule;
      }

      parentModule = nodes.closest(".".concat(query, ", [class*=\"").concat(query + _this.modifierGlue, "\"]"));

      if (parentModule && Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(parentModule, _this.componentGlue, _this.modifierGlue, 'strict') === query) {
        return parentModule;
      }
    };

    var componentMatch = function componentMatch() {
      var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.DOMNodes;
      namespace = namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(nodes, _this.componentGlue, _this.modifierGlue, 'strict');
      var parentModule, selector;

      if (nodes instanceof NodeList) {
        return _toConsumableArray(nodes).map(function (node) {
          return componentMatch(node);
        });
      }

      parentModule = nodes.parentNode.closest("[data-component=\"".concat(query, "\"]"));

      if (parentModule) {
        return parentModule;
      }

      parentModule = nodes.parentNode.closest(".".concat(namespace + _this.componentGlue + query));

      if (parentModule) {
        return parentModule;
      }

      selector = "[class*=\"".concat(namespace + _this.componentGlue, "\"][class*=\"").concat(_this.componentGlue + query, "\"]");
      parentModule = nodes.parentNode.closest(selector);

      if (parentModule) {
        return parentModule;
      }
    };

    if (this.DOMNodes instanceof HTMLElement) {
      return moduleMatch() || componentMatch();
    }

    return moduleMatch()[0] ? moduleMatch() : componentMatch();
  }
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = removeModifier;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {(String|Array)} modifier 
 */

function removeModifier(modifier) {
  var _this = this;

  if (modifier.constructor === Array) {
    return modifier.forEach(function (_modifier) {
      removeModifier.bind(Object.assign(_this))(_modifier);
    });
  }

  if (this.DOMNodes instanceof NodeList) {
    return this.DOMNodes.forEach(function (node) {
      return removeModifier.bind(Object.assign(_this, {
        DOMNodes: node
      }))(modifier);
    });
  }

  var node = this.DOMNodes;

  _toConsumableArray(node.classList).forEach(function (className) {
    var moduleMatch = className.indexOf((_this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(node, _this.componentGlue, _this.modifierGlue)) + _this.modifierGlue) === 0;
    var modifierMatch = className.indexOf(_this.modifierGlue + modifier) > -1;
    var newClass = className.replace(new RegExp(_this.modifierGlue + modifier, 'g'), '');

    if (moduleMatch && modifierMatch) {
      node.classList.remove(className);
      node.classList.add(newClass);
    }
  });
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = polymorph;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_isValidCssProperty__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utilities_stringifyState__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__text__ = __webpack_require__(26);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }





/**
 * Set a module's styles on a DOM element instance
 */

function polymorph(element) {
  var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = arguments.length > 2 ? arguments[2] : undefined;
  var globals = arguments.length > 3 ? arguments[3] : undefined;
  var parentElement = arguments.length > 4 ? arguments[4] : undefined;
  var specificity = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var values = _typeof(styles) === 'object' ? styles : styles(element, config, globals);
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

      var components = __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["a" /* getComponents */].bind({
        DOMNodes: element,
        componentGlue: componentGlue,
        modifierGlue: modifierGlue,
        parentElement: element
      })();
      /**
       * Get child sub-components
       */

      var subComponents = __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["b" /* getSubComponents */].bind({
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

    var matchedComponents = __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["a" /* getComponents */].bind({
      DOMNodes: element,
      componentGlue: componentGlue,
      modifierGlue: modifierGlue,
      parentElement: parentElement
    })(key);
    var matchedSubComponents = __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["b" /* getSubComponents */].bind({
      DOMNodes: element,
      componentGlue: componentGlue,
      modifierGlue: modifierGlue,
      parentElement: parentElement
    })(key);
    /**
     * Handle object of CSS properties / function that will return an object
     * of CSS properties
     */

    if (typeof value === 'function' || _typeof(value) === 'object') {
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

          if (__WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["c" /* hasModifier */].bind({
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
              if (_typeof(value) === 'object') {
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
              var subComponents = __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["b" /* getSubComponents */].bind({
                DOMNodes: element,
                componentGlue: componentGlue,
                modifierGlue: modifierGlue,
                parentElement: parentElement
              })(subComponent);

              if (subComponents.length) {
                subComponents.forEach(function (_component) {
                  if (_typeof(value) === 'object') {
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
                      console.warn("".concat(element, " does not have data-component attribute so disableCascade option in ").concat(value, " will not reliably work"));
                    }

                    return element === subComponent.closest("[data-component=\"".concat(element.getAttribute('data-component'), "\"]"));
                  });
                }

                matchedSubComponents.forEach(function (_component) {
                  if (_typeof(value) === 'object') {
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
                      var wrapperValues = _typeof(value) === 'object' ? value : value(element.parentNode);
                      var childValues = _typeof(value) === 'object' ? value : value(element); // apply styles to wrapper/group element

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
                    var stringifiedState = Object(__WEBPACK_IMPORTED_MODULE_2__utilities_stringifyState__["a" /* default */])(values);
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
                   * Handle `before` pseudo element
                   */
                  // else if (key === ':before') {
                  //     console.log(value);
                  // }

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
                     * Handle case where CSS `value` to be applied to `element` is a function
                     */
                    else if (typeof value === 'function') {
                        if (!element.data.properties[key] || element.data.properties[key].specificity < specificity) {
                          if (Object(__WEBPACK_IMPORTED_MODULE_0__utilities_isValidCssProperty__["a" /* default */])(key)) {
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

    if (_typeof(_ret) === "object") return _ret.v;
  }
  /**
   * Dispatch initial event when styles first mount
   */


  if (element === parentElement && config !== false) {
    element.dispatchEvent(new Event('stylesdidmount'));
  }
}
/**
 * Wrapper for sQuery `hasModifier()`
 */

polymorph.modifier = function (element, modifier, modifierGlue, componentGlue) {
  modifierGlue = modifierGlue || window.Synergy && Synergy.modifierGlue || '-';
  componentGlue = componentGlue || window.Synergy && Synergy.componentGlue || '_';
  return __WEBPACK_IMPORTED_MODULE_1__sQuery_sQuery_src_api__["c" /* hasModifier */].bind({
    DOMNodes: element,
    modifierGlue: modifierGlue,
    componentGlue: componentGlue
  })(modifier);
};

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isValidCssProperty;
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

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export fizzBuzz */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__addModifier__ = __webpack_require__(5);
/* unused harmony reexport add */
/* unused harmony reexport addModifier */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component__ = __webpack_require__(12);
/* unused harmony reexport component */
/* unused harmony reexport components */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__find__ = __webpack_require__(13);
/* unused harmony reexport find */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getComponent__ = __webpack_require__(15);
/* unused harmony reexport getComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__getComponents__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_4__getComponents__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__getModifiers__ = __webpack_require__(16);
/* unused harmony reexport getModifiers */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__getSubComponent__ = __webpack_require__(17);
/* unused harmony reexport getSubComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__getSubComponents__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_7__getSubComponents__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__hasModifier__ = __webpack_require__(4);
/* unused harmony reexport has */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_8__hasModifier__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__is__ = __webpack_require__(18);
/* unused harmony reexport is */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__isComponent__ = __webpack_require__(2);
/* unused harmony reexport isComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__modifier__ = __webpack_require__(20);
/* unused harmony reexport modifier */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__removeModifier__ = __webpack_require__(8);
/* unused harmony reexport removeModifier */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__parent__ = __webpack_require__(7);
/* unused harmony reexport parent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__parentComponent__ = __webpack_require__(21);
/* unused harmony reexport parentComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__setComponent__ = __webpack_require__(22);
/* unused harmony reexport setComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__subComponent__ = __webpack_require__(23);
/* unused harmony reexport subComponent */
/* unused harmony reexport subComponents */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__unsetComponent__ = __webpack_require__(24);
/* unused harmony reexport unsetComponent */


















function fizzBuzz(test) {
  console.log(test);
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getComponents__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isComponent__ = __webpack_require__(2);



/**
 * @param {String} componentName 
 * @param {(('find'|'is'|'set'|'unset')|Function)} operator 
 */

function component(componentName, operator) {
  var _this = this;

  var namespace = function namespace(node) {
    return _this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(node, _this.componentGlue, _this.modifierGlue, 'strict');
  };

  if (!componentName && !operator) {
    return __WEBPACK_IMPORTED_MODULE_1__getComponents__["a" /* default */].bind(this)();
  }

  if (!operator || operator === 'find') {
    return __WEBPACK_IMPORTED_MODULE_1__getComponents__["a" /* default */].bind(this)(componentName);
  }

  if (operator === 'is') {
    return __WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(componentName);
  }

  if (operator === 'set') {
    if (this.DOMNodes instanceof NodeList) {
      this.DOMNodes.forEach(function (node) {
        return node.classList.add(namespace(node) + _this.componentGlue + componentName);
      });
    } else {
      this.DOMNodes.classList.add(namespace(this.DOMNodes) + this.componentGlue + componentName);
    }
  }

  if (operator === 'unset') {
    if (this.DOMNodes instanceof NodeList) {
      this.DOMNodes.forEach(function (node) {
        return node.classList.remove(namespace(node) + _this.componentGlue + componentName);
      });
    } else {
      this.DOMNodes.classList.remove(namespace(this.DOMNodes) + this.componentGlue + componentName);
    }
  }

  if (typeof operator === 'function') {
    __WEBPACK_IMPORTED_MODULE_1__getComponents__["a" /* default */].bind(this)(componentName).forEach(function (node) {
      return operator(node);
    });
  }
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_getModules__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getComponents__ = __webpack_require__(1);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




/**
 * @param {*} query 
 */

function find(query) {
  var _this = this;

  if (_typeof(query) === 'object') {
    if (this.DOMNodes instanceof NodeList) {
      return _toConsumableArray(this.DOMNodes).reduce(function (matches, node) {
        return matches.concat(getQueryFromObject.bind(_this)(query, node));
      }, []);
    }

    return getQueryFromObject.bind(this)(query, this.DOMNodes);
  }

  if (typeof query === 'string') {
    var components = __WEBPACK_IMPORTED_MODULE_2__getComponents__["a" /* default */].bind(this)(query);

    if (components.length) {
      return components;
    }

    if (Object(__WEBPACK_IMPORTED_MODULE_1__utilities_getModules__["a" /* default */])(this, query).length) {
      return Object(__WEBPACK_IMPORTED_MODULE_1__utilities_getModules__["a" /* default */])(this, query);
    }
  }
}
/**
 * @param {Object} query 
 * @param {HTMLElement} node 
 */

function getQueryFromObject(query, node) {
  var _this2 = this;

  var matches = [];

  if (query.module) {
    if (query.component) {
      return matches.concat.apply(matches, _toConsumableArray(__WEBPACK_IMPORTED_MODULE_2__getComponents__["a" /* default */].bind(this)(query.component, query.modifier, query.module)));
    }

    return matches.concat.apply(matches, _toConsumableArray(node.querySelectorAll(".".concat(query.module, ", [class*=\"").concat(query.module + query.modifierGlue, "\"]"))));
  }

  if (query.component) {
    var components = __WEBPACK_IMPORTED_MODULE_2__getComponents__["a" /* default */].bind(this)(query.component);

    if (query.modifier) {
      return matches.concat.apply(matches, _toConsumableArray(components.filter(function (component) {
        return _toConsumableArray(component.classList).some(function (className) {
          var isNamespace = className.indexOf(_this2.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(component, _this2.componentGlue, _this2.modifierGlue)) === 0;
          var hasModifier = className.indexOf(query.modifier) > -1;
          return isNamespace && hasModifier;
        });
      })));
    }

    return matches.concat.apply(matches, _toConsumableArray(components));
  }

  if (query.modifier) {
    return;
  }
}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getModules;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @param {*} target 
 * @param {*} moduleName 
 */
function getModules(target, moduleName) {
  if (target.DOMNodes instanceof NodeList) {
    return _toConsumableArray(target.DOMNodes).reduce(function (matches, node) {
      return matches.concat.apply(matches, _toConsumableArray(node.querySelectorAll(".".concat(moduleName, ", [class*=\"").concat(moduleName + target.modifierGlue, "\"]"))));
    }, []);
  }

  return target.DOMNodes.querySelectorAll(".".concat(moduleName, ", [class*=\"").concat(moduleName + target.modifierGlue, "\"]"));
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getComponents__ = __webpack_require__(1);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {*} componentName 
 */

function getComponent(componentName) {
  var _this = this;

  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).map(function (DOMNodes) {
      return getComponent.bind(Object.assign(_this, {
        DOMNodes: DOMNodes
      }))(componentName);
    });
  }

  ;
  return __WEBPACK_IMPORTED_MODULE_0__getComponents__["a" /* default */].bind(this)(componentName)[0];
}

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {*} componentName 
 */

function getModifiers() {
  var _this = this,
      _ref;

  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).reduce(function (matches, DOMNodes) {
      return matches.concat.apply(matches, _toConsumableArray(getModifiers.bind(Object.assign(_this, {
        DOMNodes: DOMNodes
      }))()));
    }, []);
  }

  return (_ref = []).concat.apply(_ref, _toConsumableArray(_toConsumableArray(this.DOMNodes.classList).filter(function (className) {
    return className.indexOf(_this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(_this.DOMNodes, _this.componentGlue, _this.modifierGlue)) === 0;
  }).map(function (target) {
    return target.split(_this.modifierGlue).slice(1);
  })));
}

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getSubComponents__ = __webpack_require__(3);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {*} subComponentName 
 */

function getComponent(subComponentName) {
  var _this = this;

  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).map(function () {
      return __WEBPACK_IMPORTED_MODULE_0__getSubComponents__["a" /* default */].bind(_this)(subComponentName, context)[0];
    });
  }

  return __WEBPACK_IMPORTED_MODULE_0__getSubComponents__["a" /* default */].bind(this)(subComponentName, context)[0];
}

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_isModule__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__hasModifier__ = __webpack_require__(4);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }





/**
 * @param {*} query 
 */

function is(query) {
  var _this = this;

  if (_typeof(query) === 'object') {
    if (query.module) {
      if (query.component) {
        var isModuleNamespace = _toConsumableArray(this.DOMNodes).every(function (node) {
          return (_this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(node, _this.componentGlue, _this.modifierGlue, true)) === query.module;
        });

        if (query.modifier) {
          return isModuleNamespace && __WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(query.component) && __WEBPACK_IMPORTED_MODULE_3__hasModifier__["a" /* default */].bind(this)(query.modifier);
        }

        return isModuleNamespace && __WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(query.component);
      }

      return Object(__WEBPACK_IMPORTED_MODULE_1__utilities_isModule__["a" /* default */])(this, query.module);
    }

    if (query.component) {
      if (query.modifier) {
        return __WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(query.component) && __WEBPACK_IMPORTED_MODULE_3__hasModifier__["a" /* default */].bind(this)(query.modifier);
      }

      return __WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(query.component);
    }

    if (query.modifier) {
      return __WEBPACK_IMPORTED_MODULE_3__hasModifier__["a" /* default */].bind(this)(query.modifier);
    }
  }

  if (typeof query === 'string') {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__utilities_isModule__["a" /* default */])(this, query)) {
      return Object(__WEBPACK_IMPORTED_MODULE_1__utilities_isModule__["a" /* default */])(this, query);
    }

    if (__WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(query)) {
      return __WEBPACK_IMPORTED_MODULE_2__isComponent__["a" /* default */].bind(this)(query);
    }

    if (__WEBPACK_IMPORTED_MODULE_3__hasModifier__["a" /* default */].bind(this)(query)) {
      return __WEBPACK_IMPORTED_MODULE_3__hasModifier__["a" /* default */].bind(this)(query);
    }
  }

  return false;
}

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isModule;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @param {*} target 
 * @param {*} moduleName 
 */
function isModule(target, moduleName) {
  return _toConsumableArray(target.DOMNodes).every(function (node) {
    return node.matches(".".concat(moduleName, ", [class*=\"").concat(moduleName + target.modifierGlue, "\"]"));
  });
}

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hasModifier__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__addModifier__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__removeModifier__ = __webpack_require__(8);



/**
 * @param {String} modifier 
 * @param {(('is'|'set'|'unset')|Function)} operator 
 */

function modifier(modifier, operator) {
  if (!operator || operator === 'is') {
    return __WEBPACK_IMPORTED_MODULE_0__hasModifier__["a" /* default */].bind(this)(modifier);
  }

  if (operator === 'set' || operator === 'add') {
    return __WEBPACK_IMPORTED_MODULE_1__addModifier__["a" /* default */].bind(this)(modifier);
  }

  if (operator === 'unset' || operator === 'remove') {
    return __WEBPACK_IMPORTED_MODULE_2__removeModifier__["a" /* default */].bind(this)(modifier);
  }
}

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @param {*} componentName 
 */
function parentComponent(componentName) {
  if (this.DOMNodes instanceof NodeList) {
    return _toConsumableArray(this.DOMNodes).map(function (node) {
      return node.parentNode.closest("[data-component=\"".concat(componentName, "\"]"));
    });
  }

  return this.DOMNodes.parentNode.closest("[data-component=\"".concat(componentName, "\"]"));
}

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);

/**
 * @param {*} componentName 
 */

function setComponent(componentName, namespace, replace) {
  var _this = this;

  if (this.DOMNodes instanceof NodeList) {
    return this.DOMNodes.forEach(function (DOMNodes) {
      return setComponent.bind(Object.assign(_this, {
        DOMNodes: DOMNodes
      }))(componentName);
    });
  }

  if (!namespace && !replace) {
    replace = this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(this.DOMNodes, this.componentGlue, this.modifierGlue);
  }

  namespace = namespace || this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(this.DOMNodes, this.componentGlue, this.modifierGlue);
  this.DOMNodes.classList.add(namespace + this.componentGlue + componentName);
  this.DOMNodes.setAttribute('data-component', componentName);
  replace && this.DOMNodes.classList.remove(replace);
}

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getSubComponents__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



/**
 * @param {String} componentName 
 * @param {(('find'|'is')|Function)} operator 
 */

function subComponent(subComponentName, operator) {
  var _this = this;

  if (!subComponentName && !operator) {
    return __WEBPACK_IMPORTED_MODULE_0__getSubComponents__["a" /* default */].bind(this)();
  }

  if (!operator || operator === 'find') {
    return __WEBPACK_IMPORTED_MODULE_0__getSubComponents__["a" /* default */].bind(this)(subComponentName);
  }

  if (operator === 'is') {
    if (this.DOMNodes instanceof NodeList) {
      return _toConsumableArray(this.DOMNodes).every(function (node) {
        return is.bind(_this)(node, subComponentName);
      });
    }

    return is.bind(this)(this.DOMNodes, subComponentName);
  }

  if (typeof operator === 'function') {
    __WEBPACK_IMPORTED_MODULE_0__getSubComponents__["a" /* default */].bind(this)(subComponentName).forEach(function (node) {
      return operator(node);
    });
  }
}
/**
 * @param {HTMLElement} node 
 * @param {String} subComponentName 
 */

function is(node, subComponentName) {
  var query = this.namespace || Object(__WEBPACK_IMPORTED_MODULE_1__utilities_getModuleNamespace__["a" /* default */])(node, this.componentGlue, this.modifierGlue);
  var isMatch = query.indexOf(subComponentName) === query.length - subComponentName.length;
  return _toConsumableArray(node.classList).some(function (className) {
    return className.indexOf(query) > -1 && isMatch;
  });
}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__ = __webpack_require__(0);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/**
 * @param {*} componentName 
 */

function unsetComponent(componentName) {
  var _this = this;

  if (this.DOMNodes instanceof NodeList) {
    return this.DOMNodes.forEach(function (DOMNodes) {
      return unsetComponent.bind(Object.assign(_this, {
        DOMNodes: DOMNodes
      }))(componentName);
    });
  }

  return _toConsumableArray(this.DOMNodes.classList).forEach(function (className) {
    var isAComponent = className.split(_this.componentGlue).length - 1 === 1;
    var isMatch = className.indexOf((_this.namespace || Object(__WEBPACK_IMPORTED_MODULE_0__utilities_getModuleNamespace__["a" /* default */])(_this.DOMNodes, _this.componentGlue, _this.modifierGlue)) + _this.componentGlue + componentName) === 0;

    if (isAComponent && isMatch) {
      _this.DOMNodes.classList.remove(className);
    }
  });
}

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Stringify a polymorph state
 * 
 * @see https://stackoverflow.com/a/48254637/2253888
 * 
 * @param {Object} state 
 */
/* harmony default export */ __webpack_exports__["a"] = (function (state) {
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

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export go1 */
/* unused harmony export go2 */
function go1() {
  return;
}
function go2() {
  return;
}

/***/ })
/******/ ]);