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
    limit: false,
    center: true
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

    if (! options.center && options.size === 'contain') {
      _marginTop = 0
      _marginLeft = 0
    } else {
      _marginTop = Math.ceil((_parent.h - _height) / 2)
      _marginLeft = Math.ceil((_parent.w - _width) / 2)
    }

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
