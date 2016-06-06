# Waver.js

A Siri like waver library port from [Waver - kevinzhow](https://github.com/kevinzhow/Waver/).

## Screencast
![](https://github.com/unixzii/Waver.js/raw/master/Images/screencast.gif)

## Usage
```javascript
var canvasEl = ...; // Get the canvas element via whatever you like.
Waver.init(canvasEl, function () {
  return ...; // Return the level value, ranged from 0 to 1.
});
```

## License
The project is available under the MIT license. See the LICENSE file for more info.
