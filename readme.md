# mediaSize

`npm install mediasize`

Simple DOM module which replicates the css `background-size` attribute.

## Setup

```
var mediasize = require('mediasize')

var media = mediasize($('[data-slide]'), {
  mode  : 'cover',
  parent : $(window)
})

media.start()
```

Require mediaSize. You can pass either a single element or an array of elements using whatever selector method or library you prefer as the first argument. This example is using jQuery as the selector engine. The second argument contains an options object.

## Testing

You can do a quick test by running `npm run watch`, which requires beefy to be installed: `npm install beefy -g`

## Options

### Mode 
You can set **mode** as either `cover` or `contain`, just as you would the CSS background-size attribute.

### Parent
The dimensions of this element will be used as the basis of the new dimensions for your primary element(s). If no element is defined we default to `window`.

## Methods

Methods can be invoked like so:
```
mediasize.start();
```

Available methods:
```
start           Start listening to window resize event
stop            Stop listening to window resize event
```
