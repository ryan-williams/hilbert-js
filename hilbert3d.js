
var Point = require('./point').Point;

debug = false;

log = function(s) {
  if (debug) console.log(s);
};

pp = function(p) {return p.pp();};

var d2horseshoe = [0, 1, 3, 2, 6, 7, 5, 4];
var horseshoe2d = [0, 1, 3, 2, 7, 6, 4, 5];

exports.d2xyz = function() {
  var args = [].slice.call(arguments);
  if (args.length == 1 && args[0] instanceof Array) {
    args = args[0];
  }
  var points = args.map(function(d) {
    d = Math.floor(d);
    var p = new Point();
    var s = 1;
    var iter = 0;
    while (d > 0) {
      var xBit = d & 1;
      var yBit = (d/2) & 1;
      var zBit = (d/4) & 1;

      var regs = new Point(xBit ^ yBit, yBit ^ zBit, zBit);
      p = p.rotate(regs, s-1).add(regs.mult(s));

      d = Math.floor(d/8);
      s *= 2;
      iter++;
    }
    if (iter % 3 == 0) {
      return new Point(p.z, p.x, p.y);
    } else if (iter % 3 == 1) {
      return p;
    } else {
      return new Point(p.y, p.z, p.x);
    }
  });

  if (points.length == 1) return points[0];
  return points;
};

prettyD2XYZ = function() {
  var from = 0, to = arguments[0];
  if (arguments.length == 2) {
    from = arguments[0];
    to = arguments[1];
  }
  var lines = [];
  for (var i = from; i <= to; ++i) {
    var p = d2xyz(i);
    lines.push(i + ":\t[" + p.pp() + "],");
  }
  console.log(lines.join('\n'));
};

exports.xyz2d = function(x, y, z) {
  x = Math.floor(x);
  y = Math.floor(y);
  z = Math.floor(z);
  var p = new Point(x,y,z);
  var s = 1;
  var level = 0;
  var max = Math.max(x, y, z);
  for(; 2*s <= max; s *= 2) {
    level = (level + 1) % 3;
  }

  var d = 0;
  if (level == 1) {
    p = p.rotateRight(1);
  } else if (level == 2) {
    p = p.rotateLeft(1);
  }
  while (s > 0) {
    var regs = new Point(p.x&s && 1, p.y&s && 1, p.z&s && 1);

    log("p: " + p.pp() + " s: " + s + " regs: " + regs.pp() + "(" + regs.n + ") level: " + level + " v: " + horseshoe2d[regs.n]);
    d *= 8;
    d += horseshoe2d[regs.n];

    level = (level + 2) % 3;
    p = new Point(p.x%s, p.y%s, p.z%s);
    p = p.unrotate(regs, s-1);
    s = Math.floor(s/2);
  }

  return d;
};


d2xyzTestMap = {
  0: [0,0,0],
  1: [1,0,0],
  2: [1,1,0],
  3: [0,1,0],
  4: [0,1,1],
  5: [1,1,1],
  6: [1,0,1],
  7: [0,0,1],
  8: [0,0,2],
  9: [0,1,2],
  10: [0,1,3],
  11: [0,0,3],
  12: [1,0,3],
  13: [1,1,3],
  14: [1,1,2],
  15: [1,0,2],
  16: [2,0,2],
  17: [2,1,2],
  18: [2,1,3],
  19: [2,0,3],
  20: [3,0,3],
  21: [3,1,3],
  22: [3,1,2],
  23: [3,0,2],
  24: [3,0,1],
  25: [3,0,0],
  26: [2,0,0],
  27: [2,0,1],
  28: [2,1,1],
  29: [2,1,0],
  30: [3,1,0],
  31: [3,1,1],
  32: [3,2,1],
  33: [3,2,0],
  34: [2,2,0],
  35: [2,2,1],
  36: [2,3,1],
  37: [2,3,0],
  38: [3,3,0],
  39: [3,3,1],
  40: [3,3,2],
  41: [3,2,2],
  42: [3,2,3],
  43: [3,3,3],
  44: [2,3,3],
  45: [2,2,3],
  46: [2,2,2],
  47: [2,3,2],
  48: [1,3,2],
  49: [1,2,2],
  50: [1,2,3],
  51: [1,3,3],
  52: [0,3,3],
  53: [0,2,3],
  54: [0,2,2],
  55: [0,3,2],
  56: [0,3,1],
  57: [1,3,1],
  58: [1,2,1],
  59: [0,2,1],
  60: [0,2,0],
  61: [1,2,0],
  62: [1,3,0],
  63: [0,3,0]
};

//var assert = require('assert');

getPointsMap = function(low, high) {
  var pointsMap = {};
  for (var i = low; i < high; ++i) {
    var key = d2xyz(i).pp();
    if (!(key in pointsMap)) pointsMap[key] = [];
    pointsMap[key].push(i);
  }
  return pointsMap;
};

checkDupes = function(pointsMap) {
  var numDupes = 0;
  for (key in pointsMap) {
    var val = pointsMap[key];
    var num = val.length;
    if (num > 1) {
      log("Found " + num + " points at " + key + ": " + val);
      numDupes += (num - 1);
    }
  }
  return numDupes;
};

testD2XYZ = function(n) {
  for (i in d2xyzTestMap) {
    var p = d2xyz(i).pp();
    if ('' + d2xyzTestMap[i] != p) {
      log(i + ": expected " + d2xyzTestMap[i] + " actual: " + p);
    }
  }

  if (n) {
    var N = Math.pow(8, n);

    var foundPoints = {};
    var numCollisions = 0;
    var numMissing = 0;
    for (var i = 0; i < N; ++i) {
      var p = d2xyz(i);
      var key = p.pp();
      if (key in foundPoints) {
        log("key " + key + " already found at " + foundPoints[key] + ", now again at " + i);
        numCollisions++;
      }
      foundPoints[key] = i;
    }

    var axisN = Math.pow(2, n);
    for (var x = 0; x < axisN; x++) {
      for (var y = 0; y < axisN; y++) {
        for (var z = 0; z < axisN; z++) {
          var key = [x,y,z].join(',');
          if (!(key in foundPoints)) {
            log("missing: " + key);
            numMissing++;
          }
        }
      }
    }

    console.log(numCollisions + " collisions, " + numMissing + " missing");
  }
};

checkDiscontinuities = function(low, high) {
  var num = 0;
  for (var i = low; i < high - 1; ++i) {
    if (d2xyz(i).manhattanDistance(d2xyz(i+1)) != 1) {
      log("Discontinuity from " + i + " (" + d2xyz(i).pp() + ") to " + (i+1) + " (" + d2xyz(i+1).pp() + ")");
      num++;
    }
  }
  log("Found " + num + " discontinuities");
  return num;
};

checkRange = function(low, high, lowerLeft, upperRight, shouldDebug) {
  debug = !!shouldDebug;
  var pointsMap = getPointsMap(low, high);
  var numDupes = checkDupes(pointsMap);
  var numDiscs = checkDiscontinuities(pointsMap, low, high);
  var numMissing = 0;
  for (var x = lowerLeft[0]; x < upperRight[0]; ++x) {
    for (var y = lowerLeft[1]; y < upperRight[1]; ++y) {
      for (var z = lowerLeft[2]; z < upperRight[2]; ++z) {
        var key = [x,y,z].join(',');
        if (!(key in pointsMap)) {
          log("Missing " + key);
          numMissing++;
        }
      }
    }
  }
  var numOutOfRange = 0;
  for (key in pointsMap) {
    var idxs = key.split(',');
    var x = parseInt(idxs[0]);
    var y = parseInt(idxs[1]);
    var z = parseInt(idxs[2]);
    if (x < lowerLeft[0] || x >= upperRight[0] ||
        y < lowerLeft[1] || y >= upperRight[1] ||
        z < lowerLeft[2] || z >= upperRight[2]) {
      log("Point out of range: " + key + " (" + pointsMap[key] + ")");
      numOutOfRange++;
    }
  }
  console.log("Found " + numDupes + " dupes, " + numMissing + " missing, " + numOutOfRange + " out of range, and " + numDiscs + " discontinuities.");
};

testRanges = function() {
  checkRange(0, 64, [0,0,0], [4,4,4]);
  checkRange(64, 128, [0,4,0], [4,8,4]);
  checkRange(128, 192, [0,4,4], [4,8,8]);
  checkRange(192, 256, [0,0,4], [4,4,8]);

  checkRange(0, 512, [0,0,0], [8,8,8]);

  checkRange(0, 4096, [0,0,0], [16,16,16]);

  checkRange(0, 32768, [0,0,0], [32,32,32]);

  checkRange(0, 262144, [0,0,0], [64,64,64]);
};

testInversion = function(low, high) {
  high = high || low+1;
  for (var i = low; i < high; ++i) {
    var p = d2xyz(i);
    var j = xyz2d(p.x, p.y, p.z);
    if (i != j) {
      console.log(i + " (" + p.pp() + "): actual " + j);
    }
  }
};
