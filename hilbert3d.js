
var Point = require('./point').Point;

debug = false;

log = function(s) {
  if (debug) console.log(s);
};

var d2horseshoe = [0, 1, 3, 2, 6, 7, 5, 4];
var horseshoe2d = [0, 1, 3, 2, 7, 6, 4, 5];

var Hilbert3d = exports.Hilbert3d = function(options, axisOrderOpt) {

  options = options || {};
  if (typeof options == 'number') {
    this.size = options;
    this.anchorAxisOrder = axisOrderOpt;
  } else if (typeof options == 'string') {
    this.anchorAxisOrder = options;
  } else {
    // should be empty if we're prioritizing bottom level.
    this.size = options.top;
    this.anchorAxisOrder = options.axisOrder;
  }

  if (this.anchorAxisOrder && !(this.anchorAxisOrder in { xyz:1,xzy:1,yxz:1,yzx:1,zxy:1,zyx:1 })) {
    throw new Error("Invalid axis order: " + anchorAxisOrder);
  }
  if (this.anchorAxisOrder == 'xyz') {
    this.anchorAxisOrder = null;
  }
  if (this.anchorAxisOrder) {
    this.reverseAnchorAxisOrder = {
      xzy: 'xzy',
      yxz: 'yxz',
      yzx: 'zxy',
      zxy: 'yzx',
      zyx: 'zyx'
    }[this.anchorAxisOrder]
  }

  if (this.size) {
    this.log2size = 0;
    var pow2 = 1;
    for (; pow2 < this.size; pow2 *= 2, this.log2size++) {}
    if (pow2 != this.size) {
      throw new Error("Invalid size: " + this.size + ". Must be a power of 2.");
    }
    this.log2parity = (this.log2size % 3);
  }

  this.d2xyz = this.xyz = function (d) {
    d = Math.floor(d);
    var p = new Point();
    var s = 1;
    var iter = 2;
    var size = this.size || 0;
    while (d > 0 || s < size) {
      var xBit = d & 1;
      var yBit = (d / 2) & 1;
      var zBit = (d / 4) & 1;

      var regs = new Point(xBit ^ yBit, yBit ^ zBit, zBit);
      p = p.rotate(regs, s - 1).add(regs.mult(s));

      d = Math.floor(d / 8);
      s *= 2;
      iter++;
    }
    if (this.size) {
      p = p.rotateLeft(iter - this.log2parity + 1);
    } else {
      p = p.rotateLeft(iter);
    }
    return p.shuffle(this.reverseAnchorAxisOrder);
  };

  this.xyz2d = this.d = function (x, y, z) {
    var p = new Point(x, y, z).map(Math.floor);
    var s = 1;
    var level = 0;
    var max = Math.max.apply(Math, p.arr);
    for (; 2 * s <= max; s *= 2) {
      level = (level + 1) % 3;
    }

    p = p.shuffle(this.anchorAxisOrder);
    if (this.size) {
      p = p.rotateRight(level - this.log2parity + 1);
    } else {
      p = p.rotateRight(level);
    }

    var d = 0;
    while (s > 0) {
      var regs = new Point(p.x & s && 1, p.y & s && 1, p.z & s && 1);

      log("p: " + p.pp() + " s: " + s + " regs: " + regs.pp() + "(" + regs.n + ") level: " + level + " v: " + horseshoe2d[regs.n]);
      d *= 8;
      d += horseshoe2d[regs.n];

      level = (level + 2) % 3;
      p = p.mod(s);
      p = p.unrotate(regs, s - 1);
      s = Math.floor(s / 2);
    }

    return d;
  };
};