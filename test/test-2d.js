
var assert = require('assert');
var Hilbert2d = require('../hilbert').Hilbert2d;

var eq = assert.equal;

var d2xyOracle = {
  0:  [0,0],
  1:  [1,0],
  2:  [1,1],
  3:  [0,1],
  4:  [0,2],
  5:  [0,3],
  6:  [1,3],
  7:  [1,2],
  8:  [2,2],
  9:  [2,3],
  10: [3,3],
  11: [3,2],
  12: [3,1],
  13: [2,1],
  14: [2,0],
  15: [3,0],
  16: [4,0],
  17: [4,1],
  18: [5,1],
  19: [5,0],
  20: [6,0],
  21: [7,0],
  22: [7,1],
  23: [6,1],
  24: [6,2],
  25: [7,2],
  26: [7,3],
  27: [6,3],
  28: [5,3],
  29: [5,2],
  30: [4,2],
  31: [4,3],
  32: [4,4],
  33: [4,5],
  34: [5,5],
  35: [5,4],
  36: [6,4],
  37: [7,4],
  38: [7,5],
  39: [6,5],
  40: [6,6],
  41: [7,6],
  42: [7,7],
  43: [6,7],
  44: [5,7],
  45: [5,6],
  46: [4,6],
  47: [4,7],
  48: [3,7],
  49: [2,7],
  50: [2,6],
  51: [3,6],
  52: [3,5],
  53: [3,4],
  54: [2,4],
  55: [2,5],
  56: [1,5],
  57: [1,4],
  58: [0,4],
  59: [0,5],
  60: [0,6],
  61: [1,6],
  62: [1,7],
  63: [0,7]
};

function testOracle(hilbert, reverse) {
  for (d in d2xyOracle) {
    var expected = !!reverse ? d2xyOracle[d].slice(0).reverse() : d2xyOracle[d];
    var actual = hilbert.xy(d);
    eq(expected[0], actual.x, "d2xy("+d+") should equal ("+expected.join(',')+"); got ("+actual.x+','+actual.y+')');
    eq(expected[1], actual.y, "d2xy("+d+") should equal ("+expected.join(',')+"); got ("+actual.x+','+actual.y+')');
    eq(d, hilbert.d(actual.x, actual.y));
  }
}

describe('d2xy', function() {
  it('should match the oracle', function() {
    var h = new Hilbert2d();
    testOracle(h);
  });
});

var xy2dOracle = {};
for (d in d2xyOracle) {
  var xy = d2xyOracle[d];
  xy2dOracle[xy[0]] = xy2dOracle[xy[0]] || [];
  xy2dOracle[xy[0]][xy[1]] = d;
}

describe('xy2d', function() {
  it('should match the oracle', function() {
    var h = new Hilbert2d();
    for (x in xy2dOracle) {
      for (y in xy2dOracle[x]) {
        var expected = xy2dOracle[x][y];
        var actual = h.d(x, y);
        eq(expected, actual, "xy2d(["+x+','+y+"]) should be " + expected + ", got " + actual);
      }
    }
  })
});

describe('d2xy heuristics:', function() {
  it('should pass all heuristics', function() {
    var h = new Hilbert2d();

    var previous = null;
    var seenPoints = [];

    var maxPerSide = 256;

    for (var d = 0; d < maxPerSide*maxPerSide; d++) {
      var xy = h.xy(d);

      seenPoints[xy.x] = seenPoints[xy.x] || [];
      eq(false, xy.y in seenPoints[xy.x],
                  "Saw ("+xy.x+','+xy.y+') at ' + seenPoints[xy.x][xy.y] + ' and also at ' + d
      );
      seenPoints[xy.x][xy.y] = xy;

      seenPoints[xy.x][xy.y] = d;

      if (previous) {
        eq(1, Math.abs(previous.x - xy.x) + Math.abs(previous.y - xy.y),
                    "| (" + previous.x + ',' + previous.y + ') -> (' + xy.x + ',' + xy.y + ') | != 1'
        );
      }
      previous = xy;
    }

    for (var x = 0; x < maxPerSide; x++) {
      for (var y = 0; y < maxPerSide; y++) {
        assert(y in seenPoints[x], "Missing (" + x + ',' + y + ")");
      }
    }
  });
});

describe('handles rotations with ceilings', function() {

  it('should not invert when given a ceiling that is not a power of 4', function() {
    var h = new Hilbert2d(2);
    assert.equal(2, h.size);
    assert.equal('xy', h.anchorAxisOrder);
    testOracle(h);
  });

  it('should invert when given a ceiling that is a power of 4', function () {
    var h = new Hilbert2d(4);
    assert.equal(4, h.size);
    assert.equal('xy', h.anchorAxisOrder);
    testOracle(h, true);
  });

  it('should not invert when given a ceiling of 8', function() {
    var h = new Hilbert2d(8);
    assert.equal(8, h.size);
    assert.equal('xy', h.anchorAxisOrder);
    testOracle(h);
  });

  it('should invert when given a ceiling that is a power of 4', function() {
    var h = new Hilbert2d(16);
    assert.equal(16, h.size);
    assert.equal('xy', h.anchorAxisOrder);
    testOracle(h, true);
  });

});

describe('bottom-level yx-prioritization', function() {
  it('should invert', function() {
    var h = new Hilbert2d('yx');
    assert.equal('yx', h.anchorAxisOrder);
    testOracle(h, true);
  });
});

describe('top-level yx-prioritization for non-powers-of-4', function() {
  it('should invert', function() {
    var h = new Hilbert2d(2, 'yx');
    assert.equal(2, h.size);
    assert.equal('yx', h.anchorAxisOrder);
    testOracle(h, true);
  });

  it('should invert', function() {
    var h = new Hilbert2d(8, 'yx');
    assert.equal(8, h.size);
    assert.equal('yx', h.anchorAxisOrder);
    testOracle(h, true);
  });
});

describe('top-level yx-prioritization for powers-of-4', function() {
  it('should not invert', function() {
    var h = new Hilbert2d(4, 'yx');
    assert.equal(4, h.size);
    assert.equal('yx', h.anchorAxisOrder);
    testOracle(h);
  });

  it('should not invert', function() {
    var h = new Hilbert2d(16, 'yx');
    assert.equal(16, h.size);
    assert.equal('yx', h.anchorAxisOrder);
    testOracle(h);
  });
});