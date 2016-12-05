/*!
 * editTable - editTable.js
 * @version v1.0.0
 * @link 
 * @license MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	// Knife.js
	// (c) 2016 Walter Yu from Knife
	// remove more not use function, keep smaller for h5.
	// Knife.js may be freely distributed under the MIT license.

	var $ = __webpack_require__(5);
	(function (global, factory) {
	  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return factory(global);
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else factory(global);
	})(typeof window !== "undefined" ? window : undefined, function (window) {
	  // 函数内私有变量及函数
	  var undefined,
	      key,
	      emptyArray = [],
	      _concat = emptyArray.concat,
	      _filter = emptyArray.filter,
	      _slice = emptyArray.slice,
	      document = window.document,
	      elementDisplay = {},
	      cssNumber = {
	    'column-count': 1,
	    'columns': 1,
	    'font-weight': 1,
	    'line-height': 1,
	    'opacity': 1,
	    'z-index': 1,
	    'zoom': 1
	  },
	      fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	      singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	      tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	      rootNodeRE = /^(?:body|html)$/i,
	      capitalRE = /([A-Z])/g,


	  // special attributes that should be get/set via method calls
	  methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
	      adjacencyOperators = ['after', 'prepend', 'before', 'append'],
	      table = document.createElement('table'),
	      tableRow = document.createElement('tr'),
	      containers = {
	    'tr': document.createElement('tbody'),
	    'tbody': table, 'thead': table, 'tfoot': table,
	    'td': tableRow, 'th': tableRow,
	    '*': document.createElement('div')
	  },
	      simpleSelectorRE = /^[\w-]*$/,


	  // 内部变量
	  knife = $.knife,
	      camelize,
	      uniq,
	      tempParent = document.createElement('div');

	  knife.matches = function (element, selector) {
	    if (!selector || !element || element.nodeType !== 1) return false;
	    var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
	    if (matchesSelector) return matchesSelector.call(element, selector);
	    // fall back to performing a selector:
	    var match,
	        parent = element.parentNode,
	        temp = !parent;
	    if (temp) (parent = tempParent).appendChild(element);
	    match = ~knife.qsa(parent, selector).indexOf(element);
	    temp && tempParent.removeChild(element);
	    return match;
	  };

	  function compact(array) {
	    return _filter.call(array, function (item) {
	      return item != null;
	    });
	  }

	  function flatten(array) {
	    return array.length > 0 ? $.fn.concat.apply([], array) : array;
	  }

	  camelize = function camelize(str) {
	    return str.replace(/-+(.)?/g, function (match, chr) {
	      return chr ? chr.toUpperCase() : '';
	    });
	  };
	  function dasherize(str) {
	    return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
	  }

	  uniq = function uniq(array) {
	    return _filter.call(array, function (item, idx) {
	      return array.indexOf(item) == idx;
	    });
	  };

	  function maybeAddPx(name, value) {
	    return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
	  }

	  function children(element) {
	    return 'children' in element ? _slice.call(element.children) : $.map(element.childNodes, function (node) {
	      if (node.nodeType == 1) return node;
	    });
	  }

	  // `$.knife.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overridden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  knife.fragment = function (html, name, properties) {
	    var dom, nodes, container;

	    // A special case optimization for a single tag
	    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

	    if (!dom) {
	      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
	      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
	      if (!(name in containers)) name = '*';

	      container = containers[name];
	      container.innerHTML = '' + html;
	      dom = $.each(_slice.call(container.childNodes), function () {
	        container.removeChild(this);
	      });
	    }

	    if ($.isPlainObject(properties)) {
	      nodes = $(dom);
	      $.each(properties, function (key, value) {
	        if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
	      });
	    }

	    return dom;
	  };

	  // `$.knife.qsa` is Knife's CSS selector implementation which
	  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	  // This method can be overridden in plugins.
	  knife.qsa = function (element, selector) {
	    var found,
	        maybeID = selector[0] == '#',
	        maybeClass = !maybeID && selector[0] == '.',
	        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
	        // Ensure that a 1 char tag name still gets checked
	    isSimple = simpleSelectorRE.test(nameOnly);

	    return element.getElementById && isSimple && maybeID ? // Safari DocumentFragment doesn't have getElementById
	    (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : _slice.call(isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
	    maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	    element.getElementsByTagName(selector) : // Or a tag
	    element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	    );
	  };

	  function filtered(nodes, selector) {
	    return selector == null ? $(nodes) : $(nodes).filter(selector);
	  }

	  function funcArg(ctx, arg, idx, payload) {
	    return $.isFunction(arg) ? arg.call(ctx, idx, payload) : arg;
	  }

	  function setAttribute(node, name, value) {
	    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	  }

	  // "true"  => true
	  // "false" => false
	  // "null"  => null
	  // "42"    => 42
	  // "42.5"  => 42.5
	  // "08"    => "08"
	  // JSON    => parse if valid
	  // String  => self
	  function deserializeValue(value) {
	    try {
	      return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
	    } catch (e) {
	      return value;
	    }
	  }

	  // 静态属性,可直接调用
	  $.isEmptyObject = function (obj) {
	    var name;
	    for (name in obj) {
	      return false;
	    }return true;
	  };

	  $.inArray = function (elem, array, i) {
	    return emptyArray.indexOf.call(array, elem, i);
	  };
	  $.camelCase = camelize;

	  $.map = function (elements, callback) {
	    var value,
	        values = [],
	        i,
	        key;
	    if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
	      value = callback(elements[i], i);
	      if (value != null) values.push(value);
	    } else for (key in elements) {
	      value = callback(elements[key], key);
	      if (value != null) values.push(value);
	    }
	    return flatten(values);
	  };

	  $.grep = function (elements, callback) {
	    return _filter.call(elements, callback);
	  };

	  $.parseJSON = JSON.parse;

	  // Define methods that will be available on all
	  // Knife collections
	  // 原型, 在$()后可调用
	  $.fn = {
	    constructor: knife.K,
	    length: 0,

	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    sort: emptyArray.sort,
	    splice: emptyArray.splice,
	    indexOf: emptyArray.indexOf,
	    concat: function concat() {
	      var i,
	          value,
	          args = [];
	      for (i = 0; i < arguments.length; i++) {
	        value = arguments[i];
	        args[i] = knife.isK(value) ? value.toArray() : value;
	      }
	      return _concat.apply(knife.isK(this) ? this.toArray() : this, args);
	    },
	    // `map` and `slice` in the jQuery API work differently
	    // from their array counterparts
	    map: function map(fn) {
	      return $($.map(this, function (el, i) {
	        return fn.call(el, i, el);
	      }));
	    },
	    slice: function slice() {
	      return $(_slice.apply(this, arguments));
	    },
	    get: function get(idx) {
	      return idx === undefined ? _slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
	    },
	    toArray: function toArray() {
	      return this.get();
	    },
	    size: function size() {
	      return this.length;
	    },
	    remove: function remove() {
	      return this.each(function () {
	        if (this.parentNode != null) this.parentNode.removeChild(this);
	      });
	    },
	    each: function each(callback) {
	      emptyArray.every.call(this, function (el, idx) {
	        return callback.call(el, idx, el) !== false;
	      });
	      return this;
	    },
	    filter: function filter(selector) {
	      if (isFunction(selector)) return this.not(this.not(selector));
	      return $(_filter.call(this, function (element) {
	        return knife.matches(element, selector);
	      }));
	    },
	    find: function find(sel) {
	      var result,
	          $this = this;
	      if (!sel) result = $();else if (this.length == 1) result = $(knife.qs(sel, this[0]));
	      /*
	       else if (typeof sel == 'object')
	       result = $(sel).filter(function () {
	       var node = this
	       return emptyArray.some.call($this, function (parent) {
	       return $.contains(parent, node)
	       })
	       })
	       else if (this.length == 1) result = $(knife.qsa(this[0], sel))
	       else result = this.map(function () {
	       return knife.qsa(this, sel)
	       })
	       */
	      return result;
	    },
	    contents: function contents() {
	      return this.map(function () {
	        return this.contentDocument || _slice.call(this.childNodes);
	      });
	    },
	    empty: function empty() {
	      return this.each(function () {
	        this.innerHTML = '';
	      });
	    },
	    // `pluck` is borrowed from Prototype.js
	    pluck: function pluck(property) {
	      return $.map(this, function (el) {
	        return el[property];
	      });
	    },
	    html: function html(_html) {
	      var rs = $.html(this[0], _html);
	      return 0 in arguments ? this : rs;
	    },
	    text: function text(_text) {
	      return 0 in arguments ? this.each(function (idx) {
	        var newText = funcArg(this, _text, idx, this.textContent);
	        this.textContent = newText == null ? '' : '' + newText;
	      }) : 0 in this ? this.pluck('textContent').join("") : null;
	    },
	    attr: function attr(name, value) {
	      var rs = $.attr(this[0], name, value);
	      return 1 in arguments ? this : rs;
	    },
	    removeAttr: function removeAttr(name) {
	      $.removeAttr(this[0], name);
	      return this;
	    },
	    prop: function prop(name, value) {
	      var rs = $.prop(this[0], name, value);
	      return 1 in arguments ? this : rs;
	    },
	    removeProp: function removeProp(name) {
	      $.removeProp(this[0], name);
	      return this;
	    },
	    hasClass: function hasClass(name) {
	      return $.hasClass(this[0], name);
	    },
	    addClass: function addClass(name) {
	      $.addClass(this[0], name);
	      return this;
	    },
	    removeClass: function removeClass(name) {
	      $.removeClass(this[0], name);
	      return this;
	    },
	    on: function on(event, handle) {
	      this[0].addEventListener(event, handle);
	      return this;
	    },
	    off: function off(event, handle) {
	      this[0].removeEventListener(event, handle);
	      return this;
	    }

	  };

	  // for now
	  $.fn.detach = $.fn.remove;

	  // Generate the `width` and `height` functions
	  ['width', 'height'].forEach(function (dimension) {
	    var dimensionProperty = dimension.replace(/./, function (m) {
	      return m[0].toUpperCase();
	    });

	    $.fn[dimension] = function (value) {
	      var offset,
	          el = this[0];
	      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
	        el = $(this);
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()));
	      });
	    };
	  });

	  function traverseNode(node, fun) {
	    fun(node);
	    for (var i = 0, len = node.childNodes.length; i < len; i++) {
	      traverseNode(node.childNodes[i], fun);
	    }
	  }

	  // Generate the `after`, `prepend`, `before`, `append`,
	  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	  adjacencyOperators.forEach(function (operator, operatorIndex) {
	    var inside = operatorIndex % 2; //=> prepend, append

	    $.fn[operator] = function () {
	      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	      var argType,
	          nodes = $.map(arguments, function (arg) {
	        argType = type(arg);
	        return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg);
	      }),
	          parent,
	          copyByClone = this.length > 1;
	      if (nodes.length < 1) return this;

	      return this.each(function (_, target) {
	        parent = inside ? target : target.parentNode;

	        // convert all methods to a "before" operation
	        target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;

	        var parentInDocument = $.contains(document.documentElement, parent);

	        nodes.forEach(function (node) {
	          if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();

	          parent.insertBefore(node, target);
	          if (parentInDocument) traverseNode(node, function (el) {
	            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) window['eval'].call(window, el.innerHTML);
	          });
	        });
	      });
	    };

	    // after    => insertAfter
	    // prepend  => prependTo
	    // before   => insertBefore
	    // append   => appendTo
	    $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
	      $(html)[operator](this);
	      return this;
	    };
	  });

	  // Export internal API functions in the `$.knife` namespace
	  $.knife.uniq = uniq;
	  $.knife.deserializeValue = deserializeValue;

	  $.K.prototype = $.knife.K.prototype = $.fn;

	  return $;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Created by way on 16/8/28.
	 * 静态 dom 常用操作, 通过 $ 静态属性、方法访问
	 */

	(function (global, factory) {
	  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return factory(global);
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else factory(global);
	})(typeof window !== "undefined" ? window : undefined, function (window) {
	  var Knife = function () {
	    // 函数内私有变量及函数
	    var $,
	        classCache = {},
	        idCache = {},
	        readyRE = /complete|loaded|interactive/,
	        class2type = {},
	        toString = class2type.toString,
	        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	        knife = {},
	        propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    };

	    function classRE(name) {
	      return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
	    }

	    // 私有方法
	    function funcArg(ctx, arg, idx, payload) {
	      return $.isFunction(arg) ? arg.call(ctx, idx, payload) : arg;
	    }

	    function setAttribute(node, name, value) {
	      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	    }

	    document.ready = function (callback) {
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback();else document.addEventListener('DOMContentLoaded', function () {
	        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
	        callback();
	      }, false);
	    };

	    // 构造函数
	    function K(dom, sel) {
	      this.selector = sel || '';
	      this[0] = this.dom = dom;
	      this.length = 1;
	      if (!dom) this.length = 0;
	    }

	    // `$.knife.Z` swaps out the prototype of the given `dom` array
	    // of nodes with `$.fn` and thus supplying all the Knife functions
	    // to the array. This method can be overridden in plugins.
	    knife.K = function (dom, sel) {
	      return new K(dom, sel);
	    };

	    // `$.knife.isK` should return `true` if the given object is a Knife
	    // collection. This method can be overridden in plugins.
	    knife.isK = function (obj) {
	      return obj instanceof knife.K;
	    };

	    knife.id = function (x) {
	      return x in idCache ? idCache[x] : idCache[x] = knife.K(document.getElementById(x), x);
	    };

	    // knife 实现
	    knife.fragment = function (html, name, properties) {};
	    // `$.knife.init` is Knife's counterpart to jQuery's `$.fn.init` and
	    // takes a CSS selector and an optional context (and handles various
	    // special cases).
	    // This method can be overridden in plugins.
	    knife.init = function (sel, root) {
	      var dom = void 0;
	      // If nothing given, return an empty Zepto collection
	      if (!sel) return knife.Z();
	      // Optimize for string selectors
	      if (typeof sel === 'string') {
	        if (sel[0] === '#') return knife.id(sel.substr(1));

	        if (sel[0] == '<' && fragmentRE.test(sel)) dom = knife.fragment(sel, RegExp.$1, root), sel = null;else dom = $.qu(sel, root);
	      } else if (knife.isK(sel)) return sel;
	      // Wrap DOM nodes.
	      else if ($.isObject(sel)) dom = sel, sel = null;

	      // create a new Knife collection from the nodes found
	      return knife.K(dom, sel);
	    };

	    // `$` will be the base `Knife` object. When calling this
	    // function just call `$.knife.init, which makes the implementation
	    // details of selecting nodes and creating Knife collections
	    // patchable in plugins.
	    // 实例化函数调用, $() 返回一个新的实例!
	    $ = function $(selector, context) {
	      return knife.init(selector, context);
	    };

	    $.K = K;
	    $.knife = knife;

	    // plugin compatibility
	    $.uuid = 0;
	    $.expr = {};
	    $.noop = function () {};

	    // 静态属性,可直接调用
	    $.type = function (obj) {
	      return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
	    };

	    $.isFunction = function (value) {
	      return $.type(value) == 'function';
	    };
	    $.isWindow = function (obj) {
	      return obj != null && obj == obj.window;
	    };

	    $.isDocument = function (obj) {
	      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    };

	    $.isObject = function (obj) {
	      return $.type(obj) == 'object';
	    };
	    $.isPlainObject = function (obj) {
	      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	    };
	    $.isArray = Array.isArray || function (object) {
	      return object instanceof Array;
	    };
	    $.isNumeric = function (val) {
	      var num = Number(val),
	          type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	      return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false;
	    };
	    $.trim = function (str) {
	      return str == null ? '' : String.prototype.trim.call(str);
	    };

	    $.support = function () {
	      var support = {
	        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)
	      };
	      return support;
	    }();

	    $.touchEvents = {
	      start: $.support.touch ? 'touchstart' : 'mousedown',
	      move: $.support.touch ? 'touchmove' : 'mousemove',
	      end: $.support.touch ? 'touchend' : 'mouseup'
	    };

	    $.likeArray = function (obj) {
	      var length = !!obj && 'length' in obj && obj.length,
	          type = $.type(obj);

	      return 'function' != type && !$.isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
	    };
	    $.each = function (els, callback) {
	      var i, key;
	      if ($.likeArray(els)) {
	        for (i = 0; i < els.length; i++) {
	          if (callback.call(els[i], i, els[i]) === false) return els;
	        }
	      } else {
	        for (key in els) {
	          if (callback.call(els[key], key, els[key]) === false) return els;
	        }
	      }
	      return els;
	    };
	    // Populate the class2type map
	    $.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
	      class2type['[object ' + name + ']'] = name.toLowerCase();
	    });

	    $.id = function (x) {
	      return document.getElementById(x);
	      return x in idCache ? idCache[x] : idCache[x] = knife.K(document.getElementById(x), x);
	    };
	    $.qu = function (sel, root) {
	      if (root) return knife.isK(root) ? root[0].querySelector(sel) : root.querySelector(sel);
	      return document.querySelector(sel);
	    };
	    $.qus = function (sel, root) {
	      if (root) return knife.isK(root) ? root[0].querySelectorAll(sel) : root.querySelectorAll(sel);
	      return document.querySelectorAll(sel);
	    };
	    $.nms = function (name) {
	      return document.getElementsByName(name);
	    };
	    $.tags = function (el, tag) {
	      el = el || document;
	      return el.getElementsByTagName(tag.toUpperCase());
	    };
	    $.dc = function (obj, tag, cls) {
	      var el = document.createElement(tag);
	      if (cls) el.className = cls;
	      obj.appendChild(el);
	      return el;
	    };
	    $.html = function (el, html) {
	      if (html !== undefined) {
	        var originHtml = el.innerHTML;
	        el.innerHTML = '';
	        $(el).append(funcArg(el, html, 0, originHtml));
	      } else return el ? el.innerHTML : null;
	    };
	    $.attr = function (el, name, value) {
	      var result;
	      if (!el) return '';
	      if (typeof name == 'string' && value === undefined) return el && el.nodeType == 1 && (result = el.getAttribute(name)) != null ? result : ''; // undefined)

	      if (el.nodeType !== 1) return false;
	      if (isObject(name)) for (key in name) {
	        setAttribute(el, key, name[key]);
	      } else setAttribute(el, name, funcArg(el, value, 0, el.getAttribute(name)));
	      return true;
	    };
	    $.attrn = function (el, name) {
	      if (!el) return '';

	      var rc = el.getAttribute(name);
	      if (rc == null) rc = '';
	      if (rc) rc = name + '=' + rc + ';';
	      return rc;
	    };
	    $.removeAttr = function (el, name) {
	      el.nodeType === 1 && name.split(' ').forEach(function (attribute) {
	        setAttribute(el, attribute);
	      });
	    };
	    $.prop = function (el, name, value) {
	      name = propMap[name] || name;
	      return value !== undefined ? (el[name] = funcArg(el, value, 0, el[name]), true) : el && el[name];
	    };
	    $.removeProp = function (el, name) {
	      name = propMap[name] || name;
	      delete el[name];
	    };
	    // access className property while respecting SVGAnimatedString
	    $.className = function (node, value) {
	      var cls = (node.className || '').trim(),
	          svg = cls && cls.baseVal !== undefined;

	      if (value === undefined) return svg ? cls.baseVal : cls;
	      svg ? cls.baseVal = value : node.className = value;
	    };
	    $.hasClass = function (el, name) {
	      if (!el || !name) return false;
	      return classRE(name).test($.className(el));
	    };
	    $.addClass = function (el, name) {
	      if (!el || !name) return false;
	      var cs = [];
	      var cl = $.className(el),
	          newName = funcArg(el, name, 0, cl);
	      newName.split(/\s+/g).forEach(function (klass) {
	        if (!$.hasClass(el, klass)) cs.push(klass);
	      });
	      cs.length && $.className(el, cl + (cl ? ' ' : '') + cs.join(' '));
	      return true;
	    };
	    $.removeClass = function (el, name) {
	      if (name === undefined) return $.className(el, '');
	      var classList = $.className(el);
	      funcArg(el, name, 0, classList).split(/\s+/g).forEach(function (cls) {
	        classList = classList.replace(classRE(cls), ' ');
	      });
	      $.className(el, classList.trim());
	    };
	    // 第一个子元素节点或非空文本节点 Object.prototype. ie 不支持
	    $.firstChild = function (el) {
	      var RC = null;
	      if (!el) return null;

	      try {
	        for (var i = 0; i < el.childNodes.length; i++) {
	          var nd = el.childNodes[i];

	          // alert(nd.nodeType + "/" + nd.nodeName + "/"
	          //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	          if (nd.nodeType === 1 // 元素节点
	          // 有效文本节点，nodeName == "#text"
	           || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	            RC = nd;
	            break;
	          }
	        }
	      } catch (e) {
	        alert('firstChild exp:' + e.message);
	      }
	      return RC;
	    };
	    // 下一个子元素节点或非空文本节点
	    $.nextNode = function (el) {
	      var RC = null;
	      if (!el) return null;

	      var nd = el.nextSibling;
	      while (nd) {
	        if (nd.nodeType === 1 // 元素节点
	        // 有效文本节点，nodeName == "#text"
	         || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC = nd;
	          break;
	        }
	        nd = nd.nextSibling;
	      }
	      return RC;
	    };
	    // 最后一个子元素节点或非空文本节点 Object.prototype. ie 不支持
	    $.lastChild = function (el) {
	      var RC = null;
	      if (!el) return null;

	      for (var i = el.childNodes.length - 1; i >= 0; i--) {
	        var nd = el.childNodes[i];

	        // alert(nd.nodeType + "/" + nd.nodeName + "/"
	        //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	        if (nd.nodeType === 1 // 元素节点，元素节点没有 nodeValue
	        // 有效文本节点，nodeName == "#text"
	         || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC = nd;
	          break;
	        }
	      }
	      return RC;
	    };
	    // 元素子节点或非空文本节点数量
	    $.childCount = function (el) {
	      var RC = 0;

	      if (!el) return 0;

	      for (var i = 0; i < el.childNodes.length; i++) {
	        var nd = el.childNodes[i];

	        // alert(nd.nodeType + "/" + nd.nodeName + "/"
	        //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	        if (nd.nodeType === 1 // 元素节点，元素节点没有 nodeValue
	        // 有效文本节点，nodeName === "#text"
	         || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC++;
	        }
	      }
	      return RC;
	    };
	    // 得到obj的上级元素TagName
	    // ff parentNode 会返回 空 节点
	    // ff textNode节点 没有 tagName
	    $.upperTag = function (el, tagName) {
	      var RC = null;

	      var tn = tagName.toUpperCase();

	      var i = 0;
	      var nd = el;
	      while (nd) {
	        i++;
	        if (i >= 10) break;
	        if (nd.tagName && nd.tagName === tn) {
	          RC = nd;
	          break;
	        }
	        nd = nd.parentNode;
	      }
	      return RC;
	    };

	    // 得到obj的上级元素TagName
	    // ff parentNode 会返回 空 节点
	    // ff textNode节点 没有 tagName
	    /**
	     * 获取 指定 tagName的子元素
	     * @param el
	     * @param tagName
	     * @returns {*}
	     */
	    $.childTag = function (el, tag) {
	      var RC = null;

	      if (!el) return null;

	      try {
	        for (var i = 0; i < el.childNodes.length; i++) {
	          var nd = el.childNodes[i];

	          if (nd.tagName && nd.tagName === tag.toUpperCase()) {
	            RC = nd;
	            break;
	          }
	        }
	      } catch (e) {
	        alert('childTag exp:' + e.message);
	      }

	      return RC;
	    };
	    /**
	     * 光标放入尾部
	     * @param el
	     */
	    $.cursorEnd = function (el) {
	      el.focus();

	      if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
	        var rg = document.createRange();
	        rg.selectNodeContents(el);
	        // 合并光标
	        rg.collapse(false);
	        var sel = window.getSelection();
	        sel.removeAllRanges();
	        sel.addRange(rg);
	      } else if (typeof document.body.createTextRangrge !== 'undefined') {
	        var _rg = document.body.createTextRange();
	        _rg.moveToElementText(el);
	        // 合并光标
	        _rg.collapse(false);
	        // textRange.moveStart('character', 3);
	        _rg.select();
	      }
	    };

	    /**
	     * 获取光标位置
	     * @param el
	     * @returns {number}
	     */
	    $.getCursorPos = function (el) {
	      var rs = 0;

	      if (!el) return 0;

	      // obj.focus();
	      if (el.selectionStart) {
	        // IE以外
	        rs = el.selectionStart;
	      } else {
	        // IE
	        var rg = null;
	        if (el.tagName.toLowerCase() === 'textarea') {
	          // TEXTAREA
	          rg = event.srcElement.createTextRange();
	          rg.moveToPoint(event.x, event.y);
	        } else {
	          // Text
	          rg = document.selection.createRange();
	        }
	        rg.moveStart('character', -event.srcElement.value.length);
	        // rg.setEndPoint("StartToStart", obj.createTextRange())
	        rs = rg.text.length;
	      }
	      return rs;
	    };

	    // 得到光标的位置
	    $.getCursorPosition = function (el) {
	      var qswh = '@#%#^&#*$';
	      // obj.focus();
	      var rng = document.selection.createRange();
	      rng.text = qswh;
	      var nPosition = el.value.indexOf(qswh);
	      rng.moveStart('character', -qswh.length);
	      rng.text = '';
	      return nPosition;
	    };

	    // 设置光标位置
	    $.setCursorPos = function (el, pos) {
	      var rg = el.createTextRange();
	      rg.collapse(true);
	      rg.moveStart('character', pos);
	      rg.select();
	    };

	    $.moveFirst = function () {
	      this.rowindex = 0;
	    };

	    // 返回 $ 类,可以直接调用其静态属性和方法
	    return $;
	  }();

	  // If `$` is not yet defined, point it to `Knife`
	  window.Knife = Knife;
	  window.$ === undefined && (window.$ = Knife);
	  return Knife;
	});

/***/ }
/******/ ]);