
var Hilbert2d = exports.Hilbert2d = require('./hilbert2d').Hilbert2d;
var Hilbert3d = exports.Hilbert3d = require('./hilbert3d').Hilbert3d;

var h2 = new Hilbert2d();
exports.d2xy = h2.d2xy;
exports.xy = h2.xy;
exports.xy2d = h2.xy2d;
exports.d2 = h2.d;

var h3 = new Hilbert3d();
exports.d2xyz = h3.d2xyz;
exports.xyz = h3.xyz;
exports.xyz2d = h3.xyz2d;
exports.d3 = h3.d;

exports.d = function() {
  if (arguments.length == 2) {
    return h2.d.apply(h2, arguments);
  } else if (arguments.length == 3) {
    return h3.d.apply(h3, arguments);
  } else {
    throw new Error("Invalid number of arguments: " + arguments.length + ". Need 2 or 3");
  }
};
