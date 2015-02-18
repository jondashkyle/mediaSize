var extend = require('extend')

/**
 * Module
 */
module.exports = function ($elements, opts) {
  var options, data

  options = extend(true, {
    'size': 'cover'
  }, opts)

  data = {
    'active': false
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

  var resizeElement = function (_element) {
    var _parent = window
    var _size = options.size
    var _ratioY = 0
    var _ratioX = 0
    var _height = 0
    var _width = 0
    var _marginTop = 0
    var _marginLeft = 0
    var _check = null

    if (!_element.hasAttribute('height') || !_element.hasAttribute('width')) {
      console.error('Element needs height and width defined')
      return
    }

    if (_element.hasAttribute('data-size')) {
      var _attr = _element.getAttribute('data-size')
      if (_attr === 'cover' || _attr === 'contain') {
        _size = _attr
      }
    }

    _ratioY = _element.getAttribute('width') / _element.getAttribute('height')
    _ratioX = _element.getAttribute('height') / _element.getAttribute('width')

    if (_size === 'contain') {
      _check = (_parent.innerWidth / _parent.innerHeight) > _ratioY
    } else if (_size === 'cover') {
      _check = (_parent.innerWidth / _parent.innerHeight) < _ratioY
    } else {
      console.warn('Please select a size mode')
    }

    if (_check) {
      // Tall
      _height = Math.ceil(_parent.innerHeight)
      _width = Math.ceil(_parent.innerHeight * _ratioY)
      _marginTop = 0
      _marginLeft = Math.ceil((_parent.innerWidth - _width) / 2)
    } else {
      // Wide
      _height = Math.ceil(_parent.innerWidth * _ratioX)
      _width = Math.ceil(_parent.innerWidth)
      _marginTop = Math.ceil((_parent.innerHeight - _height) / 2)
      _marginLeft = 0
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
