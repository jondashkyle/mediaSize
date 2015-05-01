# mediaSize

`npm install mediasize`

Simple DOM module which replicates the css `background-size` attribute, but on any block element. Take a look at [an example](http://jondashkyle.github.io/mediaSize/).

## Setup

```
var mediasize = require('mediasize')

var media = mediasize($('[data-slide]'), {
  size : 'cover'
})

media.start()
```

Require mediaSize. You can pass either a single element or an array of elements using whatever selector method or library you prefer as the first argument. This example is using jQuery as the selector engine. The second argument contains an options object.

## Testing

You can do a quick test by running `npm run test`. You'll need Beefy for this, which you can install by running `npm install beefy -g`

## Options

### Mode 
You can set **size** as either `cover` or `contain`, just as you would the CSS background-size attribute.

## Center
When size is set to *contain* and **center** is set to **true** this centers the image within the parent. When set to **false** the element will set top left.

## Limit
When the size is set to *contain* and **limit** is set to **true**, prevent the image from scaling past it's original size.

## Parent
The dimensions of this element will be used as the basis of the new dimensions for your primary element(s). If no element is defined we default to `window`.

## Methods

Methods can be invoked like so:
```
mediasize.start();
```

Available methods:
```
start           Start listening to window resize event
refresh         Reformat everything
stop            Stop listening to window resize event
```
