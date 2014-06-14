
var assert = require('assert');

var Hilbert3d = require('../hilbert').Hilbert3d;
var h = new Hilbert3d();

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

function testOracle(hilbert, arg1, arg2) {
  var rightRotation = 0;
  var shuffle = '';
  if (typeof arg1 == 'string') {
    shuffle = arg1.split('');
  }
  if (typeof arg1 == 'number') {
    rightRotation = arg1;
  }
  if (typeof arg2 == 'string') {
    shuffle = arg2.split('');
  }
  if (typeof arg2 == 'number') {
    rightRotation = arg2;
  }
  for (d in d2xyzOracle) {
    var original = d2xyzOracle[d];
    var expected = original;
    if (rightRotation) {
      expected = original.slice(original.length - rightRotation).concat(original.slice(0, original.length - rightRotation));
    }
    if (shuffle) {
      expected = shuffle.map(function(idx) { return expected[idx]; });
    }
    var actual = hilbert.xyz(d);
    var msg = "d2xyz("+d+") should equal ("+expected.join(',')+"), got " + actual.pp();
    assert.equal(expected[0], actual.x, msg);
    assert.equal(expected[1], actual.y, msg);
    assert.equal(expected[2], actual.z, msg);

    var invertedD = hilbert.d.apply(hilbert, actual.arr);
    assert.equal(d, invertedD,
                "d2xyz(xyz2d("+d+")) == d2xyz(" + actual.pp() + ") == " + invertedD + ", should be " + d
    );
  }
}

describe('d2xyz', function() {
  it('should match the oracle', function() {
    testOracle(h);
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

describe('fixed top levels', function() {
  it('should not change when top is 2', function() {
    var h = new Hilbert3d(2);
    testOracle(h);
  });

  it('should rotate left when top is 4', function() {
    var h = new Hilbert3d(4);
    testOracle(h, 1);
  });

  it('should rotate right when top is 8', function() {
    var h = new Hilbert3d(8);
    testOracle(h, 2);
  });

  it('should not change when top is 16', function() {
    var h = new Hilbert3d(16);
    testOracle(h);
  });

  it('should rotate left when top is 32', function() {
    var h = new Hilbert3d(32);
    testOracle(h, 1);
  });

  it('should rotate right when top is 64', function() {
    var h = new Hilbert3d(64);
    testOracle(h, 2);
  });
});

describe('permuted lowest level', function() {
  it('should not change when passed identity mapping', function() {
    var h = new Hilbert3d('xyz');
    testOracle(h);
  });

  it('should pass with "yzx" mapping', function() {
    var h = new Hilbert3d('yzx');
    testOracle(h, "201");
  });

  it('should pass with "zxy" mapping', function() {
    var h = new Hilbert3d('zxy');
    testOracle(h, "120");
  });

  it('should pass with "xzy" mapping', function() {
    var h = new Hilbert3d('xzy');
    testOracle(h, "021");
  });

  it('should pass with "yxz" mapping', function() {
    var h = new Hilbert3d('yxz');
    testOracle(h, "102");
  });

  it('should pass with "zyx" mapping', function() {
    var h = new Hilbert3d('zyx');
    testOracle(h, "210");
  });
});

describe('permuted top level with size 2', function() {
  it('should pass with (2, "yzx") mapping', function() {
    var h = new Hilbert3d(2, 'yzx');
    testOracle(h, "201");
  });

  it('should pass with (2, "zxy") mapping', function() {
    var h = new Hilbert3d(2, 'zxy');
    testOracle(h, "120");
  });

  it('should pass with (2, "xzy") mapping', function() {
    var h = new Hilbert3d(2, 'xzy');
    testOracle(h, "021");
  });

  it('should pass with (2, "yxz") mapping', function() {
    var h = new Hilbert3d(2, 'yxz');
    testOracle(h, "102");
  });

  it('should pass with (2, "zyx") mapping', function() {
    var h = new Hilbert3d(2, 'zyx');
    testOracle(h, "210");
  });
});

describe('permuted top level with size 4', function() {
  it('should pass with (4, "yzx") mapping', function() {
    var h = new Hilbert3d(4, 'yzx');
    testOracle(h, "201", 1);
  });

  it('should pass with (4, "zxy") mapping', function() {
    var h = new Hilbert3d(4, 'zxy');
    testOracle(h, "120", 1);
  });

  it('should pass with (4, "xzy") mapping', function() {
    var h = new Hilbert3d(4, 'xzy');
    testOracle(h, "021", 1);
  });

  it('should pass with (4, "yxz") mapping', function() {
    var h = new Hilbert3d(4, 'yxz');
    testOracle(h, "102", 1);
  });

  it('should pass with (4, "zyx") mapping', function() {
    var h = new Hilbert3d(4, 'zyx');
    testOracle(h, "210", 1);
  });
});

describe('permuted top level with size 8', function() {
  it('should pass with (8, "yzx") mapping', function() {
    var h = new Hilbert3d(8, 'yzx');
    testOracle(h, "201", 2);
  });

  it('should pass with (8, "zxy") mapping', function() {
    var h = new Hilbert3d(8, 'zxy');
    testOracle(h, "120", 2);
  });

  it('should pass with (8, "xzy") mapping', function() {
    var h = new Hilbert3d(8, 'xzy');
    testOracle(h, "021", 2);
  });

  it('should pass with (8, "yxz") mapping', function() {
    var h = new Hilbert3d(8, 'yxz');
    testOracle(h, "102", 2);
  });

  it('should pass with (8, "zyx") mapping', function() {
    var h = new Hilbert3d(8, 'zyx');
    testOracle(h, "210", 2);
  });
});


describe('permuted top level with size 16', function() {
  it('should pass with (16, "yzx") mapping', function() {
    var h = new Hilbert3d(16, 'yzx');
    testOracle(h, "201");
  });

  it('should pass with (16, "zxy") mapping', function() {
    var h = new Hilbert3d(16, 'zxy');
    testOracle(h, "120");
  });

  it('should pass with (16, "xzy") mapping', function() {
    var h = new Hilbert3d(16, 'xzy');
    testOracle(h, "021");
  });

  it('should pass with (16, "yxz") mapping', function() {
    var h = new Hilbert3d(16, 'yxz');
    testOracle(h, "102");
  });

  it('should pass with (16, "zyx") mapping', function() {
    var h = new Hilbert3d(16, 'zyx');
    testOracle(h, "210");
  });
});
