/**
 * @fileoverview Waver.js - a Siri like waver library.
 * @version 0.1.0
 *
 * @license MIT, see https://github.com/unixzii/Waver.js/LICENSE
 * @copyright 2016 Cyandev <unixzii@gmail.com>
 *
 * Code structure aims at minimizing the compressed library size
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    factory((root.Waver = {}));
  }
})(this, function (exports) {
  // Optimized for compression and minify.
  var _window   = window,
      _document = document;

  var configs = {
    frequency: 1.2,
    idleAmplitude: 0.1,
    waveCount: 5,
    phaseShift: -0.2,
    color: '#ffffff',
    primaryLineWidth: 4.0,
    otherLineWidth: 1.0
  };

  // Canvas states.
  var ctx, height, width;
  // Waver states.
  var phase = 0;
  var amplitude = 0.1;
  var targetAmplitude = 0;
  // Update callback.
  var callback;

  var _update = function () {
    // Optimized update strategy.
    phase += configs.phaseShift;
    if (typeof callback !== 'undefined') {
      targetAmplitude = Math.max(Math.min(callback(), 1.0), configs.idleAmplitude);
      amplitude -= (amplitude - targetAmplitude) * 0.05 * Math.abs(targetAmplitude - amplitude); // Debounce the level changing.
    } else {
      amplitude = configs.idleAmplitude;
    }
  };

  var _render = function () {
    _update();

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < configs.waveCount; i++) {
      var progress = 1.0 - i / configs.waveCount;
      // Shift the last wave's amplitude to make it lower than current level.
      var normalizedAmplitude = (1.5 * progress - 0.5) * amplitude;

      ctx.beginPath();

      for (var x = 0; x <= width; x++) {
        // Core algorithm from "https://github.com/kevinzhow/Waver/".
        var scaling = -Math.pow(x / (width / 2.0) - 1, 2) + 1;

        var y = normalizedAmplitude * Math.sin(2 * Math.PI * (x / width) * configs.frequency + phase); // base factor
        y *= scaling * (height - 400); // Scale it to proper height.
        y += height / 2.0; // Translate it to vertical center.

        if (x == 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = i == 0 ? configs.primaryLineWidth : configs.otherLineWidth;
      ctx.globalAlpha = 1.0 - Math.pow(i / configs.waveCount, 2);
      ctx.stroke();
    }

    _window.requestAnimationFrame(_render);
  };

  var init = function (el, cb) {
    ctx = el.getContext('2d');
    height = el.height;
    width = el.width;
    callback = cb;

    ctx.strokeStyle = configs.color;

    _window.requestAnimationFrame(_render);
  };

  exports.init = init;
});
