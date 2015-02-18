var resize = require('../index')

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
