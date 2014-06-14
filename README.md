
#Hilbert-js
Node library for working with 2-d and 3-d hilbert curves.

##Install
`npm install hilbert`

##Run Tests
`npm test`

##Examples
``` 
> var H = require('./hilbert')

// Basic 2x2 square
> H.d2xy(0)
{ x: 0, y: 0 }
> H.d2xy(1)
{ x: 1, y: 0 }
> H.d2xy(2)
{ x: 1, y: 1 }
> H.d2xy(3)
{ x: 0, y: 1 }

// Inverse of previous call
> H.xy2d(0, 1)
3

> H.d2xy(1024)
{ x: 0, y: 32 }
> H.xy2d(0, 32)
1024

// 3-d mode
> H.d2xyz(10).arr
[ 0, 1, 3 ]
> H.xyz2d(0, 1, 3)
10

// Create a 2-d Hilbert curve that will follow the axis path 'xy' 
// on its "4" level, i.e. its 4x4 square, which will be made up of 
// 4 2x2 squares, the first of which will consequently follow a 
// 'yx' axis path.
> var H2 = H.Hilbert2d;
> var h2 = new H2(4)
> h2.xy(0)
{ x: 0, y: 0 }
> h2.xy(1)
{ x: 0, y: 1 }  // order is reversed at this (2x2) level.
> h2.xy(2)
{ x: 1, y: 1 }
> h2.xy(3)
{ x: 1, y: 0 }
> h2.xy(4)
{ x: 2, y: 0 }  // order is 'x'-axis, then 'y'-, at the 4x4 level.

```

##API
The module, `require('hilbert')`, exposes the following functions:

###xy2d(x,y)
(aliases `d2(x,y)`, `d(x,y)`)

Convert an `(x,y)` tuple to a distance along a _2-dimensional_ Hilbert walk. 

###d2xy(d)
(alias `xy(d)`)

The inverse of `xy2d`.

###xyz2d(x,y,z)
(aliases `d3(x,y,z)`, `d(x,y,z)`)

Convert an `(x,y,z)` tuple to a distance along a _3-dimensional_ Hilbert walk.

###d2xyz(d)
(alias `xyz(d)`)

The inverse of `xyz2d`.

###Hilbert2d, Hilbert3d
These classes can be used for more advanced 2d- and 3d- Hilbert-curve calculations.

Their constructors take 2 optional arguments:

* `axis order` _(string)_: the order in which the curve should progress through available axes. 

    Defaults to `'xy'` or `'xyz'` in 2- and 3-dimensional modes, respectively; this can be interpreted as indicating that, starting from an origin, the curve should move along the x-axis, then the y-axis, (then the z-axis), etc.

* `size`: which size square or cube should be fixed to the axis ordering dictated by `axis order` above?

    Defaults to `2`, meaning the smallest level of the curve (that fills out the 2x2 square in 2d or the 2x2x2 cube in 3d) will progress through available axes; the next level up will progress through them in a rotated order, as the definition of a Hilbert curve dictates.

##Bash Helpers
Three helper scripts, `./d`, `./xy`, and `./xyz` are available for quick command-line sanity-checking of values.

```
# Call `d2xyz` on a Hilbert curve with axis order `xzy` for 
# the integers [0,8]:
$ ./xyz "-'xzy'" 0 1 2 3 4 5 6 7 8
0:	[ 0, 0, 0 ]
1:	[ 1, 0, 0 ]
2:	[ 1, 0, 1 ]
3:	[ 0, 0, 1 ]
4:	[ 0, 1, 1 ]
5:	[ 1, 1, 1 ]
6:	[ 1, 1, 0 ]
7:	[ 0, 1, 0 ]
8:	[ 0, 2, 0 ]

# Inverse of the above.
$ ./d "'xzy'" 0,0,0 1,0,0 1,0,1 0,0,1 0,1,1 1,1,1 1,1,0 0,1,0 0,2,0
0
1
2
3
4
5
6
7
8
```
