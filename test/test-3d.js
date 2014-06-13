
var assert = require('assert');

var h = new (require('../hilbert').Hilbert3d)();

var d2xyzOracle = {
  0:  [0,0,0],
  1:  [1,0,0],
  2:  [1,1,0],
  3:  [0,1,0],
  4:  [0,1,1],
  5:  [1,1,1],
  6:  [1,0,1],
  7:  [0,0,1],
  8:  [0,0,2],
  9:  [0,1,2],
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

describe('d2xyz', function() {
  it('should match the oracle', function() {
    for (d in d2xyzOracle) {
      var expected = d2xyzOracle[d];
      var actual = h.xyz(d);
      var msg = "d2xyz("+d+") should equal ("+expected.join(',')+"), got " + actual.pp();
      assert.equal(expected[0], actual.x, msg);
      assert.equal(expected[1], actual.y, msg);
      assert.equal(expected[2], actual.z, msg);
    }
  });
});

var xyz2dOracle = {};
for (d in d2xyzOracle) {
  var xyz = d2xyzOracle[d];
  xyz2dOracle[xyz[0]] = xyz2dOracle[xyz[0]] || [];
  xyz2dOracle[xyz[0]][xyz[1]] = xyz2dOracle[xyz[0]][xyz[1]] || [];
  xyz2dOracle[xyz[0]][xyz[1]][xyz[2]] = d;
}

describe('xyz2d', function() {
  it('should match the oracle', function() {
    for (x in xyz2dOracle) {
      for (y in xyz2dOracle[x]) {
        for (z in xyz2dOracle[x][y]) {
          var expected = xyz2dOracle[x][y][z];
          var actual = h.d(x, y, z);
          assert.equal(expected, actual, 'xyz2d('+x+','+y+','+z+') should equal ' + expected + ', got ' + actual);
        }
      }
    }
  });
});

describe('heuristics', function() {
  it('should pass all heuristics', function() {
    var previous = null;
    var seenPoints = [];
    var maxPerSide = 32;
    for (var d = 0; d < maxPerSide * maxPerSide * maxPerSide; d++) {
      var xyz = h.xyz(d);

      if (previous) {
        var distance = xyz.manhattanDistance(previous);
        assert.equal(1, distance, "d2xyz("+(d-1)+') -> d2xyz('+d+') is ('+previous.pp()+') -> (' + xyz.pp() + ')');
      }
      previous = xyz;

      seenPoints[xyz.x] = seenPoints[xyz.x] || [];
      seenPoints[xyz.x][xyz.y] = seenPoints[xyz.x][xyz.y] || [];
      assert.equal(false, xyz.z in seenPoints[xyz.x][xyz.y], "Saw (" + xyz.pp() + ") at " + seenPoints[xyz.x][xyz.y][xyz.z] + " and also at " + d);
      seenPoints[xyz.x][xyz.y][xyz.z] = d;
    }
  });
});