(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var extend  = require('extend')
var closest = require('closest')

/**
 * Module
 */
module.exports = function ($elements, opts) {
  var options, data

  options = extend(true, {
    size: 'cover',
    parent: 'window',
    limit: false
  }, opts)

  data = {
    active: false
  }

  if ($elements === undefined) {
    console.error('Please pass an element')
    return
  }

  if (typeof $elements === 'object') {
    Object.keys($elements).map(function (key) {
      return $elements[key][0]
    })
  }

  var format = function () {
    for (var i = 0; i < $elements.length; i++) {
      resizeElement($elements[i])
    }
  }

  var helpers = {
    elementRatio : function(_element) {
      var _ratios = {
        x : 0,
        y : 0,
      }
      if (_element.hasAttribute('height') && _element.hasAttribute('width')) {
        _ratios.y = _element.getAttribute('width') / _element.getAttribute('height')
        _ratios.x = _element.getAttribute('height') / _element.getAttribute('width')
        return _ratios
      } else if (_element.hasAttribute('data-aspect-ratio')) {
        var _ratio = _element.getAttribute('data-aspect-ratio').split(':')
        _ratios.y = parseInt(_ratio[0]) / parseInt(_ratio[1])
        _ratios.x = parseInt(_ratio[1]) / parseInt(_ratio[0])
        return _ratios
      }
      _ratios = false
      return _ratios
    },

    isElement : function(value){
      return value !== undefined
        && typeof HTMLElement !== 'undefined'
        && value instanceof HTMLElement
        && value.nodeType === 1;
    },

    parentDimensions : function (_element, _parent) {
      var _dimensions = {
        w : 0,
        h : 0,
      }
      if (!_parent || _parent === window || _parent === 'window') {
        _dimensions.w = window.innerWidth
        _dimensions.h = window.innerHeight
        return _dimensions
      }
      if(typeof _parent === 'object' && !helpers.isElement(_parent)){
        _parent = _parent[0]
      }
      if (helpers.isElement(_parent)) {
        _dimensions.w = _parent.clientWidth
        _dimensions.h = _parent.clientHeight
        return _dimensions
      }
      if (_parent = closest(_element, _parent) || document.querySelector(_parent)) {
        _dimensions.w = _parent.clientWidth
        _dimensions.h = _parent.clientHeight
        return _dimensions
      }
      _dimensions = false
      return _dimensions
    }
  }

  // Starting to get unwieldy... break this into smaller pieces soon
  var resizeElement = function (_element) {
    var _size = options.size
    var _parent = null
    var _ratio = null
    var _origHeight = 0
    var _origWidth = 0 
    var _height = 0
    var _width = 0
    var _marginTop = 0
    var _marginLeft = 0
    var _check = null

    _ratio = helpers.elementRatio(_element)
    if (!_ratio) {
      console.error('Element needs height and width defined')
      return
    } else {
      _origHeight = parseInt(_element.getAttribute('height'))
      _origWidth = parseInt(_element.getAttribute('width'))
    }

    if (_element.hasAttribute('data-size')) {
      var _attr = _element.getAttribute('data-size')
      if (_attr === 'cover' || _attr === 'contain') {
        _size = _attr
      }
    }

    _parent = helpers.parentDimensions(_element, options.parent)
    if (!_parent) {
      console.error('Invalid parent option')
      return
    }

    if (_size === 'contain') {
      _check = (_parent.w / _parent.h) > _ratio.y
    } else if (_size === 'cover') {
      _check = (_parent.w / _parent.h) < _ratio.y
    } else {
      console.warn('Please select a size mode')
    }

    if (_check) {
      // Tall
      _height = Math.ceil(_parent.h)
      _width = Math.ceil(_parent.h * _ratio.y)
    } else {
      // Wide
      _height = Math.ceil(_parent.w * _ratio.x)
      _width = Math.ceil(_parent.w)
    }

    if (_size === 'contain' && options.limit) {
      if (_height > _origHeight) {
        _height = _origHeight
      }
      if (_width > _origWidth) {
        _width = _origWidth
      }
    } 

    _marginTop = Math.ceil((_parent.h - _height) / 2)
    _marginLeft = Math.ceil((_parent.w - _width) / 2)

    /**
     * Set the styles
     */
    _element.style.height = _height + 'px'
    _element.style.width = _width + 'px'
    _element.style.marginTop = _marginTop + 'px'
    _element.style.marginLeft = _marginLeft + 'px'
  }

  var start = function () {
    if (data.active) return
    data.active = true
    window.addEventListener('resize', format, false)
    format()
  }

  var refresh = function () {
    format()
  }

  var stop = function () {
    if (!data.active) return
    data.active = true
    window.removeEventListener('resize', format, false)
  }

  var setSize = function (size) {
    if (size !== 'cover' && size !== 'contain') {
      console.warn('Please pass a valid size')
    } else {
      options.size = size
      format()
    }
  }

  /**
   * Public methods
   */
  return {
    'start': start,
    'refresh': refresh,
    'stop': stop,
    'setSize': setSize
  }
}

},{"closest":2,"extend":4}],2:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":3}],3:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],4:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],5:[function(require,module,exports){
var resize = require('./')

// Toggle position
var pos = 0
var options = ['cover', 'contain']

// Elements
var elements = document.querySelectorAll('[data-resize]')

// Resize setup
var media = resize(elements, {
  size: 'contain'
})

// Start resizing
media.start()

// Toggle through size options on click
window.addEventListener('click', function () {
  var _opt = options[pos++ % options.length]
  media.setSize(_opt)
  document.querySelectorAll('[data-status]')[0].innerHTML = _opt
})

},{"./":1}]},{},[5]);
