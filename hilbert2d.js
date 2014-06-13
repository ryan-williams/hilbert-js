
exports.d2xy = function(d) {
  d = Math.floor(d);
  var curPos = {
    x: 0,
    y: 0
  };
  var s = 1;
  var iter = 0;
  while (d > 0) {
    var ry = 1 & (d/2);
    var rx = 1 & (ry ^ d);

    // Rotate, if need be
    if (rx == 0) {
      if (ry == 1) {
        curPos = {
          x: s - 1 - curPos.x,
          y: s - 1 - curPos.y
        };
      }
      curPos = {
        x: curPos.y,
        y: curPos.x
      };
    }

    curPos = {
      x: curPos.x + s*rx,
      y: curPos.y + s*ry
    };

    s *= 2;
    d = Math.floor(d/4);
    iter = (iter + 1) % 2;
  }
  if (iter == 0) {
    curPos = {
      x: curPos.y,
      y: curPos.x
    };
  }
  return curPos;
};

var horseshoe2d = [0, 1, 3, 2];

exports.xy2d = function(x, y) {
  x = Math.floor(x);
  y = Math.floor(y);
  var s = 1;
  var max = Math.max(x,y);
  var level = 0;
  for (; 2*s <= max; s*=2) {
    level = (level + 1) % 2;
  }
  if (level % 2 == 1) {
    var t = x;
    x = y;
    y = t;
  }

  var d = 0;
  while(s > 0) {
    var rx = x&s && 1;
    var ry = y&s && 1;
    d *= 4;
    d += horseshoe2d[2*ry + rx];
    if (rx == 0) {
      if (ry == 1) {
        x = s-1 - x;
        y = s-1 - y;
      }
      var t = x;
      x = y;
      y = t;
    }
    x %= s;
    y %= s;
    s = Math.floor(s / 2);
  }
  return d;
};
