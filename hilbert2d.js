
var Hilbert2d = exports.Hilbert2d = function(options) {
  options = options || {};
  options.axisOrder = options.axisOrder || { bottom: 'xy' };
  var anchorToTopAxis = !!options.axisOrder.top;
  var anchorAxisOrder = options.axisOrder.top || options.axisOrder.bottom || 'xy';
  if (!(anchorAxisOrder in {xy:1,yx:1})) {
    throw new Error("Invalid axis order: " + anchorAxisOrder);
  }

  function invert(point) {
    return {
      x: point.y,
      y: point.x
    };
  }

  function maybeRotate(point, iter) {
    if (anchorToTopAxis) {
      if (anchorAxisOrder == 'yx') {
        return invert(point);
      }
    } else {
      if (anchorAxisOrder == 'xy') {
        if (iter == 0) {
          return invert(point);
        }
      } else {
        if (iter == 1) {
          return invert(point);
        }
      }
    }
    return point;
  }

  this.d2xy = this.xy = function (d) {
    d = Math.floor(d);
    var curPos = {
      x: 0,
      y: 0
    };
    var s = 1;
    var iter = 0;
    while (d > 0) {
      var ry = 1 & (d / 2);
      var rx = 1 & (ry ^ d);

      // Rotate, if need be
      if (rx == 0) {
        if (ry == 1) {
          curPos = {
            x: s - 1 - curPos.x,
            y: s - 1 - curPos.y
          };
        }
        curPos = invert(curPos);
      }

      curPos = {
        x: curPos.x + s * rx,
        y: curPos.y + s * ry
      };

      s *= 2;
      d = Math.floor(d / 4);
      iter = (iter + 1) % 2;
    }
    return maybeRotate(curPos, iter);
  };

  var horseshoe2d = [0, 1, 3, 2];

  this.xy2d = this.d = function (x, y) {
    var curPos = {
      x: Math.floor(x),
      y: Math.floor(y)
    };
    x = Math.floor(x);
    y = Math.floor(y);
    var s = 1;
    var max = Math.max(curPos.x, curPos.y);
    var level = 0;
    for (; 2 * s <= max; s *= 2) {
      level = (level + 1) % 2;
    }
    if (level % 2 == 1) {
      curPos = invert(curPos);
    }

    var d = 0;
    while (s > 0) {
      var rx = curPos.x & s && 1;
      var ry = curPos.y & s && 1;
      d *= 4;
      d += horseshoe2d[2 * ry + rx];
      if (rx == 0) {
        if (ry == 1) {
          curPos = {
            x: s - 1 - curPos.x,
            y: s - 1 - curPos.y
          }
        }
        curPos = invert(curPos);
      }
      curPos = {
        x: curPos.x % s,
        y: curPos.y % s
      };
      s = Math.floor(s / 2);
    }
    return d;
  };
};