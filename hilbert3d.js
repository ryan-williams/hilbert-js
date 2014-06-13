
var Point = require('./point').Point;

debug = false;

log = function(s) {
  if (debug) console.log(s);
};

pp = function(p) {return p.pp();};

var d2horseshoe = [0, 1, 3, 2, 6, 7, 5, 4];
var horseshoe2d = [0, 1, 3, 2, 7, 6, 4, 5];

var Hilbert3d = exports.Hilbert3d = function(options) {

  this.d2xyz = this.xyz = function (d) {
    d = Math.floor(d);
    var p = new Point();
    var s = 1;
    var iter = 0;
    while (d > 0) {
      var xBit = d & 1;
      var yBit = (d / 2) & 1;
      var zBit = (d / 4) & 1;

      var regs = new Point(xBit ^ yBit, yBit ^ zBit, zBit);
      p = p.rotate(regs, s - 1).add(regs.mult(s));

      d = Math.floor(d / 8);
      s *= 2;
      iter++;
    }
    return p.rotateLeft(iter + 2);
  };

  this.xyz2d = this.d = function (x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    var p = new Point(x, y, z);
    var s = 1;
    var level = 0;
    var max = Math.max(x, y, z);
    for (; 2 * s <= max; s *= 2) {
      level = (level + 1) % 3;
    }

    var d = 0;
    p = p.rotateRight(level);
    while (s > 0) {
      var regs = new Point(p.x & s && 1, p.y & s && 1, p.z & s && 1);

      log("p: " + p.pp() + " s: " + s + " regs: " + regs.pp() + "(" + regs.n + ") level: " + level + " v: " + horseshoe2d[regs.n]);
      d *= 8;
      d += horseshoe2d[regs.n];

      level = (level + 2) % 3;
      p = new Point(p.x % s, p.y % s, p.z % s);
      p = p.unrotate(regs, s - 1);
      s = Math.floor(s / 2);
    }

    return d;
  };
};