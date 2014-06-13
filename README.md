
Node library for working with 2-d and 3-d hilbert curves. Install with `npm install hilbert`.
 
Exposes the functions `xy2d`, `d2xy`, `xyz2d`, and `d2xyz`, that move between a one-dimensional number-line (`d`) and 2- and 3-dimensional hilbert curves (`xy` and `xyz`, resp.).

Tests can be run with `npm test`.

Examples:
``` 
> var hilbert = require('./hilbert')
> hilbert.d2xy(0)
{ x: 0, y: 0 }
> hilbert.d2xy(1)
{ x: 1, y: 0 }
> hilbert.d2xy(2)
{ x: 1, y: 1 }

> hilbert.d2xy(3)
{ x: 0, y: 1 }
> hilbert.xy2d(0, 1)
3

> hilbert.d2xy(1024)
{ x: 0, y: 32 }
> hilbert.xy2d(0, 32)
1024

> hilbert.d2xyz(10).arr
[ 0, 1, 3 ]
> hilbert.xyz2d(0, 1, 3)
10
```