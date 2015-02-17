var extend = require('extend')

/**
 * Module
 */
module.exports = function($elements, opts) {

  /**
   * Options
   */
  var options = extend(true, {
    'size' : 'cover'
  }, opts)

  /**
   * Data
   */
  var data = {
    'active' : false
  }

  // Make sure there is an element
  if ( $elements == undefined ) {
    console.error('Please pass an element')
    return
  }

  /**
   * Create an array of a jQuery object
   */
  if ( typeof $elements === 'object' ) {
    Object.keys($elements).map(function (key) {
      return $elements[key][0]
    })
  }

  /**
   * If there was a single element make it an array
   */

  /**
   * Loop through the elements
   */
  var format = function() {
    for (var i = 0; i < $elements.length; i++) {
      resizeElement($elements[i])
    }
  }

  /**
   * Resize the element
   */
  var resizeElement = function(_element) {

    /**
     * Data
     */
    _parent = window
    _size   = options.size
    _ratioY = 0
    _ratioX = 0
    _height = 0
    _width  = 0
    _check  = null

    /**
     * Height/Width attribute check
     */
    if ( ! _element.hasAttribute('height') || ! _element.hasAttribute('width') ) {
      console.error('Element needs height and width defined')
      return
    }

    /**
     * Size
     */
    if ( _element.hasAttribute('data-size') ) {
      var _attr = _element.getAttribute('data-size')
      if ( _attr === 'cover' || _attr === 'contain' ) {
        _size = _attr
      }
    }

    /**
     * Ratios
     */
    _ratioY = _element.getAttribute('width') / _element.getAttribute('height')
    _ratioX = _element.getAttribute('height') / _element.getAttribute('width')

    /**
     * Size mode
     */
    if ( _size === 'contain' ) {
      _check = (_parent.innerWidth/_parent.innerHeight) > _ratioY
    } else if ( _size === 'cover' ) {
      _check = (_parent.innerWidth/_parent.innerHeight) < _ratioY
    } else {
      console.warn('Please select a size mode')
    }

    /**
     * Resize
     */
    if ( _check ) {
      // Tall
      _height     = Math.ceil(_parent.innerHeight)
      _width      = Math.ceil(_parent.innerHeight * _ratioY)
      _marginTop  = 0
      _marginLeft = Math.ceil((_parent.innerWidth - _width) / 2)
    } else {
      // Wide
      _height     = Math.ceil(_parent.innerWidth * _ratioX)
      _width      = Math.ceil(_parent.innerWidth)
      _marginTop  = Math.ceil((_parent.innerHeight - _height) / 2)
      _marginLeft = 0
    }

    /**
     * Set the styles
     */
    _element.style.height = _height + 'px'
    _element.style.width  = _width + 'px'
    _element.style.marginTop   = _marginTop + 'px'
    _element.style.marginLeft  = _marginLeft + 'px'

  }

  /**
   * Start
   */
  var start = function() {
    if ( data.active ) return
    data.active = true
    window.addEventListener('resize', format, false)
    format()
  }

  /**
   * Refresh
   */
  var refresh = function() {
    format()
  }
  
  /**
   * Stop
   */
  var stop = function() {
    if ( ! data.active ) return
    data.active = true
    window.removeEventListener('resize', format, false)
  }

  /**
   * Set size
   */
  var setSize = function(size) {
    if ( size !== 'cover' && size !== 'contain' ) {
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
    'start'   : start,
    'refresh' : refresh,
    'stop'    : stop,
    'setSize' : setSize
  }

}

/**
 * Initialize
 */
exports.init = function(opts) {

  // Extend the options
  options = $.extend(options, opts);

};

/**
 * Load
 */
exports.load = function() {

};

/**
 * Unload
 */
exports.unload = function() {

};

/**
 * On callbacks
 */
exports.on = function(ev, cb) {
  events.on(ev, cb);
};

/**
 * Once callback
 */
exports.once = function(ev, cb) {
  events.once(ev, cb);
}

/**
 * Off callbacks
 */
exports.off = function(ev, cb) {
  events.removeListener(ev, cb);
};