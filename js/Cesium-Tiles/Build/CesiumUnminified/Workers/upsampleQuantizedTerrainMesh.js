/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2017 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
(function () {
/*global define*/
define('Core/defined',[],function() {
    'use strict';

    /**
     * @exports defined
     *
     * @param {Object} value The object.
     * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
     *
     * @example
     * if (Cesium.defined(positions)) {
     *      doSomething();
     * } else {
     *      doSomethingElse();
     * }
     */
    function defined(value) {
        return value !== undefined && value !== null;
    }

    return defined;
});

/*global define*/
define('Core/DeveloperError',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Constructs an exception object that is thrown due to a developer error, e.g., invalid argument,
     * argument out of range, etc.  This exception should only be thrown during development;
     * it usually indicates a bug in the calling code.  This exception should never be
     * caught; instead the calling code should strive not to generate it.
     * <br /><br />
     * On the other hand, a {@link RuntimeError} indicates an exception that may
     * be thrown at runtime, e.g., out of memory, that the calling code should be prepared
     * to catch.
     *
     * @alias DeveloperError
     * @constructor
     * @extends Error
     *
     * @param {String} [message] The error message for this exception.
     *
     * @see RuntimeError
     */
    function DeveloperError(message) {
        /**
         * 'DeveloperError' indicating that this exception was thrown due to a developer error.
         * @type {String}
         * @readonly
         */
        this.name = 'DeveloperError';

        /**
         * The explanation for why this exception was thrown.
         * @type {String}
         * @readonly
         */
        this.message = message;

        //Browsers such as IE don't have a stack property until you actually throw the error.
        var stack;
        try {
            throw new Error();
        } catch (e) {
            stack = e.stack;
        }

        /**
         * The stack trace of this exception, if available.
         * @type {String}
         * @readonly
         */
        this.stack = stack;
    }

    if (defined(Object.create)) {
        DeveloperError.prototype = Object.create(Error.prototype);
        DeveloperError.prototype.constructor = DeveloperError;
    }

    DeveloperError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    /**
     * @private
     */
    DeveloperError.throwInstantiationError = function() {
        throw new DeveloperError('This function defines an interface and should not be called directly.');
    };

    return DeveloperError;
});

/*global define*/
define('Core/Check',[
        './defined',
        './DeveloperError'
    ], function(
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Contains functions for checking that supplied arguments are of a specified type
     * or meet specified conditions
     * @private
     */
    var Check = {};

    /**
     * Contains type checking functions, all using the typeof operator
     */
    Check.typeOf = {};

    function getUndefinedErrorMessage(name) {
        return name + ' is required, actual value was undefined';
    }

    function getFailedTypeErrorMessage(actual, expected, name) {
        return 'Expected ' + name + ' to be typeof ' + expected + ', actual typeof was ' + actual;
    }

    /**
     * Throws if test is not defined
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value that is to be checked
     * @exception {DeveloperError} test must be defined
     */
    Check.defined = function (name, test) {
        if (!defined(test)) {
            throw new DeveloperError(getUndefinedErrorMessage(name));
        }
    };

    /**
     * Throws if test is not typeof 'function'
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @exception {DeveloperError} test must be typeof 'function'
     */
    Check.typeOf.func = function (name, test) {
        if (typeof test !== 'function') {
            throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'function', name));
        }
    };

    /**
     * Throws if test is not typeof 'string'
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @exception {DeveloperError} test must be typeof 'string'
     */
    Check.typeOf.string = function (name, test) {
        if (typeof test !== 'string') {
            throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'string', name));
        }
    };

    /**
     * Throws if test is not typeof 'number'
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @exception {DeveloperError} test must be typeof 'number'
     */
    Check.typeOf.number = function (name, test) {
        if (typeof test !== 'number') {
            throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'number', name));
        }
    };

    /**
     * Throws if test is not typeof 'number' and less than limit
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @param {Number} limit The limit value to compare against
     * @exception {DeveloperError} test must be typeof 'number' and less than limit
     */
    Check.typeOf.number.lessThan = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test >= limit) {
            throw new DeveloperError('Expected ' + name + ' to be less than ' + limit + ', actual value was ' + test);
        }
    };

    /**
     * Throws if test is not typeof 'number' and less than or equal to limit
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @param {Number} limit The limit value to compare against
     * @exception {DeveloperError} test must be typeof 'number' and less than or equal to limit
     */
    Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test > limit) {
            throw new DeveloperError('Expected ' + name + ' to be less than or equal to ' + limit + ', actual value was ' + test);
        }
    };

    /**
     * Throws if test is not typeof 'number' and greater than limit
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @param {Number} limit The limit value to compare against
     * @exception {DeveloperError} test must be typeof 'number' and greater than limit
     */
    Check.typeOf.number.greaterThan = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test <= limit) {
            throw new DeveloperError('Expected ' + name + ' to be greater than ' + limit + ', actual value was ' + test);
        }
    };

    /**
     * Throws if test is not typeof 'number' and greater than or equal to limit
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @param {Number} limit The limit value to compare against
     * @exception {DeveloperError} test must be typeof 'number' and greater than or equal to limit
     */
    Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test < limit) {
            throw new DeveloperError('Expected ' + name + ' to be greater than or equal to' + limit + ', actual value was ' + test);
        }
    };

    /**
     * Throws if test is not typeof 'object'
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @exception {DeveloperError} test must be typeof 'object'
     */
    Check.typeOf.object = function (name, test) {
        if (typeof test !== 'object') {
            throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'object', name));
        }
    };

    /**
     * Throws if test is not typeof 'boolean'
     *
     * @param {String} name The name of the variable being tested
     * @param {*} test The value to test
     * @exception {DeveloperError} test must be typeof 'boolean'
     */
    Check.typeOf.bool = function (name, test) {
        if (typeof test !== 'boolean') {
            throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'boolean', name));
        }
    };

    return Check;
});

/*global define*/
define('Core/freezeObject',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Freezes an object, using Object.freeze if available, otherwise returns
     * the object unchanged.  This function should be used in setup code to prevent
     * errors from completely halting JavaScript execution in legacy browsers.
     *
     * @private
     *
     * @exports freezeObject
     */
    var freezeObject = Object.freeze;
    if (!defined(freezeObject)) {
        freezeObject = function(o) {
            return o;
        };
    }

    return freezeObject;
});

/*global define*/
define('Core/defaultValue',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * Returns the first parameter if not undefined, otherwise the second parameter.
     * Useful for setting a default value for a parameter.
     *
     * @exports defaultValue
     *
     * @param {*} a
     * @param {*} b
     * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
     *
     * @example
     * param = Cesium.defaultValue(param, 'default');
     */
    function defaultValue(a, b) {
        if (a !== undefined) {
            return a;
        }
        return b;
    }

    /**
     * A frozen empty object that can be used as the default value for options passed as
     * an object literal.
     */
    defaultValue.EMPTY_OBJECT = freezeObject({});

    return defaultValue;
});

/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.

  If you want to use this as a substitute for Math.random(), use the random()
  method like so:

  var m = new MersenneTwister();
  var randomNumber = m.random();

  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).
*/
/**
@license
mersenne-twister.js - https://gist.github.com/banksean/300494

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
define('ThirdParty/mersenne-twister',[],function() {
var MersenneTwister = function(seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }
  /* Period parameters */
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
   this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
  + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
}

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
//MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
//  var i, j, k;
//  this.init_genrand(19650218);
//  i=1; j=0;
//  k = (this.N>key_length ? this.N : key_length);
//  for (; k; k--) {
//    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
//    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
//      + init_key[j] + j; /* non linear */
//    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
//    i++; j++;
//    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
//    if (j>=key_length) j=0;
//  }
//  for (k=this.N-1; k; k--) {
//    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
//    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
//      - i; /* non linear */
//    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
//    i++;
//    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
//  }
//
//  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
//}

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
}

/* generates a random number on [0,0x7fffffff]-interval */
//MersenneTwister.prototype.genrand_int31 = function() {
//  return (this.genrand_int32()>>>1);
//}

/* generates a random number on [0,1]-real-interval */
//MersenneTwister.prototype.genrand_real1 = function() {
//  return this.genrand_int32()*(1.0/4294967295.0);
//  /* divided by 2^32-1 */
//}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0);
  /* divided by 2^32 */
}

/* generates a random number on (0,1)-real-interval */
//MersenneTwister.prototype.genrand_real3 = function() {
//  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
//  /* divided by 2^32 */
//}

/* generates a random number on [0,1) with 53-bit resolution*/
//MersenneTwister.prototype.genrand_res53 = function() {
//  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
//  return(a*67108864.0+b)*(1.0/9007199254740992.0);
//}

/* These real versions are due to Isaku Wada, 2002/01/09 added */

return MersenneTwister;
});

/*global define*/
define('Core/Math',[
        '../ThirdParty/mersenne-twister',
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        MersenneTwister,
        defaultValue,
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Math functions.
     *
     * @exports CesiumMath
     */
    var CesiumMath = {};

    /**
     * 0.1
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON1 = 0.1;

    /**
     * 0.01
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON2 = 0.01;

    /**
     * 0.001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON3 = 0.001;

    /**
     * 0.0001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON4 = 0.0001;

    /**
     * 0.00001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON5 = 0.00001;

    /**
     * 0.000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON6 = 0.000001;

    /**
     * 0.0000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON7 = 0.0000001;

    /**
     * 0.00000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON8 = 0.00000001;

    /**
     * 0.000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON9 = 0.000000001;

    /**
     * 0.0000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON10 = 0.0000000001;

    /**
     * 0.00000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON11 = 0.00000000001;

    /**
     * 0.000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON12 = 0.000000000001;

    /**
     * 0.0000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON13 = 0.0000000000001;

    /**
     * 0.00000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON14 = 0.00000000000001;

    /**
     * 0.000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON15 = 0.000000000000001;

    /**
     * 0.0000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON16 = 0.0000000000000001;

    /**
     * 0.00000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON17 = 0.00000000000000001;

    /**
     * 0.000000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON18 = 0.000000000000000001;

    /**
     * 0.0000000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON19 = 0.0000000000000000001;

    /**
     * 0.00000000000000000001
     * @type {Number}
     * @constant
     */
    CesiumMath.EPSILON20 = 0.00000000000000000001;

    /**
     * 3.986004418e14
     * @type {Number}
     * @constant
     */
    CesiumMath.GRAVITATIONALPARAMETER = 3.986004418e14;

    /**
     * Radius of the sun in meters: 6.955e8
     * @type {Number}
     * @constant
     */
    CesiumMath.SOLAR_RADIUS = 6.955e8;

    /**
     * The mean radius of the moon, according to the "Report of the IAU/IAG Working Group on
     * Cartographic Coordinates and Rotational Elements of the Planets and satellites: 2000",
     * Celestial Mechanics 82: 83-110, 2002.
     * @type {Number}
     * @constant
     */
    CesiumMath.LUNAR_RADIUS = 1737400.0;

    /**
     * 64 * 1024
     * @type {Number}
     * @constant
     */
    CesiumMath.SIXTY_FOUR_KILOBYTES = 64 * 1024;

    /**
     * Returns the sign of the value; 1 if the value is positive, -1 if the value is
     * negative, or 0 if the value is 0.
     *
     * @param {Number} value The value to return the sign of.
     * @returns {Number} The sign of value.
     */
    CesiumMath.sign = function(value) {
        if (value > 0) {
            return 1;
        }
        if (value < 0) {
            return -1;
        }

        return 0;
    };

    /**
     * Returns 1.0 if the given value is positive or zero, and -1.0 if it is negative.
     * This is similar to {@link CesiumMath#sign} except that returns 1.0 instead of
     * 0.0 when the input value is 0.0.
     * @param {Number} value The value to return the sign of.
     * @returns {Number} The sign of value.
     */
    CesiumMath.signNotZero = function(value) {
        return value < 0.0 ? -1.0 : 1.0;
    };

    /**
     * Converts a scalar value in the range [-1.0, 1.0] to a SNORM in the range [0, rangeMax]
     * @param {Number} value The scalar value in the range [-1.0, 1.0]
     * @param {Number} [rangeMax=255] The maximum value in the mapped range, 255 by default.
     * @returns {Number} A SNORM value, where 0 maps to -1.0 and rangeMax maps to 1.0.
     *
     * @see CesiumMath.fromSNorm
     */
    CesiumMath.toSNorm = function(value, rangeMax) {
        rangeMax = defaultValue(rangeMax, 255);
        return Math.round((CesiumMath.clamp(value, -1.0, 1.0) * 0.5 + 0.5) * rangeMax);
    };

    /**
     * Converts a SNORM value in the range [0, rangeMax] to a scalar in the range [-1.0, 1.0].
     * @param {Number} value SNORM value in the range [0, 255]
     * @param {Number} [rangeMax=255] The maximum value in the SNORM range, 255 by default.
     * @returns {Number} Scalar in the range [-1.0, 1.0].
     *
     * @see CesiumMath.toSNorm
     */
    CesiumMath.fromSNorm = function(value, rangeMax) {
        rangeMax = defaultValue(rangeMax, 255);
        return CesiumMath.clamp(value, 0.0, rangeMax) / rangeMax * 2.0 - 1.0;
    };

    /**
     * Returns the hyperbolic sine of a number.
     * The hyperbolic sine of <em>value</em> is defined to be
     * (<em>e<sup>x</sup>&nbsp;-&nbsp;e<sup>-x</sup></em>)/2.0
     * where <i>e</i> is Euler's number, approximately 2.71828183.
     *
     * <p>Special cases:
     *   <ul>
     *     <li>If the argument is NaN, then the result is NaN.</li>
     *
     *     <li>If the argument is infinite, then the result is an infinity
     *     with the same sign as the argument.</li>
     *
     *     <li>If the argument is zero, then the result is a zero with the
     *     same sign as the argument.</li>
     *   </ul>
     *</p>
     *
     * @param {Number} value The number whose hyperbolic sine is to be returned.
     * @returns {Number} The hyperbolic sine of <code>value</code>.
     */
    CesiumMath.sinh = function(value) {
        var part1 = Math.pow(Math.E, value);
        var part2 = Math.pow(Math.E, -1.0 * value);

        return (part1 - part2) * 0.5;
    };

    /**
     * Returns the hyperbolic cosine of a number.
     * The hyperbolic cosine of <strong>value</strong> is defined to be
     * (<em>e<sup>x</sup>&nbsp;+&nbsp;e<sup>-x</sup></em>)/2.0
     * where <i>e</i> is Euler's number, approximately 2.71828183.
     *
     * <p>Special cases:
     *   <ul>
     *     <li>If the argument is NaN, then the result is NaN.</li>
     *
     *     <li>If the argument is infinite, then the result is positive infinity.</li>
     *
     *     <li>If the argument is zero, then the result is 1.0.</li>
     *   </ul>
     *</p>
     *
     * @param {Number} value The number whose hyperbolic cosine is to be returned.
     * @returns {Number} The hyperbolic cosine of <code>value</code>.
     */
    CesiumMath.cosh = function(value) {
        var part1 = Math.pow(Math.E, value);
        var part2 = Math.pow(Math.E, -1.0 * value);

        return (part1 + part2) * 0.5;
    };

    /**
     * Computes the linear interpolation of two values.
     *
     * @param {Number} p The start value to interpolate.
     * @param {Number} q The end value to interpolate.
     * @param {Number} time The time of interpolation generally in the range <code>[0.0, 1.0]</code>.
     * @returns {Number} The linearly interpolated value.
     *
     * @example
     * var n = Cesium.Math.lerp(0.0, 2.0, 0.5); // returns 1.0
     */
    CesiumMath.lerp = function(p, q, time) {
        return ((1.0 - time) * p) + (time * q);
    };

    /**
     * pi
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.PI = Math.PI;

    /**
     * 1/pi
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.ONE_OVER_PI = 1.0 / Math.PI;

    /**
     * pi/2
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.PI_OVER_TWO = Math.PI * 0.5;

    /**
     * pi/3
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.PI_OVER_THREE = Math.PI / 3.0;

    /**
     * pi/4
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.PI_OVER_FOUR = Math.PI / 4.0;

    /**
     * pi/6
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.PI_OVER_SIX = Math.PI / 6.0;

    /**
     * 3pi/2
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.THREE_PI_OVER_TWO = (3.0 * Math.PI) * 0.5;

    /**
     * 2pi
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.TWO_PI = 2.0 * Math.PI;

    /**
     * 1/2pi
     *
     * @type {Number}
     * @constant
     */
    CesiumMath.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);

    /**
     * The number of radians in a degree.
     *
     * @type {Number}
     * @constant
     * @default Math.PI / 180.0
     */
    CesiumMath.RADIANS_PER_DEGREE = Math.PI / 180.0;

    /**
     * The number of degrees in a radian.
     *
     * @type {Number}
     * @constant
     * @default 180.0 / Math.PI
     */
    CesiumMath.DEGREES_PER_RADIAN = 180.0 / Math.PI;

    /**
     * The number of radians in an arc second.
     *
     * @type {Number}
     * @constant
     * @default {@link CesiumMath.RADIANS_PER_DEGREE} / 3600.0
     */
    CesiumMath.RADIANS_PER_ARCSECOND = CesiumMath.RADIANS_PER_DEGREE / 3600.0;

    /**
     * Converts degrees to radians.
     * @param {Number} degrees The angle to convert in degrees.
     * @returns {Number} The corresponding angle in radians.
     */
    CesiumMath.toRadians = function(degrees) {
                if (!defined(degrees)) {
            throw new DeveloperError('degrees is required.');
        }
                return degrees * CesiumMath.RADIANS_PER_DEGREE;
    };

    /**
     * Converts radians to degrees.
     * @param {Number} radians The angle to convert in radians.
     * @returns {Number} The corresponding angle in degrees.
     */
    CesiumMath.toDegrees = function(radians) {
                if (!defined(radians)) {
            throw new DeveloperError('radians is required.');
        }
                return radians * CesiumMath.DEGREES_PER_RADIAN;
    };

    /**
     * Converts a longitude value, in radians, to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
     *
     * @param {Number} angle The longitude value, in radians, to convert to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
     * @returns {Number} The equivalent longitude value in the range [<code>-Math.PI</code>, <code>Math.PI</code>).
     *
     * @example
     * // Convert 270 degrees to -90 degrees longitude
     * var longitude = Cesium.Math.convertLongitudeRange(Cesium.Math.toRadians(270.0));
     */
    CesiumMath.convertLongitudeRange = function(angle) {
                if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }
                var twoPi = CesiumMath.TWO_PI;

        var simplified = angle - Math.floor(angle / twoPi) * twoPi;

        if (simplified < -Math.PI) {
            return simplified + twoPi;
        }
        if (simplified >= Math.PI) {
            return simplified - twoPi;
        }

        return simplified;
    };

    /**
     * Convenience function that clamps a latitude value, in radians, to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
     * Useful for sanitizing data before use in objects requiring correct range.
     *
     * @param {Number} angle The latitude value, in radians, to clamp to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
     * @returns {Number} The latitude value clamped to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
     *
     * @example
     * // Clamp 108 degrees latitude to 90 degrees latitude
     * var latitude = Cesium.Math.clampToLatitudeRange(Cesium.Math.toRadians(108.0));
     */
    CesiumMath.clampToLatitudeRange = function(angle) {
                if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }
        
        return CesiumMath.clamp(angle, -1*CesiumMath.PI_OVER_TWO, CesiumMath.PI_OVER_TWO);
    };

    /**
     * Produces an angle in the range -Pi <= angle <= Pi which is equivalent to the provided angle.
     *
     * @param {Number} angle in radians
     * @returns {Number} The angle in the range [<code>-CesiumMath.PI</code>, <code>CesiumMath.PI</code>].
     */
    CesiumMath.negativePiToPi = function(angle) {
                if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }
                return CesiumMath.zeroToTwoPi(angle + CesiumMath.PI) - CesiumMath.PI;
    };

    /**
     * Produces an angle in the range 0 <= angle <= 2Pi which is equivalent to the provided angle.
     *
     * @param {Number} angle in radians
     * @returns {Number} The angle in the range [0, <code>CesiumMath.TWO_PI</code>].
     */
    CesiumMath.zeroToTwoPi = function(angle) {
                if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }
                var mod = CesiumMath.mod(angle, CesiumMath.TWO_PI);
        if (Math.abs(mod) < CesiumMath.EPSILON14 && Math.abs(angle) > CesiumMath.EPSILON14) {
            return CesiumMath.TWO_PI;
        }
        return mod;
    };

    /**
     * The modulo operation that also works for negative dividends.
     *
     * @param {Number} m The dividend.
     * @param {Number} n The divisor.
     * @returns {Number} The remainder.
     */
    CesiumMath.mod = function(m, n) {
                if (!defined(m)) {
            throw new DeveloperError('m is required.');
        }
        if (!defined(n)) {
            throw new DeveloperError('n is required.');
        }
                return ((m % n) + n) % n;
    };

    /**
     * Determines if two values are equal using an absolute or relative tolerance test. This is useful
     * to avoid problems due to roundoff error when comparing floating-point values directly. The values are
     * first compared using an absolute tolerance test. If that fails, a relative tolerance test is performed.
     * Use this test if you are unsure of the magnitudes of left and right.
     *
     * @param {Number} left The first value to compare.
     * @param {Number} right The other value to compare.
     * @param {Number} relativeEpsilon The maximum inclusive delta between <code>left</code> and <code>right</code> for the relative tolerance test.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The maximum inclusive delta between <code>left</code> and <code>right</code> for the absolute tolerance test.
     * @returns {Boolean} <code>true</code> if the values are equal within the epsilon; otherwise, <code>false</code>.
     *
     * @example
     * var a = Cesium.Math.equalsEpsilon(0.0, 0.01, Cesium.Math.EPSILON2); // true
     * var b = Cesium.Math.equalsEpsilon(0.0, 0.1, Cesium.Math.EPSILON2);  // false
     * var c = Cesium.Math.equalsEpsilon(3699175.1634344, 3699175.2, Cesium.Math.EPSILON7); // true
     * var d = Cesium.Math.equalsEpsilon(3699175.1634344, 3699175.2, Cesium.Math.EPSILON9); // false
     */
    CesiumMath.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
                if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        if (!defined(relativeEpsilon)) {
            throw new DeveloperError('relativeEpsilon is required.');
        }
                absoluteEpsilon = defaultValue(absoluteEpsilon, relativeEpsilon);
        var absDiff = Math.abs(left - right);
        return absDiff <= absoluteEpsilon || absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right));
    };

    var factorials = [1];

    /**
     * Computes the factorial of the provided number.
     *
     * @param {Number} n The number whose factorial is to be computed.
     * @returns {Number} The factorial of the provided number or undefined if the number is less than 0.
     *
     * @exception {DeveloperError} A number greater than or equal to 0 is required.
     *
     *
     * @example
     * //Compute 7!, which is equal to 5040
     * var computedFactorial = Cesium.Math.factorial(7);
     *
     * @see {@link http://en.wikipedia.org/wiki/Factorial|Factorial on Wikipedia}
     */
    CesiumMath.factorial = function(n) {
                if (typeof n !== 'number' || n < 0) {
            throw new DeveloperError('A number greater than or equal to 0 is required.');
        }
        
        var length = factorials.length;
        if (n >= length) {
            var sum = factorials[length - 1];
            for (var i = length; i <= n; i++) {
                factorials.push(sum * i);
            }
        }
        return factorials[n];
    };

    /**
     * Increments a number with a wrapping to a minimum value if the number exceeds the maximum value.
     *
     * @param {Number} [n] The number to be incremented.
     * @param {Number} [maximumValue] The maximum incremented value before rolling over to the minimum value.
     * @param {Number} [minimumValue=0.0] The number reset to after the maximum value has been exceeded.
     * @returns {Number} The incremented number.
     *
     * @exception {DeveloperError} Maximum value must be greater than minimum value.
     *
     * @example
     * var n = Cesium.Math.incrementWrap(5, 10, 0); // returns 6
     * var n = Cesium.Math.incrementWrap(10, 10, 0); // returns 0
     */
    CesiumMath.incrementWrap = function(n, maximumValue, minimumValue) {
        minimumValue = defaultValue(minimumValue, 0.0);

                if (!defined(n)) {
            throw new DeveloperError('n is required.');
        }
        if (maximumValue <= minimumValue) {
            throw new DeveloperError('maximumValue must be greater than minimumValue.');
        }
        
        ++n;
        if (n > maximumValue) {
            n = minimumValue;
        }
        return n;
    };

    /**
     * Determines if a positive integer is a power of two.
     *
     * @param {Number} n The positive integer to test.
     * @returns {Boolean} <code>true</code> if the number if a power of two; otherwise, <code>false</code>.
     *
     * @exception {DeveloperError} A number greater than or equal to 0 is required.
     *
     * @example
     * var t = Cesium.Math.isPowerOfTwo(16); // true
     * var f = Cesium.Math.isPowerOfTwo(20); // false
     */
    CesiumMath.isPowerOfTwo = function(n) {
                if (typeof n !== 'number' || n < 0) {
            throw new DeveloperError('A number greater than or equal to 0 is required.');
        }
        
        return (n !== 0) && ((n & (n - 1)) === 0);
    };

    /**
     * Computes the next power-of-two integer greater than or equal to the provided positive integer.
     *
     * @param {Number} n The positive integer to test.
     * @returns {Number} The next power-of-two integer.
     *
     * @exception {DeveloperError} A number greater than or equal to 0 is required.
     *
     * @example
     * var n = Cesium.Math.nextPowerOfTwo(29); // 32
     * var m = Cesium.Math.nextPowerOfTwo(32); // 32
     */
    CesiumMath.nextPowerOfTwo = function(n) {
                if (typeof n !== 'number' || n < 0) {
            throw new DeveloperError('A number greater than or equal to 0 is required.');
        }
        
        // From http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
        --n;
        n |= n >> 1;
        n |= n >> 2;
        n |= n >> 4;
        n |= n >> 8;
        n |= n >> 16;
        ++n;

        return n;
    };

    /**
     * Constraint a value to lie between two values.
     *
     * @param {Number} value The value to constrain.
     * @param {Number} min The minimum value.
     * @param {Number} max The maximum value.
     * @returns {Number} The value clamped so that min <= value <= max.
     */
    CesiumMath.clamp = function(value, min, max) {
                if (!defined(value)) {
            throw new DeveloperError('value is required');
        }
        if (!defined(min)) {
            throw new DeveloperError('min is required.');
        }
        if (!defined(max)) {
            throw new DeveloperError('max is required.');
        }
                return value < min ? min : value > max ? max : value;
    };

    var randomNumberGenerator = new MersenneTwister();

    /**
     * Sets the seed used by the random number generator
     * in {@link CesiumMath#nextRandomNumber}.
     *
     * @param {Number} seed An integer used as the seed.
     */
    CesiumMath.setRandomNumberSeed = function(seed) {
                if (!defined(seed)) {
            throw new DeveloperError('seed is required.');
        }
        
        randomNumberGenerator = new MersenneTwister(seed);
    };

    /**
     * Generates a random number in the range of [0.0, 1.0)
     * using a Mersenne twister.
     *
     * @returns {Number} A random number in the range of [0.0, 1.0).
     *
     * @see CesiumMath.setRandomNumberSeed
     * @see {@link http://en.wikipedia.org/wiki/Mersenne_twister|Mersenne twister on Wikipedia}
     */
    CesiumMath.nextRandomNumber = function() {
        return randomNumberGenerator.random();
    };

    /**
     * Computes <code>Math.acos(value)</acode>, but first clamps <code>value</code> to the range [-1.0, 1.0]
     * so that the function will never return NaN.
     *
     * @param {Number} value The value for which to compute acos.
     * @returns {Number} The acos of the value if the value is in the range [-1.0, 1.0], or the acos of -1.0 or 1.0,
     *          whichever is closer, if the value is outside the range.
     */
    CesiumMath.acosClamped = function(value) {
                if (!defined(value)) {
            throw new DeveloperError('value is required.');
        }
                return Math.acos(CesiumMath.clamp(value, -1.0, 1.0));
    };

    /**
     * Computes <code>Math.asin(value)</acode>, but first clamps <code>value</code> to the range [-1.0, 1.0]
     * so that the function will never return NaN.
     *
     * @param {Number} value The value for which to compute asin.
     * @returns {Number} The asin of the value if the value is in the range [-1.0, 1.0], or the asin of -1.0 or 1.0,
     *          whichever is closer, if the value is outside the range.
     */
    CesiumMath.asinClamped = function(value) {
                if (!defined(value)) {
            throw new DeveloperError('value is required.');
        }
                return Math.asin(CesiumMath.clamp(value, -1.0, 1.0));
    };

    /**
     * Finds the chord length between two points given the circle's radius and the angle between the points.
     *
     * @param {Number} angle The angle between the two points.
     * @param {Number} radius The radius of the circle.
     * @returns {Number} The chord length.
     */
    CesiumMath.chordLength = function(angle, radius) {
                if (!defined(angle)) {
            throw new DeveloperError('angle is required.');
        }
        if (!defined(radius)) {
            throw new DeveloperError('radius is required.');
        }
                return 2.0 * radius * Math.sin(angle * 0.5);
    };

    /**
     * Finds the logarithm of a number to a base.
     *
     * @param {Number} number The number.
     * @param {Number} base The base.
     * @returns {Number} The result.
     */
    CesiumMath.logBase = function(number, base) {
                if (!defined(number)) {
            throw new DeveloperError('number is required.');
        }
        if (!defined(base)) {
            throw new DeveloperError('base is required.');
        }
                return Math.log(number) / Math.log(base);
    };

    /**
     * @private
     */
    CesiumMath.fog = function(distanceToCamera, density) {
        var scalar = distanceToCamera * density;
        return 1.0 - Math.exp(-(scalar * scalar));
    };

    return CesiumMath;
});

/*global define*/
define('Core/Cartesian2',[
        './Check',
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject',
        './Math'
    ], function(
        Check,
        defaultValue,
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath) {
    'use strict';

    /**
     * A 2D Cartesian point.
     * @alias Cartesian2
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     *
     * @see Cartesian3
     * @see Cartesian4
     * @see Packable
     */
    function Cartesian2(x, y) {
        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);
    }

    /**
     * Creates a Cartesian2 instance from x and y coordinates.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.fromElements = function(x, y, result) {
        if (!defined(result)) {
            return new Cartesian2(x, y);
        }

        result.x = x;
        result.y = y;
        return result;
    };

    /**
     * Duplicates a Cartesian2 instance.
     *
     * @param {Cartesian2} cartesian The Cartesian to duplicate.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided. (Returns undefined if cartesian is undefined)
     */
    Cartesian2.clone = function(cartesian, result) {
        if (!defined(cartesian)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Cartesian2(cartesian.x, cartesian.y);
        }

        result.x = cartesian.x;
        result.y = cartesian.y;
        return result;
    };

    /**
     * Creates a Cartesian2 instance from an existing Cartesian3.  This simply takes the
     * x and y properties of the Cartesian3 and drops z.
     * @function
     *
     * @param {Cartesian3} cartesian The Cartesian3 instance to create a Cartesian2 instance from.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.fromCartesian3 = Cartesian2.clone;

    /**
     * Creates a Cartesian2 instance from an existing Cartesian4.  This simply takes the
     * x and y properties of the Cartesian4 and drops z and w.
     * @function
     *
     * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian2 instance from.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.fromCartesian4 = Cartesian2.clone;

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Cartesian2.packedLength = 2;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Cartesian2} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Cartesian2.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex] = value.y;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Cartesian2} [result] The object into which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Cartesian2();
        }
        result.x = array[startingIndex++];
        result.y = array[startingIndex];
        return result;
    };

    /**
     * Flattens an array of Cartesian2s into and array of components.
     *
     * @param {Cartesian2[]} array The array of cartesians to pack.
     * @param {Number[]} result The array onto which to store the result.
     * @returns {Number[]} The packed array.
     */
    Cartesian2.packArray = function(array, result) {
                Check.defined('array', array);
        
        var length = array.length;
        if (!defined(result)) {
            result = new Array(length * 2);
        } else {
            result.length = length * 2;
        }

        for (var i = 0; i < length; ++i) {
            Cartesian2.pack(array[i], result, i * 2);
        }
        return result;
    };

    /**
     * Unpacks an array of cartesian components into and array of Cartesian2s.
     *
     * @param {Number[]} array The array of components to unpack.
     * @param {Cartesian2[]} result The array onto which to store the result.
     * @returns {Cartesian2[]} The unpacked array.
     */
    Cartesian2.unpackArray = function(array, result) {
                Check.defined('array', array);
        
        var length = array.length;
        if (!defined(result)) {
            result = new Array(length / 2);
        } else {
            result.length = length / 2;
        }

        for (var i = 0; i < length; i += 2) {
            var index = i / 2;
            result[index] = Cartesian2.unpack(array, i, result[index]);
        }
        return result;
    };

    /**
     * Creates a Cartesian2 from two consecutive elements in an array.
     * @function
     *
     * @param {Number[]} array The array whose two consecutive elements correspond to the x and y components, respectively.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     *
     * @example
     * // Create a Cartesian2 with (1.0, 2.0)
     * var v = [1.0, 2.0];
     * var p = Cesium.Cartesian2.fromArray(v);
     *
     * // Create a Cartesian2 with (1.0, 2.0) using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 2.0];
     * var p2 = Cesium.Cartesian2.fromArray(v2, 2);
     */
    Cartesian2.fromArray = Cartesian2.unpack;

    /**
     * Computes the value of the maximum component for the supplied Cartesian.
     *
     * @param {Cartesian2} cartesian The cartesian to use.
     * @returns {Number} The value of the maximum component.
     */
    Cartesian2.maximumComponent = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return Math.max(cartesian.x, cartesian.y);
    };

    /**
     * Computes the value of the minimum component for the supplied Cartesian.
     *
     * @param {Cartesian2} cartesian The cartesian to use.
     * @returns {Number} The value of the minimum component.
     */
    Cartesian2.minimumComponent = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return Math.min(cartesian.x, cartesian.y);
    };

    /**
     * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
     *
     * @param {Cartesian2} first A cartesian to compare.
     * @param {Cartesian2} second A cartesian to compare.
     * @param {Cartesian2} result The object into which to store the result.
     * @returns {Cartesian2} A cartesian with the minimum components.
     */
    Cartesian2.minimumByComponent = function(first, second, result) {
                Check.typeOf.object('first', first);
        Check.typeOf.object('second', second);
        Check.typeOf.object('result', result);
        

        result.x = Math.min(first.x, second.x);
        result.y = Math.min(first.y, second.y);

        return result;
    };

    /**
     * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
     *
     * @param {Cartesian2} first A cartesian to compare.
     * @param {Cartesian2} second A cartesian to compare.
     * @param {Cartesian2} result The object into which to store the result.
     * @returns {Cartesian2} A cartesian with the maximum components.
     */
    Cartesian2.maximumByComponent = function(first, second, result) {
                Check.typeOf.object('first', first);
        Check.typeOf.object('second', second);
        Check.typeOf.object('result', result);
        
        result.x = Math.max(first.x, second.x);
        result.y = Math.max(first.y, second.y);
        return result;
    };

    /**
     * Computes the provided Cartesian's squared magnitude.
     *
     * @param {Cartesian2} cartesian The Cartesian instance whose squared magnitude is to be computed.
     * @returns {Number} The squared magnitude.
     */
    Cartesian2.magnitudeSquared = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return cartesian.x * cartesian.x + cartesian.y * cartesian.y;
    };

    /**
     * Computes the Cartesian's magnitude (length).
     *
     * @param {Cartesian2} cartesian The Cartesian instance whose magnitude is to be computed.
     * @returns {Number} The magnitude.
     */
    Cartesian2.magnitude = function(cartesian) {
        return Math.sqrt(Cartesian2.magnitudeSquared(cartesian));
    };

    var distanceScratch = new Cartesian2();

    /**
     * Computes the distance between two points.
     *
     * @param {Cartesian2} left The first point to compute the distance from.
     * @param {Cartesian2} right The second point to compute the distance to.
     * @returns {Number} The distance between two points.
     *
     * @example
     * // Returns 1.0
     * var d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(2.0, 0.0));
     */
    Cartesian2.distance = function(left, right) {
                if (!defined(left) || !defined(right)) {
            throw new DeveloperError('left and right are required.');
        }
        
        Cartesian2.subtract(left, right, distanceScratch);
        return Cartesian2.magnitude(distanceScratch);
    };

    /**
     * Computes the squared distance between two points.  Comparing squared distances
     * using this function is more efficient than comparing distances using {@link Cartesian2#distance}.
     *
     * @param {Cartesian2} left The first point to compute the distance from.
     * @param {Cartesian2} right The second point to compute the distance to.
     * @returns {Number} The distance between two points.
     *
     * @example
     * // Returns 4.0, not 2.0
     * var d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(3.0, 0.0));
     */
    Cartesian2.distanceSquared = function(left, right) {
                if (!defined(left) || !defined(right)) {
            throw new DeveloperError('left and right are required.');
        }
        
        Cartesian2.subtract(left, right, distanceScratch);
        return Cartesian2.magnitudeSquared(distanceScratch);
    };

    /**
     * Computes the normalized form of the supplied Cartesian.
     *
     * @param {Cartesian2} cartesian The Cartesian to be normalized.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.normalize = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var magnitude = Cartesian2.magnitude(cartesian);

        result.x = cartesian.x / magnitude;
        result.y = cartesian.y / magnitude;

                if (isNaN(result.x) || isNaN(result.y)) {
            throw new DeveloperError('normalized result is not a number');
        }
        
        return result;
    };

    /**
     * Computes the dot (scalar) product of two Cartesians.
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @returns {Number} The dot product.
     */
    Cartesian2.dot = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        return left.x * right.x + left.y * right.y;
    };

    /**
     * Computes the componentwise product of two Cartesians.
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.multiplyComponents = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x * right.x;
        result.y = left.y * right.y;
        return result;
    };

    /**
     * Computes the componentwise quotient of two Cartesians.
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.divideComponents = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x / right.x;
        result.y = left.y / right.y;
        return result;
    };

    /**
     * Computes the componentwise sum of two Cartesians.
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.add = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        return result;
    };

    /**
     * Computes the componentwise difference of two Cartesians.
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.subtract = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        return result;
    };

    /**
     * Multiplies the provided Cartesian componentwise by the provided scalar.
     *
     * @param {Cartesian2} cartesian The Cartesian to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.multiplyByScalar = function(cartesian, scalar, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = cartesian.x * scalar;
        result.y = cartesian.y * scalar;
        return result;
    };

    /**
     * Divides the provided Cartesian componentwise by the provided scalar.
     *
     * @param {Cartesian2} cartesian The Cartesian to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.divideByScalar = function(cartesian, scalar, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = cartesian.x / scalar;
        result.y = cartesian.y / scalar;
        return result;
    };

    /**
     * Negates the provided Cartesian.
     *
     * @param {Cartesian2} cartesian The Cartesian to be negated.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.negate = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result.x = -cartesian.x;
        result.y = -cartesian.y;
        return result;
    };

    /**
     * Computes the absolute value of the provided Cartesian.
     *
     * @param {Cartesian2} cartesian The Cartesian whose absolute value is to be computed.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.abs = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result.x = Math.abs(cartesian.x);
        result.y = Math.abs(cartesian.y);
        return result;
    };

    var lerpScratch = new Cartesian2();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
     *
     * @param {Cartesian2} start The value corresponding to t at 0.0.
     * @param {Cartesian2} end The value corresponding to t at 1.0.
     * @param {Number} t The point along t at which to interpolate.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter.
     */
    Cartesian2.lerp = function(start, end, t, result) {
                Check.typeOf.object('start', start);
        Check.typeOf.object('end', end);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        Cartesian2.multiplyByScalar(end, t, lerpScratch);
        result = Cartesian2.multiplyByScalar(start, 1.0 - t, result);
        return Cartesian2.add(lerpScratch, result, result);
    };

    var angleBetweenScratch = new Cartesian2();
    var angleBetweenScratch2 = new Cartesian2();
    /**
     * Returns the angle, in radians, between the provided Cartesians.
     *
     * @param {Cartesian2} left The first Cartesian.
     * @param {Cartesian2} right The second Cartesian.
     * @returns {Number} The angle between the Cartesians.
     */
    Cartesian2.angleBetween = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        Cartesian2.normalize(left, angleBetweenScratch);
        Cartesian2.normalize(right, angleBetweenScratch2);
        return CesiumMath.acosClamped(Cartesian2.dot(angleBetweenScratch, angleBetweenScratch2));
    };

    var mostOrthogonalAxisScratch = new Cartesian2();
    /**
     * Returns the axis that is most orthogonal to the provided Cartesian.
     *
     * @param {Cartesian2} cartesian The Cartesian on which to find the most orthogonal axis.
     * @param {Cartesian2} result The object onto which to store the result.
     * @returns {Cartesian2} The most orthogonal axis.
     */
    Cartesian2.mostOrthogonalAxis = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var f = Cartesian2.normalize(cartesian, mostOrthogonalAxisScratch);
        Cartesian2.abs(f, f);

        if (f.x <= f.y) {
            result = Cartesian2.clone(Cartesian2.UNIT_X, result);
        } else {
            result = Cartesian2.clone(Cartesian2.UNIT_Y, result);
        }

        return result;
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartesian2} [left] The first Cartesian.
     * @param {Cartesian2} [right] The second Cartesian.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartesian2.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.x === right.x) &&
                (left.y === right.y));
    };

    /**
     * @private
     */
    Cartesian2.equalsArray = function(cartesian, array, offset) {
        return cartesian.x === array[offset] &&
               cartesian.y === array[offset + 1];
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian2} [left] The first Cartesian.
     * @param {Cartesian2} [right] The second Cartesian.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartesian2.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                CesiumMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon));
    };

    /**
     * An immutable Cartesian2 instance initialized to (0.0, 0.0).
     *
     * @type {Cartesian2}
     * @constant
     */
    Cartesian2.ZERO = freezeObject(new Cartesian2(0.0, 0.0));

    /**
     * An immutable Cartesian2 instance initialized to (1.0, 0.0).
     *
     * @type {Cartesian2}
     * @constant
     */
    Cartesian2.UNIT_X = freezeObject(new Cartesian2(1.0, 0.0));

    /**
     * An immutable Cartesian2 instance initialized to (0.0, 1.0).
     *
     * @type {Cartesian2}
     * @constant
     */
    Cartesian2.UNIT_Y = freezeObject(new Cartesian2(0.0, 1.0));

    /**
     * Duplicates this Cartesian2 instance.
     *
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
     */
    Cartesian2.prototype.clone = function(result) {
        return Cartesian2.clone(this, result);
    };

    /**
     * Compares this Cartesian against the provided Cartesian componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartesian2} [right] The right hand side Cartesian.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Cartesian2.prototype.equals = function(right) {
        return Cartesian2.equals(this, right);
    };

    /**
     * Compares this Cartesian against the provided Cartesian componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian2} [right] The right hand side Cartesian.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartesian2.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
        return Cartesian2.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
    };

    /**
     * Creates a string representing this Cartesian in the format '(x, y)'.
     *
     * @returns {String} A string representing the provided Cartesian in the format '(x, y)'.
     */
    Cartesian2.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ')';
    };

    return Cartesian2;
});

/*global define*/
define('Core/Cartesian3',[
    './Check',
    './defaultValue',
    './defined',
    './DeveloperError',
    './freezeObject',
    './Math'
    ], function(
        Check,
        defaultValue,
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath) {
    'use strict';

    /**
     * A 3D Cartesian point.
     * @alias Cartesian3
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     * @param {Number} [z=0.0] The Z component.
     *
     * @see Cartesian2
     * @see Cartesian4
     * @see Packable
     */
    function Cartesian3(x, y, z) {
        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);

        /**
         * The Z component.
         * @type {Number}
         * @default 0.0
         */
        this.z = defaultValue(z, 0.0);
    }

    /**
     * Converts the provided Spherical into Cartesian3 coordinates.
     *
     * @param {Spherical} spherical The Spherical to be converted to Cartesian3.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.fromSpherical = function(spherical, result) {
                Check.typeOf.object('spherical', spherical);
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        var clock = spherical.clock;
        var cone = spherical.cone;
        var magnitude = defaultValue(spherical.magnitude, 1.0);
        var radial = magnitude * Math.sin(cone);
        result.x = radial * Math.cos(clock);
        result.y = radial * Math.sin(clock);
        result.z = magnitude * Math.cos(cone);
        return result;
    };

    /**
     * Creates a Cartesian3 instance from x, y and z coordinates.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} z The z coordinate.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.fromElements = function(x, y, z, result) {
        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Duplicates a Cartesian3 instance.
     *
     * @param {Cartesian3} cartesian The Cartesian to duplicate.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided. (Returns undefined if cartesian is undefined)
     */
    Cartesian3.clone = function(cartesian, result) {
        if (!defined(cartesian)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Cartesian3(cartesian.x, cartesian.y, cartesian.z);
        }

        result.x = cartesian.x;
        result.y = cartesian.y;
        result.z = cartesian.z;
        return result;
    };

    /**
     * Creates a Cartesian3 instance from an existing Cartesian4.  This simply takes the
     * x, y, and z properties of the Cartesian4 and drops w.
     * @function
     *
     * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian3 instance from.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.fromCartesian4 = Cartesian3.clone;

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Cartesian3.packedLength = 3;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Cartesian3} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Cartesian3.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex++] = value.y;
        array[startingIndex] = value.z;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Cartesian3} [result] The object into which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Cartesian3();
        }
        result.x = array[startingIndex++];
        result.y = array[startingIndex++];
        result.z = array[startingIndex];
        return result;
    };

    /**
     * Flattens an array of Cartesian3s into an array of components.
     *
     * @param {Cartesian3[]} array The array of cartesians to pack.
     * @param {Number[]} result The array onto which to store the result.
     * @returns {Number[]} The packed array.
     */
    Cartesian3.packArray = function(array, result) {
                Check.defined('array', array);
        
        var length = array.length;
        if (!defined(result)) {
            result = new Array(length * 3);
        } else {
            result.length = length * 3;
        }

        for (var i = 0; i < length; ++i) {
            Cartesian3.pack(array[i], result, i * 3);
        }
        return result;
    };

    /**
     * Unpacks an array of cartesian components into an array of Cartesian3s.
     *
     * @param {Number[]} array The array of components to unpack.
     * @param {Cartesian3[]} result The array onto which to store the result.
     * @returns {Cartesian3[]} The unpacked array.
     */
    Cartesian3.unpackArray = function(array, result) {
                Check.defined('array', array);
        Check.typeOf.number.greaterThanOrEquals('array.length', array.length, 3);
        if (array.length % 3 !== 0) {
            throw new DeveloperError('array length must be a multiple of 3.');
        }
        
        var length = array.length;
        if (!defined(result)) {
            result = new Array(length / 3);
        } else {
            result.length = length / 3;
        }

        for (var i = 0; i < length; i += 3) {
            var index = i / 3;
            result[index] = Cartesian3.unpack(array, i, result[index]);
        }
        return result;
    };

    /**
     * Creates a Cartesian3 from three consecutive elements in an array.
     * @function
     *
     * @param {Number[]} array The array whose three consecutive elements correspond to the x, y, and z components, respectively.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     *
     * @example
     * // Create a Cartesian3 with (1.0, 2.0, 3.0)
     * var v = [1.0, 2.0, 3.0];
     * var p = Cesium.Cartesian3.fromArray(v);
     *
     * // Create a Cartesian3 with (1.0, 2.0, 3.0) using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0];
     * var p2 = Cesium.Cartesian3.fromArray(v2, 2);
     */
    Cartesian3.fromArray = Cartesian3.unpack;

    /**
     * Computes the value of the maximum component for the supplied Cartesian.
     *
     * @param {Cartesian3} cartesian The cartesian to use.
     * @returns {Number} The value of the maximum component.
     */
    Cartesian3.maximumComponent = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return Math.max(cartesian.x, cartesian.y, cartesian.z);
    };

    /**
     * Computes the value of the minimum component for the supplied Cartesian.
     *
     * @param {Cartesian3} cartesian The cartesian to use.
     * @returns {Number} The value of the minimum component.
     */
    Cartesian3.minimumComponent = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return Math.min(cartesian.x, cartesian.y, cartesian.z);
    };

    /**
     * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
     *
     * @param {Cartesian3} first A cartesian to compare.
     * @param {Cartesian3} second A cartesian to compare.
     * @param {Cartesian3} result The object into which to store the result.
     * @returns {Cartesian3} A cartesian with the minimum components.
     */
    Cartesian3.minimumByComponent = function(first, second, result) {
                Check.typeOf.object('first', first);
        Check.typeOf.object('second', second);
        Check.typeOf.object('result', result);
        
        result.x = Math.min(first.x, second.x);
        result.y = Math.min(first.y, second.y);
        result.z = Math.min(first.z, second.z);

        return result;
    };

    /**
     * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
     *
     * @param {Cartesian3} first A cartesian to compare.
     * @param {Cartesian3} second A cartesian to compare.
     * @param {Cartesian3} result The object into which to store the result.
     * @returns {Cartesian3} A cartesian with the maximum components.
     */
    Cartesian3.maximumByComponent = function(first, second, result) {
                Check.typeOf.object('first', first);
        Check.typeOf.object('second', second);
        Check.typeOf.object('result', result);
        
        result.x = Math.max(first.x, second.x);
        result.y = Math.max(first.y, second.y);
        result.z = Math.max(first.z, second.z);
        return result;
    };

    /**
     * Computes the provided Cartesian's squared magnitude.
     *
     * @param {Cartesian3} cartesian The Cartesian instance whose squared magnitude is to be computed.
     * @returns {Number} The squared magnitude.
     */
    Cartesian3.magnitudeSquared = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z;
    };

    /**
     * Computes the Cartesian's magnitude (length).
     *
     * @param {Cartesian3} cartesian The Cartesian instance whose magnitude is to be computed.
     * @returns {Number} The magnitude.
     */
    Cartesian3.magnitude = function(cartesian) {
        return Math.sqrt(Cartesian3.magnitudeSquared(cartesian));
    };

    var distanceScratch = new Cartesian3();

    /**
     * Computes the distance between two points.
     *
     * @param {Cartesian3} left The first point to compute the distance from.
     * @param {Cartesian3} right The second point to compute the distance to.
     * @returns {Number} The distance between two points.
     *
     * @example
     * // Returns 1.0
     * var d = Cesium.Cartesian3.distance(new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(2.0, 0.0, 0.0));
     */
    Cartesian3.distance = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        Cartesian3.subtract(left, right, distanceScratch);
        return Cartesian3.magnitude(distanceScratch);
    };

    /**
     * Computes the squared distance between two points.  Comparing squared distances
     * using this function is more efficient than comparing distances using {@link Cartesian3#distance}.
     *
     * @param {Cartesian3} left The first point to compute the distance from.
     * @param {Cartesian3} right The second point to compute the distance to.
     * @returns {Number} The distance between two points.
     *
     * @example
     * // Returns 4.0, not 2.0
     * var d = Cesium.Cartesian3.distanceSquared(new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(3.0, 0.0, 0.0));
     */
    Cartesian3.distanceSquared = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        Cartesian3.subtract(left, right, distanceScratch);
        return Cartesian3.magnitudeSquared(distanceScratch);
    };

    /**
     * Computes the normalized form of the supplied Cartesian.
     *
     * @param {Cartesian3} cartesian The Cartesian to be normalized.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.normalize = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var magnitude = Cartesian3.magnitude(cartesian);

        result.x = cartesian.x / magnitude;
        result.y = cartesian.y / magnitude;
        result.z = cartesian.z / magnitude;

                if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
            throw new DeveloperError('normalized result is not a number');
        }
        
        return result;
    };

    /**
     * Computes the dot (scalar) product of two Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @returns {Number} The dot product.
     */
    Cartesian3.dot = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        return left.x * right.x + left.y * right.y + left.z * right.z;
    };

    /**
     * Computes the componentwise product of two Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.multiplyComponents = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x * right.x;
        result.y = left.y * right.y;
        result.z = left.z * right.z;
        return result;
    };

    /**
     * Computes the componentwise quotient of two Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.divideComponents = function(left, right, result) {
                if (!defined(left)) {
            throw new DeveloperError('left is required');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required');
        }
        
        result.x = left.x / right.x;
        result.y = left.y / right.y;
        result.z = left.z / right.z;
        return result;
    };

    /**
     * Computes the componentwise sum of two Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.add = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        result.z = left.z + right.z;
        return result;
    };

    /**
     * Computes the componentwise difference of two Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.subtract = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        result.z = left.z - right.z;
        return result;
    };

    /**
     * Multiplies the provided Cartesian componentwise by the provided scalar.
     *
     * @param {Cartesian3} cartesian The Cartesian to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.multiplyByScalar = function(cartesian, scalar, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = cartesian.x * scalar;
        result.y = cartesian.y * scalar;
        result.z = cartesian.z * scalar;
        return result;
    };

    /**
     * Divides the provided Cartesian componentwise by the provided scalar.
     *
     * @param {Cartesian3} cartesian The Cartesian to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.divideByScalar = function(cartesian, scalar, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = cartesian.x / scalar;
        result.y = cartesian.y / scalar;
        result.z = cartesian.z / scalar;
        return result;
    };

    /**
     * Negates the provided Cartesian.
     *
     * @param {Cartesian3} cartesian The Cartesian to be negated.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.negate = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result.x = -cartesian.x;
        result.y = -cartesian.y;
        result.z = -cartesian.z;
        return result;
    };

    /**
     * Computes the absolute value of the provided Cartesian.
     *
     * @param {Cartesian3} cartesian The Cartesian whose absolute value is to be computed.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.abs = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result.x = Math.abs(cartesian.x);
        result.y = Math.abs(cartesian.y);
        result.z = Math.abs(cartesian.z);
        return result;
    };

    var lerpScratch = new Cartesian3();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
     *
     * @param {Cartesian3} start The value corresponding to t at 0.0.
     * @param {Cartesian3} end The value corresponding to t at 1.0.
     * @param {Number} t The point along t at which to interpolate.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Cartesian3.lerp = function(start, end, t, result) {
                Check.typeOf.object('start', start);
        Check.typeOf.object('end', end);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        Cartesian3.multiplyByScalar(end, t, lerpScratch);
        result = Cartesian3.multiplyByScalar(start, 1.0 - t, result);
        return Cartesian3.add(lerpScratch, result, result);
    };

    var angleBetweenScratch = new Cartesian3();
    var angleBetweenScratch2 = new Cartesian3();
    /**
     * Returns the angle, in radians, between the provided Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @returns {Number} The angle between the Cartesians.
     */
    Cartesian3.angleBetween = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        Cartesian3.normalize(left, angleBetweenScratch);
        Cartesian3.normalize(right, angleBetweenScratch2);
        var cosine = Cartesian3.dot(angleBetweenScratch, angleBetweenScratch2);
        var sine = Cartesian3.magnitude(Cartesian3.cross(angleBetweenScratch, angleBetweenScratch2, angleBetweenScratch));
        return Math.atan2(sine, cosine);
    };

    var mostOrthogonalAxisScratch = new Cartesian3();
    /**
     * Returns the axis that is most orthogonal to the provided Cartesian.
     *
     * @param {Cartesian3} cartesian The Cartesian on which to find the most orthogonal axis.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The most orthogonal axis.
     */
    Cartesian3.mostOrthogonalAxis = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var f = Cartesian3.normalize(cartesian, mostOrthogonalAxisScratch);
        Cartesian3.abs(f, f);

        if (f.x <= f.y) {
            if (f.x <= f.z) {
                result = Cartesian3.clone(Cartesian3.UNIT_X, result);
            } else {
                result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
            }
        } else {
            if (f.y <= f.z) {
                result = Cartesian3.clone(Cartesian3.UNIT_Y, result);
            } else {
                result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
            }
        }

        return result;
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartesian3} [left] The first Cartesian.
     * @param {Cartesian3} [right] The second Cartesian.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartesian3.equals = function(left, right) {
            return (left === right) ||
              ((defined(left)) &&
               (defined(right)) &&
               (left.x === right.x) &&
               (left.y === right.y) &&
               (left.z === right.z));
    };

    /**
     * @private
     */
    Cartesian3.equalsArray = function(cartesian, array, offset) {
        return cartesian.x === array[offset] &&
               cartesian.y === array[offset + 1] &&
               cartesian.z === array[offset + 2];
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [left] The first Cartesian.
     * @param {Cartesian3} [right] The second Cartesian.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartesian3.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                CesiumMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon));
    };

    /**
     * Computes the cross (outer) product of two Cartesians.
     *
     * @param {Cartesian3} left The first Cartesian.
     * @param {Cartesian3} right The second Cartesian.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The cross product.
     */
    Cartesian3.cross = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        var leftX = left.x;
        var leftY = left.y;
        var leftZ = left.z;
        var rightX = right.x;
        var rightY = right.y;
        var rightZ = right.z;

        var x = leftY * rightZ - leftZ * rightY;
        var y = leftZ * rightX - leftX * rightZ;
        var z = leftX * rightY - leftY * rightX;

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Returns a Cartesian3 position from longitude and latitude values given in degrees.
     *
     * @param {Number} longitude The longitude, in degrees
     * @param {Number} latitude The latitude, in degrees
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The position
     *
     * @example
     * var position = Cesium.Cartesian3.fromDegrees(-115.0, 37.0);
     */
    Cartesian3.fromDegrees = function(longitude, latitude, height, ellipsoid, result) {
                Check.typeOf.number('longitude', longitude);
        Check.typeOf.number('latitude', latitude);
        
        longitude = CesiumMath.toRadians(longitude);
        latitude = CesiumMath.toRadians(latitude);
        return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
    };

    var scratchN = new Cartesian3();
    var scratchK = new Cartesian3();
    var wgs84RadiiSquared = new Cartesian3(6378137.0 * 6378137.0, 6378137.0 * 6378137.0, 6356752.3142451793 * 6356752.3142451793);

    /**
     * Returns a Cartesian3 position from longitude and latitude values given in radians.
     *
     * @param {Number} longitude The longitude, in radians
     * @param {Number} latitude The latitude, in radians
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The position
     *
     * @example
     * var position = Cesium.Cartesian3.fromRadians(-2.007, 0.645);
     */
    Cartesian3.fromRadians = function(longitude, latitude, height, ellipsoid, result) {
                Check.typeOf.number('longitude', longitude);
        Check.typeOf.number('latitude', latitude);
        
        height = defaultValue(height, 0.0);
        var radiiSquared = defined(ellipsoid) ? ellipsoid.radiiSquared : wgs84RadiiSquared;

        var cosLatitude = Math.cos(latitude);
        scratchN.x = cosLatitude * Math.cos(longitude);
        scratchN.y = cosLatitude * Math.sin(longitude);
        scratchN.z = Math.sin(latitude);
        scratchN = Cartesian3.normalize(scratchN, scratchN);

        Cartesian3.multiplyComponents(radiiSquared, scratchN, scratchK);
        var gamma = Math.sqrt(Cartesian3.dot(scratchN, scratchK));
        scratchK = Cartesian3.divideByScalar(scratchK, gamma, scratchK);
        scratchN = Cartesian3.multiplyByScalar(scratchN, height, scratchN);

        if (!defined(result)) {
            result = new Cartesian3();
        }
        return Cartesian3.add(scratchK, scratchN, result);
    };

    /**
     * Returns an array of Cartesian3 positions given an array of longitude and latitude values given in degrees.
     *
     * @param {Number[]} coordinates A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...].
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the coordinates lie.
     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
     * @returns {Cartesian3[]} The array of positions.
     *
     * @example
     * var positions = Cesium.Cartesian3.fromDegreesArray([-115.0, 37.0, -107.0, 33.0]);
     */
    Cartesian3.fromDegreesArray = function(coordinates, ellipsoid, result) {
                Check.defined('coordinates', coordinates);
        if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
            throw new DeveloperError('the number of coordinates must be a multiple of 2 and at least 2');
        }
        
        var length = coordinates.length;
        if (!defined(result)) {
            result = new Array(length / 2);
        } else {
            result.length = length / 2;
        }

        for (var i = 0; i < length; i += 2) {
            var longitude = coordinates[i];
            var latitude = coordinates[i + 1];
            var index = i / 2;
            result[index] = Cartesian3.fromDegrees(longitude, latitude, 0, ellipsoid, result[index]);
        }

        return result;
    };

    /**
     * Returns an array of Cartesian3 positions given an array of longitude and latitude values given in radians.
     *
     * @param {Number[]} coordinates A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...].
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the coordinates lie.
     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
     * @returns {Cartesian3[]} The array of positions.
     *
     * @example
     * var positions = Cesium.Cartesian3.fromRadiansArray([-2.007, 0.645, -1.867, .575]);
     */
    Cartesian3.fromRadiansArray = function(coordinates, ellipsoid, result) {
                Check.defined('coordinates', coordinates);
        if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
            throw new DeveloperError('the number of coordinates must be a multiple of 2 and at least 2');
        }
        
        var length = coordinates.length;
        if (!defined(result)) {
            result = new Array(length / 2);
        } else {
            result.length = length / 2;
        }

        for (var i = 0; i < length; i += 2) {
            var longitude = coordinates[i];
            var latitude = coordinates[i + 1];
            var index = i / 2;
            result[index] = Cartesian3.fromRadians(longitude, latitude, 0, ellipsoid, result[index]);
        }

        return result;
    };

    /**
     * Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in degrees.
     *
     * @param {Number[]} coordinates A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...].
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
     * @returns {Cartesian3[]} The array of positions.
     *
     * @example
     * var positions = Cesium.Cartesian3.fromDegreesArrayHeights([-115.0, 37.0, 100000.0, -107.0, 33.0, 150000.0]);
     */
    Cartesian3.fromDegreesArrayHeights = function(coordinates, ellipsoid, result) {
                Check.defined('coordinates', coordinates);
        if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
            throw new DeveloperError('the number of coordinates must be a multiple of 3 and at least 3');
        }
        
        var length = coordinates.length;
        if (!defined(result)) {
            result = new Array(length / 3);
        } else {
            result.length = length / 3;
        }

        for (var i = 0; i < length; i += 3) {
            var longitude = coordinates[i];
            var latitude = coordinates[i + 1];
            var height = coordinates[i + 2];
            var index = i / 3;
            result[index] = Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result[index]);
        }

        return result;
    };

    /**
     * Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in radians.
     *
     * @param {Number[]} coordinates A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...].
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
     * @returns {Cartesian3[]} The array of positions.
     *
     * @example
     * var positions = Cesium.Cartesian3.fromRadiansArrayHeights([-2.007, 0.645, 100000.0, -1.867, .575, 150000.0]);
     */
    Cartesian3.fromRadiansArrayHeights = function(coordinates, ellipsoid, result) {
                Check.defined('coordinates', coordinates);
        if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
            throw new DeveloperError('the number of coordinates must be a multiple of 3 and at least 3');
        }
        
        var length = coordinates.length;
        if (!defined(result)) {
            result = new Array(length / 3);
        } else {
            result.length = length / 3;
        }

        for (var i = 0; i < length; i += 3) {
            var longitude = coordinates[i];
            var latitude = coordinates[i + 1];
            var height = coordinates[i + 2];
            var index = i / 3;
            result[index] = Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result[index]);
        }

        return result;
    };

    /**
     * An immutable Cartesian3 instance initialized to (0.0, 0.0, 0.0).
     *
     * @type {Cartesian3}
     * @constant
     */
    Cartesian3.ZERO = freezeObject(new Cartesian3(0.0, 0.0, 0.0));

    /**
     * An immutable Cartesian3 instance initialized to (1.0, 0.0, 0.0).
     *
     * @type {Cartesian3}
     * @constant
     */
    Cartesian3.UNIT_X = freezeObject(new Cartesian3(1.0, 0.0, 0.0));

    /**
     * An immutable Cartesian3 instance initialized to (0.0, 1.0, 0.0).
     *
     * @type {Cartesian3}
     * @constant
     */
    Cartesian3.UNIT_Y = freezeObject(new Cartesian3(0.0, 1.0, 0.0));

    /**
     * An immutable Cartesian3 instance initialized to (0.0, 0.0, 1.0).
     *
     * @type {Cartesian3}
     * @constant
     */
    Cartesian3.UNIT_Z = freezeObject(new Cartesian3(0.0, 0.0, 1.0));

    /**
     * Duplicates this Cartesian3 instance.
     *
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
     */
    Cartesian3.prototype.clone = function(result) {
        return Cartesian3.clone(this, result);
    };

    /**
     * Compares this Cartesian against the provided Cartesian componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartesian3} [right] The right hand side Cartesian.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Cartesian3.prototype.equals = function(right) {
        return Cartesian3.equals(this, right);
    };

    /**
     * Compares this Cartesian against the provided Cartesian componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [right] The right hand side Cartesian.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartesian3.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
        return Cartesian3.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
    };

    /**
     * Creates a string representing this Cartesian in the format '(x, y, z)'.
     *
     * @returns {String} A string representing this Cartesian in the format '(x, y, z)'.
     */
    Cartesian3.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
    };

    return Cartesian3;
});

/*global define*/
define('Core/AttributeCompression',[
        './Cartesian2',
        './Cartesian3',
        './defined',
        './DeveloperError',
        './Math'
    ], function(
        Cartesian2,
        Cartesian3,
        defined,
        DeveloperError,
        CesiumMath) {
    'use strict';

    /**
     * Attribute compression and decompression functions.
     *
     * @exports AttributeCompression
     *
     * @private
     */
    var AttributeCompression = {};

    /**
     * Encodes a normalized vector into 2 SNORM values in the range of [0-rangeMax] following the 'oct' encoding.
     *
     * Oct encoding is a compact representation of unit length vectors.
     * The 'oct' encoding is described in "A Survey of Efficient Representations of Independent Unit Vectors",
     * Cigolle et al 2014: {@link http://jcgt.org/published/0003/02/01/}
     *
     * @param {Cartesian3} vector The normalized vector to be compressed into 2 component 'oct' encoding.
     * @param {Cartesian2} result The 2 component oct-encoded unit length vector.
     * @param {Number} rangeMax The maximum value of the SNORM range. The encoded vector is stored in log2(rangeMax+1) bits.
     * @returns {Cartesian2} The 2 component oct-encoded unit length vector.
     *
     * @exception {DeveloperError} vector must be normalized.
     *
     * @see AttributeCompression.octDecodeInRange
     */
    AttributeCompression.octEncodeInRange = function(vector, rangeMax, result) {
                if (!defined(vector)) {
            throw new DeveloperError('vector is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        var magSquared = Cartesian3.magnitudeSquared(vector);
        if (Math.abs(magSquared - 1.0) > CesiumMath.EPSILON6) {
            throw new DeveloperError('vector must be normalized.');
        }
        
        result.x = vector.x / (Math.abs(vector.x) + Math.abs(vector.y) + Math.abs(vector.z));
        result.y = vector.y / (Math.abs(vector.x) + Math.abs(vector.y) + Math.abs(vector.z));
        if (vector.z < 0) {
            var x = result.x;
            var y = result.y;
            result.x = (1.0 - Math.abs(y)) * CesiumMath.signNotZero(x);
            result.y = (1.0 - Math.abs(x)) * CesiumMath.signNotZero(y);
        }

        result.x = CesiumMath.toSNorm(result.x, rangeMax);
        result.y = CesiumMath.toSNorm(result.y, rangeMax);

        return result;
    };

    /**
     * Encodes a normalized vector into 2 SNORM values in the range of [0-255] following the 'oct' encoding.
     *
     * @param {Cartesian3} vector The normalized vector to be compressed into 2 byte 'oct' encoding.
     * @param {Cartesian2} result The 2 byte oct-encoded unit length vector.
     * @returns {Cartesian2} The 2 byte oct-encoded unit length vector.
     *
     * @exception {DeveloperError} vector must be normalized.
     *
     * @see AttributeCompression.octEncodeInRange
     * @see AttributeCompression.octDecode
     */
    AttributeCompression.octEncode = function(vector, result) {
        return AttributeCompression.octEncodeInRange(vector, 255, result);
    };

    /**
     * Decodes a unit-length vector in 'oct' encoding to a normalized 3-component vector.
     *
     * @param {Number} x The x component of the oct-encoded unit length vector.
     * @param {Number} y The y component of the oct-encoded unit length vector.
     * @param {Number} rangeMax The maximum value of the SNORM range. The encoded vector is stored in log2(rangeMax+1) bits.
     * @param {Cartesian3} result The decoded and normalized vector
     * @returns {Cartesian3} The decoded and normalized vector.
     *
     * @exception {DeveloperError} x and y must be an unsigned normalized integer between 0 and rangeMax.
     *
     * @see AttributeCompression.octEncodeInRange
     */
    AttributeCompression.octDecodeInRange = function(x, y, rangeMax, result) {
                if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        if (x < 0 || x > rangeMax || y < 0 || y > rangeMax) {
            throw new DeveloperError('x and y must be a signed normalized integer between 0 and ' + rangeMax);
        }
        
        result.x = CesiumMath.fromSNorm(x, rangeMax);
        result.y = CesiumMath.fromSNorm(y, rangeMax);
        result.z = 1.0 - (Math.abs(result.x) + Math.abs(result.y));

        if (result.z < 0.0)
        {
            var oldVX = result.x;
            result.x = (1.0 - Math.abs(result.y)) * CesiumMath.signNotZero(oldVX);
            result.y = (1.0 - Math.abs(oldVX)) * CesiumMath.signNotZero(result.y);
        }

        return Cartesian3.normalize(result, result);
    };

    /**
     * Decodes a unit-length vector in 2 byte 'oct' encoding to a normalized 3-component vector.
     *
     * @param {Number} x The x component of the oct-encoded unit length vector.
     * @param {Number} y The y component of the oct-encoded unit length vector.
     * @param {Cartesian3} result The decoded and normalized vector.
     * @returns {Cartesian3} The decoded and normalized vector.
     *
     * @exception {DeveloperError} x and y must be an unsigned normalized integer between 0 and 255.
     *
     * @see AttributeCompression.octDecodeInRange
     */
    AttributeCompression.octDecode = function(x, y, result) {
        return AttributeCompression.octDecodeInRange(x, y, 255, result);
    };

    /**
     * Packs an oct encoded vector into a single floating-point number.
     *
     * @param {Cartesian2} encoded The oct encoded vector.
     * @returns {Number} The oct encoded vector packed into a single float.
     *
     */
    AttributeCompression.octPackFloat = function(encoded) {
                if (!defined(encoded)) {
            throw new DeveloperError('encoded is required.');
        }
                return 256.0 * encoded.x + encoded.y;
    };

    var scratchEncodeCart2 = new Cartesian2();

    /**
     * Encodes a normalized vector into 2 SNORM values in the range of [0-255] following the 'oct' encoding and
     * stores those values in a single float-point number.
     *
     * @param {Cartesian3} vector The normalized vector to be compressed into 2 byte 'oct' encoding.
     * @returns {Number} The 2 byte oct-encoded unit length vector.
     *
     * @exception {DeveloperError} vector must be normalized.
     */
    AttributeCompression.octEncodeFloat = function(vector) {
        AttributeCompression.octEncode(vector, scratchEncodeCart2);
        return AttributeCompression.octPackFloat(scratchEncodeCart2);
    };

    /**
     * Decodes a unit-length vector in 'oct' encoding packed in a floating-point number to a normalized 3-component vector.
     *
     * @param {Number} value The oct-encoded unit length vector stored as a single floating-point number.
     * @param {Cartesian3} result The decoded and normalized vector
     * @returns {Cartesian3} The decoded and normalized vector.
     *
     */
    AttributeCompression.octDecodeFloat = function(value, result) {
                if (!defined(value)) {
            throw new DeveloperError('value is required.');
        }
        
        var temp = value / 256.0;
        var x = Math.floor(temp);
        var y = (temp - x) * 256.0;

        return AttributeCompression.octDecode(x, y, result);
    };

    /**
     * Encodes three normalized vectors into 6 SNORM values in the range of [0-255] following the 'oct' encoding and
     * packs those into two floating-point numbers.
     *
     * @param {Cartesian3} v1 A normalized vector to be compressed.
     * @param {Cartesian3} v2 A normalized vector to be compressed.
     * @param {Cartesian3} v3 A normalized vector to be compressed.
     * @param {Cartesian2} result The 'oct' encoded vectors packed into two floating-point numbers.
     * @returns {Cartesian2} The 'oct' encoded vectors packed into two floating-point numbers.
     *
     */
    AttributeCompression.octPack = function(v1, v2, v3, result) {
                if (!defined(v1)) {
            throw new DeveloperError('v1 is required.');
        }
        if (!defined(v2)) {
            throw new DeveloperError('v2 is required.');
        }
        if (!defined(v3)) {
            throw new DeveloperError('v3 is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var encoded1 = AttributeCompression.octEncodeFloat(v1);
        var encoded2 = AttributeCompression.octEncodeFloat(v2);

        var encoded3 = AttributeCompression.octEncode(v3, scratchEncodeCart2);
        result.x = 65536.0 * encoded3.x + encoded1;
        result.y = 65536.0 * encoded3.y + encoded2;
        return result;
    };

    /**
     * Decodes three unit-length vectors in 'oct' encoding packed into a floating-point number to a normalized 3-component vector.
     *
     * @param {Cartesian2} packed The three oct-encoded unit length vectors stored as two floating-point number.
     * @param {Cartesian3} v1 One decoded and normalized vector.
     * @param {Cartesian3} v2 One decoded and normalized vector.
     * @param {Cartesian3} v3 One decoded and normalized vector.
     */
    AttributeCompression.octUnpack = function(packed, v1, v2, v3) {
                if (!defined(packed)) {
            throw new DeveloperError('packed is required.');
        }
        if (!defined(v1)) {
            throw new DeveloperError('v1 is required.');
        }
        if (!defined(v2)) {
            throw new DeveloperError('v2 is required.');
        }
        if (!defined(v3)) {
            throw new DeveloperError('v3 is required.');
        }
        
        var temp = packed.x / 65536.0;
        var x = Math.floor(temp);
        var encodedFloat1 = (temp - x) * 65536.0;

        temp = packed.y / 65536.0;
        var y = Math.floor(temp);
        var encodedFloat2 = (temp - y) * 65536.0;

        AttributeCompression.octDecodeFloat(encodedFloat1, v1);
        AttributeCompression.octDecodeFloat(encodedFloat2, v2);
        AttributeCompression.octDecode(x, y, v3);
    };

    /**
     * Pack texture coordinates into a single float. The texture coordinates will only preserve 12 bits of precision.
     *
     * @param {Cartesian2} textureCoordinates The texture coordinates to compress.  Both coordinates must be in the range 0.0-1.0.
     * @returns {Number} The packed texture coordinates.
     *
     */
    AttributeCompression.compressTextureCoordinates = function(textureCoordinates) {
                if (!defined(textureCoordinates)) {
            throw new DeveloperError('textureCoordinates is required.');
        }
        
        // Move x and y to the range 0-4095;
        var x = (textureCoordinates.x * 4095.0) | 0;
        var y = (textureCoordinates.y * 4095.0) | 0;
        return 4096.0 * x + y;
    };

    /**
     * Decompresses texture coordinates that were packed into a single float.
     *
     * @param {Number} compressed The compressed texture coordinates.
     * @param {Cartesian2} result The decompressed texture coordinates.
     * @returns {Cartesian2} The modified result parameter.
     *
     */
    AttributeCompression.decompressTextureCoordinates = function(compressed, result) {
                if (!defined(compressed)) {
            throw new DeveloperError('compressed is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var temp = compressed / 4096.0;
        var xZeroTo4095 = Math.floor(temp);
        result.x = xZeroTo4095 / 4095.0;
        result.y = (compressed - xZeroTo4095 * 4096) / 4095;
        return result;
    };

    return AttributeCompression;
});

/*global define*/
define('Core/scaleToGeodeticSurface',[
        './Cartesian3',
        './defined',
        './DeveloperError',
        './Math'
    ], function(
        Cartesian3,
        defined,
        DeveloperError,
        CesiumMath) {
    'use strict';

    var scaleToGeodeticSurfaceIntersection = new Cartesian3();
    var scaleToGeodeticSurfaceGradient = new Cartesian3();

    /**
     * Scales the provided Cartesian position along the geodetic surface normal
     * so that it is on the surface of this ellipsoid.  If the position is
     * at the center of the ellipsoid, this function returns undefined.
     *
     * @param {Cartesian3} cartesian The Cartesian position to scale.
     * @param {Cartesian3} oneOverRadii One over radii of the ellipsoid.
     * @param {Cartesian3} oneOverRadiiSquared One over radii squared of the ellipsoid.
     * @param {Number} centerToleranceSquared Tolerance for closeness to the center.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter, a new Cartesian3 instance if none was provided, or undefined if the position is at the center.
     *
     * @exports scaleToGeodeticSurface
     *
     * @private
     */
    function scaleToGeodeticSurface(cartesian, oneOverRadii, oneOverRadiiSquared, centerToleranceSquared, result) {
                if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }
        if (!defined(oneOverRadii)) {
            throw new DeveloperError('oneOverRadii is required.');
        }
        if (!defined(oneOverRadiiSquared)) {
            throw new DeveloperError('oneOverRadiiSquared is required.');
        }
        if (!defined(centerToleranceSquared)) {
            throw new DeveloperError('centerToleranceSquared is required.');
        }
        
        var positionX = cartesian.x;
        var positionY = cartesian.y;
        var positionZ = cartesian.z;

        var oneOverRadiiX = oneOverRadii.x;
        var oneOverRadiiY = oneOverRadii.y;
        var oneOverRadiiZ = oneOverRadii.z;

        var x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
        var y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
        var z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;

        // Compute the squared ellipsoid norm.
        var squaredNorm = x2 + y2 + z2;
        var ratio = Math.sqrt(1.0 / squaredNorm);

        // As an initial approximation, assume that the radial intersection is the projection point.
        var intersection = Cartesian3.multiplyByScalar(cartesian, ratio, scaleToGeodeticSurfaceIntersection);

        // If the position is near the center, the iteration will not converge.
        if (squaredNorm < centerToleranceSquared) {
            return !isFinite(ratio) ? undefined : Cartesian3.clone(intersection, result);
        }

        var oneOverRadiiSquaredX = oneOverRadiiSquared.x;
        var oneOverRadiiSquaredY = oneOverRadiiSquared.y;
        var oneOverRadiiSquaredZ = oneOverRadiiSquared.z;

        // Use the gradient at the intersection point in place of the true unit normal.
        // The difference in magnitude will be absorbed in the multiplier.
        var gradient = scaleToGeodeticSurfaceGradient;
        gradient.x = intersection.x * oneOverRadiiSquaredX * 2.0;
        gradient.y = intersection.y * oneOverRadiiSquaredY * 2.0;
        gradient.z = intersection.z * oneOverRadiiSquaredZ * 2.0;

        // Compute the initial guess at the normal vector multiplier, lambda.
        var lambda = (1.0 - ratio) * Cartesian3.magnitude(cartesian) / (0.5 * Cartesian3.magnitude(gradient));
        var correction = 0.0;

        var func;
        var denominator;
        var xMultiplier;
        var yMultiplier;
        var zMultiplier;
        var xMultiplier2;
        var yMultiplier2;
        var zMultiplier2;
        var xMultiplier3;
        var yMultiplier3;
        var zMultiplier3;

        do {
            lambda -= correction;

            xMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredX);
            yMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredY);
            zMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredZ);

            xMultiplier2 = xMultiplier * xMultiplier;
            yMultiplier2 = yMultiplier * yMultiplier;
            zMultiplier2 = zMultiplier * zMultiplier;

            xMultiplier3 = xMultiplier2 * xMultiplier;
            yMultiplier3 = yMultiplier2 * yMultiplier;
            zMultiplier3 = zMultiplier2 * zMultiplier;

            func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1.0;

            // "denominator" here refers to the use of this expression in the velocity and acceleration
            // computations in the sections to follow.
            denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;

            var derivative = -2.0 * denominator;

            correction = func / derivative;
        } while (Math.abs(func) > CesiumMath.EPSILON12);

        if (!defined(result)) {
            return new Cartesian3(positionX * xMultiplier, positionY * yMultiplier, positionZ * zMultiplier);
        }
        result.x = positionX * xMultiplier;
        result.y = positionY * yMultiplier;
        result.z = positionZ * zMultiplier;
        return result;
    }

    return scaleToGeodeticSurface;
});

/*global define*/
define('Core/Cartographic',[
        './Cartesian3',
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject',
        './Math',
        './scaleToGeodeticSurface'
    ], function(
        Cartesian3,
        defaultValue,
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath,
        scaleToGeodeticSurface) {
    'use strict';

    /**
     * A position defined by longitude, latitude, and height.
     * @alias Cartographic
     * @constructor
     *
     * @param {Number} [longitude=0.0] The longitude, in radians.
     * @param {Number} [latitude=0.0] The latitude, in radians.
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     *
     * @see Ellipsoid
     */
    function Cartographic(longitude, latitude, height) {
        /**
         * The longitude, in radians.
         * @type {Number}
         * @default 0.0
         */
        this.longitude = defaultValue(longitude, 0.0);

        /**
         * The latitude, in radians.
         * @type {Number}
         * @default 0.0
         */
        this.latitude = defaultValue(latitude, 0.0);

        /**
         * The height, in meters, above the ellipsoid.
         * @type {Number}
         * @default 0.0
         */
        this.height = defaultValue(height, 0.0);
    }

    /**
     * Creates a new Cartographic instance from longitude and latitude
     * specified in radians.
     *
     * @param {Number} longitude The longitude, in radians.
     * @param {Number} latitude The latitude, in radians.
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
     */
    Cartographic.fromRadians = function(longitude, latitude, height, result) {
                if (!defined(longitude)) {
            throw new DeveloperError('longitude is required.');
        }
        if (!defined(latitude)) {
            throw new DeveloperError('latitude is required.');
        }
        
        height = defaultValue(height, 0.0);

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    /**
     * Creates a new Cartographic instance from longitude and latitude
     * specified in degrees.  The values in the resulting object will
     * be in radians.
     *
     * @param {Number} longitude The longitude, in degrees.
     * @param {Number} latitude The latitude, in degrees.
     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
     */
    Cartographic.fromDegrees = function(longitude, latitude, height, result) {
                if (!defined(longitude)) {
            throw new DeveloperError('longitude is required.');
        }
        if (!defined(latitude)) {
            throw new DeveloperError('latitude is required.');
        }
                longitude = CesiumMath.toRadians(longitude);
        latitude = CesiumMath.toRadians(latitude);

        return Cartographic.fromRadians(longitude, latitude, height, result);
    };

    var cartesianToCartographicN = new Cartesian3();
    var cartesianToCartographicP = new Cartesian3();
    var cartesianToCartographicH = new Cartesian3();
    var wgs84OneOverRadii = new Cartesian3(1.0 / 6378137.0, 1.0 / 6378137.0, 1.0 / 6356752.3142451793);
    var wgs84OneOverRadiiSquared = new Cartesian3(1.0 / (6378137.0 * 6378137.0), 1.0 / (6378137.0 * 6378137.0), 1.0 / (6356752.3142451793 * 6356752.3142451793));
    var wgs84CenterToleranceSquared = CesiumMath.EPSILON1;

    /**
     * Creates a new Cartographic instance from a Cartesian position. The values in the
     * resulting object will be in radians.
     *
     * @param {Cartesian3} cartesian The Cartesian position to convert to cartographic representation.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter, new Cartographic instance if none was provided, or undefined if the cartesian is at the center of the ellipsoid.
     */
    Cartographic.fromCartesian = function(cartesian, ellipsoid, result) {
        var oneOverRadii = defined(ellipsoid) ? ellipsoid.oneOverRadii : wgs84OneOverRadii;
        var oneOverRadiiSquared = defined(ellipsoid) ? ellipsoid.oneOverRadiiSquared : wgs84OneOverRadiiSquared;
        var centerToleranceSquared = defined(ellipsoid) ? ellipsoid._centerToleranceSquared : wgs84CenterToleranceSquared;

        //`cartesian is required.` is thrown from scaleToGeodeticSurface
        var p = scaleToGeodeticSurface(cartesian, oneOverRadii, oneOverRadiiSquared, centerToleranceSquared, cartesianToCartographicP);

        if (!defined(p)) {
            return undefined;
        }

        var n = Cartesian3.multiplyComponents(p, oneOverRadiiSquared, cartesianToCartographicN);
        n = Cartesian3.normalize(n, n);

        var h = Cartesian3.subtract(cartesian, p, cartesianToCartographicH);

        var longitude = Math.atan2(n.y, n.x);
        var latitude = Math.asin(n.z);
        var height = CesiumMath.sign(Cartesian3.dot(h, cartesian)) * Cartesian3.magnitude(h);

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }
        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    /**
     * Duplicates a Cartographic instance.
     *
     * @param {Cartographic} cartographic The cartographic to duplicate.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided. (Returns undefined if cartographic is undefined)
     */
    Cartographic.clone = function(cartographic, result) {
        if (!defined(cartographic)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Cartographic(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
        result.longitude = cartographic.longitude;
        result.latitude = cartographic.latitude;
        result.height = cartographic.height;
        return result;
    };

    /**
     * Compares the provided cartographics componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartographic} [left] The first cartographic.
     * @param {Cartographic} [right] The second cartographic.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartographic.equals = function(left, right) {
        return (left === right) ||
                ((defined(left)) &&
                 (defined(right)) &&
                 (left.longitude === right.longitude) &&
                 (left.latitude === right.latitude) &&
                 (left.height === right.height));
    };

    /**
     * Compares the provided cartographics componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Cartographic} [left] The first cartographic.
     * @param {Cartographic} [right] The second cartographic.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartographic.equalsEpsilon = function(left, right, epsilon) {
                if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number.');
        }
        
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.longitude - right.longitude) <= epsilon) &&
                (Math.abs(left.latitude - right.latitude) <= epsilon) &&
                (Math.abs(left.height - right.height) <= epsilon));
    };

    /**
     * An immutable Cartographic instance initialized to (0.0, 0.0, 0.0).
     *
     * @type {Cartographic}
     * @constant
     */
    Cartographic.ZERO = freezeObject(new Cartographic(0.0, 0.0, 0.0));

    /**
     * Duplicates this instance.
     *
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
     */
    Cartographic.prototype.clone = function(result) {
        return Cartographic.clone(this, result);
    };

    /**
     * Compares the provided against this cartographic componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartographic} [right] The second cartographic.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartographic.prototype.equals = function(right) {
        return Cartographic.equals(this, right);
    };

    /**
     * Compares the provided against this cartographic componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Cartographic} [right] The second cartographic.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartographic.prototype.equalsEpsilon = function(right, epsilon) {
        return Cartographic.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Creates a string representing this cartographic in the format '(longitude, latitude, height)'.
     *
     * @returns {String} A string representing the provided cartographic in the format '(longitude, latitude, height)'.
     */
    Cartographic.prototype.toString = function() {
        return '(' + this.longitude + ', ' + this.latitude + ', ' + this.height + ')';
    };

    return Cartographic;
});

/*global define*/
define('Core/defineProperties',[
        './defined'
    ], function(
        defined) {
    'use strict';

    var definePropertyWorks = (function() {
        try {
            return 'x' in Object.defineProperty({}, 'x', {});
        } catch (e) {
            return false;
        }
    })();

    /**
     * Defines properties on an object, using Object.defineProperties if available,
     * otherwise returns the object unchanged.  This function should be used in
     * setup code to prevent errors from completely halting JavaScript execution
     * in legacy browsers.
     *
     * @private
     *
     * @exports defineProperties
     */
    var defineProperties = Object.defineProperties;
    if (!definePropertyWorks || !defined(defineProperties)) {
        defineProperties = function(o) {
            return o;
        };
    }

    return defineProperties;
});

/*global define*/
define('Core/Ellipsoid',[
        './Cartesian3',
        './Cartographic',
        './defaultValue',
        './defined',
        './defineProperties',
        './DeveloperError',
        './freezeObject',
        './Math',
        './scaleToGeodeticSurface'
    ], function(
        Cartesian3,
        Cartographic,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        freezeObject,
        CesiumMath,
        scaleToGeodeticSurface) {
    'use strict';

    function initialize(ellipsoid, x, y, z) {
        x = defaultValue(x, 0.0);
        y = defaultValue(y, 0.0);
        z = defaultValue(z, 0.0);

                if (x < 0.0 || y < 0.0 || z < 0.0) {
            throw new DeveloperError('All radii components must be greater than or equal to zero.');
        }
        
        ellipsoid._radii = new Cartesian3(x, y, z);

        ellipsoid._radiiSquared = new Cartesian3(x * x,
                                            y * y,
                                            z * z);

        ellipsoid._radiiToTheFourth = new Cartesian3(x * x * x * x,
                                                y * y * y * y,
                                                z * z * z * z);

        ellipsoid._oneOverRadii = new Cartesian3(x === 0.0 ? 0.0 : 1.0 / x,
                                            y === 0.0 ? 0.0 : 1.0 / y,
                                            z === 0.0 ? 0.0 : 1.0 / z);

        ellipsoid._oneOverRadiiSquared = new Cartesian3(x === 0.0 ? 0.0 : 1.0 / (x * x),
                                                   y === 0.0 ? 0.0 : 1.0 / (y * y),
                                                   z === 0.0 ? 0.0 : 1.0 / (z * z));

        ellipsoid._minimumRadius = Math.min(x, y, z);

        ellipsoid._maximumRadius = Math.max(x, y, z);

        ellipsoid._centerToleranceSquared = CesiumMath.EPSILON1;

        if (ellipsoid._radiiSquared.z !== 0) {
            ellipsoid._sqauredXOverSquaredZ = ellipsoid._radiiSquared.x / ellipsoid._radiiSquared.z;
        }
    }

    /**
     * A quadratic surface defined in Cartesian coordinates by the equation
     * <code>(x / a)^2 + (y / b)^2 + (z / c)^2 = 1</code>.  Primarily used
     * by Cesium to represent the shape of planetary bodies.
     *
     * Rather than constructing this object directly, one of the provided
     * constants is normally used.
     * @alias Ellipsoid
     * @constructor
     *
     * @param {Number} [x=0] The radius in the x direction.
     * @param {Number} [y=0] The radius in the y direction.
     * @param {Number} [z=0] The radius in the z direction.
     *
     * @exception {DeveloperError} All radii components must be greater than or equal to zero.
     *
     * @see Ellipsoid.fromCartesian3
     * @see Ellipsoid.WGS84
     * @see Ellipsoid.UNIT_SPHERE
     */
    function Ellipsoid(x, y, z) {
        this._radii = undefined;
        this._radiiSquared = undefined;
        this._radiiToTheFourth = undefined;
        this._oneOverRadii = undefined;
        this._oneOverRadiiSquared = undefined;
        this._minimumRadius = undefined;
        this._maximumRadius = undefined;
        this._centerToleranceSquared = undefined;
        this._sqauredXOverSquaredZ = undefined;

        initialize(this, x, y, z);
    }

    defineProperties(Ellipsoid.prototype, {
        /**
         * Gets the radii of the ellipsoid.
         * @memberof Ellipsoid.prototype
         * @type {Cartesian3}
         * @readonly
         */
        radii : {
            get: function() {
                return this._radii;
            }
        },
        /**
         * Gets the squared radii of the ellipsoid.
         * @memberof Ellipsoid.prototype
         * @type {Cartesian3}
         * @readonly
         */
        radiiSquared : {
            get : function() {
                return this._radiiSquared;
            }
        },
        /**
         * Gets the radii of the ellipsoid raise to the fourth power.
         * @memberof Ellipsoid.prototype
         * @type {Cartesian3}
         * @readonly
         */
        radiiToTheFourth : {
            get : function() {
                return this._radiiToTheFourth;
            }
        },
        /**
         * Gets one over the radii of the ellipsoid.
         * @memberof Ellipsoid.prototype
         * @type {Cartesian3}
         * @readonly
         */
        oneOverRadii : {
            get : function() {
                return this._oneOverRadii;
            }
        },
        /**
         * Gets one over the squared radii of the ellipsoid.
         * @memberof Ellipsoid.prototype
         * @type {Cartesian3}
         * @readonly
         */
        oneOverRadiiSquared : {
            get : function() {
                return this._oneOverRadiiSquared;
            }
        },
        /**
         * Gets the minimum radius of the ellipsoid.
         * @memberof Ellipsoid.prototype
         * @type {Number}
         * @readonly
         */
        minimumRadius : {
            get : function() {
                return this._minimumRadius;
            }
        },
        /**
         * Gets the maximum radius of the ellipsoid.
         * @memberof Ellipsoid.prototype
         * @type {Number}
         * @readonly
         */
        maximumRadius : {
            get : function() {
                return this._maximumRadius;
            }
        }
    });

    /**
     * Duplicates an Ellipsoid instance.
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid to duplicate.
     * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
     *                    instance should be created.
     * @returns {Ellipsoid} The cloned Ellipsoid. (Returns undefined if ellipsoid is undefined)
     */
    Ellipsoid.clone = function(ellipsoid, result) {
        if (!defined(ellipsoid)) {
            return undefined;
        }
        var radii = ellipsoid._radii;

        if (!defined(result)) {
            return new Ellipsoid(radii.x, radii.y, radii.z);
        }

        Cartesian3.clone(radii, result._radii);
        Cartesian3.clone(ellipsoid._radiiSquared, result._radiiSquared);
        Cartesian3.clone(ellipsoid._radiiToTheFourth, result._radiiToTheFourth);
        Cartesian3.clone(ellipsoid._oneOverRadii, result._oneOverRadii);
        Cartesian3.clone(ellipsoid._oneOverRadiiSquared, result._oneOverRadiiSquared);
        result._minimumRadius = ellipsoid._minimumRadius;
        result._maximumRadius = ellipsoid._maximumRadius;
        result._centerToleranceSquared = ellipsoid._centerToleranceSquared;

        return result;
    };

    /**
     * Computes an Ellipsoid from a Cartesian specifying the radii in x, y, and z directions.
     *
     * @param {Cartesian3} [cartesian=Cartesian3.ZERO] The ellipsoid's radius in the x, y, and z directions.
     * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
     *                    instance should be created.
     * @returns {Ellipsoid} A new Ellipsoid instance.
     *
     * @exception {DeveloperError} All radii components must be greater than or equal to zero.
     *
     * @see Ellipsoid.WGS84
     * @see Ellipsoid.UNIT_SPHERE
     */
    Ellipsoid.fromCartesian3 = function(cartesian, result) {
        if (!defined(result)) {
            result = new Ellipsoid();
        }

        if (!defined(cartesian)) {
            return result;
        }

        initialize(result, cartesian.x, cartesian.y, cartesian.z);
        return result;
    };

    /**
     * An Ellipsoid instance initialized to the WGS84 standard.
     *
     * @type {Ellipsoid}
     * @constant
     */
    Ellipsoid.WGS84 = freezeObject(new Ellipsoid(6378137.0, 6378137.0, 6356752.3142451793));

    /**
     * An Ellipsoid instance initialized to radii of (1.0, 1.0, 1.0).
     *
     * @type {Ellipsoid}
     * @constant
     */
    Ellipsoid.UNIT_SPHERE = freezeObject(new Ellipsoid(1.0, 1.0, 1.0));

    /**
     * An Ellipsoid instance initialized to a sphere with the lunar radius.
     *
     * @type {Ellipsoid}
     * @constant
     */
    Ellipsoid.MOON = freezeObject(new Ellipsoid(CesiumMath.LUNAR_RADIUS, CesiumMath.LUNAR_RADIUS, CesiumMath.LUNAR_RADIUS));

    /**
     * Duplicates an Ellipsoid instance.
     *
     * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
     *                    instance should be created.
     * @returns {Ellipsoid} The cloned Ellipsoid.
     */
    Ellipsoid.prototype.clone = function(result) {
        return Ellipsoid.clone(this, result);
    };

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Ellipsoid.packedLength = Cartesian3.packedLength;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Ellipsoid} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Ellipsoid.pack = function(value, array, startingIndex) {
                if (!defined(value)) {
            throw new DeveloperError('value is required');
        }
        if (!defined(array)) {
            throw new DeveloperError('array is required');
        }
        
        startingIndex = defaultValue(startingIndex, 0);

        Cartesian3.pack(value._radii, array, startingIndex);

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Ellipsoid} [result] The object into which to store the result.
     * @returns {Ellipsoid} The modified result parameter or a new Ellipsoid instance if one was not provided.
     */
    Ellipsoid.unpack = function(array, startingIndex, result) {
                if (!defined(array)) {
            throw new DeveloperError('array is required');
        }
        
        startingIndex = defaultValue(startingIndex, 0);

        var radii = Cartesian3.unpack(array, startingIndex);
        return Ellipsoid.fromCartesian3(radii, result);
    };

    /**
     * Computes the unit vector directed from the center of this ellipsoid toward the provided Cartesian position.
     * @function
     *
     * @param {Cartesian3} cartesian The Cartesian for which to to determine the geocentric normal.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     */
    Ellipsoid.prototype.geocentricSurfaceNormal = Cartesian3.normalize;

    /**
     * Computes the normal of the plane tangent to the surface of the ellipsoid at the provided position.
     *
     * @param {Cartographic} cartographic The cartographic position for which to to determine the geodetic normal.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     */
    Ellipsoid.prototype.geodeticSurfaceNormalCartographic = function(cartographic, result) {
                if (!defined(cartographic)) {
            throw new DeveloperError('cartographic is required.');
        }
        
        var longitude = cartographic.longitude;
        var latitude = cartographic.latitude;
        var cosLatitude = Math.cos(latitude);

        var x = cosLatitude * Math.cos(longitude);
        var y = cosLatitude * Math.sin(longitude);
        var z = Math.sin(latitude);

        if (!defined(result)) {
            result = new Cartesian3();
        }
        result.x = x;
        result.y = y;
        result.z = z;
        return Cartesian3.normalize(result, result);
    };

    /**
     * Computes the normal of the plane tangent to the surface of the ellipsoid at the provided position.
     *
     * @param {Cartesian3} cartesian The Cartesian position for which to to determine the surface normal.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     */
    Ellipsoid.prototype.geodeticSurfaceNormal = function(cartesian, result) {
        if (!defined(result)) {
            result = new Cartesian3();
        }
        result = Cartesian3.multiplyComponents(cartesian, this._oneOverRadiiSquared, result);
        return Cartesian3.normalize(result, result);
    };

    var cartographicToCartesianNormal = new Cartesian3();
    var cartographicToCartesianK = new Cartesian3();

    /**
     * Converts the provided cartographic to Cartesian representation.
     *
     * @param {Cartographic} cartographic The cartographic position.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     *
     * @example
     * //Create a Cartographic and determine it's Cartesian representation on a WGS84 ellipsoid.
     * var position = new Cesium.Cartographic(Cesium.Math.toRadians(21), Cesium.Math.toRadians(78), 5000);
     * var cartesianPosition = Cesium.Ellipsoid.WGS84.cartographicToCartesian(position);
     */
    Ellipsoid.prototype.cartographicToCartesian = function(cartographic, result) {
        //`cartographic is required` is thrown from geodeticSurfaceNormalCartographic.
        var n = cartographicToCartesianNormal;
        var k = cartographicToCartesianK;
        this.geodeticSurfaceNormalCartographic(cartographic, n);
        Cartesian3.multiplyComponents(this._radiiSquared, n, k);
        var gamma = Math.sqrt(Cartesian3.dot(n, k));
        Cartesian3.divideByScalar(k, gamma, k);
        Cartesian3.multiplyByScalar(n, cartographic.height, n);

        if (!defined(result)) {
            result = new Cartesian3();
        }
        return Cartesian3.add(k, n, result);
    };

    /**
     * Converts the provided array of cartographics to an array of Cartesians.
     *
     * @param {Cartographic[]} cartographics An array of cartographic positions.
     * @param {Cartesian3[]} [result] The object onto which to store the result.
     * @returns {Cartesian3[]} The modified result parameter or a new Array instance if none was provided.
     *
     * @example
     * //Convert an array of Cartographics and determine their Cartesian representation on a WGS84 ellipsoid.
     * var positions = [new Cesium.Cartographic(Cesium.Math.toRadians(21), Cesium.Math.toRadians(78), 0),
     *                  new Cesium.Cartographic(Cesium.Math.toRadians(21.321), Cesium.Math.toRadians(78.123), 100),
     *                  new Cesium.Cartographic(Cesium.Math.toRadians(21.645), Cesium.Math.toRadians(78.456), 250)];
     * var cartesianPositions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(positions);
     */
    Ellipsoid.prototype.cartographicArrayToCartesianArray = function(cartographics, result) {
                if (!defined(cartographics)) {
            throw new DeveloperError('cartographics is required.');
        }
        
        var length = cartographics.length;
        if (!defined(result)) {
            result = new Array(length);
        } else {
            result.length = length;
        }
        for ( var i = 0; i < length; i++) {
            result[i] = this.cartographicToCartesian(cartographics[i], result[i]);
        }
        return result;
    };

    var cartesianToCartographicN = new Cartesian3();
    var cartesianToCartographicP = new Cartesian3();
    var cartesianToCartographicH = new Cartesian3();

    /**
     * Converts the provided cartesian to cartographic representation.
     * The cartesian is undefined at the center of the ellipsoid.
     *
     * @param {Cartesian3} cartesian The Cartesian position to convert to cartographic representation.
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter, new Cartographic instance if none was provided, or undefined if the cartesian is at the center of the ellipsoid.
     *
     * @example
     * //Create a Cartesian and determine it's Cartographic representation on a WGS84 ellipsoid.
     * var position = new Cesium.Cartesian3(17832.12, 83234.52, 952313.73);
     * var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
     */
    Ellipsoid.prototype.cartesianToCartographic = function(cartesian, result) {
        //`cartesian is required.` is thrown from scaleToGeodeticSurface
        var p = this.scaleToGeodeticSurface(cartesian, cartesianToCartographicP);

        if (!defined(p)) {
            return undefined;
        }

        var n = this.geodeticSurfaceNormal(p, cartesianToCartographicN);
        var h = Cartesian3.subtract(cartesian, p, cartesianToCartographicH);

        var longitude = Math.atan2(n.y, n.x);
        var latitude = Math.asin(n.z);
        var height = CesiumMath.sign(Cartesian3.dot(h, cartesian)) * Cartesian3.magnitude(h);

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }
        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    /**
     * Converts the provided array of cartesians to an array of cartographics.
     *
     * @param {Cartesian3[]} cartesians An array of Cartesian positions.
     * @param {Cartographic[]} [result] The object onto which to store the result.
     * @returns {Cartographic[]} The modified result parameter or a new Array instance if none was provided.
     *
     * @example
     * //Create an array of Cartesians and determine their Cartographic representation on a WGS84 ellipsoid.
     * var positions = [new Cesium.Cartesian3(17832.12, 83234.52, 952313.73),
     *                  new Cesium.Cartesian3(17832.13, 83234.53, 952313.73),
     *                  new Cesium.Cartesian3(17832.14, 83234.54, 952313.73)]
     * var cartographicPositions = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(positions);
     */
    Ellipsoid.prototype.cartesianArrayToCartographicArray = function(cartesians, result) {
                if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }
        
        var length = cartesians.length;
        if (!defined(result)) {
            result = new Array(length);
        } else {
            result.length = length;
        }
        for ( var i = 0; i < length; ++i) {
            result[i] = this.cartesianToCartographic(cartesians[i], result[i]);
        }
        return result;
    };

    /**
     * Scales the provided Cartesian position along the geodetic surface normal
     * so that it is on the surface of this ellipsoid.  If the position is
     * at the center of the ellipsoid, this function returns undefined.
     *
     * @param {Cartesian3} cartesian The Cartesian position to scale.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter, a new Cartesian3 instance if none was provided, or undefined if the position is at the center.
     */
    Ellipsoid.prototype.scaleToGeodeticSurface = function(cartesian, result) {
        return scaleToGeodeticSurface(cartesian, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, result);
    };

    /**
     * Scales the provided Cartesian position along the geocentric surface normal
     * so that it is on the surface of this ellipsoid.
     *
     * @param {Cartesian3} cartesian The Cartesian position to scale.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
     */
    Ellipsoid.prototype.scaleToGeocentricSurface = function(cartesian, result) {
                if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        var positionX = cartesian.x;
        var positionY = cartesian.y;
        var positionZ = cartesian.z;
        var oneOverRadiiSquared = this._oneOverRadiiSquared;

        var beta = 1.0 / Math.sqrt((positionX * positionX) * oneOverRadiiSquared.x +
                                   (positionY * positionY) * oneOverRadiiSquared.y +
                                   (positionZ * positionZ) * oneOverRadiiSquared.z);

        return Cartesian3.multiplyByScalar(cartesian, beta, result);
    };

    /**
     * Transforms a Cartesian X, Y, Z position to the ellipsoid-scaled space by multiplying
     * its components by the result of {@link Ellipsoid#oneOverRadii}.
     *
     * @param {Cartesian3} position The position to transform.
     * @param {Cartesian3} [result] The position to which to copy the result, or undefined to create and
     *        return a new instance.
     * @returns {Cartesian3} The position expressed in the scaled space.  The returned instance is the
     *          one passed as the result parameter if it is not undefined, or a new instance of it is.
     */
    Ellipsoid.prototype.transformPositionToScaledSpace = function(position, result) {
        if (!defined(result)) {
            result = new Cartesian3();
        }

        return Cartesian3.multiplyComponents(position, this._oneOverRadii, result);
    };

    /**
     * Transforms a Cartesian X, Y, Z position from the ellipsoid-scaled space by multiplying
     * its components by the result of {@link Ellipsoid#radii}.
     *
     * @param {Cartesian3} position The position to transform.
     * @param {Cartesian3} [result] The position to which to copy the result, or undefined to create and
     *        return a new instance.
     * @returns {Cartesian3} The position expressed in the unscaled space.  The returned instance is the
     *          one passed as the result parameter if it is not undefined, or a new instance of it is.
     */
    Ellipsoid.prototype.transformPositionFromScaledSpace = function(position, result) {
        if (!defined(result)) {
            result = new Cartesian3();
        }

        return Cartesian3.multiplyComponents(position, this._radii, result);
    };

    /**
     * Compares this Ellipsoid against the provided Ellipsoid componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Ellipsoid} [right] The other Ellipsoid.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Ellipsoid.prototype.equals = function(right) {
        return (this === right) ||
               (defined(right) &&
                Cartesian3.equals(this._radii, right._radii));
    };

    /**
     * Creates a string representing this Ellipsoid in the format '(radii.x, radii.y, radii.z)'.
     *
     * @returns {String} A string representing this ellipsoid in the format '(radii.x, radii.y, radii.z)'.
     */
    Ellipsoid.prototype.toString = function() {
        return this._radii.toString();
    };

    /**
     * Computes a point which is the intersection of the surface normal with the z-axis.
     *
     * @param {Cartesian3} position the position. must be on the surface of the ellipsoid.
     * @param {Number} [buffer = 0.0] A buffer to subtract from the ellipsoid size when checking if the point is inside the ellipsoid.
     *                                In earth case, with common earth datums, there is no need for this buffer since the intersection point is always (relatively) very close to the center.
     *                                In WGS84 datum, intersection point is at max z = +-42841.31151331382 (0.673% of z-axis).
     *                                Intersection point could be outside the ellipsoid if the ratio of MajorAxis / AxisOfRotation is bigger than the square root of 2
     * @param {Cartesian} [result] The cartesian to which to copy the result, or undefined to create and
     *        return a new instance.
     * @returns {Cartesian | undefined} the intersection point if it's inside the ellipsoid, undefined otherwise
     *
     * @exception {DeveloperError} position is required.
     * @exception {DeveloperError} Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y).
     * @exception {DeveloperError} Ellipsoid.radii.z must be greater than 0.
     */
    Ellipsoid.prototype.getSurfaceNormalIntersectionWithZAxis = function(position, buffer, result) {
                if (!defined(position)) {
            throw new DeveloperError('position is required.');
        }
        if (!CesiumMath.equalsEpsilon(this._radii.x, this._radii.y, CesiumMath.EPSILON15)) {
            throw new DeveloperError('Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)');
        }
        if (this._radii.z === 0) {
            throw new DeveloperError('Ellipsoid.radii.z must be greater than 0');
        }
        
        buffer = defaultValue(buffer, 0.0);

        var sqauredXOverSquaredZ = this._sqauredXOverSquaredZ;

        if (!defined(result)) {
            result = new Cartesian3();
        }

        result.x = 0.0;
        result.y = 0.0;
        result.z = position.z * (1 - sqauredXOverSquaredZ);

        if (Math.abs(result.z) >= this._radii.z - buffer) {
            return undefined;
        }

        return result;
    };

    return Ellipsoid;
});

/*global define*/
define('Core/GeographicProjection',[
        './Cartesian3',
        './Cartographic',
        './defaultValue',
        './defined',
        './defineProperties',
        './DeveloperError',
        './Ellipsoid'
    ], function(
        Cartesian3,
        Cartographic,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Ellipsoid) {
    'use strict';

    /**
     * A simple map projection where longitude and latitude are linearly mapped to X and Y by multiplying
     * them by the {@link Ellipsoid#maximumRadius}.  This projection
     * is commonly known as geographic, equirectangular, equidistant cylindrical, or plate carrée.  It
     * is also known as EPSG:4326.
     *
     * @alias GeographicProjection
     * @constructor
     *
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
     *
     * @see WebMercatorProjection
     */
    function GeographicProjection(ellipsoid) {
        this._ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        this._semimajorAxis = this._ellipsoid.maximumRadius;
        this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis;
    }

    defineProperties(GeographicProjection.prototype, {
        /**
         * Gets the {@link Ellipsoid}.
         *
         * @memberof GeographicProjection.prototype
         *
         * @type {Ellipsoid}
         * @readonly
         */
        ellipsoid : {
            get : function() {
                return this._ellipsoid;
            }
        }
    });

    /**
     * Projects a set of {@link Cartographic} coordinates, in radians, to map coordinates, in meters.
     * X and Y are the longitude and latitude, respectively, multiplied by the maximum radius of the
     * ellipsoid.  Z is the unmodified height.
     *
     * @param {Cartographic} cartographic The coordinates to project.
     * @param {Cartesian3} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartesian3} The projected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    GeographicProjection.prototype.project = function(cartographic, result) {
        // Actually this is the special case of equidistant cylindrical called the plate carree
        var semimajorAxis = this._semimajorAxis;
        var x = cartographic.longitude * semimajorAxis;
        var y = cartographic.latitude * semimajorAxis;
        var z = cartographic.height;

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Unprojects a set of projected {@link Cartesian3} coordinates, in meters, to {@link Cartographic}
     * coordinates, in radians.  Longitude and Latitude are the X and Y coordinates, respectively,
     * divided by the maximum radius of the ellipsoid.  Height is the unmodified Z coordinate.
     *
     * @param {Cartesian3} cartesian The Cartesian position to unproject with height (z) in meters.
     * @param {Cartographic} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartographic} The unprojected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    GeographicProjection.prototype.unproject = function(cartesian, result) {
                if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }
        
        var oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
        var longitude = cartesian.x * oneOverEarthSemimajorAxis;
        var latitude = cartesian.y * oneOverEarthSemimajorAxis;
        var height = cartesian.z;

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    return GeographicProjection;
});

/*global define*/
define('Core/Intersect',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * This enumerated type is used in determining where, relative to the frustum, an
     * object is located. The object can either be fully contained within the frustum (INSIDE),
     * partially inside the frustum and partially outside (INTERSECTING), or somwhere entirely
     * outside of the frustum's 6 planes (OUTSIDE).
     *
     * @exports Intersect
     */
    var Intersect = {
        /**
         * Represents that an object is not contained within the frustum.
         *
         * @type {Number}
         * @constant
         */
        OUTSIDE : -1,

        /**
         * Represents that an object intersects one of the frustum's planes.
         *
         * @type {Number}
         * @constant
         */
        INTERSECTING : 0,

        /**
         * Represents that an object is fully within the frustum.
         *
         * @type {Number}
         * @constant
         */
        INSIDE : 1
    };

    return freezeObject(Intersect);
});

/*global define*/
define('Core/Interval',[
        './defaultValue'
    ], function(
        defaultValue) {
    'use strict';

    /**
     * Represents the closed interval [start, stop].
     * @alias Interval
     * @constructor
     *
     * @param {Number} [start=0.0] The beginning of the interval.
     * @param {Number} [stop=0.0] The end of the interval.
     */
    function Interval(start, stop) {
        /**
         * The beginning of the interval.
         * @type {Number}
         * @default 0.0
         */
        this.start = defaultValue(start, 0.0);
        /**
         * The end of the interval.
         * @type {Number}
         * @default 0.0
         */
        this.stop = defaultValue(stop, 0.0);
    }

    return Interval;
});

/*global define*/
define('Core/Matrix3',[
        './Cartesian3',
        './Check',
        './defaultValue',
        './defined',
        './defineProperties',
        './DeveloperError',
        './freezeObject',
        './Math'
    ], function(
        Cartesian3,
        Check,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        freezeObject,
        CesiumMath) {
    'use strict';

    /**
     * A 3x3 matrix, indexable as a column-major order array.
     * Constructor parameters are in row-major order for code readability.
     * @alias Matrix3
     * @constructor
     *
     * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
     * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
     * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
     * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
     * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
     * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
     * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
     * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
     * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
     *
     * @see Matrix3.fromColumnMajorArray
     * @see Matrix3.fromRowMajorArray
     * @see Matrix3.fromQuaternion
     * @see Matrix3.fromScale
     * @see Matrix3.fromUniformScale
     * @see Matrix2
     * @see Matrix4
     */
    function Matrix3(column0Row0, column1Row0, column2Row0,
                           column0Row1, column1Row1, column2Row1,
                           column0Row2, column1Row2, column2Row2) {
        this[0] = defaultValue(column0Row0, 0.0);
        this[1] = defaultValue(column0Row1, 0.0);
        this[2] = defaultValue(column0Row2, 0.0);
        this[3] = defaultValue(column1Row0, 0.0);
        this[4] = defaultValue(column1Row1, 0.0);
        this[5] = defaultValue(column1Row2, 0.0);
        this[6] = defaultValue(column2Row0, 0.0);
        this[7] = defaultValue(column2Row1, 0.0);
        this[8] = defaultValue(column2Row2, 0.0);
    }

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Matrix3.packedLength = 9;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Matrix3} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Matrix3.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value[0];
        array[startingIndex++] = value[1];
        array[startingIndex++] = value[2];
        array[startingIndex++] = value[3];
        array[startingIndex++] = value[4];
        array[startingIndex++] = value[5];
        array[startingIndex++] = value[6];
        array[startingIndex++] = value[7];
        array[startingIndex++] = value[8];

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Matrix3} [result] The object into which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     */
    Matrix3.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Matrix3();
        }

        result[0] = array[startingIndex++];
        result[1] = array[startingIndex++];
        result[2] = array[startingIndex++];
        result[3] = array[startingIndex++];
        result[4] = array[startingIndex++];
        result[5] = array[startingIndex++];
        result[6] = array[startingIndex++];
        result[7] = array[startingIndex++];
        result[8] = array[startingIndex++];
        return result;
    };

    /**
     * Duplicates a Matrix3 instance.
     *
     * @param {Matrix3} matrix The matrix to duplicate.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided. (Returns undefined if matrix is undefined)
     */
    Matrix3.clone = function(matrix, result) {
        if (!defined(matrix)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Matrix3(matrix[0], matrix[3], matrix[6],
                               matrix[1], matrix[4], matrix[7],
                               matrix[2], matrix[5], matrix[8]);
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        return result;
    };

    /**
     * Creates a Matrix3 from 9 consecutive elements in an array.
     *
     * @param {Number[]} array The array whose 9 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Create the Matrix3:
     * // [1.0, 2.0, 3.0]
     * // [1.0, 2.0, 3.0]
     * // [1.0, 2.0, 3.0]
     *
     * var v = [1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
     * var m = Cesium.Matrix3.fromArray(v);
     *
     * // Create same Matrix3 with using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
     * var m2 = Cesium.Matrix3.fromArray(v2, 2);
     */
    Matrix3.fromArray = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Matrix3();
        }

        result[0] = array[startingIndex];
        result[1] = array[startingIndex + 1];
        result[2] = array[startingIndex + 2];
        result[3] = array[startingIndex + 3];
        result[4] = array[startingIndex + 4];
        result[5] = array[startingIndex + 5];
        result[6] = array[startingIndex + 6];
        result[7] = array[startingIndex + 7];
        result[8] = array[startingIndex + 8];
        return result;
    };

    /**
     * Creates a Matrix3 instance from a column-major order array.
     *
     * @param {Number[]} values The column-major order array.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     */
    Matrix3.fromColumnMajorArray = function(values, result) {
                Check.defined('values', values);
        
        return Matrix3.clone(values, result);
    };

    /**
     * Creates a Matrix3 instance from a row-major order array.
     * The resulting matrix will be in column-major order.
     *
     * @param {Number[]} values The row-major order array.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     */
    Matrix3.fromRowMajorArray = function(values, result) {
                Check.defined('values', values);
        
        if (!defined(result)) {
            return new Matrix3(values[0], values[1], values[2],
                               values[3], values[4], values[5],
                               values[6], values[7], values[8]);
        }
        result[0] = values[0];
        result[1] = values[3];
        result[2] = values[6];
        result[3] = values[1];
        result[4] = values[4];
        result[5] = values[7];
        result[6] = values[2];
        result[7] = values[5];
        result[8] = values[8];
        return result;
    };

    /**
     * Computes a 3x3 rotation matrix from the provided quaternion.
     *
     * @param {Quaternion} quaternion the quaternion to use.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The 3x3 rotation matrix from this quaternion.
     */
    Matrix3.fromQuaternion = function(quaternion, result) {
                Check.typeOf.object('quaternion', quaternion);
        
        var x2 = quaternion.x * quaternion.x;
        var xy = quaternion.x * quaternion.y;
        var xz = quaternion.x * quaternion.z;
        var xw = quaternion.x * quaternion.w;
        var y2 = quaternion.y * quaternion.y;
        var yz = quaternion.y * quaternion.z;
        var yw = quaternion.y * quaternion.w;
        var z2 = quaternion.z * quaternion.z;
        var zw = quaternion.z * quaternion.w;
        var w2 = quaternion.w * quaternion.w;

        var m00 = x2 - y2 - z2 + w2;
        var m01 = 2.0 * (xy - zw);
        var m02 = 2.0 * (xz + yw);

        var m10 = 2.0 * (xy + zw);
        var m11 = -x2 + y2 - z2 + w2;
        var m12 = 2.0 * (yz - xw);

        var m20 = 2.0 * (xz - yw);
        var m21 = 2.0 * (yz + xw);
        var m22 = -x2 - y2 + z2 + w2;

        if (!defined(result)) {
            return new Matrix3(m00, m01, m02,
                               m10, m11, m12,
                               m20, m21, m22);
        }
        result[0] = m00;
        result[1] = m10;
        result[2] = m20;
        result[3] = m01;
        result[4] = m11;
        result[5] = m21;
        result[6] = m02;
        result[7] = m12;
        result[8] = m22;
        return result;
    };

    /**
     * Computes a 3x3 rotation matrix from the provided headingPitchRoll. (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
     *
     * @param {HeadingPitchRoll} headingPitchRoll the headingPitchRoll to use.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The 3x3 rotation matrix from this headingPitchRoll.
     */
    Matrix3.fromHeadingPitchRoll = function(headingPitchRoll, result) {
                Check.typeOf.object('headingPitchRoll', headingPitchRoll);
        
        var cosTheta = Math.cos(-headingPitchRoll.pitch);
        var cosPsi = Math.cos(-headingPitchRoll.heading);
        var cosPhi = Math.cos(headingPitchRoll.roll);
        var sinTheta = Math.sin(-headingPitchRoll.pitch);
        var sinPsi = Math.sin(-headingPitchRoll.heading);
        var sinPhi = Math.sin(headingPitchRoll.roll);

        var m00 = cosTheta * cosPsi;
        var m01 = -cosPhi * sinPsi + sinPhi * sinTheta * cosPsi;
        var m02 = sinPhi * sinPsi + cosPhi * sinTheta * cosPsi;

        var m10 = cosTheta * sinPsi;
        var m11 = cosPhi * cosPsi + sinPhi * sinTheta * sinPsi;
        var m12 = -sinPhi * cosPsi + cosPhi * sinTheta * sinPsi;

        var m20 = -sinTheta;
        var m21 = sinPhi * cosTheta;
        var m22 = cosPhi * cosTheta;

        if (!defined(result)) {
            return new Matrix3(m00, m01, m02,
                m10, m11, m12,
                m20, m21, m22);
        }
        result[0] = m00;
        result[1] = m10;
        result[2] = m20;
        result[3] = m01;
        result[4] = m11;
        result[5] = m21;
        result[6] = m02;
        result[7] = m12;
        result[8] = m22;
        return result;
    };

    /**
     * Computes a Matrix3 instance representing a non-uniform scale.
     *
     * @param {Cartesian3} scale The x, y, and z scale factors.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [7.0, 0.0, 0.0]
     * //   [0.0, 8.0, 0.0]
     * //   [0.0, 0.0, 9.0]
     * var m = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
     */
    Matrix3.fromScale = function(scale, result) {
                Check.typeOf.object('scale', scale);
        
        if (!defined(result)) {
            return new Matrix3(
                scale.x, 0.0,     0.0,
                0.0,     scale.y, 0.0,
                0.0,     0.0,     scale.z);
        }

        result[0] = scale.x;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = scale.y;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = scale.z;
        return result;
    };

    /**
     * Computes a Matrix3 instance representing a uniform scale.
     *
     * @param {Number} scale The uniform scale factor.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [2.0, 0.0, 0.0]
     * //   [0.0, 2.0, 0.0]
     * //   [0.0, 0.0, 2.0]
     * var m = Cesium.Matrix3.fromUniformScale(2.0);
     */
    Matrix3.fromUniformScale = function(scale, result) {
                Check.typeOf.number('scale', scale);
        
        if (!defined(result)) {
            return new Matrix3(
                scale, 0.0,   0.0,
                0.0,   scale, 0.0,
                0.0,   0.0,   scale);
        }

        result[0] = scale;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = scale;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = scale;
        return result;
    };

    /**
     * Computes a Matrix3 instance representing the cross product equivalent matrix of a Cartesian3 vector.
     *
     * @param {Cartesian3} vector the vector on the left hand side of the cross product operation.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [0.0, -9.0,  8.0]
     * //   [9.0,  0.0, -7.0]
     * //   [-8.0, 7.0,  0.0]
     * var m = Cesium.Matrix3.fromCrossProduct(new Cesium.Cartesian3(7.0, 8.0, 9.0));
     */
    Matrix3.fromCrossProduct = function(vector, result) {
                Check.typeOf.object('vector', vector);
        
        if (!defined(result)) {
            return new Matrix3(
                      0.0, -vector.z,  vector.y,
                 vector.z,       0.0, -vector.x,
                -vector.y,  vector.x,       0.0);
        }

        result[0] = 0.0;
        result[1] = vector.z;
        result[2] = -vector.y;
        result[3] = -vector.z;
        result[4] = 0.0;
        result[5] = vector.x;
        result[6] = vector.y;
        result[7] = -vector.x;
        result[8] = 0.0;
        return result;
    };

    /**
     * Creates a rotation matrix around the x-axis.
     *
     * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Rotate a point 45 degrees counterclockwise around the x-axis.
     * var p = new Cesium.Cartesian3(5, 6, 7);
     * var m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(45.0));
     * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
     */
    Matrix3.fromRotationX = function(angle, result) {
                Check.typeOf.number('angle', angle);
        
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        if (!defined(result)) {
            return new Matrix3(
                1.0, 0.0, 0.0,
                0.0, cosAngle, -sinAngle,
                0.0, sinAngle, cosAngle);
        }

        result[0] = 1.0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = cosAngle;
        result[5] = sinAngle;
        result[6] = 0.0;
        result[7] = -sinAngle;
        result[8] = cosAngle;

        return result;
    };

    /**
     * Creates a rotation matrix around the y-axis.
     *
     * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Rotate a point 45 degrees counterclockwise around the y-axis.
     * var p = new Cesium.Cartesian3(5, 6, 7);
     * var m = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(45.0));
     * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
     */
    Matrix3.fromRotationY = function(angle, result) {
                Check.typeOf.number('angle', angle);
        
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        if (!defined(result)) {
            return new Matrix3(
                cosAngle, 0.0, sinAngle,
                0.0, 1.0, 0.0,
                -sinAngle, 0.0, cosAngle);
        }

        result[0] = cosAngle;
        result[1] = 0.0;
        result[2] = -sinAngle;
        result[3] = 0.0;
        result[4] = 1.0;
        result[5] = 0.0;
        result[6] = sinAngle;
        result[7] = 0.0;
        result[8] = cosAngle;

        return result;
    };

    /**
     * Creates a rotation matrix around the z-axis.
     *
     * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
     * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
     *
     * @example
     * // Rotate a point 45 degrees counterclockwise around the z-axis.
     * var p = new Cesium.Cartesian3(5, 6, 7);
     * var m = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45.0));
     * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
     */
    Matrix3.fromRotationZ = function(angle, result) {
                Check.typeOf.number('angle', angle);
        
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        if (!defined(result)) {
            return new Matrix3(
                cosAngle, -sinAngle, 0.0,
                sinAngle, cosAngle, 0.0,
                0.0, 0.0, 1.0);
        }

        result[0] = cosAngle;
        result[1] = sinAngle;
        result[2] = 0.0;
        result[3] = -sinAngle;
        result[4] = cosAngle;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 1.0;

        return result;
    };

    /**
     * Creates an Array from the provided Matrix3 instance.
     * The array will be in column-major order.
     *
     * @param {Matrix3} matrix The matrix to use..
     * @param {Number[]} [result] The Array onto which to store the result.
     * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
     */
    Matrix3.toArray = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        
        if (!defined(result)) {
            return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8]];
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        return result;
    };

    /**
     * Computes the array index of the element at the provided row and column.
     *
     * @param {Number} row The zero-based index of the row.
     * @param {Number} column The zero-based index of the column.
     * @returns {Number} The index of the element at the provided row and column.
     *
     * @exception {DeveloperError} row must be 0, 1, or 2.
     * @exception {DeveloperError} column must be 0, 1, or 2.
     *
     * @example
     * var myMatrix = new Cesium.Matrix3();
     * var column1Row0Index = Cesium.Matrix3.getElementIndex(1, 0);
     * var column1Row0 = myMatrix[column1Row0Index]
     * myMatrix[column1Row0Index] = 10.0;
     */
    Matrix3.getElementIndex = function(column, row) {
                Check.typeOf.number.greaterThanOrEquals('row', row, 0);
        Check.typeOf.number.lessThanOrEquals('row', row, 2);
        Check.typeOf.number.greaterThanOrEquals('column', column, 0);
        Check.typeOf.number.lessThanOrEquals('column', column, 2);
        
        return column * 3 + row;
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian3 instance.
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, or 2.
     */
    Matrix3.getColumn = function(matrix, index, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 2);
        Check.typeOf.object('result', result);
        
        var startIndex = index * 3;
        var x = matrix[startIndex];
        var y = matrix[startIndex + 1];
        var z = matrix[startIndex + 2];

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian3 instance.
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified column.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, or 2.
     */
    Matrix3.setColumn = function(matrix, index, cartesian, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 2);
        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result = Matrix3.clone(matrix, result);
        var startIndex = index * 3;
        result[startIndex] = cartesian.x;
        result[startIndex + 1] = cartesian.y;
        result[startIndex + 2] = cartesian.z;
        return result;
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian3 instance.
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, or 2.
     */
    Matrix3.getRow = function(matrix, index, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 2);
        Check.typeOf.object('result', result);
        
        var x = matrix[index];
        var y = matrix[index + 3];
        var z = matrix[index + 6];

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian3 instance.
     *
     * @param {Matrix3} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified row.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, or 2.
     */
    Matrix3.setRow = function(matrix, index, cartesian, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 2);
        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result = Matrix3.clone(matrix, result);
        result[index] = cartesian.x;
        result[index + 3] = cartesian.y;
        result[index + 6] = cartesian.z;
        return result;
    };

    var scratchColumn = new Cartesian3();

    /**
     * Extracts the non-uniform scale assuming the matrix is an affine transformation.
     *
     * @param {Matrix3} matrix The matrix.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Matrix3.getScale = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result.x = Cartesian3.magnitude(Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn));
        result.y = Cartesian3.magnitude(Cartesian3.fromElements(matrix[3], matrix[4], matrix[5], scratchColumn));
        result.z = Cartesian3.magnitude(Cartesian3.fromElements(matrix[6], matrix[7], matrix[8], scratchColumn));
        return result;
    };

    var scratchScale = new Cartesian3();

    /**
     * Computes the maximum scale assuming the matrix is an affine transformation.
     * The maximum scale is the maximum length of the column vectors.
     *
     * @param {Matrix3} matrix The matrix.
     * @returns {Number} The maximum scale.
     */
    Matrix3.getMaximumScale = function(matrix) {
        Matrix3.getScale(matrix, scratchScale);
        return Cartesian3.maximumComponent(scratchScale);
    };

    /**
     * Computes the product of two matrices.
     *
     * @param {Matrix3} left The first matrix.
     * @param {Matrix3} right The second matrix.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.multiply = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        var column0Row0 = left[0] * right[0] + left[3] * right[1] + left[6] * right[2];
        var column0Row1 = left[1] * right[0] + left[4] * right[1] + left[7] * right[2];
        var column0Row2 = left[2] * right[0] + left[5] * right[1] + left[8] * right[2];

        var column1Row0 = left[0] * right[3] + left[3] * right[4] + left[6] * right[5];
        var column1Row1 = left[1] * right[3] + left[4] * right[4] + left[7] * right[5];
        var column1Row2 = left[2] * right[3] + left[5] * right[4] + left[8] * right[5];

        var column2Row0 = left[0] * right[6] + left[3] * right[7] + left[6] * right[8];
        var column2Row1 = left[1] * right[6] + left[4] * right[7] + left[7] * right[8];
        var column2Row2 = left[2] * right[6] + left[5] * right[7] + left[8] * right[8];

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column1Row0;
        result[4] = column1Row1;
        result[5] = column1Row2;
        result[6] = column2Row0;
        result[7] = column2Row1;
        result[8] = column2Row2;
        return result;
    };

    /**
     * Computes the sum of two matrices.
     *
     * @param {Matrix3} left The first matrix.
     * @param {Matrix3} right The second matrix.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.add = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result[0] = left[0] + right[0];
        result[1] = left[1] + right[1];
        result[2] = left[2] + right[2];
        result[3] = left[3] + right[3];
        result[4] = left[4] + right[4];
        result[5] = left[5] + right[5];
        result[6] = left[6] + right[6];
        result[7] = left[7] + right[7];
        result[8] = left[8] + right[8];
        return result;
    };

    /**
     * Computes the difference of two matrices.
     *
     * @param {Matrix3} left The first matrix.
     * @param {Matrix3} right The second matrix.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.subtract = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result[0] = left[0] - right[0];
        result[1] = left[1] - right[1];
        result[2] = left[2] - right[2];
        result[3] = left[3] - right[3];
        result[4] = left[4] - right[4];
        result[5] = left[5] - right[5];
        result[6] = left[6] - right[6];
        result[7] = left[7] - right[7];
        result[8] = left[8] - right[8];
        return result;
    };

    /**
     * Computes the product of a matrix and a column vector.
     *
     * @param {Matrix3} matrix The matrix.
     * @param {Cartesian3} cartesian The column.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Matrix3.multiplyByVector = function(matrix, cartesian, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;

        var x = matrix[0] * vX + matrix[3] * vY + matrix[6] * vZ;
        var y = matrix[1] * vX + matrix[4] * vY + matrix[7] * vZ;
        var z = matrix[2] * vX + matrix[5] * vY + matrix[8] * vZ;

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes the product of a matrix and a scalar.
     *
     * @param {Matrix3} matrix The matrix.
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.multiplyByScalar = function(matrix, scalar, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result[0] = matrix[0] * scalar;
        result[1] = matrix[1] * scalar;
        result[2] = matrix[2] * scalar;
        result[3] = matrix[3] * scalar;
        result[4] = matrix[4] * scalar;
        result[5] = matrix[5] * scalar;
        result[6] = matrix[6] * scalar;
        result[7] = matrix[7] * scalar;
        result[8] = matrix[8] * scalar;
        return result;
    };

    /**
     * Computes the product of a matrix times a (non-uniform) scale, as if the scale were a scale matrix.
     *
     * @param {Matrix3} matrix The matrix on the left-hand side.
     * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     *
     * @example
     * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromScale(scale), m);
     * Cesium.Matrix3.multiplyByScale(m, scale, m);
     *
     * @see Matrix3.fromScale
     * @see Matrix3.multiplyByUniformScale
     */
    Matrix3.multiplyByScale = function(matrix, scale, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('scale', scale);
        Check.typeOf.object('result', result);
        
        result[0] = matrix[0] * scale.x;
        result[1] = matrix[1] * scale.x;
        result[2] = matrix[2] * scale.x;
        result[3] = matrix[3] * scale.y;
        result[4] = matrix[4] * scale.y;
        result[5] = matrix[5] * scale.y;
        result[6] = matrix[6] * scale.z;
        result[7] = matrix[7] * scale.z;
        result[8] = matrix[8] * scale.z;
        return result;
    };

    /**
     * Creates a negated copy of the provided matrix.
     *
     * @param {Matrix3} matrix The matrix to negate.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.negate = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result[0] = -matrix[0];
        result[1] = -matrix[1];
        result[2] = -matrix[2];
        result[3] = -matrix[3];
        result[4] = -matrix[4];
        result[5] = -matrix[5];
        result[6] = -matrix[6];
        result[7] = -matrix[7];
        result[8] = -matrix[8];
        return result;
    };

    /**
     * Computes the transpose of the provided matrix.
     *
     * @param {Matrix3} matrix The matrix to transpose.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.transpose = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        var column0Row0 = matrix[0];
        var column0Row1 = matrix[3];
        var column0Row2 = matrix[6];
        var column1Row0 = matrix[1];
        var column1Row1 = matrix[4];
        var column1Row2 = matrix[7];
        var column2Row0 = matrix[2];
        var column2Row1 = matrix[5];
        var column2Row2 = matrix[8];

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column1Row0;
        result[4] = column1Row1;
        result[5] = column1Row2;
        result[6] = column2Row0;
        result[7] = column2Row1;
        result[8] = column2Row2;
        return result;
    };

    function computeFrobeniusNorm(matrix) {
        var norm = 0.0;
        for (var i = 0; i < 9; ++i) {
            var temp = matrix[i];
            norm += temp * temp;
        }

        return Math.sqrt(norm);
    }

    var rowVal = [1, 0, 0];
    var colVal = [2, 2, 1];

    function offDiagonalFrobeniusNorm(matrix) {
        // Computes the "off-diagonal" Frobenius norm.
        // Assumes matrix is symmetric.

        var norm = 0.0;
        for (var i = 0; i < 3; ++i) {
            var temp = matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])];
            norm += 2.0 * temp * temp;
        }

        return Math.sqrt(norm);
    }

    function shurDecomposition(matrix, result) {
        // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
        // section 8.4.2 The 2by2 Symmetric Schur Decomposition.
        //
        // The routine takes a matrix, which is assumed to be symmetric, and
        // finds the largest off-diagonal term, and then creates
        // a matrix (result) which can be used to help reduce it

        var tolerance = CesiumMath.EPSILON15;

        var maxDiagonal = 0.0;
        var rotAxis = 1;

        // find pivot (rotAxis) based on max diagonal of matrix
        for (var i = 0; i < 3; ++i) {
            var temp = Math.abs(matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])]);
            if (temp > maxDiagonal) {
                rotAxis = i;
                maxDiagonal = temp;
            }
        }

        var c = 1.0;
        var s = 0.0;

        var p = rowVal[rotAxis];
        var q = colVal[rotAxis];

        if (Math.abs(matrix[Matrix3.getElementIndex(q, p)]) > tolerance) {
            var qq = matrix[Matrix3.getElementIndex(q, q)];
            var pp = matrix[Matrix3.getElementIndex(p, p)];
            var qp = matrix[Matrix3.getElementIndex(q, p)];

            var tau = (qq - pp) / 2.0 / qp;
            var t;

            if (tau < 0.0) {
                t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
            } else {
                t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
            }

            c = 1.0 / Math.sqrt(1.0 + t * t);
            s = t * c;
        }

        result = Matrix3.clone(Matrix3.IDENTITY, result);

        result[Matrix3.getElementIndex(p, p)] = result[Matrix3.getElementIndex(q, q)] = c;
        result[Matrix3.getElementIndex(q, p)] = s;
        result[Matrix3.getElementIndex(p, q)] = -s;

        return result;
    }

    var jMatrix = new Matrix3();
    var jMatrixTranspose = new Matrix3();

    /**
     * Computes the eigenvectors and eigenvalues of a symmetric matrix.
     * <p>
     * Returns a diagonal matrix and unitary matrix such that:
     * <code>matrix = unitary matrix * diagonal matrix * transpose(unitary matrix)</code>
     * </p>
     * <p>
     * The values along the diagonal of the diagonal matrix are the eigenvalues. The columns
     * of the unitary matrix are the corresponding eigenvectors.
     * </p>
     *
     * @param {Matrix3} matrix The matrix to decompose into diagonal and unitary matrix. Expected to be symmetric.
     * @param {Object} [result] An object with unitary and diagonal properties which are matrices onto which to store the result.
     * @returns {Object} An object with unitary and diagonal properties which are the unitary and diagonal matrices, respectively.
     *
     * @example
     * var a = //... symetric matrix
     * var result = {
     *     unitary : new Cesium.Matrix3(),
     *     diagonal : new Cesium.Matrix3()
     * };
     * Cesium.Matrix3.computeEigenDecomposition(a, result);
     *
     * var unitaryTranspose = Cesium.Matrix3.transpose(result.unitary, new Cesium.Matrix3());
     * var b = Cesium.Matrix3.multiply(result.unitary, result.diagonal, new Cesium.Matrix3());
     * Cesium.Matrix3.multiply(b, unitaryTranspose, b); // b is now equal to a
     *
     * var lambda = Cesium.Matrix3.getColumn(result.diagonal, 0, new Cesium.Cartesian3()).x;  // first eigenvalue
     * var v = Cesium.Matrix3.getColumn(result.unitary, 0, new Cesium.Cartesian3());          // first eigenvector
     * var c = Cesium.Cartesian3.multiplyByScalar(v, lambda, new Cesium.Cartesian3());        // equal to Cesium.Matrix3.multiplyByVector(a, v)
     */
    Matrix3.computeEigenDecomposition = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        
        // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
        // section 8.4.3 The Classical Jacobi Algorithm

        var tolerance = CesiumMath.EPSILON20;
        var maxSweeps = 10;

        var count = 0;
        var sweep = 0;

        if (!defined(result)) {
            result = {};
        }

        var unitaryMatrix = result.unitary = Matrix3.clone(Matrix3.IDENTITY, result.unitary);
        var diagMatrix = result.diagonal = Matrix3.clone(matrix, result.diagonal);

        var epsilon = tolerance * computeFrobeniusNorm(diagMatrix);

        while (sweep < maxSweeps && offDiagonalFrobeniusNorm(diagMatrix) > epsilon) {
            shurDecomposition(diagMatrix, jMatrix);
            Matrix3.transpose(jMatrix, jMatrixTranspose);
            Matrix3.multiply(diagMatrix, jMatrix, diagMatrix);
            Matrix3.multiply(jMatrixTranspose, diagMatrix, diagMatrix);
            Matrix3.multiply(unitaryMatrix, jMatrix, unitaryMatrix);

            if (++count > 2) {
                ++sweep;
                count = 0;
            }
        }

        return result;
    };

    /**
     * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
     *
     * @param {Matrix3} matrix The matrix with signed elements.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     */
    Matrix3.abs = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result[0] = Math.abs(matrix[0]);
        result[1] = Math.abs(matrix[1]);
        result[2] = Math.abs(matrix[2]);
        result[3] = Math.abs(matrix[3]);
        result[4] = Math.abs(matrix[4]);
        result[5] = Math.abs(matrix[5]);
        result[6] = Math.abs(matrix[6]);
        result[7] = Math.abs(matrix[7]);
        result[8] = Math.abs(matrix[8]);

        return result;
    };

    /**
     * Computes the determinant of the provided matrix.
     *
     * @param {Matrix3} matrix The matrix to use.
     * @returns {Number} The value of the determinant of the matrix.
     */
    Matrix3.determinant = function(matrix) {
                Check.typeOf.object('matrix', matrix);
        
        var m11 = matrix[0];
        var m21 = matrix[3];
        var m31 = matrix[6];
        var m12 = matrix[1];
        var m22 = matrix[4];
        var m32 = matrix[7];
        var m13 = matrix[2];
        var m23 = matrix[5];
        var m33 = matrix[8];

        return m11 * (m22 * m33 - m23 * m32) + m12 * (m23 * m31 - m21 * m33) + m13 * (m21 * m32 - m22 * m31);
    };

    /**
     * Computes the inverse of the provided matrix.
     *
     * @param {Matrix3} matrix The matrix to invert.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     * @exception {DeveloperError} matrix is not invertible.
     */
    Matrix3.inverse = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        var m11 = matrix[0];
        var m21 = matrix[1];
        var m31 = matrix[2];
        var m12 = matrix[3];
        var m22 = matrix[4];
        var m32 = matrix[5];
        var m13 = matrix[6];
        var m23 = matrix[7];
        var m33 = matrix[8];

        var determinant = Matrix3.determinant(matrix);

                if (Math.abs(determinant) <= CesiumMath.EPSILON15) {
            throw new DeveloperError('matrix is not invertible');
        }
        
        result[0] = m22 * m33 - m23 * m32;
        result[1] = m23 * m31 - m21 * m33;
        result[2] = m21 * m32 - m22 * m31;
        result[3] = m13 * m32 - m12 * m33;
        result[4] = m11 * m33 - m13 * m31;
        result[5] = m12 * m31 - m11 * m32;
        result[6] = m12 * m23 - m13 * m22;
        result[7] = m13 * m21 - m11 * m23;
        result[8] = m11 * m22 - m12 * m21;

       var scale = 1.0 / determinant;
       return Matrix3.multiplyByScalar(result, scale, result);
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Matrix3} [left] The first matrix.
     * @param {Matrix3} [right] The second matrix.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Matrix3.equals = function(left, right) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                left[0] === right[0] &&
                left[1] === right[1] &&
                left[2] === right[2] &&
                left[3] === right[3] &&
                left[4] === right[4] &&
                left[5] === right[5] &&
                left[6] === right[6] &&
                left[7] === right[7] &&
                left[8] === right[8]);
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Matrix3} [left] The first matrix.
     * @param {Matrix3} [right] The second matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Matrix3.equalsEpsilon = function(left, right, epsilon) {
                Check.typeOf.number('epsilon', epsilon);
        
        return (left === right) ||
                (defined(left) &&
                defined(right) &&
                Math.abs(left[0] - right[0]) <= epsilon &&
                Math.abs(left[1] - right[1]) <= epsilon &&
                Math.abs(left[2] - right[2]) <= epsilon &&
                Math.abs(left[3] - right[3]) <= epsilon &&
                Math.abs(left[4] - right[4]) <= epsilon &&
                Math.abs(left[5] - right[5]) <= epsilon &&
                Math.abs(left[6] - right[6]) <= epsilon &&
                Math.abs(left[7] - right[7]) <= epsilon &&
                Math.abs(left[8] - right[8]) <= epsilon);
    };

    /**
     * An immutable Matrix3 instance initialized to the identity matrix.
     *
     * @type {Matrix3}
     * @constant
     */
    Matrix3.IDENTITY = freezeObject(new Matrix3(1.0, 0.0, 0.0,
                                                0.0, 1.0, 0.0,
                                                0.0, 0.0, 1.0));

    /**
     * An immutable Matrix3 instance initialized to the zero matrix.
     *
     * @type {Matrix3}
     * @constant
     */
    Matrix3.ZERO = freezeObject(new Matrix3(0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0));

    /**
     * The index into Matrix3 for column 0, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN0ROW0 = 0;

    /**
     * The index into Matrix3 for column 0, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN0ROW1 = 1;

    /**
     * The index into Matrix3 for column 0, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN0ROW2 = 2;

    /**
     * The index into Matrix3 for column 1, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN1ROW0 = 3;

    /**
     * The index into Matrix3 for column 1, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN1ROW1 = 4;

    /**
     * The index into Matrix3 for column 1, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN1ROW2 = 5;

    /**
     * The index into Matrix3 for column 2, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN2ROW0 = 6;

    /**
     * The index into Matrix3 for column 2, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN2ROW1 = 7;

    /**
     * The index into Matrix3 for column 2, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix3.COLUMN2ROW2 = 8;

    defineProperties(Matrix3.prototype, {
        /**
         * Gets the number of items in the collection.
         * @memberof Matrix3.prototype
         *
         * @type {Number}
         */
        length : {
            get : function() {
                return Matrix3.packedLength;
            }
        }
    });

    /**
     * Duplicates the provided Matrix3 instance.
     *
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
     */
    Matrix3.prototype.clone = function(result) {
        return Matrix3.clone(this, result);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Matrix3} [right] The right hand side matrix.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Matrix3.prototype.equals = function(right) {
        return Matrix3.equals(this, right);
    };

    /**
     * @private
     */
    Matrix3.equalsArray = function(matrix, array, offset) {
        return matrix[0] === array[offset] &&
               matrix[1] === array[offset + 1] &&
               matrix[2] === array[offset + 2] &&
               matrix[3] === array[offset + 3] &&
               matrix[4] === array[offset + 4] &&
               matrix[5] === array[offset + 5] &&
               matrix[6] === array[offset + 6] &&
               matrix[7] === array[offset + 7] &&
               matrix[8] === array[offset + 8];
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Matrix3} [right] The right hand side matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    Matrix3.prototype.equalsEpsilon = function(right, epsilon) {
        return Matrix3.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Creates a string representing this Matrix with each row being
     * on a separate line and in the format '(column0, column1, column2)'.
     *
     * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2)'.
     */
    Matrix3.prototype.toString = function() {
        return '(' + this[0] + ', ' + this[3] + ', ' + this[6] + ')\n' +
               '(' + this[1] + ', ' + this[4] + ', ' + this[7] + ')\n' +
               '(' + this[2] + ', ' + this[5] + ', ' + this[8] + ')';
    };

    return Matrix3;
});

/*global define*/
define('Core/Cartesian4',[
        './Check',
        './defaultValue',
        './defined',
        './DeveloperError',
        './freezeObject',
        './Math'
    ], function(
        Check,
        defaultValue,
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath) {
    'use strict';

    /**
     * A 4D Cartesian point.
     * @alias Cartesian4
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     * @param {Number} [z=0.0] The Z component.
     * @param {Number} [w=0.0] The W component.
     *
     * @see Cartesian2
     * @see Cartesian3
     * @see Packable
     */
    function Cartesian4(x, y, z, w) {
        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);

        /**
         * The Z component.
         * @type {Number}
         * @default 0.0
         */
        this.z = defaultValue(z, 0.0);

        /**
         * The W component.
         * @type {Number}
         * @default 0.0
         */
        this.w = defaultValue(w, 0.0);
    }

    /**
     * Creates a Cartesian4 instance from x, y, z and w coordinates.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} z The z coordinate.
     * @param {Number} w The w coordinate.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     */
    Cartesian4.fromElements = function(x, y, z, w, result) {
        if (!defined(result)) {
            return new Cartesian4(x, y, z, w);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Creates a Cartesian4 instance from a {@link Color}. <code>red</code>, <code>green</code>, <code>blue</code>,
     * and <code>alpha</code> map to <code>x</code>, <code>y</code>, <code>z</code>, and <code>w</code>, respectively.
     *
     * @param {Color} color The source color.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     */
    Cartesian4.fromColor = function(color, result) {
                Check.typeOf.object('color', color);
                if (!defined(result)) {
            return new Cartesian4(color.red, color.green, color.blue, color.alpha);
        }

        result.x = color.red;
        result.y = color.green;
        result.z = color.blue;
        result.w = color.alpha;
        return result;
    };

    /**
     * Duplicates a Cartesian4 instance.
     *
     * @param {Cartesian4} cartesian The Cartesian to duplicate.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided. (Returns undefined if cartesian is undefined)
     */
    Cartesian4.clone = function(cartesian, result) {
        if (!defined(cartesian)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Cartesian4(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
        }

        result.x = cartesian.x;
        result.y = cartesian.y;
        result.z = cartesian.z;
        result.w = cartesian.w;
        return result;
    };


    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Cartesian4.packedLength = 4;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Cartesian4} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Cartesian4.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex++] = value.y;
        array[startingIndex++] = value.z;
        array[startingIndex] = value.w;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Cartesian4} [result] The object into which to store the result.
     * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
     */
    Cartesian4.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Cartesian4();
        }
        result.x = array[startingIndex++];
        result.y = array[startingIndex++];
        result.z = array[startingIndex++];
        result.w = array[startingIndex];
        return result;
    };

    /**
     * Flattens an array of Cartesian4s into and array of components.
     *
     * @param {Cartesian4[]} array The array of cartesians to pack.
     * @param {Number[]} result The array onto which to store the result.
     * @returns {Number[]} The packed array.
     */
    Cartesian4.packArray = function(array, result) {
                Check.defined('array', array);
        
        var length = array.length;
        if (!defined(result)) {
            result = new Array(length * 4);
        } else {
            result.length = length * 4;
        }

        for (var i = 0; i < length; ++i) {
            Cartesian4.pack(array[i], result, i * 4);
        }
        return result;
    };

    /**
     * Unpacks an array of cartesian components into and array of Cartesian4s.
     *
     * @param {Number[]} array The array of components to unpack.
     * @param {Cartesian4[]} result The array onto which to store the result.
     * @returns {Cartesian4[]} The unpacked array.
     */
    Cartesian4.unpackArray = function(array, result) {
                Check.defined('array', array);
        
        var length = array.length;
        if (!defined(result)) {
            result = new Array(length / 4);
        } else {
            result.length = length / 4;
        }

        for (var i = 0; i < length; i += 4) {
            var index = i / 4;
            result[index] = Cartesian4.unpack(array, i, result[index]);
        }
        return result;
    };

    /**
     * Creates a Cartesian4 from four consecutive elements in an array.
     * @function
     *
     * @param {Number[]} array The array whose four consecutive elements correspond to the x, y, z, and w components, respectively.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
     *
     * @example
     * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0)
     * var v = [1.0, 2.0, 3.0, 4.0];
     * var p = Cesium.Cartesian4.fromArray(v);
     *
     * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0) using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0, 4.0];
     * var p2 = Cesium.Cartesian4.fromArray(v2, 2);
     */
    Cartesian4.fromArray = Cartesian4.unpack;

    /**
     * Computes the value of the maximum component for the supplied Cartesian.
     *
     * @param {Cartesian4} cartesian The cartesian to use.
     * @returns {Number} The value of the maximum component.
     */
    Cartesian4.maximumComponent = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return Math.max(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
    };

    /**
     * Computes the value of the minimum component for the supplied Cartesian.
     *
     * @param {Cartesian4} cartesian The cartesian to use.
     * @returns {Number} The value of the minimum component.
     */
    Cartesian4.minimumComponent = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return Math.min(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
    };

    /**
     * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
     *
     * @param {Cartesian4} first A cartesian to compare.
     * @param {Cartesian4} second A cartesian to compare.
     * @param {Cartesian4} result The object into which to store the result.
     * @returns {Cartesian4} A cartesian with the minimum components.
     */
    Cartesian4.minimumByComponent = function(first, second, result) {
                Check.typeOf.object('first', first);
        Check.typeOf.object('second', second);
        Check.typeOf.object('result', result);
        
        result.x = Math.min(first.x, second.x);
        result.y = Math.min(first.y, second.y);
        result.z = Math.min(first.z, second.z);
        result.w = Math.min(first.w, second.w);

        return result;
    };

    /**
     * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
     *
     * @param {Cartesian4} first A cartesian to compare.
     * @param {Cartesian4} second A cartesian to compare.
     * @param {Cartesian4} result The object into which to store the result.
     * @returns {Cartesian4} A cartesian with the maximum components.
     */
    Cartesian4.maximumByComponent = function(first, second, result) {
                Check.typeOf.object('first', first);
        Check.typeOf.object('second', second);
        Check.typeOf.object('result', result);
        
        result.x = Math.max(first.x, second.x);
        result.y = Math.max(first.y, second.y);
        result.z = Math.max(first.z, second.z);
        result.w = Math.max(first.w, second.w);

        return result;
    };

    /**
     * Computes the provided Cartesian's squared magnitude.
     *
     * @param {Cartesian4} cartesian The Cartesian instance whose squared magnitude is to be computed.
     * @returns {Number} The squared magnitude.
     */
    Cartesian4.magnitudeSquared = function(cartesian) {
                Check.typeOf.object('cartesian', cartesian);
        
        return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z + cartesian.w * cartesian.w;
    };

    /**
     * Computes the Cartesian's magnitude (length).
     *
     * @param {Cartesian4} cartesian The Cartesian instance whose magnitude is to be computed.
     * @returns {Number} The magnitude.
     */
    Cartesian4.magnitude = function(cartesian) {
        return Math.sqrt(Cartesian4.magnitudeSquared(cartesian));
    };

    var distanceScratch = new Cartesian4();

    /**
     * Computes the 4-space distance between two points.
     *
     * @param {Cartesian4} left The first point to compute the distance from.
     * @param {Cartesian4} right The second point to compute the distance to.
     * @returns {Number} The distance between two points.
     *
     * @example
     * // Returns 1.0
     * var d = Cesium.Cartesian4.distance(
     *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
     *   new Cesium.Cartesian4(2.0, 0.0, 0.0, 0.0));
     */
    Cartesian4.distance = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        Cartesian4.subtract(left, right, distanceScratch);
        return Cartesian4.magnitude(distanceScratch);
    };

    /**
     * Computes the squared distance between two points.  Comparing squared distances
     * using this function is more efficient than comparing distances using {@link Cartesian4#distance}.
     *
     * @param {Cartesian4} left The first point to compute the distance from.
     * @param {Cartesian4} right The second point to compute the distance to.
     * @returns {Number} The distance between two points.
     *
     * @example
     * // Returns 4.0, not 2.0
     * var d = Cesium.Cartesian4.distance(
     *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
     *   new Cesium.Cartesian4(3.0, 0.0, 0.0, 0.0));
     */
    Cartesian4.distanceSquared = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        Cartesian4.subtract(left, right, distanceScratch);
        return Cartesian4.magnitudeSquared(distanceScratch);
    };

    /**
     * Computes the normalized form of the supplied Cartesian.
     *
     * @param {Cartesian4} cartesian The Cartesian to be normalized.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.normalize = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var magnitude = Cartesian4.magnitude(cartesian);

        result.x = cartesian.x / magnitude;
        result.y = cartesian.y / magnitude;
        result.z = cartesian.z / magnitude;
        result.w = cartesian.w / magnitude;

                if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z) || isNaN(result.w)) {
            throw new DeveloperError('normalized result is not a number');
        }
        
        return result;
    };

    /**
     * Computes the dot (scalar) product of two Cartesians.
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @returns {Number} The dot product.
     */
    Cartesian4.dot = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
    };

    /**
     * Computes the componentwise product of two Cartesians.
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.multiplyComponents = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x * right.x;
        result.y = left.y * right.y;
        result.z = left.z * right.z;
        result.w = left.w * right.w;
        return result;
    };

    /**
     * Computes the componentwise quotient of two Cartesians.
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.divideComponents = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x / right.x;
        result.y = left.y / right.y;
        result.z = left.z / right.z;
        result.w = left.w / right.w;
        return result;
    };

    /**
     * Computes the componentwise sum of two Cartesians.
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.add = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        result.z = left.z + right.z;
        result.w = left.w + right.w;
        return result;
    };

    /**
     * Computes the componentwise difference of two Cartesians.
     *
     * @param {Cartesian4} left The first Cartesian.
     * @param {Cartesian4} right The second Cartesian.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.subtract = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        result.z = left.z - right.z;
        result.w = left.w - right.w;
        return result;
    };

    /**
     * Multiplies the provided Cartesian componentwise by the provided scalar.
     *
     * @param {Cartesian4} cartesian The Cartesian to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.multiplyByScalar = function(cartesian, scalar, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = cartesian.x * scalar;
        result.y = cartesian.y * scalar;
        result.z = cartesian.z * scalar;
        result.w = cartesian.w * scalar;
        return result;
    };

    /**
     * Divides the provided Cartesian componentwise by the provided scalar.
     *
     * @param {Cartesian4} cartesian The Cartesian to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.divideByScalar = function(cartesian, scalar, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = cartesian.x / scalar;
        result.y = cartesian.y / scalar;
        result.z = cartesian.z / scalar;
        result.w = cartesian.w / scalar;
        return result;
    };

    /**
     * Negates the provided Cartesian.
     *
     * @param {Cartesian4} cartesian The Cartesian to be negated.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.negate = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result.x = -cartesian.x;
        result.y = -cartesian.y;
        result.z = -cartesian.z;
        result.w = -cartesian.w;
        return result;
    };

    /**
     * Computes the absolute value of the provided Cartesian.
     *
     * @param {Cartesian4} cartesian The Cartesian whose absolute value is to be computed.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.abs = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result.x = Math.abs(cartesian.x);
        result.y = Math.abs(cartesian.y);
        result.z = Math.abs(cartesian.z);
        result.w = Math.abs(cartesian.w);
        return result;
    };

    var lerpScratch = new Cartesian4();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
     *
     * @param {Cartesian4} start The value corresponding to t at 0.0.
     * @param {Cartesian4}end The value corresponding to t at 1.0.
     * @param {Number} t The point along t at which to interpolate.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Cartesian4.lerp = function(start, end, t, result) {
                Check.typeOf.object('start', start);
        Check.typeOf.object('end', end);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        Cartesian4.multiplyByScalar(end, t, lerpScratch);
        result = Cartesian4.multiplyByScalar(start, 1.0 - t, result);
        return Cartesian4.add(lerpScratch, result, result);
    };

    var mostOrthogonalAxisScratch = new Cartesian4();
    /**
     * Returns the axis that is most orthogonal to the provided Cartesian.
     *
     * @param {Cartesian4} cartesian The Cartesian on which to find the most orthogonal axis.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The most orthogonal axis.
     */
    Cartesian4.mostOrthogonalAxis = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var f = Cartesian4.normalize(cartesian, mostOrthogonalAxisScratch);
        Cartesian4.abs(f, f);

        if (f.x <= f.y) {
            if (f.x <= f.z) {
                if (f.x <= f.w) {
                    result = Cartesian4.clone(Cartesian4.UNIT_X, result);
                } else {
                    result = Cartesian4.clone(Cartesian4.UNIT_W, result);
                }
            } else if (f.z <= f.w) {
                result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
            } else {
                result = Cartesian4.clone(Cartesian4.UNIT_W, result);
            }
        } else if (f.y <= f.z) {
            if (f.y <= f.w) {
                result = Cartesian4.clone(Cartesian4.UNIT_Y, result);
            } else {
                result = Cartesian4.clone(Cartesian4.UNIT_W, result);
            }
        } else if (f.z <= f.w) {
            result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
        } else {
            result = Cartesian4.clone(Cartesian4.UNIT_W, result);
        }

        return result;
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartesian4} [left] The first Cartesian.
     * @param {Cartesian4} [right] The second Cartesian.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Cartesian4.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.x === right.x) &&
                (left.y === right.y) &&
                (left.z === right.z) &&
                (left.w === right.w));
    };

    /**
     * @private
     */
    Cartesian4.equalsArray = function(cartesian, array, offset) {
        return cartesian.x === array[offset] &&
               cartesian.y === array[offset + 1] &&
               cartesian.z === array[offset + 2] &&
               cartesian.w === array[offset + 3];
    };

    /**
     * Compares the provided Cartesians componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian4} [left] The first Cartesian.
     * @param {Cartesian4} [right] The second Cartesian.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartesian4.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                CesiumMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.w, right.w, relativeEpsilon, absoluteEpsilon));
    };

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 0.0).
     *
     * @type {Cartesian4}
     * @constant
     */
    Cartesian4.ZERO = freezeObject(new Cartesian4(0.0, 0.0, 0.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (1.0, 0.0, 0.0, 0.0).
     *
     * @type {Cartesian4}
     * @constant
     */
    Cartesian4.UNIT_X = freezeObject(new Cartesian4(1.0, 0.0, 0.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 1.0, 0.0, 0.0).
     *
     * @type {Cartesian4}
     * @constant
     */
    Cartesian4.UNIT_Y = freezeObject(new Cartesian4(0.0, 1.0, 0.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 0.0, 1.0, 0.0).
     *
     * @type {Cartesian4}
     * @constant
     */
    Cartesian4.UNIT_Z = freezeObject(new Cartesian4(0.0, 0.0, 1.0, 0.0));

    /**
     * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 1.0).
     *
     * @type {Cartesian4}
     * @constant
     */
    Cartesian4.UNIT_W = freezeObject(new Cartesian4(0.0, 0.0, 0.0, 1.0));

    /**
     * Duplicates this Cartesian4 instance.
     *
     * @param {Cartesian4} [result] The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
     */
    Cartesian4.prototype.clone = function(result) {
        return Cartesian4.clone(this, result);
    };

    /**
     * Compares this Cartesian against the provided Cartesian componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Cartesian4} [right] The right hand side Cartesian.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Cartesian4.prototype.equals = function(right) {
        return Cartesian4.equals(this, right);
    };

    /**
     * Compares this Cartesian against the provided Cartesian componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian4} [right] The right hand side Cartesian.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    Cartesian4.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
        return Cartesian4.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
    };

    /**
     * Creates a string representing this Cartesian in the format '(x, y)'.
     *
     * @returns {String} A string representing the provided Cartesian in the format '(x, y)'.
     */
    Cartesian4.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
    };

    return Cartesian4;
});

/*global define*/
define('Core/RuntimeError',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Constructs an exception object that is thrown due to an error that can occur at runtime, e.g.,
     * out of memory, could not compile shader, etc.  If a function may throw this
     * exception, the calling code should be prepared to catch it.
     * <br /><br />
     * On the other hand, a {@link DeveloperError} indicates an exception due
     * to a developer error, e.g., invalid argument, that usually indicates a bug in the
     * calling code.
     *
     * @alias RuntimeError
     * @constructor
     * @extends Error
     *
     * @param {String} [message] The error message for this exception.
     *
     * @see DeveloperError
     */
    function RuntimeError(message) {
        /**
         * 'RuntimeError' indicating that this exception was thrown due to a runtime error.
         * @type {String}
         * @readonly
         */
        this.name = 'RuntimeError';

        /**
         * The explanation for why this exception was thrown.
         * @type {String}
         * @readonly
         */
        this.message = message;

        //Browsers such as IE don't have a stack property until you actually throw the error.
        var stack;
        try {
            throw new Error();
        } catch (e) {
            stack = e.stack;
        }

        /**
         * The stack trace of this exception, if available.
         * @type {String}
         * @readonly
         */
        this.stack = stack;
    }

    if (defined(Object.create)) {
        RuntimeError.prototype = Object.create(Error.prototype);
        RuntimeError.prototype.constructor = RuntimeError;
    }

    RuntimeError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return RuntimeError;
});

/*global define*/
define('Core/Matrix4',[
        './Cartesian3',
        './Cartesian4',
        './Check',
        './defaultValue',
        './defined',
        './defineProperties',
        './freezeObject',
        './Math',
        './Matrix3',
        './RuntimeError'
    ], function(
        Cartesian3,
        Cartesian4,
        Check,
        defaultValue,
        defined,
        defineProperties,
        freezeObject,
        CesiumMath,
        Matrix3,
        RuntimeError) {
    'use strict';

    /**
     * A 4x4 matrix, indexable as a column-major order array.
     * Constructor parameters are in row-major order for code readability.
     * @alias Matrix4
     * @constructor
     *
     * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
     * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
     * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
     * @param {Number} [column3Row0=0.0] The value for column 3, row 0.
     * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
     * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
     * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
     * @param {Number} [column3Row1=0.0] The value for column 3, row 1.
     * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
     * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
     * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
     * @param {Number} [column3Row2=0.0] The value for column 3, row 2.
     * @param {Number} [column0Row3=0.0] The value for column 0, row 3.
     * @param {Number} [column1Row3=0.0] The value for column 1, row 3.
     * @param {Number} [column2Row3=0.0] The value for column 2, row 3.
     * @param {Number} [column3Row3=0.0] The value for column 3, row 3.
     *
     * @see Matrix4.fromColumnMajorArray
     * @see Matrix4.fromRowMajorArray
     * @see Matrix4.fromRotationTranslation
     * @see Matrix4.fromTranslationRotationScale
     * @see Matrix4.fromTranslationQuaternionRotationScale
     * @see Matrix4.fromTranslation
     * @see Matrix4.fromScale
     * @see Matrix4.fromUniformScale
     * @see Matrix4.fromCamera
     * @see Matrix4.computePerspectiveFieldOfView
     * @see Matrix4.computeOrthographicOffCenter
     * @see Matrix4.computePerspectiveOffCenter
     * @see Matrix4.computeInfinitePerspectiveOffCenter
     * @see Matrix4.computeViewportTransformation
     * @see Matrix4.computeView
     * @see Matrix2
     * @see Matrix3
     * @see Packable
     */
    function Matrix4(column0Row0, column1Row0, column2Row0, column3Row0,
                           column0Row1, column1Row1, column2Row1, column3Row1,
                           column0Row2, column1Row2, column2Row2, column3Row2,
                           column0Row3, column1Row3, column2Row3, column3Row3) {
        this[0] = defaultValue(column0Row0, 0.0);
        this[1] = defaultValue(column0Row1, 0.0);
        this[2] = defaultValue(column0Row2, 0.0);
        this[3] = defaultValue(column0Row3, 0.0);
        this[4] = defaultValue(column1Row0, 0.0);
        this[5] = defaultValue(column1Row1, 0.0);
        this[6] = defaultValue(column1Row2, 0.0);
        this[7] = defaultValue(column1Row3, 0.0);
        this[8] = defaultValue(column2Row0, 0.0);
        this[9] = defaultValue(column2Row1, 0.0);
        this[10] = defaultValue(column2Row2, 0.0);
        this[11] = defaultValue(column2Row3, 0.0);
        this[12] = defaultValue(column3Row0, 0.0);
        this[13] = defaultValue(column3Row1, 0.0);
        this[14] = defaultValue(column3Row2, 0.0);
        this[15] = defaultValue(column3Row3, 0.0);
    }

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Matrix4.packedLength = 16;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Matrix4} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Matrix4.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value[0];
        array[startingIndex++] = value[1];
        array[startingIndex++] = value[2];
        array[startingIndex++] = value[3];
        array[startingIndex++] = value[4];
        array[startingIndex++] = value[5];
        array[startingIndex++] = value[6];
        array[startingIndex++] = value[7];
        array[startingIndex++] = value[8];
        array[startingIndex++] = value[9];
        array[startingIndex++] = value[10];
        array[startingIndex++] = value[11];
        array[startingIndex++] = value[12];
        array[startingIndex++] = value[13];
        array[startingIndex++] = value[14];
        array[startingIndex] = value[15];

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Matrix4} [result] The object into which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     */
    Matrix4.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Matrix4();
        }

        result[0] = array[startingIndex++];
        result[1] = array[startingIndex++];
        result[2] = array[startingIndex++];
        result[3] = array[startingIndex++];
        result[4] = array[startingIndex++];
        result[5] = array[startingIndex++];
        result[6] = array[startingIndex++];
        result[7] = array[startingIndex++];
        result[8] = array[startingIndex++];
        result[9] = array[startingIndex++];
        result[10] = array[startingIndex++];
        result[11] = array[startingIndex++];
        result[12] = array[startingIndex++];
        result[13] = array[startingIndex++];
        result[14] = array[startingIndex++];
        result[15] = array[startingIndex];
        return result;
    };

    /**
     * Duplicates a Matrix4 instance.
     *
     * @param {Matrix4} matrix The matrix to duplicate.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided. (Returns undefined if matrix is undefined)
     */
    Matrix4.clone = function(matrix, result) {
        if (!defined(matrix)) {
            return undefined;
        }
        if (!defined(result)) {
            return new Matrix4(matrix[0], matrix[4], matrix[8], matrix[12],
                               matrix[1], matrix[5], matrix[9], matrix[13],
                               matrix[2], matrix[6], matrix[10], matrix[14],
                               matrix[3], matrix[7], matrix[11], matrix[15]);
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Creates a Matrix4 from 16 consecutive elements in an array.
     * @function
     *
     * @param {Number[]} array The array whose 16 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @example
     * // Create the Matrix4:
     * // [1.0, 2.0, 3.0, 4.0]
     * // [1.0, 2.0, 3.0, 4.0]
     * // [1.0, 2.0, 3.0, 4.0]
     * // [1.0, 2.0, 3.0, 4.0]
     *
     * var v = [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
     * var m = Cesium.Matrix4.fromArray(v);
     *
     * // Create same Matrix4 with using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
     * var m2 = Cesium.Matrix4.fromArray(v2, 2);
     */
    Matrix4.fromArray = Matrix4.unpack;

    /**
     * Computes a Matrix4 instance from a column-major order array.
     *
     * @param {Number[]} values The column-major order array.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromColumnMajorArray = function(values, result) {
                Check.defined('values', values);
        
        return Matrix4.clone(values, result);
    };

    /**
     * Computes a Matrix4 instance from a row-major order array.
     * The resulting matrix will be in column-major order.
     *
     * @param {Number[]} values The row-major order array.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromRowMajorArray = function(values, result) {
                Check.defined('values', values);
        
        if (!defined(result)) {
            return new Matrix4(values[0], values[1], values[2], values[3],
                               values[4], values[5], values[6], values[7],
                               values[8], values[9], values[10], values[11],
                               values[12], values[13], values[14], values[15]);
        }
        result[0] = values[0];
        result[1] = values[4];
        result[2] = values[8];
        result[3] = values[12];
        result[4] = values[1];
        result[5] = values[5];
        result[6] = values[9];
        result[7] = values[13];
        result[8] = values[2];
        result[9] = values[6];
        result[10] = values[10];
        result[11] = values[14];
        result[12] = values[3];
        result[13] = values[7];
        result[14] = values[11];
        result[15] = values[15];
        return result;
    };

    /**
     * Computes a Matrix4 instance from a Matrix3 representing the rotation
     * and a Cartesian3 representing the translation.
     *
     * @param {Matrix3} rotation The upper left portion of the matrix representing the rotation.
     * @param {Cartesian3} [translation=Cartesian3.ZERO] The upper right portion of the matrix representing the translation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromRotationTranslation = function(rotation, translation, result) {
                Check.typeOf.object('rotation', rotation);
        
        translation = defaultValue(translation, Cartesian3.ZERO);

        if (!defined(result)) {
            return new Matrix4(rotation[0], rotation[3], rotation[6], translation.x,
                               rotation[1], rotation[4], rotation[7], translation.y,
                               rotation[2], rotation[5], rotation[8], translation.z,
                                       0.0,         0.0,         0.0,           1.0);
        }

        result[0] = rotation[0];
        result[1] = rotation[1];
        result[2] = rotation[2];
        result[3] = 0.0;
        result[4] = rotation[3];
        result[5] = rotation[4];
        result[6] = rotation[5];
        result[7] = 0.0;
        result[8] = rotation[6];
        result[9] = rotation[7];
        result[10] = rotation[8];
        result[11] = 0.0;
        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance from a translation, rotation, and scale (TRS)
     * representation with the rotation represented as a quaternion.
     *
     * @param {Cartesian3} translation The translation transformation.
     * @param {Quaternion} rotation The rotation transformation.
     * @param {Cartesian3} scale The non-uniform scale transformation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @example
     * var result = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
     *   new Cesium.Cartesian3(1.0, 2.0, 3.0), // translation
     *   Cesium.Quaternion.IDENTITY,           // rotation
     *   new Cesium.Cartesian3(7.0, 8.0, 9.0), // scale
     *   result);
     */
    Matrix4.fromTranslationQuaternionRotationScale = function(translation, rotation, scale, result) {
                Check.typeOf.object('translation', translation);
        Check.typeOf.object('rotation', rotation);
        Check.typeOf.object('scale', scale);
        
        if (!defined(result)) {
            result = new Matrix4();
        }

        var scaleX = scale.x;
        var scaleY = scale.y;
        var scaleZ = scale.z;

        var x2 = rotation.x * rotation.x;
        var xy = rotation.x * rotation.y;
        var xz = rotation.x * rotation.z;
        var xw = rotation.x * rotation.w;
        var y2 = rotation.y * rotation.y;
        var yz = rotation.y * rotation.z;
        var yw = rotation.y * rotation.w;
        var z2 = rotation.z * rotation.z;
        var zw = rotation.z * rotation.w;
        var w2 = rotation.w * rotation.w;

        var m00 = x2 - y2 - z2 + w2;
        var m01 = 2.0 * (xy - zw);
        var m02 = 2.0 * (xz + yw);

        var m10 = 2.0 * (xy + zw);
        var m11 = -x2 + y2 - z2 + w2;
        var m12 = 2.0 * (yz - xw);

        var m20 = 2.0 * (xz - yw);
        var m21 = 2.0 * (yz + xw);
        var m22 = -x2 - y2 + z2 + w2;

        result[0]  = m00 * scaleX;
        result[1]  = m10 * scaleX;
        result[2]  = m20 * scaleX;
        result[3]  = 0.0;
        result[4]  = m01 * scaleY;
        result[5]  = m11 * scaleY;
        result[6]  = m21 * scaleY;
        result[7]  = 0.0;
        result[8]  = m02 * scaleZ;
        result[9]  = m12 * scaleZ;
        result[10] = m22 * scaleZ;
        result[11] = 0.0;
        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = 1.0;

        return result;
    };

    /**
     * Creates a Matrix4 instance from a {@link TranslationRotationScale} instance.
     *
     * @param {TranslationRotationScale} translationRotationScale The instance.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromTranslationRotationScale = function(translationRotationScale, result) {
                Check.typeOf.object('translationRotationScale', translationRotationScale);
        
        return Matrix4.fromTranslationQuaternionRotationScale(translationRotationScale.translation, translationRotationScale.rotation, translationRotationScale.scale, result);
    };

    /**
     * Creates a Matrix4 instance from a Cartesian3 representing the translation.
     *
     * @param {Cartesian3} translation The upper right portion of the matrix representing the translation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @see Matrix4.multiplyByTranslation
     */
    Matrix4.fromTranslation = function(translation, result) {
                Check.typeOf.object('translation', translation);
        
        return Matrix4.fromRotationTranslation(Matrix3.IDENTITY, translation, result);
    };

    /**
     * Computes a Matrix4 instance representing a non-uniform scale.
     *
     * @param {Cartesian3} scale The x, y, and z scale factors.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [7.0, 0.0, 0.0, 0.0]
     * //   [0.0, 8.0, 0.0, 0.0]
     * //   [0.0, 0.0, 9.0, 0.0]
     * //   [0.0, 0.0, 0.0, 1.0]
     * var m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
     */
    Matrix4.fromScale = function(scale, result) {
                Check.typeOf.object('scale', scale);
        
        if (!defined(result)) {
            return new Matrix4(
                scale.x, 0.0,     0.0,     0.0,
                0.0,     scale.y, 0.0,     0.0,
                0.0,     0.0,     scale.z, 0.0,
                0.0,     0.0,     0.0,     1.0);
        }

        result[0] = scale.x;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = scale.y;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = scale.z;
        result[11] = 0.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = 0.0;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing a uniform scale.
     *
     * @param {Number} scale The uniform scale factor.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [2.0, 0.0, 0.0, 0.0]
     * //   [0.0, 2.0, 0.0, 0.0]
     * //   [0.0, 0.0, 2.0, 0.0]
     * //   [0.0, 0.0, 0.0, 1.0]
     * var m = Cesium.Matrix4.fromUniformScale(2.0);
     */
    Matrix4.fromUniformScale = function(scale, result) {
                Check.typeOf.number('scale', scale);
        
        if (!defined(result)) {
            return new Matrix4(scale, 0.0,   0.0,   0.0,
                               0.0,   scale, 0.0,   0.0,
                               0.0,   0.0,   scale, 0.0,
                               0.0,   0.0,   0.0,   1.0);
        }

        result[0] = scale;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = scale;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = scale;
        result[11] = 0.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = 0.0;
        result[15] = 1.0;
        return result;
    };

    var fromCameraF = new Cartesian3();
    var fromCameraR = new Cartesian3();
    var fromCameraU = new Cartesian3();

    /**
     * Computes a Matrix4 instance from a Camera.
     *
     * @param {Camera} camera The camera to use.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromCamera = function(camera, result) {
                Check.typeOf.object('camera', camera);
        
        var position = camera.position;
        var direction = camera.direction;
        var up = camera.up;

                Check.typeOf.object('camera.position', position);
        Check.typeOf.object('camera.direction', direction);
        Check.typeOf.object('camera.up', up);
        
        Cartesian3.normalize(direction, fromCameraF);
        Cartesian3.normalize(Cartesian3.cross(fromCameraF, up, fromCameraR), fromCameraR);
        Cartesian3.normalize(Cartesian3.cross(fromCameraR, fromCameraF, fromCameraU), fromCameraU);

        var sX = fromCameraR.x;
        var sY = fromCameraR.y;
        var sZ = fromCameraR.z;
        var fX = fromCameraF.x;
        var fY = fromCameraF.y;
        var fZ = fromCameraF.z;
        var uX = fromCameraU.x;
        var uY = fromCameraU.y;
        var uZ = fromCameraU.z;
        var positionX = position.x;
        var positionY = position.y;
        var positionZ = position.z;
        var t0 = sX * -positionX + sY * -positionY+ sZ * -positionZ;
        var t1 = uX * -positionX + uY * -positionY+ uZ * -positionZ;
        var t2 = fX * positionX + fY * positionY + fZ * positionZ;

        // The code below this comment is an optimized
        // version of the commented lines.
        // Rather that create two matrices and then multiply,
        // we just bake in the multiplcation as part of creation.
        // var rotation = new Matrix4(
        //                 sX,  sY,  sZ, 0.0,
        //                 uX,  uY,  uZ, 0.0,
        //                -fX, -fY, -fZ, 0.0,
        //                 0.0,  0.0,  0.0, 1.0);
        // var translation = new Matrix4(
        //                 1.0, 0.0, 0.0, -position.x,
        //                 0.0, 1.0, 0.0, -position.y,
        //                 0.0, 0.0, 1.0, -position.z,
        //                 0.0, 0.0, 0.0, 1.0);
        // return rotation.multiply(translation);
        if (!defined(result)) {
            return new Matrix4(
                    sX,   sY,  sZ, t0,
                    uX,   uY,  uZ, t1,
                   -fX,  -fY, -fZ, t2,
                    0.0, 0.0, 0.0, 1.0);
        }
        result[0] = sX;
        result[1] = uX;
        result[2] = -fX;
        result[3] = 0.0;
        result[4] = sY;
        result[5] = uY;
        result[6] = -fY;
        result[7] = 0.0;
        result[8] = sZ;
        result[9] = uZ;
        result[10] = -fZ;
        result[11] = 0.0;
        result[12] = t0;
        result[13] = t1;
        result[14] = t2;
        result[15] = 1.0;
        return result;
    };

     /**
      * Computes a Matrix4 instance representing a perspective transformation matrix.
      *
      * @param {Number} fovY The field of view along the Y axis in radians.
      * @param {Number} aspectRatio The aspect ratio.
      * @param {Number} near The distance to the near plane in meters.
      * @param {Number} far The distance to the far plane in meters.
      * @param {Matrix4} result The object in which the result will be stored.
      * @returns {Matrix4} The modified result parameter.
      *
      * @exception {DeveloperError} fovY must be in (0, PI].
      * @exception {DeveloperError} aspectRatio must be greater than zero.
      * @exception {DeveloperError} near must be greater than zero.
      * @exception {DeveloperError} far must be greater than zero.
      */
    Matrix4.computePerspectiveFieldOfView = function(fovY, aspectRatio, near, far, result) {
                Check.typeOf.number.greaterThan('fovY', fovY, 0.0);
        Check.typeOf.number.lessThan('fovY', fovY, Math.PI);
        Check.typeOf.number.greaterThan('near', near, 0.0);
        Check.typeOf.number.greaterThan('far', far, 0.0);
        Check.typeOf.object('result', result);
        
        var bottom = Math.tan(fovY * 0.5);

        var column1Row1 = 1.0 / bottom;
        var column0Row0 = column1Row1 / aspectRatio;
        var column2Row2 = (far + near) / (near - far);
        var column3Row2 = (2.0 * far * near) / (near - far);

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = column2Row2;
        result[11] = -1.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
    * Computes a Matrix4 instance representing an orthographic transformation matrix.
    *
    * @param {Number} left The number of meters to the left of the camera that will be in view.
    * @param {Number} right The number of meters to the right of the camera that will be in view.
    * @param {Number} bottom The number of meters below of the camera that will be in view.
    * @param {Number} top The number of meters above of the camera that will be in view.
    * @param {Number} near The distance to the near plane in meters.
    * @param {Number} far The distance to the far plane in meters.
    * @param {Matrix4} result The object in which the result will be stored.
    * @returns {Matrix4} The modified result parameter.
    */
    Matrix4.computeOrthographicOffCenter = function(left, right, bottom, top, near, far, result) {
                Check.typeOf.number('left', left);
        Check.typeOf.number('right', right);
        Check.typeOf.number('bottom', bottom);
        Check.typeOf.number('top', top);
        Check.typeOf.number('near', near);
        Check.typeOf.number('far', far);
        Check.typeOf.object('result', result);
        
        var a = 1.0 / (right - left);
        var b = 1.0 / (top - bottom);
        var c = 1.0 / (far - near);

        var tx = -(right + left) * a;
        var ty = -(top + bottom) * b;
        var tz = -(far + near) * c;
        a *= 2.0;
        b *= 2.0;
        c *= -2.0;

        result[0] = a;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = b;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = c;
        result[11] = 0.0;
        result[12] = tx;
        result[13] = ty;
        result[14] = tz;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing an off center perspective transformation.
     *
     * @param {Number} left The number of meters to the left of the camera that will be in view.
     * @param {Number} right The number of meters to the right of the camera that will be in view.
     * @param {Number} bottom The number of meters below of the camera that will be in view.
     * @param {Number} top The number of meters above of the camera that will be in view.
     * @param {Number} near The distance to the near plane in meters.
     * @param {Number} far The distance to the far plane in meters.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.computePerspectiveOffCenter = function(left, right, bottom, top, near, far, result) {
                Check.typeOf.number('left', left);
        Check.typeOf.number('right', right);
        Check.typeOf.number('bottom', bottom);
        Check.typeOf.number('top', top);
        Check.typeOf.number('near', near);
        Check.typeOf.number('far', far);
        Check.typeOf.object('result', result);
        
        var column0Row0 = 2.0 * near / (right - left);
        var column1Row1 = 2.0 * near / (top - bottom);
        var column2Row0 = (right + left) / (right - left);
        var column2Row1 = (top + bottom) / (top - bottom);
        var column2Row2 = -(far + near) / (far - near);
        var column2Row3 = -1.0;
        var column3Row2 = -2.0 * far * near / (far - near);

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing an infinite off center perspective transformation.
     *
     * @param {Number} left The number of meters to the left of the camera that will be in view.
     * @param {Number} right The number of meters to the right of the camera that will be in view.
     * @param {Number} bottom The number of meters below of the camera that will be in view.
     * @param {Number} top The number of meters above of the camera that will be in view.
     * @param {Number} near The distance to the near plane in meters.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.computeInfinitePerspectiveOffCenter = function(left, right, bottom, top, near, result) {
                Check.typeOf.number('left', left);
        Check.typeOf.number('right', right);
        Check.typeOf.number('bottom', bottom);
        Check.typeOf.number('top', top);
        Check.typeOf.number('near', near);
        Check.typeOf.object('result', result);
        
        var column0Row0 = 2.0 * near / (right - left);
        var column1Row1 = 2.0 * near / (top - bottom);
        var column2Row0 = (right + left) / (right - left);
        var column2Row1 = (top + bottom) / (top - bottom);
        var column2Row2 = -1.0;
        var column2Row3 = -1.0;
        var column3Row2 = -2.0 * near;

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance that transforms from normalized device coordinates to window coordinates.
     *
     * @param {Object}[viewport = { x : 0.0, y : 0.0, width : 0.0, height : 0.0 }] The viewport's corners as shown in Example 1.
     * @param {Number}[nearDepthRange=0.0] The near plane distance in window coordinates.
     * @param {Number}[farDepthRange=1.0] The far plane distance in window coordinates.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * // Create viewport transformation using an explicit viewport and depth range.
     * var m = Cesium.Matrix4.computeViewportTransformation({
     *     x : 0.0,
     *     y : 0.0,
     *     width : 1024.0,
     *     height : 768.0
     * }, 0.0, 1.0, new Cesium.Matrix4());
     */
    Matrix4.computeViewportTransformation = function(viewport, nearDepthRange, farDepthRange, result) {
                Check.typeOf.object('result', result);
        
        viewport = defaultValue(viewport, defaultValue.EMPTY_OBJECT);
        var x = defaultValue(viewport.x, 0.0);
        var y = defaultValue(viewport.y, 0.0);
        var width = defaultValue(viewport.width, 0.0);
        var height = defaultValue(viewport.height, 0.0);
        nearDepthRange = defaultValue(nearDepthRange, 0.0);
        farDepthRange = defaultValue(farDepthRange, 1.0);

        var halfWidth = width * 0.5;
        var halfHeight = height * 0.5;
        var halfDepth = (farDepthRange - nearDepthRange) * 0.5;

        var column0Row0 = halfWidth;
        var column1Row1 = halfHeight;
        var column2Row2 = halfDepth;
        var column3Row0 = x + halfWidth;
        var column3Row1 = y + halfHeight;
        var column3Row2 = nearDepthRange + halfDepth;
        var column3Row3 = 1.0;

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = column3Row3;
        return result;
    };

    /**
     * Computes a Matrix4 instance that transforms from world space to view space.
     *
     * @param {Cartesian3} position The position of the camera.
     * @param {Cartesian3} direction The forward direction.
     * @param {Cartesian3} up The up direction.
     * @param {Cartesian3} right The right direction.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.computeView = function(position, direction, up, right, result) {
                Check.typeOf.object('position', position);
        Check.typeOf.object('direction', direction);
        Check.typeOf.object('up', up);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result[0] = right.x;
        result[1] = up.x;
        result[2] = -direction.x;
        result[3] = 0.0;
        result[4] = right.y;
        result[5] = up.y;
        result[6] = -direction.y;
        result[7] = 0.0;
        result[8] = right.z;
        result[9] = up.z;
        result[10] = -direction.z;
        result[11] = 0.0;
        result[12] = -Cartesian3.dot(right, position);
        result[13] = -Cartesian3.dot(up, position);
        result[14] = Cartesian3.dot(direction, position);
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes an Array from the provided Matrix4 instance.
     * The array will be in column-major order.
     *
     * @param {Matrix4} matrix The matrix to use..
     * @param {Number[]} [result] The Array onto which to store the result.
     * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
     *
     * @example
     * //create an array from an instance of Matrix4
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     * var a = Cesium.Matrix4.toArray(m);
     *
     * // m remains the same
     * //creates a = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]
     */
    Matrix4.toArray = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        
        if (!defined(result)) {
            return [matrix[0], matrix[1], matrix[2], matrix[3],
                    matrix[4], matrix[5], matrix[6], matrix[7],
                    matrix[8], matrix[9], matrix[10], matrix[11],
                    matrix[12], matrix[13], matrix[14], matrix[15]];
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Computes the array index of the element at the provided row and column.
     *
     * @param {Number} row The zero-based index of the row.
     * @param {Number} column The zero-based index of the column.
     * @returns {Number} The index of the element at the provided row and column.
     *
     * @exception {DeveloperError} row must be 0, 1, 2, or 3.
     * @exception {DeveloperError} column must be 0, 1, 2, or 3.
     *
     * @example
     * var myMatrix = new Cesium.Matrix4();
     * var column1Row0Index = Cesium.Matrix4.getElementIndex(1, 0);
     * var column1Row0 = myMatrix[column1Row0Index];
     * myMatrix[column1Row0Index] = 10.0;
     */
    Matrix4.getElementIndex = function(column, row) {
                Check.typeOf.number.greaterThanOrEquals('row', row, 0);
        Check.typeOf.number.lessThanOrEquals('row', row, 3);

        Check.typeOf.number.greaterThanOrEquals('column', column, 0);
        Check.typeOf.number.lessThanOrEquals('column', column, 3);
        
        return column * 4 + row;
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //returns a Cartesian4 instance with values from the specified column
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * //Example 1: Creates an instance of Cartesian
     * var a = Cesium.Matrix4.getColumn(m, 2, new Cesium.Cartesian4());
     *
     * @example
     * //Example 2: Sets values for Cartesian instance
     * var a = new Cesium.Cartesian4();
     * Cesium.Matrix4.getColumn(m, 2, a);
     *
     * // a.x = 12.0; a.y = 16.0; a.z = 20.0; a.w = 24.0;
     */
    Matrix4.getColumn = function(matrix, index, result) {
                Check.typeOf.object('matrix', matrix);

        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.typeOf.object('result', result);
        
        var startIndex = index * 4;
        var x = matrix[startIndex];
        var y = matrix[startIndex + 1];
        var z = matrix[startIndex + 2];
        var w = matrix[startIndex + 3];

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified column.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //creates a new Matrix4 instance with new column values from the Cartesian4 instance
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.setColumn(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [10.0, 11.0, 99.0, 13.0]
     * //     [14.0, 15.0, 98.0, 17.0]
     * //     [18.0, 19.0, 97.0, 21.0]
     * //     [22.0, 23.0, 96.0, 25.0]
     */
    Matrix4.setColumn = function(matrix, index, cartesian, result) {
                Check.typeOf.object('matrix', matrix);

        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result = Matrix4.clone(matrix, result);
        var startIndex = index * 4;
        result[startIndex] = cartesian.x;
        result[startIndex + 1] = cartesian.y;
        result[startIndex + 2] = cartesian.z;
        result[startIndex + 3] = cartesian.w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the translation in the rightmost column of the provided
     * matrix with the provided translation.  This assumes the matrix is an affine transformation
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Cartesian3} translation The translation that replaces the translation of the provided matrix.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.setTranslation = function(matrix, translation, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('translation', translation);
        Check.typeOf.object('result', result);
        
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];

        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];

        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];

        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = matrix[15];

        return result;
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //returns a Cartesian4 instance with values from the specified column
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * //Example 1: Returns an instance of Cartesian
     * var a = Cesium.Matrix4.getRow(m, 2, new Cesium.Cartesian4());
     *
     * @example
     * //Example 2: Sets values for a Cartesian instance
     * var a = new Cesium.Cartesian4();
     * Cesium.Matrix4.getRow(m, 2, a);
     *
     * // a.x = 18.0; a.y = 19.0; a.z = 20.0; a.w = 21.0;
     */
    Matrix4.getRow = function(matrix, index, result) {
                Check.typeOf.object('matrix', matrix);

        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.typeOf.object('result', result);
        
        var x = matrix[index];
        var y = matrix[index + 4];
        var z = matrix[index + 8];
        var w = matrix[index + 12];

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified row.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //create a new Matrix4 instance with new row values from the Cartesian4 instance
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.setRow(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [99.0, 98.0, 97.0, 96.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     */
    Matrix4.setRow = function(matrix, index, cartesian, result) {
                Check.typeOf.object('matrix', matrix);

        Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        result = Matrix4.clone(matrix, result);
        result[index] = cartesian.x;
        result[index + 4] = cartesian.y;
        result[index + 8] = cartesian.z;
        result[index + 12] = cartesian.w;
        return result;
    };

    var scratchColumn = new Cartesian3();

    /**
     * Extracts the non-uniform scale assuming the matrix is an affine transformation.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter
     */
    Matrix4.getScale = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result.x = Cartesian3.magnitude(Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn));
        result.y = Cartesian3.magnitude(Cartesian3.fromElements(matrix[4], matrix[5], matrix[6], scratchColumn));
        result.z = Cartesian3.magnitude(Cartesian3.fromElements(matrix[8], matrix[9], matrix[10], scratchColumn));
        return result;
    };

    var scratchScale = new Cartesian3();

    /**
     * Computes the maximum scale assuming the matrix is an affine transformation.
     * The maximum scale is the maximum length of the column vectors in the upper-left
     * 3x3 matrix.
     *
     * @param {Matrix4} matrix The matrix.
     * @returns {Number} The maximum scale.
     */
    Matrix4.getMaximumScale = function(matrix) {
        Matrix4.getScale(matrix, scratchScale);
        return Cartesian3.maximumComponent(scratchScale);
    };

    /**
     * Computes the product of two matrices.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.multiply = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        var left0 = left[0];
        var left1 = left[1];
        var left2 = left[2];
        var left3 = left[3];
        var left4 = left[4];
        var left5 = left[5];
        var left6 = left[6];
        var left7 = left[7];
        var left8 = left[8];
        var left9 = left[9];
        var left10 = left[10];
        var left11 = left[11];
        var left12 = left[12];
        var left13 = left[13];
        var left14 = left[14];
        var left15 = left[15];

        var right0 = right[0];
        var right1 = right[1];
        var right2 = right[2];
        var right3 = right[3];
        var right4 = right[4];
        var right5 = right[5];
        var right6 = right[6];
        var right7 = right[7];
        var right8 = right[8];
        var right9 = right[9];
        var right10 = right[10];
        var right11 = right[11];
        var right12 = right[12];
        var right13 = right[13];
        var right14 = right[14];
        var right15 = right[15];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2 + left12 * right3;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2 + left13 * right3;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2 + left14 * right3;
        var column0Row3 = left3 * right0 + left7 * right1 + left11 * right2 + left15 * right3;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6 + left12 * right7;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6 + left13 * right7;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6 + left14 * right7;
        var column1Row3 = left3 * right4 + left7 * right5 + left11 * right6 + left15 * right7;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10 + left12 * right11;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10 + left13 * right11;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10 + left14 * right11;
        var column2Row3 = left3 * right8 + left7 * right9 + left11 * right10 + left15 * right11;

        var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12 * right15;
        var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13 * right15;
        var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14 * right15;
        var column3Row3 = left3 * right12 + left7 * right13 + left11 * right14 + left15 * right15;

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column0Row3;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = column1Row3;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = column3Row3;
        return result;
    };

    /**
     * Computes the sum of two matrices.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.add = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result[0] = left[0] + right[0];
        result[1] = left[1] + right[1];
        result[2] = left[2] + right[2];
        result[3] = left[3] + right[3];
        result[4] = left[4] + right[4];
        result[5] = left[5] + right[5];
        result[6] = left[6] + right[6];
        result[7] = left[7] + right[7];
        result[8] = left[8] + right[8];
        result[9] = left[9] + right[9];
        result[10] = left[10] + right[10];
        result[11] = left[11] + right[11];
        result[12] = left[12] + right[12];
        result[13] = left[13] + right[13];
        result[14] = left[14] + right[14];
        result[15] = left[15] + right[15];
        return result;
    };

    /**
     * Computes the difference of two matrices.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.subtract = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result[0] = left[0] - right[0];
        result[1] = left[1] - right[1];
        result[2] = left[2] - right[2];
        result[3] = left[3] - right[3];
        result[4] = left[4] - right[4];
        result[5] = left[5] - right[5];
        result[6] = left[6] - right[6];
        result[7] = left[7] - right[7];
        result[8] = left[8] - right[8];
        result[9] = left[9] - right[9];
        result[10] = left[10] - right[10];
        result[11] = left[11] - right[11];
        result[12] = left[12] - right[12];
        result[13] = left[13] - right[13];
        result[14] = left[14] - right[14];
        result[15] = left[15] - right[15];
        return result;
    };

    /**
     * Computes the product of two matrices assuming the matrices are
     * affine transformation matrices, where the upper left 3x3 elements
     * are a rotation matrix, and the upper three elements in the fourth
     * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     * This method is faster than computing the product for general 4x4
     * matrices using {@link Matrix4.multiply}.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * var m1 = new Cesium.Matrix4(1.0, 6.0, 7.0, 0.0, 2.0, 5.0, 8.0, 0.0, 3.0, 4.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0);
     * var m2 = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(1.0, 1.0, 1.0));
     * var m3 = Cesium.Matrix4.multiplyTransformation(m1, m2, new Cesium.Matrix4());
     */
    Matrix4.multiplyTransformation = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        var left0 = left[0];
        var left1 = left[1];
        var left2 = left[2];
        var left4 = left[4];
        var left5 = left[5];
        var left6 = left[6];
        var left8 = left[8];
        var left9 = left[9];
        var left10 = left[10];
        var left12 = left[12];
        var left13 = left[13];
        var left14 = left[14];

        var right0 = right[0];
        var right1 = right[1];
        var right2 = right[2];
        var right4 = right[4];
        var right5 = right[5];
        var right6 = right[6];
        var right8 = right[8];
        var right9 = right[9];
        var right10 = right[10];
        var right12 = right[12];
        var right13 = right[13];
        var right14 = right[14];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

        var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12;
        var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13;
        var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14;

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = 0.0;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = 1.0;
        return result;
    };

    /**
     * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by a 3x3 rotation matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromRotationTranslation(rotation), m);</code> with less allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The matrix on the left-hand side.
     * @param {Matrix3} rotation The 3x3 rotation matrix on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromRotationTranslation(rotation), m);
     * Cesium.Matrix4.multiplyByMatrix3(m, rotation, m);
     */
    Matrix4.multiplyByMatrix3 = function(matrix, rotation, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('rotation', rotation);
        Check.typeOf.object('result', result);
        
        var left0 = matrix[0];
        var left1 = matrix[1];
        var left2 = matrix[2];
        var left4 = matrix[4];
        var left5 = matrix[5];
        var left6 = matrix[6];
        var left8 = matrix[8];
        var left9 = matrix[9];
        var left10 = matrix[10];

        var right0 = rotation[0];
        var right1 = rotation[1];
        var right2 = rotation[2];
        var right4 = rotation[3];
        var right5 = rotation[4];
        var right6 = rotation[5];
        var right8 = rotation[6];
        var right9 = rotation[7];
        var right10 = rotation[8];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = 0.0;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit translation matrix defined by a {@link Cartesian3}.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromTranslation(position), m);</code> with less allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The matrix on the left-hand side.
     * @param {Cartesian3} translation The translation on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromTranslation(position), m);
     * Cesium.Matrix4.multiplyByTranslation(m, position, m);
     */
    Matrix4.multiplyByTranslation = function(matrix, translation, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('translation', translation);
        Check.typeOf.object('result', result);
        
        var x = translation.x;
        var y = translation.y;
        var z = translation.z;

        var tx = (x * matrix[0]) + (y * matrix[4]) + (z * matrix[8]) + matrix[12];
        var ty = (x * matrix[1]) + (y * matrix[5]) + (z * matrix[9]) + matrix[13];
        var tz = (x * matrix[2]) + (y * matrix[6]) + (z * matrix[10]) + matrix[14];

        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = tx;
        result[13] = ty;
        result[14] = tz;
        result[15] = matrix[15];
        return result;
    };

    var uniformScaleScratch = new Cartesian3();

    /**
     * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit uniform scale matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
     * <code>m</code> must be an affine matrix.
     * This function performs fewer allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The affine matrix on the left-hand side.
     * @param {Number} scale The uniform scale on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromUniformScale(scale), m);
     * Cesium.Matrix4.multiplyByUniformScale(m, scale, m);
     *
     * @see Matrix4.fromUniformScale
     * @see Matrix4.multiplyByScale
     */
    Matrix4.multiplyByUniformScale = function(matrix, scale, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number('scale', scale);
        Check.typeOf.object('result', result);
        
        uniformScaleScratch.x = scale;
        uniformScaleScratch.y = scale;
        uniformScaleScratch.z = scale;
        return Matrix4.multiplyByScale(matrix, uniformScaleScratch, result);
    };

    /**
     * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit non-uniform scale matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
     * <code>m</code> must be an affine matrix.
     * This function performs fewer allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The affine matrix on the left-hand side.
     * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromScale(scale), m);
     * Cesium.Matrix4.multiplyByScale(m, scale, m);
     *
     * @see Matrix4.fromScale
     * @see Matrix4.multiplyByUniformScale
     */
    Matrix4.multiplyByScale = function(matrix, scale, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('scale', scale);
        Check.typeOf.object('result', result);
        
        var scaleX = scale.x;
        var scaleY = scale.y;
        var scaleZ = scale.z;

        // Faster than Cartesian3.equals
        if ((scaleX === 1.0) && (scaleY === 1.0) && (scaleZ === 1.0)) {
            return Matrix4.clone(matrix, result);
        }

        result[0] = scaleX * matrix[0];
        result[1] = scaleX * matrix[1];
        result[2] = scaleX * matrix[2];
        result[3] = 0.0;
        result[4] = scaleY * matrix[4];
        result[5] = scaleY * matrix[5];
        result[6] = scaleY * matrix[6];
        result[7] = 0.0;
        result[8] = scaleZ * matrix[8];
        result[9] = scaleZ * matrix[9];
        result[10] = scaleZ * matrix[10];
        result[11] = 0.0;
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes the product of a matrix and a column vector.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian4} cartesian The vector.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Matrix4.multiplyByVector = function(matrix, cartesian, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;
        var vW = cartesian.w;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
        var w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes the product of a matrix and a {@link Cartesian3}.  This is equivalent to calling {@link Matrix4.multiplyByVector}
     * with a {@link Cartesian4} with a <code>w</code> component of zero.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} cartesian The point.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     *
     * @example
     * var p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
     * var result = Cesium.Matrix4.multiplyByPointAsVector(matrix, p, new Cesium.Cartesian3());
     * // A shortcut for
     * //   Cartesian3 p = ...
     * //   Cesium.Matrix4.multiplyByVector(matrix, new Cesium.Cartesian4(p.x, p.y, p.z, 0.0), result);
     */
    Matrix4.multiplyByPointAsVector = function(matrix, cartesian, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ;
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ;
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ;

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes the product of a matrix and a {@link Cartesian3}. This is equivalent to calling {@link Matrix4.multiplyByVector}
     * with a {@link Cartesian4} with a <code>w</code> component of 1, but returns a {@link Cartesian3} instead of a {@link Cartesian4}.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} cartesian The point.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     *
     * @example
     * var p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
     * var result = Cesium.Matrix4.multiplyByPoint(matrix, p, new Cesium.Cartesian3());
     */
    Matrix4.multiplyByPoint = function(matrix, cartesian, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12];
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13];
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14];

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes the product of a matrix and a scalar.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * //create a Matrix4 instance which is a scaled version of the supplied Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.multiplyByScalar(m, -2, new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [-20.0, -22.0, -24.0, -26.0]
     * //     [-28.0, -30.0, -32.0, -34.0]
     * //     [-36.0, -38.0, -40.0, -42.0]
     * //     [-44.0, -46.0, -48.0, -50.0]
     */
    Matrix4.multiplyByScalar = function(matrix, scalar, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result[0] = matrix[0] * scalar;
        result[1] = matrix[1] * scalar;
        result[2] = matrix[2] * scalar;
        result[3] = matrix[3] * scalar;
        result[4] = matrix[4] * scalar;
        result[5] = matrix[5] * scalar;
        result[6] = matrix[6] * scalar;
        result[7] = matrix[7] * scalar;
        result[8] = matrix[8] * scalar;
        result[9] = matrix[9] * scalar;
        result[10] = matrix[10] * scalar;
        result[11] = matrix[11] * scalar;
        result[12] = matrix[12] * scalar;
        result[13] = matrix[13] * scalar;
        result[14] = matrix[14] * scalar;
        result[15] = matrix[15] * scalar;
        return result;
    };

    /**
     * Computes a negated copy of the provided matrix.
     *
     * @param {Matrix4} matrix The matrix to negate.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * //create a new Matrix4 instance which is a negation of a Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.negate(m, new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [-10.0, -11.0, -12.0, -13.0]
     * //     [-14.0, -15.0, -16.0, -17.0]
     * //     [-18.0, -19.0, -20.0, -21.0]
     * //     [-22.0, -23.0, -24.0, -25.0]
     */
    Matrix4.negate = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result[0] = -matrix[0];
        result[1] = -matrix[1];
        result[2] = -matrix[2];
        result[3] = -matrix[3];
        result[4] = -matrix[4];
        result[5] = -matrix[5];
        result[6] = -matrix[6];
        result[7] = -matrix[7];
        result[8] = -matrix[8];
        result[9] = -matrix[9];
        result[10] = -matrix[10];
        result[11] = -matrix[11];
        result[12] = -matrix[12];
        result[13] = -matrix[13];
        result[14] = -matrix[14];
        result[15] = -matrix[15];
        return result;
    };

    /**
     * Computes the transpose of the provided matrix.
     *
     * @param {Matrix4} matrix The matrix to transpose.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * //returns transpose of a Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.transpose(m, new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     */
    Matrix4.transpose = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix3 = matrix[3];
        var matrix6 = matrix[6];
        var matrix7 = matrix[7];
        var matrix11 = matrix[11];

        result[0] = matrix[0];
        result[1] = matrix[4];
        result[2] = matrix[8];
        result[3] = matrix[12];
        result[4] = matrix1;
        result[5] = matrix[5];
        result[6] = matrix[9];
        result[7] = matrix[13];
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix[10];
        result[11] = matrix[14];
        result[12] = matrix3;
        result[13] = matrix7;
        result[14] = matrix11;
        result[15] = matrix[15];
        return result;
    };

    /**
     * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
     *
     * @param {Matrix4} matrix The matrix with signed elements.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.abs = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result[0] = Math.abs(matrix[0]);
        result[1] = Math.abs(matrix[1]);
        result[2] = Math.abs(matrix[2]);
        result[3] = Math.abs(matrix[3]);
        result[4] = Math.abs(matrix[4]);
        result[5] = Math.abs(matrix[5]);
        result[6] = Math.abs(matrix[6]);
        result[7] = Math.abs(matrix[7]);
        result[8] = Math.abs(matrix[8]);
        result[9] = Math.abs(matrix[9]);
        result[10] = Math.abs(matrix[10]);
        result[11] = Math.abs(matrix[11]);
        result[12] = Math.abs(matrix[12]);
        result[13] = Math.abs(matrix[13]);
        result[14] = Math.abs(matrix[14]);
        result[15] = Math.abs(matrix[15]);

        return result;
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Matrix4} [left] The first matrix.
     * @param {Matrix4} [right] The second matrix.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     *
     * @example
     * //compares two Matrix4 instances
     *
     * // a = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * // b = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * if(Cesium.Matrix4.equals(a,b)) {
     *      console.log("Both matrices are equal");
     * } else {
     *      console.log("They are not equal");
     * }
     *
     * //Prints "Both matrices are equal" on the console
     */
    Matrix4.equals = function(left, right) {
        // Given that most matrices will be transformation matrices, the elements
        // are tested in order such that the test is likely to fail as early
        // as possible.  I _think_ this is just as friendly to the L1 cache
        // as testing in index order.  It is certainty faster in practice.
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                // Translation
                left[12] === right[12] &&
                left[13] === right[13] &&
                left[14] === right[14] &&

                // Rotation/scale
                left[0] === right[0] &&
                left[1] === right[1] &&
                left[2] === right[2] &&
                left[4] === right[4] &&
                left[5] === right[5] &&
                left[6] === right[6] &&
                left[8] === right[8] &&
                left[9] === right[9] &&
                left[10] === right[10] &&

                // Bottom row
                left[3] === right[3] &&
                left[7] === right[7] &&
                left[11] === right[11] &&
                left[15] === right[15]);
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Matrix4} [left] The first matrix.
     * @param {Matrix4} [right] The second matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @example
     * //compares two Matrix4 instances
     *
     * // a = [10.5, 14.5, 18.5, 22.5]
     * //     [11.5, 15.5, 19.5, 23.5]
     * //     [12.5, 16.5, 20.5, 24.5]
     * //     [13.5, 17.5, 21.5, 25.5]
     *
     * // b = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * if(Cesium.Matrix4.equalsEpsilon(a,b,0.1)){
     *      console.log("Difference between both the matrices is less than 0.1");
     * } else {
     *      console.log("Difference between both the matrices is not less than 0.1");
     * }
     *
     * //Prints "Difference between both the matrices is not less than 0.1" on the console
     */
    Matrix4.equalsEpsilon = function(left, right, epsilon) {
                Check.typeOf.number('epsilon', epsilon);
        
        return (left === right) ||
                (defined(left) &&
                defined(right) &&
                Math.abs(left[0] - right[0]) <= epsilon &&
                Math.abs(left[1] - right[1]) <= epsilon &&
                Math.abs(left[2] - right[2]) <= epsilon &&
                Math.abs(left[3] - right[3]) <= epsilon &&
                Math.abs(left[4] - right[4]) <= epsilon &&
                Math.abs(left[5] - right[5]) <= epsilon &&
                Math.abs(left[6] - right[6]) <= epsilon &&
                Math.abs(left[7] - right[7]) <= epsilon &&
                Math.abs(left[8] - right[8]) <= epsilon &&
                Math.abs(left[9] - right[9]) <= epsilon &&
                Math.abs(left[10] - right[10]) <= epsilon &&
                Math.abs(left[11] - right[11]) <= epsilon &&
                Math.abs(left[12] - right[12]) <= epsilon &&
                Math.abs(left[13] - right[13]) <= epsilon &&
                Math.abs(left[14] - right[14]) <= epsilon &&
                Math.abs(left[15] - right[15]) <= epsilon);
    };

    /**
     * Gets the translation portion of the provided matrix, assuming the matrix is a affine transformation matrix.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Matrix4.getTranslation = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result.x = matrix[12];
        result.y = matrix[13];
        result.z = matrix[14];
        return result;
    };

    /**
     * Gets the upper left 3x3 rotation matrix of the provided matrix, assuming the matrix is a affine transformation matrix.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     * @example
     * // returns a Matrix3 instance from a Matrix4 instance
     *
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * var b = new Cesium.Matrix3();
     * Cesium.Matrix4.getRotation(m,b);
     *
     * // b = [10.0, 14.0, 18.0]
     * //     [11.0, 15.0, 19.0]
     * //     [12.0, 16.0, 20.0]
     */
    Matrix4.getRotation = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[4];
        result[4] = matrix[5];
        result[5] = matrix[6];
        result[6] = matrix[8];
        result[7] = matrix[9];
        result[8] = matrix[10];
        return result;
    };

    var scratchInverseRotation = new Matrix3();
    var scratchMatrix3Zero = new Matrix3();
    var scratchBottomRow = new Cartesian4();
    var scratchExpectedBottomRow = new Cartesian4(0.0, 0.0, 0.0, 1.0);

     /**
      * Computes the inverse of the provided matrix using Cramers Rule.
      * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
      * If the matrix is an affine transformation matrix, it is more efficient
      * to invert it with {@link Matrix4.inverseTransformation}.
      *
      * @param {Matrix4} matrix The matrix to invert.
      * @param {Matrix4} result The object onto which to store the result.
      * @returns {Matrix4} The modified result parameter.
      *
      * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
      */
    Matrix4.inverse = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        // Special case for a zero scale matrix that can occur, for example,
        // when a model's node has a [0, 0, 0] scale.
        if (Matrix3.equalsEpsilon(Matrix4.getRotation(matrix, scratchInverseRotation), scratchMatrix3Zero, CesiumMath.EPSILON7) &&
            Cartesian4.equals(Matrix4.getRow(matrix, 3, scratchBottomRow), scratchExpectedBottomRow)) {

            result[0] = 0.0;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = 0.0;
            result[4] = 0.0;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = 0.0;
            result[9] = 0.0;
            result[10] = 0.0;
            result[11] = 0.0;
            result[12] = -matrix[12];
            result[13] = -matrix[13];
            result[14] = -matrix[14];
            result[15] = 1.0;
            return result;
        }

        //
        // Ported from:
        //   ftp://download.intel.com/design/PentiumIII/sml/24504301.pdf
        //
        var src0 = matrix[0];
        var src1 = matrix[4];
        var src2 = matrix[8];
        var src3 = matrix[12];
        var src4 = matrix[1];
        var src5 = matrix[5];
        var src6 = matrix[9];
        var src7 = matrix[13];
        var src8 = matrix[2];
        var src9 = matrix[6];
        var src10 = matrix[10];
        var src11 = matrix[14];
        var src12 = matrix[3];
        var src13 = matrix[7];
        var src14 = matrix[11];
        var src15 = matrix[15];

        // calculate pairs for first 8 elements (cofactors)
        var tmp0 = src10 * src15;
        var tmp1 = src11 * src14;
        var tmp2 = src9 * src15;
        var tmp3 = src11 * src13;
        var tmp4 = src9 * src14;
        var tmp5 = src10 * src13;
        var tmp6 = src8 * src15;
        var tmp7 = src11 * src12;
        var tmp8 = src8 * src14;
        var tmp9 = src10 * src12;
        var tmp10 = src8 * src13;
        var tmp11 = src9 * src12;

        // calculate first 8 elements (cofactors)
        var dst0 = (tmp0 * src5 + tmp3 * src6 + tmp4 * src7) - (tmp1 * src5 + tmp2 * src6 + tmp5 * src7);
        var dst1 = (tmp1 * src4 + tmp6 * src6 + tmp9 * src7) - (tmp0 * src4 + tmp7 * src6 + tmp8 * src7);
        var dst2 = (tmp2 * src4 + tmp7 * src5 + tmp10 * src7) - (tmp3 * src4 + tmp6 * src5 + tmp11 * src7);
        var dst3 = (tmp5 * src4 + tmp8 * src5 + tmp11 * src6) - (tmp4 * src4 + tmp9 * src5 + tmp10 * src6);
        var dst4 = (tmp1 * src1 + tmp2 * src2 + tmp5 * src3) - (tmp0 * src1 + tmp3 * src2 + tmp4 * src3);
        var dst5 = (tmp0 * src0 + tmp7 * src2 + tmp8 * src3) - (tmp1 * src0 + tmp6 * src2 + tmp9 * src3);
        var dst6 = (tmp3 * src0 + tmp6 * src1 + tmp11 * src3) - (tmp2 * src0 + tmp7 * src1 + tmp10 * src3);
        var dst7 = (tmp4 * src0 + tmp9 * src1 + tmp10 * src2) - (tmp5 * src0 + tmp8 * src1 + tmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        tmp0 = src2 * src7;
        tmp1 = src3 * src6;
        tmp2 = src1 * src7;
        tmp3 = src3 * src5;
        tmp4 = src1 * src6;
        tmp5 = src2 * src5;
        tmp6 = src0 * src7;
        tmp7 = src3 * src4;
        tmp8 = src0 * src6;
        tmp9 = src2 * src4;
        tmp10 = src0 * src5;
        tmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        var dst8 = (tmp0 * src13 + tmp3 * src14 + tmp4 * src15) - (tmp1 * src13 + tmp2 * src14 + tmp5 * src15);
        var dst9 = (tmp1 * src12 + tmp6 * src14 + tmp9 * src15) - (tmp0 * src12 + tmp7 * src14 + tmp8 * src15);
        var dst10 = (tmp2 * src12 + tmp7 * src13 + tmp10 * src15) - (tmp3 * src12 + tmp6 * src13 + tmp11 * src15);
        var dst11 = (tmp5 * src12 + tmp8 * src13 + tmp11 * src14) - (tmp4 * src12 + tmp9 * src13 + tmp10 * src14);
        var dst12 = (tmp2 * src10 + tmp5 * src11 + tmp1 * src9) - (tmp4 * src11 + tmp0 * src9 + tmp3 * src10);
        var dst13 = (tmp8 * src11 + tmp0 * src8 + tmp7 * src10) - (tmp6 * src10 + tmp9 * src11 + tmp1 * src8);
        var dst14 = (tmp6 * src9 + tmp11 * src11 + tmp3 * src8) - (tmp10 * src11 + tmp2 * src8 + tmp7 * src9);
        var dst15 = (tmp10 * src10 + tmp4 * src8 + tmp9 * src9) - (tmp8 * src9 + tmp11 * src10 + tmp5 * src8);

        // calculate determinant
        var det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

        if (Math.abs(det) < CesiumMath.EPSILON20) {
            throw new RuntimeError('matrix is not invertible because its determinate is zero.');
        }

        // calculate matrix inverse
        det = 1.0 / det;

        result[0] = dst0 * det;
        result[1] = dst1 * det;
        result[2] = dst2 * det;
        result[3] = dst3 * det;
        result[4] = dst4 * det;
        result[5] = dst5 * det;
        result[6] = dst6 * det;
        result[7] = dst7 * det;
        result[8] = dst8 * det;
        result[9] = dst9 * det;
        result[10] = dst10 * det;
        result[11] = dst11 * det;
        result[12] = dst12 * det;
        result[13] = dst13 * det;
        result[14] = dst14 * det;
        result[15] = dst15 * det;
        return result;
    };

    /**
     * Computes the inverse of the provided matrix assuming it is
     * an affine transformation matrix, where the upper left 3x3 elements
     * are a rotation matrix, and the upper three elements in the fourth
     * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     * This method is faster than computing the inverse for a general 4x4
     * matrix using {@link Matrix4.inverse}.
     *
     * @param {Matrix4} matrix The matrix to invert.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.inverseTransformation = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        Check.typeOf.object('result', result);
        
        //This function is an optimized version of the below 4 lines.
        //var rT = Matrix3.transpose(Matrix4.getRotation(matrix));
        //var rTN = Matrix3.negate(rT);
        //var rTT = Matrix3.multiplyByVector(rTN, Matrix4.getTranslation(matrix));
        //return Matrix4.fromRotationTranslation(rT, rTT, result);

        var matrix0 = matrix[0];
        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix4 = matrix[4];
        var matrix5 = matrix[5];
        var matrix6 = matrix[6];
        var matrix8 = matrix[8];
        var matrix9 = matrix[9];
        var matrix10 = matrix[10];

        var vX = matrix[12];
        var vY = matrix[13];
        var vZ = matrix[14];

        var x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
        var y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
        var z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

        result[0] = matrix0;
        result[1] = matrix4;
        result[2] = matrix8;
        result[3] = 0.0;
        result[4] = matrix1;
        result[5] = matrix5;
        result[6] = matrix9;
        result[7] = 0.0;
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix10;
        result[11] = 0.0;
        result[12] = x;
        result[13] = y;
        result[14] = z;
        result[15] = 1.0;
        return result;
    };

    /**
     * An immutable Matrix4 instance initialized to the identity matrix.
     *
     * @type {Matrix4}
     * @constant
     */
    Matrix4.IDENTITY = freezeObject(new Matrix4(1.0, 0.0, 0.0, 0.0,
                                                0.0, 1.0, 0.0, 0.0,
                                                0.0, 0.0, 1.0, 0.0,
                                                0.0, 0.0, 0.0, 1.0));

    /**
     * An immutable Matrix4 instance initialized to the zero matrix.
     *
     * @type {Matrix4}
     * @constant
     */
    Matrix4.ZERO = freezeObject(new Matrix4(0.0, 0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0, 0.0));

    /**
     * The index into Matrix4 for column 0, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW0 = 0;

    /**
     * The index into Matrix4 for column 0, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW1 = 1;

    /**
     * The index into Matrix4 for column 0, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW2 = 2;

    /**
     * The index into Matrix4 for column 0, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW3 = 3;

    /**
     * The index into Matrix4 for column 1, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW0 = 4;

    /**
     * The index into Matrix4 for column 1, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW1 = 5;

    /**
     * The index into Matrix4 for column 1, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW2 = 6;

    /**
     * The index into Matrix4 for column 1, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW3 = 7;

    /**
     * The index into Matrix4 for column 2, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW0 = 8;

    /**
     * The index into Matrix4 for column 2, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW1 = 9;

    /**
     * The index into Matrix4 for column 2, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW2 = 10;

    /**
     * The index into Matrix4 for column 2, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW3 = 11;

    /**
     * The index into Matrix4 for column 3, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW0 = 12;

    /**
     * The index into Matrix4 for column 3, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW1 = 13;

    /**
     * The index into Matrix4 for column 3, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW2 = 14;

    /**
     * The index into Matrix4 for column 3, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW3 = 15;

    defineProperties(Matrix4.prototype, {
        /**
         * Gets the number of items in the collection.
         * @memberof Matrix4.prototype
         *
         * @type {Number}
         */
        length : {
            get : function() {
                return Matrix4.packedLength;
            }
        }
    });

    /**
     * Duplicates the provided Matrix4 instance.
     *
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     */
    Matrix4.prototype.clone = function(result) {
        return Matrix4.clone(this, result);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Matrix4} [right] The right hand side matrix.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Matrix4.prototype.equals = function(right) {
        return Matrix4.equals(this, right);
    };

    /**
     * @private
     */
    Matrix4.equalsArray = function(matrix, array, offset) {
        return matrix[0] === array[offset] &&
               matrix[1] === array[offset + 1] &&
               matrix[2] === array[offset + 2] &&
               matrix[3] === array[offset + 3] &&
               matrix[4] === array[offset + 4] &&
               matrix[5] === array[offset + 5] &&
               matrix[6] === array[offset + 6] &&
               matrix[7] === array[offset + 7] &&
               matrix[8] === array[offset + 8] &&
               matrix[9] === array[offset + 9] &&
               matrix[10] === array[offset + 10] &&
               matrix[11] === array[offset + 11] &&
               matrix[12] === array[offset + 12] &&
               matrix[13] === array[offset + 13] &&
               matrix[14] === array[offset + 14] &&
               matrix[15] === array[offset + 15];
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Matrix4} [right] The right hand side matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    Matrix4.prototype.equalsEpsilon = function(right, epsilon) {
        return Matrix4.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Computes a string representing this Matrix with each row being
     * on a separate line and in the format '(column0, column1, column2, column3)'.
     *
     * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2, column3)'.
     */
    Matrix4.prototype.toString = function() {
        return '(' + this[0] + ', ' + this[4] + ', ' + this[8] + ', ' + this[12] +')\n' +
               '(' + this[1] + ', ' + this[5] + ', ' + this[9] + ', ' + this[13] +')\n' +
               '(' + this[2] + ', ' + this[6] + ', ' + this[10] + ', ' + this[14] +')\n' +
               '(' + this[3] + ', ' + this[7] + ', ' + this[11] + ', ' + this[15] +')';
    };

    return Matrix4;
});

/*global define*/
define('Core/Rectangle',[
        './Cartographic',
        './Check',
        './defaultValue',
        './defined',
        './defineProperties',
        './Ellipsoid',
        './freezeObject',
        './Math'
    ], function(
        Cartographic,
        Check,
        defaultValue,
        defined,
        defineProperties,
        Ellipsoid,
        freezeObject,
        CesiumMath) {
    'use strict';

    /**
     * A two dimensional region specified as longitude and latitude coordinates.
     *
     * @alias Rectangle
     * @constructor
     *
     * @param {Number} [west=0.0] The westernmost longitude, in radians, in the range [-Pi, Pi].
     * @param {Number} [south=0.0] The southernmost latitude, in radians, in the range [-Pi/2, Pi/2].
     * @param {Number} [east=0.0] The easternmost longitude, in radians, in the range [-Pi, Pi].
     * @param {Number} [north=0.0] The northernmost latitude, in radians, in the range [-Pi/2, Pi/2].
     *
     * @see Packable
     */
    function Rectangle(west, south, east, north) {
        /**
         * The westernmost longitude in radians in the range [-Pi, Pi].
         *
         * @type {Number}
         * @default 0.0
         */
        this.west = defaultValue(west, 0.0);

        /**
         * The southernmost latitude in radians in the range [-Pi/2, Pi/2].
         *
         * @type {Number}
         * @default 0.0
         */
        this.south = defaultValue(south, 0.0);

        /**
         * The easternmost longitude in radians in the range [-Pi, Pi].
         *
         * @type {Number}
         * @default 0.0
         */
        this.east = defaultValue(east, 0.0);

        /**
         * The northernmost latitude in radians in the range [-Pi/2, Pi/2].
         *
         * @type {Number}
         * @default 0.0
         */
        this.north = defaultValue(north, 0.0);
    }

    defineProperties(Rectangle.prototype, {
        /**
         * Gets the width of the rectangle in radians.
         * @memberof Rectangle.prototype
         * @type {Number}
         */
        width : {
            get : function() {
                return Rectangle.computeWidth(this);
            }
        },

        /**
         * Gets the height of the rectangle in radians.
         * @memberof Rectangle.prototype
         * @type {Number}
         */
        height : {
            get : function() {
                return Rectangle.computeHeight(this);
            }
        }
    });

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Rectangle.packedLength = 4;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Rectangle} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Rectangle.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.west;
        array[startingIndex++] = value.south;
        array[startingIndex++] = value.east;
        array[startingIndex] = value.north;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Rectangle} [result] The object into which to store the result.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if one was not provided.
     */
    Rectangle.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Rectangle();
        }

        result.west = array[startingIndex++];
        result.south = array[startingIndex++];
        result.east = array[startingIndex++];
        result.north = array[startingIndex];
        return result;
    };

    /**
     * Computes the width of a rectangle in radians.
     * @param {Rectangle} rectangle The rectangle to compute the width of.
     * @returns {Number} The width.
     */
    Rectangle.computeWidth = function(rectangle) {
                Check.typeOf.object('rectangle', rectangle);
                var east = rectangle.east;
        var west = rectangle.west;
        if (east < west) {
            east += CesiumMath.TWO_PI;
        }
        return east - west;
    };

    /**
     * Computes the height of a rectangle in radians.
     * @param {Rectangle} rectangle The rectangle to compute the height of.
     * @returns {Number} The height.
     */
    Rectangle.computeHeight = function(rectangle) {
                Check.typeOf.object('rectangle', rectangle);
                return rectangle.north - rectangle.south;
    };

    /**
     * Creates a rectangle given the boundary longitude and latitude in degrees.
     *
     * @param {Number} [west=0.0] The westernmost longitude in degrees in the range [-180.0, 180.0].
     * @param {Number} [south=0.0] The southernmost latitude in degrees in the range [-90.0, 90.0].
     * @param {Number} [east=0.0] The easternmost longitude in degrees in the range [-180.0, 180.0].
     * @param {Number} [north=0.0] The northernmost latitude in degrees in the range [-90.0, 90.0].
     * @param {Rectangle} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided.
     *
     * @example
     * var rectangle = Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0);
     */
    Rectangle.fromDegrees = function(west, south, east, north, result) {
        west = CesiumMath.toRadians(defaultValue(west, 0.0));
        south = CesiumMath.toRadians(defaultValue(south, 0.0));
        east = CesiumMath.toRadians(defaultValue(east, 0.0));
        north = CesiumMath.toRadians(defaultValue(north, 0.0));

        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;

        return result;
    };

    /**
     * Creates an rectangle given the boundary longitude and latitude in radians.
     *
     * @param {Number} [west=0.0] The westernmost longitude in radians in the range [-Math.PI, Math.PI].
     * @param {Number} [south=0.0] The southernmost latitude in radians in the range [-Math.PI/2, Math.PI/2].
     * @param {Number} [east=0.0] The easternmost longitude in radians in the range [-Math.PI, Math.PI].
     * @param {Number} [north=0.0] The northernmost latitude in radians in the range [-Math.PI/2, Math.PI/2].
     * @param {Rectangle} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided.
     *
     * @example
     * var rectangle = Cesium.Rectangle.fromRadians(0.0, Math.PI/4, Math.PI/8, 3*Math.PI/4);
     */
    Rectangle.fromRadians = function(west, south, east, north, result) {
        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }

        result.west = defaultValue(west, 0.0);
        result.south = defaultValue(south, 0.0);
        result.east = defaultValue(east, 0.0);
        result.north = defaultValue(north, 0.0);

        return result;
    };

    /**
     * Creates the smallest possible Rectangle that encloses all positions in the provided array.
     *
     * @param {Cartographic[]} cartographics The list of Cartographic instances.
     * @param {Rectangle} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided.
     */
    Rectangle.fromCartographicArray = function(cartographics, result) {
                Check.defined('cartographics', cartographics);
        
        var west = Number.MAX_VALUE;
        var east = -Number.MAX_VALUE;
        var westOverIDL = Number.MAX_VALUE;
        var eastOverIDL = -Number.MAX_VALUE;
        var south = Number.MAX_VALUE;
        var north = -Number.MAX_VALUE;

        for ( var i = 0, len = cartographics.length; i < len; i++) {
            var position = cartographics[i];
            west = Math.min(west, position.longitude);
            east = Math.max(east, position.longitude);
            south = Math.min(south, position.latitude);
            north = Math.max(north, position.latitude);

            var lonAdjusted = position.longitude >= 0 ?  position.longitude : position.longitude +  CesiumMath.TWO_PI;
            westOverIDL = Math.min(westOverIDL, lonAdjusted);
            eastOverIDL = Math.max(eastOverIDL, lonAdjusted);
        }

        if(east - west > eastOverIDL - westOverIDL) {
            west = westOverIDL;
            east = eastOverIDL;

            if (east > CesiumMath.PI) {
                east = east - CesiumMath.TWO_PI;
            }
            if (west > CesiumMath.PI) {
                west = west - CesiumMath.TWO_PI;
            }
        }

        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Creates the smallest possible Rectangle that encloses all positions in the provided array.
     *
     * @param {Cartesian[]} cartesians The list of Cartesian instances.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid the cartesians are on.
     * @param {Rectangle} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided.
     */
    Rectangle.fromCartesianArray = function(cartesians, ellipsoid, result) {
                Check.defined('cartesians', cartesians);
        
        var west = Number.MAX_VALUE;
        var east = -Number.MAX_VALUE;
        var westOverIDL = Number.MAX_VALUE;
        var eastOverIDL = -Number.MAX_VALUE;
        var south = Number.MAX_VALUE;
        var north = -Number.MAX_VALUE;

        for ( var i = 0, len = cartesians.length; i < len; i++) {
            var position = ellipsoid.cartesianToCartographic(cartesians[i]);
            west = Math.min(west, position.longitude);
            east = Math.max(east, position.longitude);
            south = Math.min(south, position.latitude);
            north = Math.max(north, position.latitude);

            var lonAdjusted = position.longitude >= 0 ?  position.longitude : position.longitude +  CesiumMath.TWO_PI;
            westOverIDL = Math.min(westOverIDL, lonAdjusted);
            eastOverIDL = Math.max(eastOverIDL, lonAdjusted);
        }

        if(east - west > eastOverIDL - westOverIDL) {
            west = westOverIDL;
            east = eastOverIDL;

            if (east > CesiumMath.PI) {
                east = east - CesiumMath.TWO_PI;
            }
            if (west > CesiumMath.PI) {
                west = west - CesiumMath.TWO_PI;
            }
        }

        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Duplicates a Rectangle.
     *
     * @param {Rectangle} rectangle The rectangle to clone.
     * @param {Rectangle} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided. (Returns undefined if rectangle is undefined)
     */
    Rectangle.clone = function(rectangle, result) {
        if (!defined(rectangle)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Rectangle(rectangle.west, rectangle.south, rectangle.east, rectangle.north);
        }

        result.west = rectangle.west;
        result.south = rectangle.south;
        result.east = rectangle.east;
        result.north = rectangle.north;
        return result;
    };

    /**
     * Duplicates this Rectangle.
     *
     * @param {Rectangle} [result] The object onto which to store the result.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided.
     */
    Rectangle.prototype.clone = function(result) {
        return Rectangle.clone(this, result);
    };

    /**
     * Compares the provided Rectangle with this Rectangle componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Rectangle} [other] The Rectangle to compare.
     * @returns {Boolean} <code>true</code> if the Rectangles are equal, <code>false</code> otherwise.
     */
    Rectangle.prototype.equals = function(other) {
        return Rectangle.equals(this, other);
    };

    /**
     * Compares the provided rectangles and returns <code>true</code> if they are equal,
     * <code>false</code> otherwise.
     *
     * @param {Rectangle} [left] The first Rectangle.
     * @param {Rectangle} [right] The second Rectangle.
     * @returns {Boolean} <code>true</code> if left and right are equal; otherwise <code>false</code>.
     */
    Rectangle.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.west === right.west) &&
                (left.south === right.south) &&
                (left.east === right.east) &&
                (left.north === right.north));
    };

    /**
     * Compares the provided Rectangle with this Rectangle componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Rectangle} [other] The Rectangle to compare.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if the Rectangles are within the provided epsilon, <code>false</code> otherwise.
     */
    Rectangle.prototype.equalsEpsilon = function(other, epsilon) {
                Check.typeOf.number('epsilon', epsilon);
        
        return defined(other) &&
               (Math.abs(this.west - other.west) <= epsilon) &&
               (Math.abs(this.south - other.south) <= epsilon) &&
               (Math.abs(this.east - other.east) <= epsilon) &&
               (Math.abs(this.north - other.north) <= epsilon);
    };

    /**
     * Checks a Rectangle's properties and throws if they are not in valid ranges.
     *
     * @param {Rectangle} rectangle The rectangle to validate
     *
     * @exception {DeveloperError} <code>north</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
     * @exception {DeveloperError} <code>south</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
     * @exception {DeveloperError} <code>east</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
     * @exception {DeveloperError} <code>west</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
     */
    Rectangle.validate = function(rectangle) {
                Check.typeOf.object('rectangle', rectangle);

        var north = rectangle.north;
        Check.typeOf.number.greaterThanOrEquals('north', north, -CesiumMath.PI_OVER_TWO);
        Check.typeOf.number.lessThanOrEquals('north', north, CesiumMath.PI_OVER_TWO);

        var south = rectangle.south;
        Check.typeOf.number.greaterThanOrEquals('south', south, -CesiumMath.PI_OVER_TWO);
        Check.typeOf.number.lessThanOrEquals('south', south, CesiumMath.PI_OVER_TWO);

        var west = rectangle.west;
        Check.typeOf.number.greaterThanOrEquals('west', west, -Math.PI);
        Check.typeOf.number.lessThanOrEquals('west', west, Math.PI);

        var east = rectangle.east;
        Check.typeOf.number.greaterThanOrEquals('east', east, -Math.PI);
        Check.typeOf.number.lessThanOrEquals('east', east, Math.PI);
            };

    /**
     * Computes the southwest corner of a rectangle.
     *
     * @param {Rectangle} rectangle The rectangle for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Rectangle.southwest = function(rectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        
        if (!defined(result)) {
            return new Cartographic(rectangle.west, rectangle.south);
        }
        result.longitude = rectangle.west;
        result.latitude = rectangle.south;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the northwest corner of a rectangle.
     *
     * @param {Rectangle} rectangle The rectangle for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Rectangle.northwest = function(rectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        
        if (!defined(result)) {
            return new Cartographic(rectangle.west, rectangle.north);
        }
        result.longitude = rectangle.west;
        result.latitude = rectangle.north;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the northeast corner of a rectangle.
     *
     * @param {Rectangle} rectangle The rectangle for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Rectangle.northeast = function(rectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        
        if (!defined(result)) {
            return new Cartographic(rectangle.east, rectangle.north);
        }
        result.longitude = rectangle.east;
        result.latitude = rectangle.north;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the southeast corner of a rectangle.
     *
     * @param {Rectangle} rectangle The rectangle for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Rectangle.southeast = function(rectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        
        if (!defined(result)) {
            return new Cartographic(rectangle.east, rectangle.south);
        }
        result.longitude = rectangle.east;
        result.latitude = rectangle.south;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the center of a rectangle.
     *
     * @param {Rectangle} rectangle The rectangle for which to find the center
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Rectangle.center = function(rectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        
        var east = rectangle.east;
        var west = rectangle.west;

        if (east < west) {
            east += CesiumMath.TWO_PI;
        }

        var longitude = CesiumMath.negativePiToPi((west + east) * 0.5);
        var latitude = (rectangle.south + rectangle.north) * 0.5;

        if (!defined(result)) {
            return new Cartographic(longitude, latitude);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the intersection of two rectangles.  This function assumes that the rectangle's coordinates are
     * latitude and longitude in radians and produces a correct intersection, taking into account the fact that
     * the same angle can be represented with multiple values as well as the wrapping of longitude at the
     * anti-meridian.  For a simple intersection that ignores these factors and can be used with projected
     * coordinates, see {@link Rectangle.simpleIntersection}.
     *
     * @param {Rectangle} rectangle On rectangle to find an intersection
     * @param {Rectangle} otherRectangle Another rectangle to find an intersection
     * @param {Rectangle} [result] The object onto which to store the result.
     * @returns {Rectangle|undefined} The modified result parameter, a new Rectangle instance if none was provided or undefined if there is no intersection.
     */
    Rectangle.intersection = function(rectangle, otherRectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        Check.typeOf.object('otherRectangle', otherRectangle);
        
        var rectangleEast = rectangle.east;
        var rectangleWest = rectangle.west;

        var otherRectangleEast = otherRectangle.east;
        var otherRectangleWest = otherRectangle.west;

        if (rectangleEast < rectangleWest && otherRectangleEast > 0.0) {
            rectangleEast += CesiumMath.TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleEast > 0.0) {
            otherRectangleEast += CesiumMath.TWO_PI;
        }

        if (rectangleEast < rectangleWest && otherRectangleWest < 0.0) {
            otherRectangleWest += CesiumMath.TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleWest < 0.0) {
            rectangleWest += CesiumMath.TWO_PI;
        }

        var west = CesiumMath.negativePiToPi(Math.max(rectangleWest, otherRectangleWest));
        var east = CesiumMath.negativePiToPi(Math.min(rectangleEast, otherRectangleEast));

        if ((rectangle.west < rectangle.east || otherRectangle.west < otherRectangle.east) && east <= west) {
            return undefined;
        }

        var south = Math.max(rectangle.south, otherRectangle.south);
        var north = Math.min(rectangle.north, otherRectangle.north);

        if (south >= north) {
            return undefined;
        }

        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Computes a simple intersection of two rectangles.  Unlike {@link Rectangle.intersection}, this function
     * does not attempt to put the angular coordinates into a consistent range or to account for crossing the
     * anti-meridian.  As such, it can be used for rectangles where the coordinates are not simply latitude
     * and longitude (i.e. projected coordinates).
     *
     * @param {Rectangle} rectangle On rectangle to find an intersection
     * @param {Rectangle} otherRectangle Another rectangle to find an intersection
     * @param {Rectangle} [result] The object onto which to store the result.
     * @returns {Rectangle|undefined} The modified result parameter, a new Rectangle instance if none was provided or undefined if there is no intersection.
     */
    Rectangle.simpleIntersection = function(rectangle, otherRectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        Check.typeOf.object('otherRectangle', otherRectangle);
        
        var west = Math.max(rectangle.west, otherRectangle.west);
        var south = Math.max(rectangle.south, otherRectangle.south);
        var east = Math.min(rectangle.east, otherRectangle.east);
        var north = Math.min(rectangle.north, otherRectangle.north);

        if (south >= north || west >= east) {
            return undefined;
        }

        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Computes a rectangle that is the union of two rectangles.
     *
     * @param {Rectangle} rectangle A rectangle to enclose in rectangle.
     * @param {Rectangle} otherRectangle A rectangle to enclose in a rectangle.
     * @param {Rectangle} [result] The object onto which to store the result.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if none was provided.
     */
    Rectangle.union = function(rectangle, otherRectangle, result) {
                Check.typeOf.object('rectangle', rectangle);
        Check.typeOf.object('otherRectangle', otherRectangle);
        
        if (!defined(result)) {
            result = new Rectangle();
        }

        var rectangleEast = rectangle.east;
        var rectangleWest = rectangle.west;

        var otherRectangleEast = otherRectangle.east;
        var otherRectangleWest = otherRectangle.west;

        if (rectangleEast < rectangleWest && otherRectangleEast > 0.0) {
            rectangleEast += CesiumMath.TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleEast > 0.0) {
            otherRectangleEast += CesiumMath.TWO_PI;
        }

        if (rectangleEast < rectangleWest && otherRectangleWest < 0.0) {
            otherRectangleWest += CesiumMath.TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleWest < 0.0) {
            rectangleWest += CesiumMath.TWO_PI;
        }

        var west = CesiumMath.convertLongitudeRange(Math.min(rectangleWest, otherRectangleWest));
        var east = CesiumMath.convertLongitudeRange(Math.max(rectangleEast, otherRectangleEast));

        result.west = west;
        result.south = Math.min(rectangle.south, otherRectangle.south);
        result.east = east;
        result.north = Math.max(rectangle.north, otherRectangle.north);

        return result;
    };

    /**
     * Computes a rectangle by enlarging the provided rectangle until it contains the provided cartographic.
     *
     * @param {Rectangle} rectangle A rectangle to expand.
     * @param {Cartographic} cartographic A cartographic to enclose in a rectangle.
     * @param {Rectangle} [result] The object onto which to store the result.
     * @returns {Rectangle} The modified result parameter or a new Rectangle instance if one was not provided.
     */
    Rectangle.expand = function(rectangle, cartographic, result) {
                Check.typeOf.object('rectangle', rectangle);
        Check.typeOf.object('cartographic', cartographic);
        
        if (!defined(result)) {
            result = new Rectangle();
        }

        result.west = Math.min(rectangle.west, cartographic.longitude);
        result.south = Math.min(rectangle.south, cartographic.latitude);
        result.east = Math.max(rectangle.east, cartographic.longitude);
        result.north = Math.max(rectangle.north, cartographic.latitude);

        return result;
    };

    /**
     * Returns true if the cartographic is on or inside the rectangle, false otherwise.
     *
     * @param {Rectangle} rectangle The rectangle
     * @param {Cartographic} cartographic The cartographic to test.
     * @returns {Boolean} true if the provided cartographic is inside the rectangle, false otherwise.
     */
    Rectangle.contains = function(rectangle, cartographic) {
                Check.typeOf.object('rectangle', rectangle);
        Check.typeOf.object('cartographic', cartographic);
        
        var longitude = cartographic.longitude;
        var latitude = cartographic.latitude;

        var west = rectangle.west;
        var east = rectangle.east;

        if (east < west) {
            east += CesiumMath.TWO_PI;
            if (longitude < 0.0) {
                longitude += CesiumMath.TWO_PI;
            }
        }
        return (longitude > west || CesiumMath.equalsEpsilon(longitude, west, CesiumMath.EPSILON14)) &&
               (longitude < east || CesiumMath.equalsEpsilon(longitude, east, CesiumMath.EPSILON14)) &&
               latitude >= rectangle.south &&
               latitude <= rectangle.north;
    };

    var subsampleLlaScratch = new Cartographic();
    /**
     * Samples a rectangle so that it includes a list of Cartesian points suitable for passing to
     * {@link BoundingSphere#fromPoints}.  Sampling is necessary to account
     * for rectangles that cover the poles or cross the equator.
     *
     * @param {Rectangle} rectangle The rectangle to subsample.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
     * @param {Number} [surfaceHeight=0.0] The height of the rectangle above the ellipsoid.
     * @param {Cartesian3[]} [result] The array of Cartesians onto which to store the result.
     * @returns {Cartesian3[]} The modified result parameter or a new Array of Cartesians instances if none was provided.
     */
    Rectangle.subsample = function(rectangle, ellipsoid, surfaceHeight, result) {
                Check.typeOf.object('rectangle', rectangle);
        
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        surfaceHeight = defaultValue(surfaceHeight, 0.0);

        if (!defined(result)) {
            result = [];
        }
        var length = 0;

        var north = rectangle.north;
        var south = rectangle.south;
        var east = rectangle.east;
        var west = rectangle.west;

        var lla = subsampleLlaScratch;
        lla.height = surfaceHeight;

        lla.longitude = west;
        lla.latitude = north;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        lla.longitude = east;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        lla.latitude = south;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        lla.longitude = west;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        if (north < 0.0) {
            lla.latitude = north;
        } else if (south > 0.0) {
            lla.latitude = south;
        } else {
            lla.latitude = 0.0;
        }

        for ( var i = 1; i < 8; ++i) {
            lla.longitude = -Math.PI + i * CesiumMath.PI_OVER_TWO;
            if (Rectangle.contains(rectangle, lla)) {
                result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
                length++;
            }
        }

        if (lla.latitude === 0.0) {
            lla.longitude = west;
            result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
            length++;
            lla.longitude = east;
            result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
            length++;
        }
        result.length = length;
        return result;
    };

    /**
     * The largest possible rectangle.
     *
     * @type {Rectangle}
     * @constant
    */
    Rectangle.MAX_VALUE = freezeObject(new Rectangle(-Math.PI, -CesiumMath.PI_OVER_TWO, Math.PI, CesiumMath.PI_OVER_TWO));

    return Rectangle;
});

/*global define*/
define('Core/BoundingSphere',[
        './Cartesian3',
        './Cartographic',
        './Check',
        './defaultValue',
        './defined',
        './Ellipsoid',
        './GeographicProjection',
        './Intersect',
        './Interval',
        './Matrix3',
        './Matrix4',
        './Rectangle'
    ], function(
        Cartesian3,
        Cartographic,
        Check,
        defaultValue,
        defined,
        Ellipsoid,
        GeographicProjection,
        Intersect,
        Interval,
        Matrix3,
        Matrix4,
        Rectangle) {
    'use strict';

    /**
     * A bounding sphere with a center and a radius.
     * @alias BoundingSphere
     * @constructor
     *
     * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the bounding sphere.
     * @param {Number} [radius=0.0] The radius of the bounding sphere.
     *
     * @see AxisAlignedBoundingBox
     * @see BoundingRectangle
     * @see Packable
     */
    function BoundingSphere(center, radius) {
        /**
         * The center point of the sphere.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.center = Cartesian3.clone(defaultValue(center, Cartesian3.ZERO));

        /**
         * The radius of the sphere.
         * @type {Number}
         * @default 0.0
         */
        this.radius = defaultValue(radius, 0.0);
    }

    var fromPointsXMin = new Cartesian3();
    var fromPointsYMin = new Cartesian3();
    var fromPointsZMin = new Cartesian3();
    var fromPointsXMax = new Cartesian3();
    var fromPointsYMax = new Cartesian3();
    var fromPointsZMax = new Cartesian3();
    var fromPointsCurrentPos = new Cartesian3();
    var fromPointsScratch = new Cartesian3();
    var fromPointsRitterCenter = new Cartesian3();
    var fromPointsMinBoxPt = new Cartesian3();
    var fromPointsMaxBoxPt = new Cartesian3();
    var fromPointsNaiveCenterScratch = new Cartesian3();

    /**
     * Computes a tight-fitting bounding sphere enclosing a list of 3D Cartesian points.
     * The bounding sphere is computed by running two algorithms, a naive algorithm and
     * Ritter's algorithm. The smaller of the two spheres is used to ensure a tight fit.
     *
     * @param {Cartesian3[]} positions An array of points that the bounding sphere will enclose.  Each point must have <code>x</code>, <code>y</code>, and <code>z</code> properties.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     *
     * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
     */
    BoundingSphere.fromPoints = function(positions, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(positions) || positions.length === 0) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        var currentPos = Cartesian3.clone(positions[0], fromPointsCurrentPos);

        var xMin = Cartesian3.clone(currentPos, fromPointsXMin);
        var yMin = Cartesian3.clone(currentPos, fromPointsYMin);
        var zMin = Cartesian3.clone(currentPos, fromPointsZMin);

        var xMax = Cartesian3.clone(currentPos, fromPointsXMax);
        var yMax = Cartesian3.clone(currentPos, fromPointsYMax);
        var zMax = Cartesian3.clone(currentPos, fromPointsZMax);

        var numPositions = positions.length;
        for (var i = 1; i < numPositions; i++) {
            Cartesian3.clone(positions[i], currentPos);

            var x = currentPos.x;
            var y = currentPos.y;
            var z = currentPos.z;

            // Store points containing the the smallest and largest components
            if (x < xMin.x) {
                Cartesian3.clone(currentPos, xMin);
            }

            if (x > xMax.x) {
                Cartesian3.clone(currentPos, xMax);
            }

            if (y < yMin.y) {
                Cartesian3.clone(currentPos, yMin);
            }

            if (y > yMax.y) {
                Cartesian3.clone(currentPos, yMax);
            }

            if (z < zMin.z) {
                Cartesian3.clone(currentPos, zMin);
            }

            if (z > zMax.z) {
                Cartesian3.clone(currentPos, zMax);
            }
        }

        // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
        var xSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(xMax, xMin, fromPointsScratch));
        var ySpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(yMax, yMin, fromPointsScratch));
        var zSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(zMax, zMin, fromPointsScratch));

        // Set the diameter endpoints to the largest span.
        var diameter1 = xMin;
        var diameter2 = xMax;
        var maxSpan = xSpan;
        if (ySpan > maxSpan) {
            maxSpan = ySpan;
            diameter1 = yMin;
            diameter2 = yMax;
        }
        if (zSpan > maxSpan) {
            maxSpan = zSpan;
            diameter1 = zMin;
            diameter2 = zMax;
        }

        // Calculate the center of the initial sphere found by Ritter's algorithm
        var ritterCenter = fromPointsRitterCenter;
        ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
        ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
        ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

        // Calculate the radius of the initial sphere found by Ritter's algorithm
        var radiusSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
        var ritterRadius = Math.sqrt(radiusSquared);

        // Find the center of the sphere found using the Naive method.
        var minBoxPt = fromPointsMinBoxPt;
        minBoxPt.x = xMin.x;
        minBoxPt.y = yMin.y;
        minBoxPt.z = zMin.z;

        var maxBoxPt = fromPointsMaxBoxPt;
        maxBoxPt.x = xMax.x;
        maxBoxPt.y = yMax.y;
        maxBoxPt.z = zMax.z;

        var naiveCenter = Cartesian3.multiplyByScalar(Cartesian3.add(minBoxPt, maxBoxPt, fromPointsScratch), 0.5, fromPointsNaiveCenterScratch);

        // Begin 2nd pass to find naive radius and modify the ritter sphere.
        var naiveRadius = 0;
        for (i = 0; i < numPositions; i++) {
            Cartesian3.clone(positions[i], currentPos);

            // Find the furthest point from the naive center to calculate the naive radius.
            var r = Cartesian3.magnitude(Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
            if (r > naiveRadius) {
                naiveRadius = r;
            }

            // Make adjustments to the Ritter Sphere to include all points.
            var oldCenterToPointSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
            if (oldCenterToPointSquared > radiusSquared) {
                var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                // Calculate new radius to include the point that lies outside
                ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                radiusSquared = ritterRadius * ritterRadius;
                // Calculate center of new Ritter sphere
                var oldToNew = oldCenterToPoint - ritterRadius;
                ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
            }
        }

        if (ritterRadius < naiveRadius) {
            Cartesian3.clone(ritterCenter, result.center);
            result.radius = ritterRadius;
        } else {
            Cartesian3.clone(naiveCenter, result.center);
            result.radius = naiveRadius;
        }

        return result;
    };

    var defaultProjection = new GeographicProjection();
    var fromRectangle2DLowerLeft = new Cartesian3();
    var fromRectangle2DUpperRight = new Cartesian3();
    var fromRectangle2DSouthwest = new Cartographic();
    var fromRectangle2DNortheast = new Cartographic();

    /**
     * Computes a bounding sphere from an rectangle projected in 2D.
     *
     * @param {Rectangle} rectangle The rectangle around which to create a bounding sphere.
     * @param {Object} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromRectangle2D = function(rectangle, projection, result) {
        return BoundingSphere.fromRectangleWithHeights2D(rectangle, projection, 0.0, 0.0, result);
    };

    /**
     * Computes a bounding sphere from a rectangle projected in 2D.  The bounding sphere accounts for the
     * object's minimum and maximum heights over the rectangle.
     *
     * @param {Rectangle} rectangle The rectangle around which to create a bounding sphere.
     * @param {Object} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
     * @param {Number} [minimumHeight=0.0] The minimum height over the rectangle.
     * @param {Number} [maximumHeight=0.0] The maximum height over the rectangle.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromRectangleWithHeights2D = function(rectangle, projection, minimumHeight, maximumHeight, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(rectangle)) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        projection = defaultValue(projection, defaultProjection);

        Rectangle.southwest(rectangle, fromRectangle2DSouthwest);
        fromRectangle2DSouthwest.height = minimumHeight;
        Rectangle.northeast(rectangle, fromRectangle2DNortheast);
        fromRectangle2DNortheast.height = maximumHeight;

        var lowerLeft = projection.project(fromRectangle2DSouthwest, fromRectangle2DLowerLeft);
        var upperRight = projection.project(fromRectangle2DNortheast, fromRectangle2DUpperRight);

        var width = upperRight.x - lowerLeft.x;
        var height = upperRight.y - lowerLeft.y;
        var elevation = upperRight.z - lowerLeft.z;

        result.radius = Math.sqrt(width * width + height * height + elevation * elevation) * 0.5;
        var center = result.center;
        center.x = lowerLeft.x + width * 0.5;
        center.y = lowerLeft.y + height * 0.5;
        center.z = lowerLeft.z + elevation * 0.5;
        return result;
    };

    var fromRectangle3DScratch = [];

    /**
     * Computes a bounding sphere from a rectangle in 3D. The bounding sphere is created using a subsample of points
     * on the ellipsoid and contained in the rectangle. It may not be accurate for all rectangles on all types of ellipsoids.
     *
     * @param {Rectangle} rectangle The valid rectangle used to create a bounding sphere.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid used to determine positions of the rectangle.
     * @param {Number} [surfaceHeight=0.0] The height above the surface of the ellipsoid.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromRectangle3D = function(rectangle, ellipsoid, surfaceHeight, result) {
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        surfaceHeight = defaultValue(surfaceHeight, 0.0);

        var positions;
        if (defined(rectangle)) {
            positions = Rectangle.subsample(rectangle, ellipsoid, surfaceHeight, fromRectangle3DScratch);
        }

        return BoundingSphere.fromPoints(positions, result);
    };

    /**
     * Computes a tight-fitting bounding sphere enclosing a list of 3D points, where the points are
     * stored in a flat array in X, Y, Z, order.  The bounding sphere is computed by running two
     * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
     * ensure a tight fit.
     *
     * @param {Number[]} positions An array of points that the bounding sphere will enclose.  Each point
     *        is formed from three elements in the array in the order X, Y, Z.
     * @param {Cartesian3} [center=Cartesian3.ZERO] The position to which the positions are relative, which need not be the
     *        origin of the coordinate system.  This is useful when the positions are to be used for
     *        relative-to-center (RTC) rendering.
     * @param {Number} [stride=3] The number of array elements per vertex.  It must be at least 3, but it may
     *        be higher.  Regardless of the value of this parameter, the X coordinate of the first position
     *        is at array index 0, the Y coordinate is at array index 1, and the Z coordinate is at array index
     *        2.  When stride is 3, the X coordinate of the next position then begins at array index 3.  If
     *        the stride is 5, however, two array elements are skipped and the next position begins at array
     *        index 5.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     *
     * @example
     * // Compute the bounding sphere from 3 positions, each specified relative to a center.
     * // In addition to the X, Y, and Z coordinates, the points array contains two additional
     * // elements per point which are ignored for the purpose of computing the bounding sphere.
     * var center = new Cesium.Cartesian3(1.0, 2.0, 3.0);
     * var points = [1.0, 2.0, 3.0, 0.1, 0.2,
     *               4.0, 5.0, 6.0, 0.1, 0.2,
     *               7.0, 8.0, 9.0, 0.1, 0.2];
     * var sphere = Cesium.BoundingSphere.fromVertices(points, center, 5);
     *
     * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
     */
    BoundingSphere.fromVertices = function(positions, center, stride, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(positions) || positions.length === 0) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        center = defaultValue(center, Cartesian3.ZERO);

        stride = defaultValue(stride, 3);

                Check.typeOf.number.greaterThanOrEquals('stride', stride, 3);
        
        var currentPos = fromPointsCurrentPos;
        currentPos.x = positions[0] + center.x;
        currentPos.y = positions[1] + center.y;
        currentPos.z = positions[2] + center.z;

        var xMin = Cartesian3.clone(currentPos, fromPointsXMin);
        var yMin = Cartesian3.clone(currentPos, fromPointsYMin);
        var zMin = Cartesian3.clone(currentPos, fromPointsZMin);

        var xMax = Cartesian3.clone(currentPos, fromPointsXMax);
        var yMax = Cartesian3.clone(currentPos, fromPointsYMax);
        var zMax = Cartesian3.clone(currentPos, fromPointsZMax);

        var numElements = positions.length;
        for (var i = 0; i < numElements; i += stride) {
            var x = positions[i] + center.x;
            var y = positions[i + 1] + center.y;
            var z = positions[i + 2] + center.z;

            currentPos.x = x;
            currentPos.y = y;
            currentPos.z = z;

            // Store points containing the the smallest and largest components
            if (x < xMin.x) {
                Cartesian3.clone(currentPos, xMin);
            }

            if (x > xMax.x) {
                Cartesian3.clone(currentPos, xMax);
            }

            if (y < yMin.y) {
                Cartesian3.clone(currentPos, yMin);
            }

            if (y > yMax.y) {
                Cartesian3.clone(currentPos, yMax);
            }

            if (z < zMin.z) {
                Cartesian3.clone(currentPos, zMin);
            }

            if (z > zMax.z) {
                Cartesian3.clone(currentPos, zMax);
            }
        }

        // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
        var xSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(xMax, xMin, fromPointsScratch));
        var ySpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(yMax, yMin, fromPointsScratch));
        var zSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(zMax, zMin, fromPointsScratch));

        // Set the diameter endpoints to the largest span.
        var diameter1 = xMin;
        var diameter2 = xMax;
        var maxSpan = xSpan;
        if (ySpan > maxSpan) {
            maxSpan = ySpan;
            diameter1 = yMin;
            diameter2 = yMax;
        }
        if (zSpan > maxSpan) {
            maxSpan = zSpan;
            diameter1 = zMin;
            diameter2 = zMax;
        }

        // Calculate the center of the initial sphere found by Ritter's algorithm
        var ritterCenter = fromPointsRitterCenter;
        ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
        ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
        ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

        // Calculate the radius of the initial sphere found by Ritter's algorithm
        var radiusSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
        var ritterRadius = Math.sqrt(radiusSquared);

        // Find the center of the sphere found using the Naive method.
        var minBoxPt = fromPointsMinBoxPt;
        minBoxPt.x = xMin.x;
        minBoxPt.y = yMin.y;
        minBoxPt.z = zMin.z;

        var maxBoxPt = fromPointsMaxBoxPt;
        maxBoxPt.x = xMax.x;
        maxBoxPt.y = yMax.y;
        maxBoxPt.z = zMax.z;

        var naiveCenter = Cartesian3.multiplyByScalar(Cartesian3.add(minBoxPt, maxBoxPt, fromPointsScratch), 0.5, fromPointsNaiveCenterScratch);

        // Begin 2nd pass to find naive radius and modify the ritter sphere.
        var naiveRadius = 0;
        for (i = 0; i < numElements; i += stride) {
            currentPos.x = positions[i] + center.x;
            currentPos.y = positions[i + 1] + center.y;
            currentPos.z = positions[i + 2] + center.z;

            // Find the furthest point from the naive center to calculate the naive radius.
            var r = Cartesian3.magnitude(Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
            if (r > naiveRadius) {
                naiveRadius = r;
            }

            // Make adjustments to the Ritter Sphere to include all points.
            var oldCenterToPointSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
            if (oldCenterToPointSquared > radiusSquared) {
                var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                // Calculate new radius to include the point that lies outside
                ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                radiusSquared = ritterRadius * ritterRadius;
                // Calculate center of new Ritter sphere
                var oldToNew = oldCenterToPoint - ritterRadius;
                ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
            }
        }

        if (ritterRadius < naiveRadius) {
            Cartesian3.clone(ritterCenter, result.center);
            result.radius = ritterRadius;
        } else {
            Cartesian3.clone(naiveCenter, result.center);
            result.radius = naiveRadius;
        }

        return result;
    };

    /**
     * Computes a tight-fitting bounding sphere enclosing a list of {@link EncodedCartesian3}s, where the points are
     * stored in parallel flat arrays in X, Y, Z, order.  The bounding sphere is computed by running two
     * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
     * ensure a tight fit.
     *
     * @param {Number[]} positionsHigh An array of high bits of the encoded cartesians that the bounding sphere will enclose.  Each point
     *        is formed from three elements in the array in the order X, Y, Z.
     * @param {Number[]} positionsLow An array of low bits of the encoded cartesians that the bounding sphere will enclose.  Each point
     *        is formed from three elements in the array in the order X, Y, Z.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     *
     * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
     */
    BoundingSphere.fromEncodedCartesianVertices = function(positionsHigh, positionsLow, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(positionsHigh) || !defined(positionsLow) || positionsHigh.length !== positionsLow.length || positionsHigh.length === 0) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        var currentPos = fromPointsCurrentPos;
        currentPos.x = positionsHigh[0] + positionsLow[0];
        currentPos.y = positionsHigh[1] + positionsLow[1];
        currentPos.z = positionsHigh[2] + positionsLow[2];

        var xMin = Cartesian3.clone(currentPos, fromPointsXMin);
        var yMin = Cartesian3.clone(currentPos, fromPointsYMin);
        var zMin = Cartesian3.clone(currentPos, fromPointsZMin);

        var xMax = Cartesian3.clone(currentPos, fromPointsXMax);
        var yMax = Cartesian3.clone(currentPos, fromPointsYMax);
        var zMax = Cartesian3.clone(currentPos, fromPointsZMax);

        var numElements = positionsHigh.length;
        for (var i = 0; i < numElements; i += 3) {
            var x = positionsHigh[i] + positionsLow[i];
            var y = positionsHigh[i + 1] + positionsLow[i + 1];
            var z = positionsHigh[i + 2] + positionsLow[i + 2];

            currentPos.x = x;
            currentPos.y = y;
            currentPos.z = z;

            // Store points containing the the smallest and largest components
            if (x < xMin.x) {
                Cartesian3.clone(currentPos, xMin);
            }

            if (x > xMax.x) {
                Cartesian3.clone(currentPos, xMax);
            }

            if (y < yMin.y) {
                Cartesian3.clone(currentPos, yMin);
            }

            if (y > yMax.y) {
                Cartesian3.clone(currentPos, yMax);
            }

            if (z < zMin.z) {
                Cartesian3.clone(currentPos, zMin);
            }

            if (z > zMax.z) {
                Cartesian3.clone(currentPos, zMax);
            }
        }

        // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
        var xSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(xMax, xMin, fromPointsScratch));
        var ySpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(yMax, yMin, fromPointsScratch));
        var zSpan = Cartesian3.magnitudeSquared(Cartesian3.subtract(zMax, zMin, fromPointsScratch));

        // Set the diameter endpoints to the largest span.
        var diameter1 = xMin;
        var diameter2 = xMax;
        var maxSpan = xSpan;
        if (ySpan > maxSpan) {
            maxSpan = ySpan;
            diameter1 = yMin;
            diameter2 = yMax;
        }
        if (zSpan > maxSpan) {
            maxSpan = zSpan;
            diameter1 = zMin;
            diameter2 = zMax;
        }

        // Calculate the center of the initial sphere found by Ritter's algorithm
        var ritterCenter = fromPointsRitterCenter;
        ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
        ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
        ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

        // Calculate the radius of the initial sphere found by Ritter's algorithm
        var radiusSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
        var ritterRadius = Math.sqrt(radiusSquared);

        // Find the center of the sphere found using the Naive method.
        var minBoxPt = fromPointsMinBoxPt;
        minBoxPt.x = xMin.x;
        minBoxPt.y = yMin.y;
        minBoxPt.z = zMin.z;

        var maxBoxPt = fromPointsMaxBoxPt;
        maxBoxPt.x = xMax.x;
        maxBoxPt.y = yMax.y;
        maxBoxPt.z = zMax.z;

        var naiveCenter = Cartesian3.multiplyByScalar(Cartesian3.add(minBoxPt, maxBoxPt, fromPointsScratch), 0.5, fromPointsNaiveCenterScratch);

        // Begin 2nd pass to find naive radius and modify the ritter sphere.
        var naiveRadius = 0;
        for (i = 0; i < numElements; i += 3) {
            currentPos.x = positionsHigh[i] + positionsLow[i];
            currentPos.y = positionsHigh[i + 1] + positionsLow[i + 1];
            currentPos.z = positionsHigh[i + 2] + positionsLow[i + 2];

            // Find the furthest point from the naive center to calculate the naive radius.
            var r = Cartesian3.magnitude(Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
            if (r > naiveRadius) {
                naiveRadius = r;
            }

            // Make adjustments to the Ritter Sphere to include all points.
            var oldCenterToPointSquared = Cartesian3.magnitudeSquared(Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
            if (oldCenterToPointSquared > radiusSquared) {
                var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                // Calculate new radius to include the point that lies outside
                ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                radiusSquared = ritterRadius * ritterRadius;
                // Calculate center of new Ritter sphere
                var oldToNew = oldCenterToPoint - ritterRadius;
                ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
            }
        }

        if (ritterRadius < naiveRadius) {
            Cartesian3.clone(ritterCenter, result.center);
            result.radius = ritterRadius;
        } else {
            Cartesian3.clone(naiveCenter, result.center);
            result.radius = naiveRadius;
        }

        return result;
    };

    /**
     * Computes a bounding sphere from the corner points of an axis-aligned bounding box.  The sphere
     * tighly and fully encompases the box.
     *
     * @param {Cartesian3} [corner] The minimum height over the rectangle.
     * @param {Cartesian3} [oppositeCorner] The maximum height over the rectangle.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @example
     * // Create a bounding sphere around the unit cube
     * var sphere = Cesium.BoundingSphere.fromCornerPoints(new Cesium.Cartesian3(-0.5, -0.5, -0.5), new Cesium.Cartesian3(0.5, 0.5, 0.5));
     */
    BoundingSphere.fromCornerPoints = function(corner, oppositeCorner, result) {
                Check.typeOf.object('corner', corner);
        Check.typeOf.object('oppositeCorner', oppositeCorner);
        
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        var center = result.center;
        Cartesian3.add(corner, oppositeCorner, center);
        Cartesian3.multiplyByScalar(center, 0.5, center);
        result.radius = Cartesian3.distance(center, oppositeCorner);
        return result;
    };

    /**
     * Creates a bounding sphere encompassing an ellipsoid.
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid around which to create a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @example
     * var boundingSphere = Cesium.BoundingSphere.fromEllipsoid(ellipsoid);
     */
    BoundingSphere.fromEllipsoid = function(ellipsoid, result) {
                Check.typeOf.object('ellipsoid', ellipsoid);
        
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        Cartesian3.clone(Cartesian3.ZERO, result.center);
        result.radius = ellipsoid.maximumRadius;
        return result;
    };

    var fromBoundingSpheresScratch = new Cartesian3();

    /**
     * Computes a tight-fitting bounding sphere enclosing the provided array of bounding spheres.
     *
     * @param {BoundingSphere[]} boundingSpheres The array of bounding spheres.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromBoundingSpheres = function(boundingSpheres, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        if (!defined(boundingSpheres) || boundingSpheres.length === 0) {
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            result.radius = 0.0;
            return result;
        }

        var length = boundingSpheres.length;
        if (length === 1) {
            return BoundingSphere.clone(boundingSpheres[0], result);
        }

        if (length === 2) {
            return BoundingSphere.union(boundingSpheres[0], boundingSpheres[1], result);
        }

        var positions = [];
        for (var i = 0; i < length; i++) {
            positions.push(boundingSpheres[i].center);
        }

        result = BoundingSphere.fromPoints(positions, result);

        var center = result.center;
        var radius = result.radius;
        for (i = 0; i < length; i++) {
            var tmp = boundingSpheres[i];
            radius = Math.max(radius, Cartesian3.distance(center, tmp.center, fromBoundingSpheresScratch) + tmp.radius);
        }
        result.radius = radius;

        return result;
    };

    var fromOrientedBoundingBoxScratchU = new Cartesian3();
    var fromOrientedBoundingBoxScratchV = new Cartesian3();
    var fromOrientedBoundingBoxScratchW = new Cartesian3();

    /**
     * Computes a tight-fitting bounding sphere enclosing the provided oriented bounding box.
     *
     * @param {OrientedBoundingBox} orientedBoundingBox The oriented bounding box.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.fromOrientedBoundingBox = function(orientedBoundingBox, result) {
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        var halfAxes = orientedBoundingBox.halfAxes;
        var u = Matrix3.getColumn(halfAxes, 0, fromOrientedBoundingBoxScratchU);
        var v = Matrix3.getColumn(halfAxes, 1, fromOrientedBoundingBoxScratchV);
        var w = Matrix3.getColumn(halfAxes, 2, fromOrientedBoundingBoxScratchW);

        var uHalf = Cartesian3.magnitude(u);
        var vHalf = Cartesian3.magnitude(v);
        var wHalf = Cartesian3.magnitude(w);

        result.center = Cartesian3.clone(orientedBoundingBox.center, result.center);
        result.radius = Math.max(uHalf, vHalf, wHalf);

        return result;
    };

    /**
     * Duplicates a BoundingSphere instance.
     *
     * @param {BoundingSphere} sphere The bounding sphere to duplicate.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided. (Returns undefined if sphere is undefined)
     */
    BoundingSphere.clone = function(sphere, result) {
        if (!defined(sphere)) {
            return undefined;
        }

        if (!defined(result)) {
            return new BoundingSphere(sphere.center, sphere.radius);
        }

        result.center = Cartesian3.clone(sphere.center, result.center);
        result.radius = sphere.radius;
        return result;
    };

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    BoundingSphere.packedLength = 4;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {BoundingSphere} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    BoundingSphere.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        var center = value.center;
        array[startingIndex++] = center.x;
        array[startingIndex++] = center.y;
        array[startingIndex++] = center.z;
        array[startingIndex] = value.radius;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {BoundingSphere} [result] The object into which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
     */
    BoundingSphere.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new BoundingSphere();
        }

        var center = result.center;
        center.x = array[startingIndex++];
        center.y = array[startingIndex++];
        center.z = array[startingIndex++];
        result.radius = array[startingIndex];
        return result;
    };

    var unionScratch = new Cartesian3();
    var unionScratchCenter = new Cartesian3();
    /**
     * Computes a bounding sphere that contains both the left and right bounding spheres.
     *
     * @param {BoundingSphere} left A sphere to enclose in a bounding sphere.
     * @param {BoundingSphere} right A sphere to enclose in a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.union = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        var leftCenter = left.center;
        var leftRadius = left.radius;
        var rightCenter = right.center;
        var rightRadius = right.radius;

        var toRightCenter = Cartesian3.subtract(rightCenter, leftCenter, unionScratch);
        var centerSeparation = Cartesian3.magnitude(toRightCenter);

        if (leftRadius >= (centerSeparation + rightRadius)) {
            // Left sphere wins.
            left.clone(result);
            return result;
        }

        if (rightRadius >= (centerSeparation + leftRadius)) {
            // Right sphere wins.
            right.clone(result);
            return result;
        }

        // There are two tangent points, one on far side of each sphere.
        var halfDistanceBetweenTangentPoints = (leftRadius + centerSeparation + rightRadius) * 0.5;

        // Compute the center point halfway between the two tangent points.
        var center = Cartesian3.multiplyByScalar(toRightCenter,
                (-leftRadius + halfDistanceBetweenTangentPoints) / centerSeparation, unionScratchCenter);
        Cartesian3.add(center, leftCenter, center);
        Cartesian3.clone(center, result.center);
        result.radius = halfDistanceBetweenTangentPoints;

        return result;
    };

    var expandScratch = new Cartesian3();
    /**
     * Computes a bounding sphere by enlarging the provided sphere to contain the provided point.
     *
     * @param {BoundingSphere} sphere A sphere to expand.
     * @param {Cartesian3} point A point to enclose in a bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.expand = function(sphere, point, result) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('point', point);
        
        result = BoundingSphere.clone(sphere, result);

        var radius = Cartesian3.magnitude(Cartesian3.subtract(point, result.center, expandScratch));
        if (radius > result.radius) {
            result.radius = radius;
        }

        return result;
    };

    /**
     * Determines which side of a plane a sphere is located.
     *
     * @param {BoundingSphere} sphere The bounding sphere to test.
     * @param {Plane} plane The plane to test against.
     * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
     *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
     *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
     *                      intersects the plane.
     */
    BoundingSphere.intersectPlane = function(sphere, plane) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('plane', plane);
        
        var center = sphere.center;
        var radius = sphere.radius;
        var normal = plane.normal;
        var distanceToPlane = Cartesian3.dot(normal, center) + plane.distance;

        if (distanceToPlane < -radius) {
            // The center point is negative side of the plane normal
            return Intersect.OUTSIDE;
        } else if (distanceToPlane < radius) {
            // The center point is positive side of the plane, but radius extends beyond it; partial overlap
            return Intersect.INTERSECTING;
        }
        return Intersect.INSIDE;
    };

    /**
     * Applies a 4x4 affine transformation matrix to a bounding sphere.
     *
     * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
     * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.transform = function(sphere, transform, result) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('transform', transform);
        
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        result.center = Matrix4.multiplyByPoint(transform, sphere.center, result.center);
        result.radius = Matrix4.getMaximumScale(transform) * sphere.radius;

        return result;
    };

    var distanceSquaredToScratch = new Cartesian3();

    /**
     * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
     *
     * @param {BoundingSphere} sphere The sphere.
     * @param {Cartesian3} cartesian The point
     * @returns {Number} The estimated distance squared from the bounding sphere to the point.
     *
     * @example
     * // Sort bounding spheres from back to front
     * spheres.sort(function(a, b) {
     *     return Cesium.BoundingSphere.distanceSquaredTo(b, camera.positionWC) - Cesium.BoundingSphere.distanceSquaredTo(a, camera.positionWC);
     * });
     */
    BoundingSphere.distanceSquaredTo = function(sphere, cartesian) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('cartesian', cartesian);
        
        var diff = Cartesian3.subtract(sphere.center, cartesian, distanceSquaredToScratch);
        return Cartesian3.magnitudeSquared(diff) - sphere.radius * sphere.radius;
    };

    /**
     * Applies a 4x4 affine transformation matrix to a bounding sphere where there is no scale
     * The transformation matrix is not verified to have a uniform scale of 1.
     * This method is faster than computing the general bounding sphere transform using {@link BoundingSphere.transform}.
     *
     * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
     * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     *
     * @example
     * var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
     * var boundingSphere = new Cesium.BoundingSphere();
     * var newBoundingSphere = Cesium.BoundingSphere.transformWithoutScale(boundingSphere, modelMatrix);
     */
    BoundingSphere.transformWithoutScale = function(sphere, transform, result) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('transform', transform);
        
        if (!defined(result)) {
            result = new BoundingSphere();
        }

        result.center = Matrix4.multiplyByPoint(transform, sphere.center, result.center);
        result.radius = sphere.radius;

        return result;
    };

    var scratchCartesian3 = new Cartesian3();
    /**
     * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
     * plus/minus the radius of the bounding sphere.
     * <br>
     * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
     * closest and farthest planes from position that intersect the bounding sphere.
     *
     * @param {BoundingSphere} sphere The bounding sphere to calculate the distance to.
     * @param {Cartesian3} position The position to calculate the distance from.
     * @param {Cartesian3} direction The direction from position.
     * @param {Interval} [result] A Interval to store the nearest and farthest distances.
     * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
     */
    BoundingSphere.computePlaneDistances = function(sphere, position, direction, result) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('position', position);
        Check.typeOf.object('direction', direction);
        
        if (!defined(result)) {
            result = new Interval();
        }

        var toCenter = Cartesian3.subtract(sphere.center, position, scratchCartesian3);
        var mag = Cartesian3.dot(direction, toCenter);

        result.start = mag - sphere.radius;
        result.stop = mag + sphere.radius;
        return result;
    };

    var projectTo2DNormalScratch = new Cartesian3();
    var projectTo2DEastScratch = new Cartesian3();
    var projectTo2DNorthScratch = new Cartesian3();
    var projectTo2DWestScratch = new Cartesian3();
    var projectTo2DSouthScratch = new Cartesian3();
    var projectTo2DCartographicScratch = new Cartographic();
    var projectTo2DPositionsScratch = new Array(8);
    for (var n = 0; n < 8; ++n) {
        projectTo2DPositionsScratch[n] = new Cartesian3();
    }

    var projectTo2DProjection = new GeographicProjection();
    /**
     * Creates a bounding sphere in 2D from a bounding sphere in 3D world coordinates.
     *
     * @param {BoundingSphere} sphere The bounding sphere to transform to 2D.
     * @param {Object} [projection=GeographicProjection] The projection to 2D.
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.projectTo2D = function(sphere, projection, result) {
                Check.typeOf.object('sphere', sphere);
        
        projection = defaultValue(projection, projectTo2DProjection);

        var ellipsoid = projection.ellipsoid;
        var center = sphere.center;
        var radius = sphere.radius;

        var normal = ellipsoid.geodeticSurfaceNormal(center, projectTo2DNormalScratch);
        var east = Cartesian3.cross(Cartesian3.UNIT_Z, normal, projectTo2DEastScratch);
        Cartesian3.normalize(east, east);
        var north = Cartesian3.cross(normal, east, projectTo2DNorthScratch);
        Cartesian3.normalize(north, north);

        Cartesian3.multiplyByScalar(normal, radius, normal);
        Cartesian3.multiplyByScalar(north, radius, north);
        Cartesian3.multiplyByScalar(east, radius, east);

        var south = Cartesian3.negate(north, projectTo2DSouthScratch);
        var west = Cartesian3.negate(east, projectTo2DWestScratch);

        var positions = projectTo2DPositionsScratch;

        // top NE corner
        var corner = positions[0];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, east, corner);

        // top NW corner
        corner = positions[1];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, west, corner);

        // top SW corner
        corner = positions[2];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, west, corner);

        // top SE corner
        corner = positions[3];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, east, corner);

        Cartesian3.negate(normal, normal);

        // bottom NE corner
        corner = positions[4];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, east, corner);

        // bottom NW corner
        corner = positions[5];
        Cartesian3.add(normal, north, corner);
        Cartesian3.add(corner, west, corner);

        // bottom SW corner
        corner = positions[6];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, west, corner);

        // bottom SE corner
        corner = positions[7];
        Cartesian3.add(normal, south, corner);
        Cartesian3.add(corner, east, corner);

        var length = positions.length;
        for (var i = 0; i < length; ++i) {
            var position = positions[i];
            Cartesian3.add(center, position, position);
            var cartographic = ellipsoid.cartesianToCartographic(position, projectTo2DCartographicScratch);
            projection.project(cartographic, position);
        }

        result = BoundingSphere.fromPoints(positions, result);

        // swizzle center components
        center = result.center;
        var x = center.x;
        var y = center.y;
        var z = center.z;
        center.x = z;
        center.y = x;
        center.z = y;

        return result;
    };

    /**
     * Determines whether or not a sphere is hidden from view by the occluder.
     *
     * @param {BoundingSphere} sphere The bounding sphere surrounding the occludee object.
     * @param {Occluder} occluder The occluder.
     * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
     */
    BoundingSphere.isOccluded = function(sphere, occluder) {
                Check.typeOf.object('sphere', sphere);
        Check.typeOf.object('occluder', occluder);
                return !occluder.isBoundingSphereVisible(sphere);
    };

    /**
     * Compares the provided BoundingSphere componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {BoundingSphere} [left] The first BoundingSphere.
     * @param {BoundingSphere} [right] The second BoundingSphere.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    BoundingSphere.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                Cartesian3.equals(left.center, right.center) &&
                left.radius === right.radius);
    };

    /**
     * Determines which side of a plane the sphere is located.
     *
     * @param {Plane} plane The plane to test against.
     * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
     *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
     *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
     *                      intersects the plane.
     */
    BoundingSphere.prototype.intersectPlane = function(plane) {
        return BoundingSphere.intersectPlane(this, plane);
    };

    /**
     * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
     *
     * @param {Cartesian3} cartesian The point
     * @returns {Number} The estimated distance squared from the bounding sphere to the point.
     *
     * @example
     * // Sort bounding spheres from back to front
     * spheres.sort(function(a, b) {
     *     return b.distanceSquaredTo(camera.positionWC) - a.distanceSquaredTo(camera.positionWC);
     * });
     */
    BoundingSphere.prototype.distanceSquaredTo = function(cartesian) {
        return BoundingSphere.distanceSquaredTo(this, cartesian);
    };

    /**
     * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
     * plus/minus the radius of the bounding sphere.
     * <br>
     * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
     * closest and farthest planes from position that intersect the bounding sphere.
     *
     * @param {Cartesian3} position The position to calculate the distance from.
     * @param {Cartesian3} direction The direction from position.
     * @param {Interval} [result] A Interval to store the nearest and farthest distances.
     * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
     */
    BoundingSphere.prototype.computePlaneDistances = function(position, direction, result) {
        return BoundingSphere.computePlaneDistances(this, position, direction, result);
    };

    /**
     * Determines whether or not a sphere is hidden from view by the occluder.
     *
     * @param {Occluder} occluder The occluder.
     * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
     */
    BoundingSphere.prototype.isOccluded = function(occluder) {
        return BoundingSphere.isOccluded(this, occluder);
    };

    /**
     * Compares this BoundingSphere against the provided BoundingSphere componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {BoundingSphere} [right] The right hand side BoundingSphere.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    BoundingSphere.prototype.equals = function(right) {
        return BoundingSphere.equals(this, right);
    };

    /**
     * Duplicates this BoundingSphere instance.
     *
     * @param {BoundingSphere} [result] The object onto which to store the result.
     * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
     */
    BoundingSphere.prototype.clone = function(result) {
        return BoundingSphere.clone(this, result);
    };

    return BoundingSphere;
});

/*global define*/
define('Core/EllipsoidalOccluder',[
        './BoundingSphere',
        './Cartesian3',
        './defaultValue',
        './defined',
        './defineProperties',
        './DeveloperError',
        './Rectangle'
    ], function(
        BoundingSphere,
        Cartesian3,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Rectangle) {
    'use strict';

    /**
     * Determine whether or not other objects are visible or hidden behind the visible horizon defined by
     * an {@link Ellipsoid} and a camera position.  The ellipsoid is assumed to be located at the
     * origin of the coordinate system.  This class uses the algorithm described in the
     * {@link http://cesiumjs.org/2013/04/25/Horizon-culling/|Horizon Culling} blog post.
     *
     * @alias EllipsoidalOccluder
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid to use as an occluder.
     * @param {Cartesian3} [cameraPosition] The coordinate of the viewer/camera.  If this parameter is not
     *        specified, {@link EllipsoidalOccluder#cameraPosition} must be called before
     *        testing visibility.
     *
     * @constructor
     *
     * @example
     * // Construct an ellipsoidal occluder with radii 1.0, 1.1, and 0.9.
     * var cameraPosition = new Cesium.Cartesian3(5.0, 6.0, 7.0);
     * var occluderEllipsoid = new Cesium.Ellipsoid(1.0, 1.1, 0.9);
     * var occluder = new Cesium.EllipsoidalOccluder(occluderEllipsoid, cameraPosition);
     *
     * @private
     */
    function EllipsoidalOccluder(ellipsoid, cameraPosition) {
                if (!defined(ellipsoid)) {
            throw new DeveloperError('ellipsoid is required.');
        }
        
        this._ellipsoid = ellipsoid;
        this._cameraPosition = new Cartesian3();
        this._cameraPositionInScaledSpace = new Cartesian3();
        this._distanceToLimbInScaledSpaceSquared = 0.0;

        // cameraPosition fills in the above values
        if (defined(cameraPosition)) {
            this.cameraPosition = cameraPosition;
        }
    }

    defineProperties(EllipsoidalOccluder.prototype, {
        /**
         * Gets the occluding ellipsoid.
         * @memberof EllipsoidalOccluder.prototype
         * @type {Ellipsoid}
         */
        ellipsoid : {
            get: function() {
                return this._ellipsoid;
            }
        },
        /**
         * Gets or sets the position of the camera.
         * @memberof EllipsoidalOccluder.prototype
         * @type {Cartesian3}
         */
        cameraPosition : {
            get : function() {
                return this._cameraPosition;
            },
            set : function(cameraPosition) {
                // See http://cesiumjs.org/2013/04/25/Horizon-culling/
                var ellipsoid = this._ellipsoid;
                var cv = ellipsoid.transformPositionToScaledSpace(cameraPosition, this._cameraPositionInScaledSpace);
                var vhMagnitudeSquared = Cartesian3.magnitudeSquared(cv) - 1.0;

                Cartesian3.clone(cameraPosition, this._cameraPosition);
                this._cameraPositionInScaledSpace = cv;
                this._distanceToLimbInScaledSpaceSquared = vhMagnitudeSquared;
            }
        }
    });

    var scratchCartesian = new Cartesian3();

    /**
     * Determines whether or not a point, the <code>occludee</code>, is hidden from view by the occluder.
     *
     * @param {Cartesian3} occludee The point to test for visibility.
     * @returns {Boolean} <code>true</code> if the occludee is visible; otherwise <code>false</code>.
     *
     * @example
     * var cameraPosition = new Cesium.Cartesian3(0, 0, 2.5);
     * var ellipsoid = new Cesium.Ellipsoid(1.0, 1.1, 0.9);
     * var occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);
     * var point = new Cesium.Cartesian3(0, -3, -3);
     * occluder.isPointVisible(point); //returns true
     */
    EllipsoidalOccluder.prototype.isPointVisible = function(occludee) {
        var ellipsoid = this._ellipsoid;
        var occludeeScaledSpacePosition = ellipsoid.transformPositionToScaledSpace(occludee, scratchCartesian);
        return this.isScaledSpacePointVisible(occludeeScaledSpacePosition);
    };

    /**
     * Determines whether or not a point expressed in the ellipsoid scaled space, is hidden from view by the
     * occluder.  To transform a Cartesian X, Y, Z position in the coordinate system aligned with the ellipsoid
     * into the scaled space, call {@link Ellipsoid#transformPositionToScaledSpace}.
     *
     * @param {Cartesian3} occludeeScaledSpacePosition The point to test for visibility, represented in the scaled space.
     * @returns {Boolean} <code>true</code> if the occludee is visible; otherwise <code>false</code>.
     *
     * @example
     * var cameraPosition = new Cesium.Cartesian3(0, 0, 2.5);
     * var ellipsoid = new Cesium.Ellipsoid(1.0, 1.1, 0.9);
     * var occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);
     * var point = new Cesium.Cartesian3(0, -3, -3);
     * var scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
     * occluder.isScaledSpacePointVisible(scaledSpacePoint); //returns true
     */
    EllipsoidalOccluder.prototype.isScaledSpacePointVisible = function(occludeeScaledSpacePosition) {
        // See http://cesiumjs.org/2013/04/25/Horizon-culling/
        var cv = this._cameraPositionInScaledSpace;
        var vhMagnitudeSquared = this._distanceToLimbInScaledSpaceSquared;
        var vt = Cartesian3.subtract(occludeeScaledSpacePosition, cv, scratchCartesian);
        var vtDotVc = -Cartesian3.dot(vt, cv);
        // If vhMagnitudeSquared < 0 then we are below the surface of the ellipsoid and
        // in this case, set the culling plane to be on V.
        var isOccluded = vhMagnitudeSquared < 0 ? vtDotVc > 0 : (vtDotVc > vhMagnitudeSquared &&
                         vtDotVc * vtDotVc / Cartesian3.magnitudeSquared(vt) > vhMagnitudeSquared);
        return !isOccluded;
    };

    /**
     * Computes a point that can be used for horizon culling from a list of positions.  If the point is below
     * the horizon, all of the positions are guaranteed to be below the horizon as well.  The returned point
     * is expressed in the ellipsoid-scaled space and is suitable for use with
     * {@link EllipsoidalOccluder#isScaledSpacePointVisible}.
     *
     * @param {Cartesian3} directionToPoint The direction that the computed point will lie along.
     *                     A reasonable direction to use is the direction from the center of the ellipsoid to
     *                     the center of the bounding sphere computed from the positions.  The direction need not
     *                     be normalized.
     * @param {Cartesian3[]} positions The positions from which to compute the horizon culling point.  The positions
     *                       must be expressed in a reference frame centered at the ellipsoid and aligned with the
     *                       ellipsoid's axes.
     * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
     * @returns {Cartesian3} The computed horizon culling point, expressed in the ellipsoid-scaled space.
     */
    EllipsoidalOccluder.prototype.computeHorizonCullingPoint = function(directionToPoint, positions, result) {
                if (!defined(directionToPoint)) {
            throw new DeveloperError('directionToPoint is required');
        }
        if (!defined(positions)) {
            throw new DeveloperError('positions is required');
        }
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        var ellipsoid = this._ellipsoid;
        var scaledSpaceDirectionToPoint = computeScaledSpaceDirectionToPoint(ellipsoid, directionToPoint);
        var resultMagnitude = 0.0;

        for (var i = 0, len = positions.length; i < len; ++i) {
            var position = positions[i];
            var candidateMagnitude = computeMagnitude(ellipsoid, position, scaledSpaceDirectionToPoint);
            resultMagnitude = Math.max(resultMagnitude, candidateMagnitude);
        }

        return magnitudeToPoint(scaledSpaceDirectionToPoint, resultMagnitude, result);
    };

    var positionScratch = new Cartesian3();

    /**
     * Computes a point that can be used for horizon culling from a list of positions.  If the point is below
     * the horizon, all of the positions are guaranteed to be below the horizon as well.  The returned point
     * is expressed in the ellipsoid-scaled space and is suitable for use with
     * {@link EllipsoidalOccluder#isScaledSpacePointVisible}.
     *
     * @param {Cartesian3} directionToPoint The direction that the computed point will lie along.
     *                     A reasonable direction to use is the direction from the center of the ellipsoid to
     *                     the center of the bounding sphere computed from the positions.  The direction need not
     *                     be normalized.
     * @param {Number[]} vertices  The vertices from which to compute the horizon culling point.  The positions
     *                   must be expressed in a reference frame centered at the ellipsoid and aligned with the
     *                   ellipsoid's axes.
     * @param {Number} [stride=3]
     * @param {Cartesian3} [center=Cartesian3.ZERO]
     * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
     * @returns {Cartesian3} The computed horizon culling point, expressed in the ellipsoid-scaled space.
     */
    EllipsoidalOccluder.prototype.computeHorizonCullingPointFromVertices = function(directionToPoint, vertices, stride, center, result) {
                if (!defined(directionToPoint)) {
            throw new DeveloperError('directionToPoint is required');
        }
        if (!defined(vertices)) {
            throw new DeveloperError('vertices is required');
        }
        if (!defined(stride)) {
            throw new DeveloperError('stride is required');
        }
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        center = defaultValue(center, Cartesian3.ZERO);
        var ellipsoid = this._ellipsoid;
        var scaledSpaceDirectionToPoint = computeScaledSpaceDirectionToPoint(ellipsoid, directionToPoint);
        var resultMagnitude = 0.0;

        for (var i = 0, len = vertices.length; i < len; i += stride) {
            positionScratch.x = vertices[i] + center.x;
            positionScratch.y = vertices[i + 1] + center.y;
            positionScratch.z = vertices[i + 2] + center.z;

            var candidateMagnitude = computeMagnitude(ellipsoid, positionScratch, scaledSpaceDirectionToPoint);
            resultMagnitude = Math.max(resultMagnitude, candidateMagnitude);
        }

        return magnitudeToPoint(scaledSpaceDirectionToPoint, resultMagnitude, result);
    };

    var subsampleScratch = [];

    /**
     * Computes a point that can be used for horizon culling of an rectangle.  If the point is below
     * the horizon, the ellipsoid-conforming rectangle is guaranteed to be below the horizon as well.
     * The returned point is expressed in the ellipsoid-scaled space and is suitable for use with
     * {@link EllipsoidalOccluder#isScaledSpacePointVisible}.
     *
     * @param {Rectangle} rectangle The rectangle for which to compute the horizon culling point.
     * @param {Ellipsoid} ellipsoid The ellipsoid on which the rectangle is defined.  This may be different from
     *                    the ellipsoid used by this instance for occlusion testing.
     * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
     * @returns {Cartesian3} The computed horizon culling point, expressed in the ellipsoid-scaled space.
     */
    EllipsoidalOccluder.prototype.computeHorizonCullingPointFromRectangle = function(rectangle, ellipsoid, result) {
                if (!defined(rectangle)) {
            throw new DeveloperError('rectangle is required.');
        }
        
        var positions = Rectangle.subsample(rectangle, ellipsoid, 0.0, subsampleScratch);
        var bs = BoundingSphere.fromPoints(positions);

        // If the bounding sphere center is too close to the center of the occluder, it doesn't make
        // sense to try to horizon cull it.
        if (Cartesian3.magnitude(bs.center) < 0.1 * ellipsoid.minimumRadius) {
            return undefined;
        }

        return this.computeHorizonCullingPoint(bs.center, positions, result);
    };

    var scaledSpaceScratch = new Cartesian3();
    var directionScratch = new Cartesian3();

    function computeMagnitude(ellipsoid, position, scaledSpaceDirectionToPoint) {
        var scaledSpacePosition = ellipsoid.transformPositionToScaledSpace(position, scaledSpaceScratch);
        var magnitudeSquared = Cartesian3.magnitudeSquared(scaledSpacePosition);
        var magnitude = Math.sqrt(magnitudeSquared);
        var direction = Cartesian3.divideByScalar(scaledSpacePosition, magnitude, directionScratch);

        // For the purpose of this computation, points below the ellipsoid are consider to be on it instead.
        magnitudeSquared = Math.max(1.0, magnitudeSquared);
        magnitude = Math.max(1.0, magnitude);

        var cosAlpha = Cartesian3.dot(direction, scaledSpaceDirectionToPoint);
        var sinAlpha = Cartesian3.magnitude(Cartesian3.cross(direction, scaledSpaceDirectionToPoint, direction));
        var cosBeta = 1.0 / magnitude;
        var sinBeta = Math.sqrt(magnitudeSquared - 1.0) * cosBeta;

        return 1.0 / (cosAlpha * cosBeta - sinAlpha * sinBeta);
    }

    function magnitudeToPoint(scaledSpaceDirectionToPoint, resultMagnitude, result) {
        // The horizon culling point is undefined if there were no positions from which to compute it,
        // the directionToPoint is pointing opposite all of the positions,  or if we computed NaN or infinity.
        if (resultMagnitude <= 0.0 || resultMagnitude === 1.0 / 0.0 || resultMagnitude !== resultMagnitude) {
            return undefined;
        }

        return Cartesian3.multiplyByScalar(scaledSpaceDirectionToPoint, resultMagnitude, result);
    }

    var directionToPointScratch = new Cartesian3();

    function computeScaledSpaceDirectionToPoint(ellipsoid, directionToPoint) {
        if (Cartesian3.equals(directionToPoint, Cartesian3.ZERO)) {
            return directionToPoint;
        }

        ellipsoid.transformPositionToScaledSpace(directionToPoint, directionToPointScratch);
        return Cartesian3.normalize(directionToPointScratch, directionToPointScratch);
    }

    return EllipsoidalOccluder;
});

/*global define*/
define('Core/WebGLConstants',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * Enum containing WebGL Constant values by name.
     * for use without an active WebGL context, or in cases where certain constants are unavailable using the WebGL context
     * (For example, in [Safari 9]{@link https://github.com/AnalyticalGraphicsInc/cesium/issues/2989}).
     *
     * These match the constants from the [WebGL 1.0]{@link https://www.khronos.org/registry/webgl/specs/latest/1.0/}
     * and [WebGL 2.0]{@link https://www.khronos.org/registry/webgl/specs/latest/2.0/}
     * specifications.
     *
     * @exports WebGLConstants
     */
    var WebGLConstants = {
        DEPTH_BUFFER_BIT : 0x00000100,
        STENCIL_BUFFER_BIT : 0x00000400,
        COLOR_BUFFER_BIT : 0x00004000,
        POINTS : 0x0000,
        LINES : 0x0001,
        LINE_LOOP : 0x0002,
        LINE_STRIP : 0x0003,
        TRIANGLES : 0x0004,
        TRIANGLE_STRIP : 0x0005,
        TRIANGLE_FAN : 0x0006,
        ZERO : 0,
        ONE : 1,
        SRC_COLOR : 0x0300,
        ONE_MINUS_SRC_COLOR : 0x0301,
        SRC_ALPHA : 0x0302,
        ONE_MINUS_SRC_ALPHA : 0x0303,
        DST_ALPHA : 0x0304,
        ONE_MINUS_DST_ALPHA : 0x0305,
        DST_COLOR : 0x0306,
        ONE_MINUS_DST_COLOR : 0x0307,
        SRC_ALPHA_SATURATE : 0x0308,
        FUNC_ADD : 0x8006,
        BLEND_EQUATION : 0x8009,
        BLEND_EQUATION_RGB : 0x8009, // same as BLEND_EQUATION
        BLEND_EQUATION_ALPHA : 0x883D,
        FUNC_SUBTRACT : 0x800A,
        FUNC_REVERSE_SUBTRACT : 0x800B,
        BLEND_DST_RGB : 0x80C8,
        BLEND_SRC_RGB : 0x80C9,
        BLEND_DST_ALPHA : 0x80CA,
        BLEND_SRC_ALPHA : 0x80CB,
        CONSTANT_COLOR : 0x8001,
        ONE_MINUS_CONSTANT_COLOR : 0x8002,
        CONSTANT_ALPHA : 0x8003,
        ONE_MINUS_CONSTANT_ALPHA : 0x8004,
        BLEND_COLOR : 0x8005,
        ARRAY_BUFFER : 0x8892,
        ELEMENT_ARRAY_BUFFER : 0x8893,
        ARRAY_BUFFER_BINDING : 0x8894,
        ELEMENT_ARRAY_BUFFER_BINDING : 0x8895,
        STREAM_DRAW : 0x88E0,
        STATIC_DRAW : 0x88E4,
        DYNAMIC_DRAW : 0x88E8,
        BUFFER_SIZE : 0x8764,
        BUFFER_USAGE : 0x8765,
        CURRENT_VERTEX_ATTRIB : 0x8626,
        FRONT : 0x0404,
        BACK : 0x0405,
        FRONT_AND_BACK : 0x0408,
        CULL_FACE : 0x0B44,
        BLEND : 0x0BE2,
        DITHER : 0x0BD0,
        STENCIL_TEST : 0x0B90,
        DEPTH_TEST : 0x0B71,
        SCISSOR_TEST : 0x0C11,
        POLYGON_OFFSET_FILL : 0x8037,
        SAMPLE_ALPHA_TO_COVERAGE : 0x809E,
        SAMPLE_COVERAGE : 0x80A0,
        NO_ERROR : 0,
        INVALID_ENUM : 0x0500,
        INVALID_VALUE : 0x0501,
        INVALID_OPERATION : 0x0502,
        OUT_OF_MEMORY : 0x0505,
        CW : 0x0900,
        CCW : 0x0901,
        LINE_WIDTH : 0x0B21,
        ALIASED_POINT_SIZE_RANGE : 0x846D,
        ALIASED_LINE_WIDTH_RANGE : 0x846E,
        CULL_FACE_MODE : 0x0B45,
        FRONT_FACE : 0x0B46,
        DEPTH_RANGE : 0x0B70,
        DEPTH_WRITEMASK : 0x0B72,
        DEPTH_CLEAR_VALUE : 0x0B73,
        DEPTH_FUNC : 0x0B74,
        STENCIL_CLEAR_VALUE : 0x0B91,
        STENCIL_FUNC : 0x0B92,
        STENCIL_FAIL : 0x0B94,
        STENCIL_PASS_DEPTH_FAIL : 0x0B95,
        STENCIL_PASS_DEPTH_PASS : 0x0B96,
        STENCIL_REF : 0x0B97,
        STENCIL_VALUE_MASK : 0x0B93,
        STENCIL_WRITEMASK : 0x0B98,
        STENCIL_BACK_FUNC : 0x8800,
        STENCIL_BACK_FAIL : 0x8801,
        STENCIL_BACK_PASS_DEPTH_FAIL : 0x8802,
        STENCIL_BACK_PASS_DEPTH_PASS : 0x8803,
        STENCIL_BACK_REF : 0x8CA3,
        STENCIL_BACK_VALUE_MASK : 0x8CA4,
        STENCIL_BACK_WRITEMASK : 0x8CA5,
        VIEWPORT : 0x0BA2,
        SCISSOR_BOX : 0x0C10,
        COLOR_CLEAR_VALUE : 0x0C22,
        COLOR_WRITEMASK : 0x0C23,
        UNPACK_ALIGNMENT : 0x0CF5,
        PACK_ALIGNMENT : 0x0D05,
        MAX_TEXTURE_SIZE : 0x0D33,
        MAX_VIEWPORT_DIMS : 0x0D3A,
        SUBPIXEL_BITS : 0x0D50,
        RED_BITS : 0x0D52,
        GREEN_BITS : 0x0D53,
        BLUE_BITS : 0x0D54,
        ALPHA_BITS : 0x0D55,
        DEPTH_BITS : 0x0D56,
        STENCIL_BITS : 0x0D57,
        POLYGON_OFFSET_UNITS : 0x2A00,
        POLYGON_OFFSET_FACTOR : 0x8038,
        TEXTURE_BINDING_2D : 0x8069,
        SAMPLE_BUFFERS : 0x80A8,
        SAMPLES : 0x80A9,
        SAMPLE_COVERAGE_VALUE : 0x80AA,
        SAMPLE_COVERAGE_INVERT : 0x80AB,
        COMPRESSED_TEXTURE_FORMATS : 0x86A3,
        DONT_CARE : 0x1100,
        FASTEST : 0x1101,
        NICEST : 0x1102,
        GENERATE_MIPMAP_HINT : 0x8192,
        BYTE : 0x1400,
        UNSIGNED_BYTE : 0x1401,
        SHORT : 0x1402,
        UNSIGNED_SHORT : 0x1403,
        INT : 0x1404,
        UNSIGNED_INT : 0x1405,
        FLOAT : 0x1406,
        DEPTH_COMPONENT : 0x1902,
        ALPHA : 0x1906,
        RGB : 0x1907,
        RGBA : 0x1908,
        LUMINANCE : 0x1909,
        LUMINANCE_ALPHA : 0x190A,
        UNSIGNED_SHORT_4_4_4_4 : 0x8033,
        UNSIGNED_SHORT_5_5_5_1 : 0x8034,
        UNSIGNED_SHORT_5_6_5 : 0x8363,
        FRAGMENT_SHADER : 0x8B30,
        VERTEX_SHADER : 0x8B31,
        MAX_VERTEX_ATTRIBS : 0x8869,
        MAX_VERTEX_UNIFORM_VECTORS : 0x8DFB,
        MAX_VARYING_VECTORS : 0x8DFC,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS : 0x8B4D,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS : 0x8B4C,
        MAX_TEXTURE_IMAGE_UNITS : 0x8872,
        MAX_FRAGMENT_UNIFORM_VECTORS : 0x8DFD,
        SHADER_TYPE : 0x8B4F,
        DELETE_STATUS : 0x8B80,
        LINK_STATUS : 0x8B82,
        VALIDATE_STATUS : 0x8B83,
        ATTACHED_SHADERS : 0x8B85,
        ACTIVE_UNIFORMS : 0x8B86,
        ACTIVE_ATTRIBUTES : 0x8B89,
        SHADING_LANGUAGE_VERSION : 0x8B8C,
        CURRENT_PROGRAM : 0x8B8D,
        NEVER : 0x0200,
        LESS : 0x0201,
        EQUAL : 0x0202,
        LEQUAL : 0x0203,
        GREATER : 0x0204,
        NOTEQUAL : 0x0205,
        GEQUAL : 0x0206,
        ALWAYS : 0x0207,
        KEEP : 0x1E00,
        REPLACE : 0x1E01,
        INCR : 0x1E02,
        DECR : 0x1E03,
        INVERT : 0x150A,
        INCR_WRAP : 0x8507,
        DECR_WRAP : 0x8508,
        VENDOR : 0x1F00,
        RENDERER : 0x1F01,
        VERSION : 0x1F02,
        NEAREST : 0x2600,
        LINEAR : 0x2601,
        NEAREST_MIPMAP_NEAREST : 0x2700,
        LINEAR_MIPMAP_NEAREST : 0x2701,
        NEAREST_MIPMAP_LINEAR : 0x2702,
        LINEAR_MIPMAP_LINEAR : 0x2703,
        TEXTURE_MAG_FILTER : 0x2800,
        TEXTURE_MIN_FILTER : 0x2801,
        TEXTURE_WRAP_S : 0x2802,
        TEXTURE_WRAP_T : 0x2803,
        TEXTURE_2D : 0x0DE1,
        TEXTURE : 0x1702,
        TEXTURE_CUBE_MAP : 0x8513,
        TEXTURE_BINDING_CUBE_MAP : 0x8514,
        TEXTURE_CUBE_MAP_POSITIVE_X : 0x8515,
        TEXTURE_CUBE_MAP_NEGATIVE_X : 0x8516,
        TEXTURE_CUBE_MAP_POSITIVE_Y : 0x8517,
        TEXTURE_CUBE_MAP_NEGATIVE_Y : 0x8518,
        TEXTURE_CUBE_MAP_POSITIVE_Z : 0x8519,
        TEXTURE_CUBE_MAP_NEGATIVE_Z : 0x851A,
        MAX_CUBE_MAP_TEXTURE_SIZE : 0x851C,
        TEXTURE0 : 0x84C0,
        TEXTURE1 : 0x84C1,
        TEXTURE2 : 0x84C2,
        TEXTURE3 : 0x84C3,
        TEXTURE4 : 0x84C4,
        TEXTURE5 : 0x84C5,
        TEXTURE6 : 0x84C6,
        TEXTURE7 : 0x84C7,
        TEXTURE8 : 0x84C8,
        TEXTURE9 : 0x84C9,
        TEXTURE10 : 0x84CA,
        TEXTURE11 : 0x84CB,
        TEXTURE12 : 0x84CC,
        TEXTURE13 : 0x84CD,
        TEXTURE14 : 0x84CE,
        TEXTURE15 : 0x84CF,
        TEXTURE16 : 0x84D0,
        TEXTURE17 : 0x84D1,
        TEXTURE18 : 0x84D2,
        TEXTURE19 : 0x84D3,
        TEXTURE20 : 0x84D4,
        TEXTURE21 : 0x84D5,
        TEXTURE22 : 0x84D6,
        TEXTURE23 : 0x84D7,
        TEXTURE24 : 0x84D8,
        TEXTURE25 : 0x84D9,
        TEXTURE26 : 0x84DA,
        TEXTURE27 : 0x84DB,
        TEXTURE28 : 0x84DC,
        TEXTURE29 : 0x84DD,
        TEXTURE30 : 0x84DE,
        TEXTURE31 : 0x84DF,
        ACTIVE_TEXTURE : 0x84E0,
        REPEAT : 0x2901,
        CLAMP_TO_EDGE : 0x812F,
        MIRRORED_REPEAT : 0x8370,
        FLOAT_VEC2 : 0x8B50,
        FLOAT_VEC3 : 0x8B51,
        FLOAT_VEC4 : 0x8B52,
        INT_VEC2 : 0x8B53,
        INT_VEC3 : 0x8B54,
        INT_VEC4 : 0x8B55,
        BOOL : 0x8B56,
        BOOL_VEC2 : 0x8B57,
        BOOL_VEC3 : 0x8B58,
        BOOL_VEC4 : 0x8B59,
        FLOAT_MAT2 : 0x8B5A,
        FLOAT_MAT3 : 0x8B5B,
        FLOAT_MAT4 : 0x8B5C,
        SAMPLER_2D : 0x8B5E,
        SAMPLER_CUBE : 0x8B60,
        VERTEX_ATTRIB_ARRAY_ENABLED : 0x8622,
        VERTEX_ATTRIB_ARRAY_SIZE : 0x8623,
        VERTEX_ATTRIB_ARRAY_STRIDE : 0x8624,
        VERTEX_ATTRIB_ARRAY_TYPE : 0x8625,
        VERTEX_ATTRIB_ARRAY_NORMALIZED : 0x886A,
        VERTEX_ATTRIB_ARRAY_POINTER : 0x8645,
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : 0x889F,
        IMPLEMENTATION_COLOR_READ_TYPE : 0x8B9A,
        IMPLEMENTATION_COLOR_READ_FORMAT : 0x8B9B,
        COMPILE_STATUS : 0x8B81,
        LOW_FLOAT : 0x8DF0,
        MEDIUM_FLOAT : 0x8DF1,
        HIGH_FLOAT : 0x8DF2,
        LOW_INT : 0x8DF3,
        MEDIUM_INT : 0x8DF4,
        HIGH_INT : 0x8DF5,
        FRAMEBUFFER : 0x8D40,
        RENDERBUFFER : 0x8D41,
        RGBA4 : 0x8056,
        RGB5_A1 : 0x8057,
        RGB565 : 0x8D62,
        DEPTH_COMPONENT16 : 0x81A5,
        STENCIL_INDEX : 0x1901,
        STENCIL_INDEX8 : 0x8D48,
        DEPTH_STENCIL : 0x84F9,
        RENDERBUFFER_WIDTH : 0x8D42,
        RENDERBUFFER_HEIGHT : 0x8D43,
        RENDERBUFFER_INTERNAL_FORMAT : 0x8D44,
        RENDERBUFFER_RED_SIZE : 0x8D50,
        RENDERBUFFER_GREEN_SIZE : 0x8D51,
        RENDERBUFFER_BLUE_SIZE : 0x8D52,
        RENDERBUFFER_ALPHA_SIZE : 0x8D53,
        RENDERBUFFER_DEPTH_SIZE : 0x8D54,
        RENDERBUFFER_STENCIL_SIZE : 0x8D55,
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : 0x8CD0,
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : 0x8CD1,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : 0x8CD2,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : 0x8CD3,
        COLOR_ATTACHMENT0 : 0x8CE0,
        DEPTH_ATTACHMENT : 0x8D00,
        STENCIL_ATTACHMENT : 0x8D20,
        DEPTH_STENCIL_ATTACHMENT : 0x821A,
        NONE : 0,
        FRAMEBUFFER_COMPLETE : 0x8CD5,
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT : 0x8CD6,
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : 0x8CD7,
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS : 0x8CD9,
        FRAMEBUFFER_UNSUPPORTED : 0x8CDD,
        FRAMEBUFFER_BINDING : 0x8CA6,
        RENDERBUFFER_BINDING : 0x8CA7,
        MAX_RENDERBUFFER_SIZE : 0x84E8,
        INVALID_FRAMEBUFFER_OPERATION : 0x0506,
        UNPACK_FLIP_Y_WEBGL : 0x9240,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL : 0x9241,
        CONTEXT_LOST_WEBGL : 0x9242,
        UNPACK_COLORSPACE_CONVERSION_WEBGL : 0x9243,
        BROWSER_DEFAULT_WEBGL : 0x9244,

        // WEBGL_compressed_texture_s3tc
        COMPRESSED_RGB_S3TC_DXT1_EXT : 0x83F0,
        COMPRESSED_RGBA_S3TC_DXT1_EXT : 0x83F1,
        COMPRESSED_RGBA_S3TC_DXT3_EXT : 0x83F2,
        COMPRESSED_RGBA_S3TC_DXT5_EXT : 0x83F3,

        // WEBGL_compressed_texture_pvrtc
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG : 0x8C00,
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG : 0x8C01,
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : 0x8C02,
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : 0x8C03,

        // WEBGL_compressed_texture_etc1
        COMPRESSED_RGB_ETC1_WEBGL : 0x8D64,

        // Desktop OpenGL
        DOUBLE : 0x140A,

        // WebGL 2
        READ_BUFFER : 0x0C02,
        UNPACK_ROW_LENGTH : 0x0CF2,
        UNPACK_SKIP_ROWS : 0x0CF3,
        UNPACK_SKIP_PIXELS : 0x0CF4,
        PACK_ROW_LENGTH : 0x0D02,
        PACK_SKIP_ROWS : 0x0D03,
        PACK_SKIP_PIXELS : 0x0D04,
        COLOR : 0x1800,
        DEPTH : 0x1801,
        STENCIL : 0x1802,
        RED : 0x1903,
        RGB8 : 0x8051,
        RGBA8 : 0x8058,
        RGB10_A2 : 0x8059,
        TEXTURE_BINDING_3D : 0x806A,
        UNPACK_SKIP_IMAGES : 0x806D,
        UNPACK_IMAGE_HEIGHT : 0x806E,
        TEXTURE_3D : 0x806F,
        TEXTURE_WRAP_R : 0x8072,
        MAX_3D_TEXTURE_SIZE : 0x8073,
        UNSIGNED_INT_2_10_10_10_REV : 0x8368,
        MAX_ELEMENTS_VERTICES : 0x80E8,
        MAX_ELEMENTS_INDICES : 0x80E9,
        TEXTURE_MIN_LOD : 0x813A,
        TEXTURE_MAX_LOD : 0x813B,
        TEXTURE_BASE_LEVEL : 0x813C,
        TEXTURE_MAX_LEVEL : 0x813D,
        MIN : 0x8007,
        MAX : 0x8008,
        DEPTH_COMPONENT24 : 0x81A6,
        MAX_TEXTURE_LOD_BIAS : 0x84FD,
        TEXTURE_COMPARE_MODE : 0x884C,
        TEXTURE_COMPARE_FUNC : 0x884D,
        CURRENT_QUERY : 0x8865,
        QUERY_RESULT : 0x8866,
        QUERY_RESULT_AVAILABLE : 0x8867,
        STREAM_READ : 0x88E1,
        STREAM_COPY : 0x88E2,
        STATIC_READ : 0x88E5,
        STATIC_COPY : 0x88E6,
        DYNAMIC_READ : 0x88E9,
        DYNAMIC_COPY : 0x88EA,
        MAX_DRAW_BUFFERS : 0x8824,
        DRAW_BUFFER0 : 0x8825,
        DRAW_BUFFER1 : 0x8826,
        DRAW_BUFFER2 : 0x8827,
        DRAW_BUFFER3 : 0x8828,
        DRAW_BUFFER4 : 0x8829,
        DRAW_BUFFER5 : 0x882A,
        DRAW_BUFFER6 : 0x882B,
        DRAW_BUFFER7 : 0x882C,
        DRAW_BUFFER8 : 0x882D,
        DRAW_BUFFER9 : 0x882E,
        DRAW_BUFFER10 : 0x882F,
        DRAW_BUFFER11 : 0x8830,
        DRAW_BUFFER12 : 0x8831,
        DRAW_BUFFER13 : 0x8832,
        DRAW_BUFFER14 : 0x8833,
        DRAW_BUFFER15 : 0x8834,
        MAX_FRAGMENT_UNIFORM_COMPONENTS : 0x8B49,
        MAX_VERTEX_UNIFORM_COMPONENTS : 0x8B4A,
        SAMPLER_3D : 0x8B5F,
        SAMPLER_2D_SHADOW : 0x8B62,
        FRAGMENT_SHADER_DERIVATIVE_HINT : 0x8B8B,
        PIXEL_PACK_BUFFER : 0x88EB,
        PIXEL_UNPACK_BUFFER : 0x88EC,
        PIXEL_PACK_BUFFER_BINDING : 0x88ED,
        PIXEL_UNPACK_BUFFER_BINDING : 0x88EF,
        FLOAT_MAT2x3 : 0x8B65,
        FLOAT_MAT2x4 : 0x8B66,
        FLOAT_MAT3x2 : 0x8B67,
        FLOAT_MAT3x4 : 0x8B68,
        FLOAT_MAT4x2 : 0x8B69,
        FLOAT_MAT4x3 : 0x8B6A,
        SRGB : 0x8C40,
        SRGB8 : 0x8C41,
        SRGB8_ALPHA8 : 0x8C43,
        COMPARE_REF_TO_TEXTURE : 0x884E,
        RGBA32F : 0x8814,
        RGB32F : 0x8815,
        RGBA16F : 0x881A,
        RGB16F : 0x881B,
        VERTEX_ATTRIB_ARRAY_INTEGER : 0x88FD,
        MAX_ARRAY_TEXTURE_LAYERS : 0x88FF,
        MIN_PROGRAM_TEXEL_OFFSET : 0x8904,
        MAX_PROGRAM_TEXEL_OFFSET : 0x8905,
        MAX_VARYING_COMPONENTS : 0x8B4B,
        TEXTURE_2D_ARRAY : 0x8C1A,
        TEXTURE_BINDING_2D_ARRAY : 0x8C1D,
        R11F_G11F_B10F : 0x8C3A,
        UNSIGNED_INT_10F_11F_11F_REV : 0x8C3B,
        RGB9_E5 : 0x8C3D,
        UNSIGNED_INT_5_9_9_9_REV : 0x8C3E,
        TRANSFORM_FEEDBACK_BUFFER_MODE : 0x8C7F,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS : 0x8C80,
        TRANSFORM_FEEDBACK_VARYINGS : 0x8C83,
        TRANSFORM_FEEDBACK_BUFFER_START : 0x8C84,
        TRANSFORM_FEEDBACK_BUFFER_SIZE : 0x8C85,
        TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN : 0x8C88,
        RASTERIZER_DISCARD : 0x8C89,
        MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS : 0x8C8A,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS : 0x8C8B,
        INTERLEAVED_ATTRIBS : 0x8C8C,
        SEPARATE_ATTRIBS : 0x8C8D,
        TRANSFORM_FEEDBACK_BUFFER : 0x8C8E,
        TRANSFORM_FEEDBACK_BUFFER_BINDING : 0x8C8F,
        RGBA32UI : 0x8D70,
        RGB32UI : 0x8D71,
        RGBA16UI : 0x8D76,
        RGB16UI : 0x8D77,
        RGBA8UI : 0x8D7C,
        RGB8UI : 0x8D7D,
        RGBA32I : 0x8D82,
        RGB32I : 0x8D83,
        RGBA16I : 0x8D88,
        RGB16I : 0x8D89,
        RGBA8I : 0x8D8E,
        RGB8I : 0x8D8F,
        RED_INTEGER : 0x8D94,
        RGB_INTEGER : 0x8D98,
        RGBA_INTEGER : 0x8D99,
        SAMPLER_2D_ARRAY : 0x8DC1,
        SAMPLER_2D_ARRAY_SHADOW : 0x8DC4,
        SAMPLER_CUBE_SHADOW : 0x8DC5,
        UNSIGNED_INT_VEC2 : 0x8DC6,
        UNSIGNED_INT_VEC3 : 0x8DC7,
        UNSIGNED_INT_VEC4 : 0x8DC8,
        INT_SAMPLER_2D : 0x8DCA,
        INT_SAMPLER_3D : 0x8DCB,
        INT_SAMPLER_CUBE : 0x8DCC,
        INT_SAMPLER_2D_ARRAY : 0x8DCF,
        UNSIGNED_INT_SAMPLER_2D : 0x8DD2,
        UNSIGNED_INT_SAMPLER_3D : 0x8DD3,
        UNSIGNED_INT_SAMPLER_CUBE : 0x8DD4,
        UNSIGNED_INT_SAMPLER_2D_ARRAY : 0x8DD7,
        DEPTH_COMPONENT32F : 0x8CAC,
        DEPTH32F_STENCIL8 : 0x8CAD,
        FLOAT_32_UNSIGNED_INT_24_8_REV : 0x8DAD,
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING : 0x8210,
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE : 0x8211,
        FRAMEBUFFER_ATTACHMENT_RED_SIZE : 0x8212,
        FRAMEBUFFER_ATTACHMENT_GREEN_SIZE : 0x8213,
        FRAMEBUFFER_ATTACHMENT_BLUE_SIZE : 0x8214,
        FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE : 0x8215,
        FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE : 0x8216,
        FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE : 0x8217,
        FRAMEBUFFER_DEFAULT : 0x8218,
        UNSIGNED_INT_24_8 : 0x84FA,
        DEPTH24_STENCIL8 : 0x88F0,
        UNSIGNED_NORMALIZED : 0x8C17,
        DRAW_FRAMEBUFFER_BINDING : 0x8CA6, // Same as FRAMEBUFFER_BINDING
        READ_FRAMEBUFFER : 0x8CA8,
        DRAW_FRAMEBUFFER : 0x8CA9,
        READ_FRAMEBUFFER_BINDING : 0x8CAA,
        RENDERBUFFER_SAMPLES : 0x8CAB,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER : 0x8CD4,
        MAX_COLOR_ATTACHMENTS : 0x8CDF,
        COLOR_ATTACHMENT1 : 0x8CE1,
        COLOR_ATTACHMENT2 : 0x8CE2,
        COLOR_ATTACHMENT3 : 0x8CE3,
        COLOR_ATTACHMENT4 : 0x8CE4,
        COLOR_ATTACHMENT5 : 0x8CE5,
        COLOR_ATTACHMENT6 : 0x8CE6,
        COLOR_ATTACHMENT7 : 0x8CE7,
        COLOR_ATTACHMENT8 : 0x8CE8,
        COLOR_ATTACHMENT9 : 0x8CE9,
        COLOR_ATTACHMENT10 : 0x8CEA,
        COLOR_ATTACHMENT11 : 0x8CEB,
        COLOR_ATTACHMENT12 : 0x8CEC,
        COLOR_ATTACHMENT13 : 0x8CED,
        COLOR_ATTACHMENT14 : 0x8CEE,
        COLOR_ATTACHMENT15 : 0x8CEF,
        FRAMEBUFFER_INCOMPLETE_MULTISAMPLE : 0x8D56,
        MAX_SAMPLES : 0x8D57,
        HALF_FLOAT : 0x140B,
        RG : 0x8227,
        RG_INTEGER : 0x8228,
        R8 : 0x8229,
        RG8 : 0x822B,
        R16F : 0x822D,
        R32F : 0x822E,
        RG16F : 0x822F,
        RG32F : 0x8230,
        R8I : 0x8231,
        R8UI : 0x8232,
        R16I : 0x8233,
        R16UI : 0x8234,
        R32I : 0x8235,
        R32UI : 0x8236,
        RG8I : 0x8237,
        RG8UI : 0x8238,
        RG16I : 0x8239,
        RG16UI : 0x823A,
        RG32I : 0x823B,
        RG32UI : 0x823C,
        VERTEX_ARRAY_BINDING : 0x85B5,
        R8_SNORM : 0x8F94,
        RG8_SNORM : 0x8F95,
        RGB8_SNORM : 0x8F96,
        RGBA8_SNORM : 0x8F97,
        SIGNED_NORMALIZED : 0x8F9C,
        COPY_READ_BUFFER : 0x8F36,
        COPY_WRITE_BUFFER : 0x8F37,
        COPY_READ_BUFFER_BINDING : 0x8F36, // Same as COPY_READ_BUFFER
        COPY_WRITE_BUFFER_BINDING : 0x8F37, // Same as COPY_WRITE_BUFFER
        UNIFORM_BUFFER : 0x8A11,
        UNIFORM_BUFFER_BINDING : 0x8A28,
        UNIFORM_BUFFER_START : 0x8A29,
        UNIFORM_BUFFER_SIZE : 0x8A2A,
        MAX_VERTEX_UNIFORM_BLOCKS : 0x8A2B,
        MAX_FRAGMENT_UNIFORM_BLOCKS : 0x8A2D,
        MAX_COMBINED_UNIFORM_BLOCKS : 0x8A2E,
        MAX_UNIFORM_BUFFER_BINDINGS : 0x8A2F,
        MAX_UNIFORM_BLOCK_SIZE : 0x8A30,
        MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS : 0x8A31,
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS : 0x8A33,
        UNIFORM_BUFFER_OFFSET_ALIGNMENT : 0x8A34,
        ACTIVE_UNIFORM_BLOCKS : 0x8A36,
        UNIFORM_TYPE : 0x8A37,
        UNIFORM_SIZE : 0x8A38,
        UNIFORM_BLOCK_INDEX : 0x8A3A,
        UNIFORM_OFFSET : 0x8A3B,
        UNIFORM_ARRAY_STRIDE : 0x8A3C,
        UNIFORM_MATRIX_STRIDE : 0x8A3D,
        UNIFORM_IS_ROW_MAJOR : 0x8A3E,
        UNIFORM_BLOCK_BINDING : 0x8A3F,
        UNIFORM_BLOCK_DATA_SIZE : 0x8A40,
        UNIFORM_BLOCK_ACTIVE_UNIFORMS : 0x8A42,
        UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES : 0x8A43,
        UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER : 0x8A44,
        UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER : 0x8A46,
        INVALID_INDEX : 0xFFFFFFFF,
        MAX_VERTEX_OUTPUT_COMPONENTS : 0x9122,
        MAX_FRAGMENT_INPUT_COMPONENTS : 0x9125,
        MAX_SERVER_WAIT_TIMEOUT : 0x9111,
        OBJECT_TYPE : 0x9112,
        SYNC_CONDITION : 0x9113,
        SYNC_STATUS : 0x9114,
        SYNC_FLAGS : 0x9115,
        SYNC_FENCE : 0x9116,
        SYNC_GPU_COMMANDS_COMPLETE : 0x9117,
        UNSIGNALED : 0x9118,
        SIGNALED : 0x9119,
        ALREADY_SIGNALED : 0x911A,
        TIMEOUT_EXPIRED : 0x911B,
        CONDITION_SATISFIED : 0x911C,
        WAIT_FAILED : 0x911D,
        SYNC_FLUSH_COMMANDS_BIT : 0x00000001,
        VERTEX_ATTRIB_ARRAY_DIVISOR : 0x88FE,
        ANY_SAMPLES_PASSED : 0x8C2F,
        ANY_SAMPLES_PASSED_CONSERVATIVE : 0x8D6A,
        SAMPLER_BINDING : 0x8919,
        RGB10_A2UI : 0x906F,
        INT_2_10_10_10_REV : 0x8D9F,
        TRANSFORM_FEEDBACK : 0x8E22,
        TRANSFORM_FEEDBACK_PAUSED : 0x8E23,
        TRANSFORM_FEEDBACK_ACTIVE : 0x8E24,
        TRANSFORM_FEEDBACK_BINDING : 0x8E25,
        COMPRESSED_R11_EAC : 0x9270,
        COMPRESSED_SIGNED_R11_EAC : 0x9271,
        COMPRESSED_RG11_EAC : 0x9272,
        COMPRESSED_SIGNED_RG11_EAC : 0x9273,
        COMPRESSED_RGB8_ETC2 : 0x9274,
        COMPRESSED_SRGB8_ETC2 : 0x9275,
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 : 0x9276,
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 : 0x9277,
        COMPRESSED_RGBA8_ETC2_EAC : 0x9278,
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : 0x9279,
        TEXTURE_IMMUTABLE_FORMAT : 0x912F,
        MAX_ELEMENT_INDEX : 0x8D6B,
        TEXTURE_IMMUTABLE_LEVELS : 0x82DF,

        // Extensions
        MAX_TEXTURE_MAX_ANISOTROPY_EXT : 0x84FF
    };

    return freezeObject(WebGLConstants);
});

/*global define*/
define('Core/IndexDatatype',[
        './defined',
        './DeveloperError',
        './freezeObject',
        './Math',
        './WebGLConstants'
    ], function(
        defined,
        DeveloperError,
        freezeObject,
        CesiumMath,
        WebGLConstants) {
    'use strict';

    /**
     * Constants for WebGL index datatypes.  These corresponds to the
     * <code>type</code> parameter of {@link http://www.khronos.org/opengles/sdk/docs/man/xhtml/glDrawElements.xml|drawElements}.
     *
     * @exports IndexDatatype
     */
    var IndexDatatype = {
        /**
         * 8-bit unsigned byte corresponding to <code>UNSIGNED_BYTE</code> and the type
         * of an element in <code>Uint8Array</code>.
         *
         * @type {Number}
         * @constant
         */
        UNSIGNED_BYTE : WebGLConstants.UNSIGNED_BYTE,

        /**
         * 16-bit unsigned short corresponding to <code>UNSIGNED_SHORT</code> and the type
         * of an element in <code>Uint16Array</code>.
         *
         * @type {Number}
         * @constant
         */
        UNSIGNED_SHORT : WebGLConstants.UNSIGNED_SHORT,

        /**
         * 32-bit unsigned int corresponding to <code>UNSIGNED_INT</code> and the type
         * of an element in <code>Uint32Array</code>.
         *
         * @type {Number}
         * @constant
         */
        UNSIGNED_INT : WebGLConstants.UNSIGNED_INT
    };

    /**
     * Returns the size, in bytes, of the corresponding datatype.
     *
     * @param {IndexDatatype} indexDatatype The index datatype to get the size of.
     * @returns {Number} The size in bytes.
     *
     * @example
     * // Returns 2
     * var size = Cesium.IndexDatatype.getSizeInBytes(Cesium.IndexDatatype.UNSIGNED_SHORT);
     */
    IndexDatatype.getSizeInBytes = function(indexDatatype) {
        switch(indexDatatype) {
            case IndexDatatype.UNSIGNED_BYTE:
                return Uint8Array.BYTES_PER_ELEMENT;
            case IndexDatatype.UNSIGNED_SHORT:
                return Uint16Array.BYTES_PER_ELEMENT;
            case IndexDatatype.UNSIGNED_INT:
                return Uint32Array.BYTES_PER_ELEMENT;
        }

                throw new DeveloperError('indexDatatype is required and must be a valid IndexDatatype constant.');
            };

    /**
     * Validates that the provided index datatype is a valid {@link IndexDatatype}.
     *
     * @param {IndexDatatype} indexDatatype The index datatype to validate.
     * @returns {Boolean} <code>true</code> if the provided index datatype is a valid value; otherwise, <code>false</code>.
     *
     * @example
     * if (!Cesium.IndexDatatype.validate(indexDatatype)) {
     *   throw new Cesium.DeveloperError('indexDatatype must be a valid value.');
     * }
     */
    IndexDatatype.validate = function(indexDatatype) {
        return defined(indexDatatype) &&
               (indexDatatype === IndexDatatype.UNSIGNED_BYTE ||
                indexDatatype === IndexDatatype.UNSIGNED_SHORT ||
                indexDatatype === IndexDatatype.UNSIGNED_INT);
    };

    /**
     * Creates a typed array that will store indices, using either <code><Uint16Array</code>
     * or <code>Uint32Array</code> depending on the number of vertices.
     *
     * @param {Number} numberOfVertices Number of vertices that the indices will reference.
     * @param {*} indicesLengthOrArray Passed through to the typed array constructor.
     * @returns {Uint16Array|Uint32Array} A <code>Uint16Array</code> or <code>Uint32Array</code> constructed with <code>indicesLengthOrArray</code>.
     *
     * @example
     * this.indices = Cesium.IndexDatatype.createTypedArray(positions.length / 3, numberOfIndices);
     */
    IndexDatatype.createTypedArray = function(numberOfVertices, indicesLengthOrArray) {
                if (!defined(numberOfVertices)) {
            throw new DeveloperError('numberOfVertices is required.');
        }
        
        if (numberOfVertices >= CesiumMath.SIXTY_FOUR_KILOBYTES) {
            return new Uint32Array(indicesLengthOrArray);
        }

        return new Uint16Array(indicesLengthOrArray);
    };

    /**
     * Creates a typed array from a source array buffer.  The resulting typed array will store indices, using either <code><Uint16Array</code>
     * or <code>Uint32Array</code> depending on the number of vertices.
     *
     * @param {Number} numberOfVertices Number of vertices that the indices will reference.
     * @param {ArrayBuffer} sourceArray Passed through to the typed array constructor.
     * @param {Number} byteOffset Passed through to the typed array constructor.
     * @param {Number} length Passed through to the typed array constructor.
     * @returns {Uint16Array|Uint32Array} A <code>Uint16Array</code> or <code>Uint32Array</code> constructed with <code>sourceArray</code>, <code>byteOffset</code>, and <code>length</code>.
     *
     */
    IndexDatatype.createTypedArrayFromArrayBuffer = function(numberOfVertices, sourceArray, byteOffset, length) {
                if (!defined(numberOfVertices)) {
            throw new DeveloperError('numberOfVertices is required.');
        }
        if (!defined(sourceArray)) {
            throw new DeveloperError('sourceArray is required.');
        }
        if (!defined(byteOffset)) {
            throw new DeveloperError('byteOffset is required.');
        }
        
        if (numberOfVertices >= CesiumMath.SIXTY_FOUR_KILOBYTES) {
            return new Uint32Array(sourceArray, byteOffset, length);
        }

        return new Uint16Array(sourceArray, byteOffset, length);
    };

    return freezeObject(IndexDatatype);
});

/*global define*/
define('Core/Intersections2D',[
        './Cartesian3',
        './defined',
        './DeveloperError'
    ], function(
        Cartesian3,
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Contains functions for operating on 2D triangles.
     *
     * @exports Intersections2D
     */
    var Intersections2D = {};

    /**
     * Splits a 2D triangle at given axis-aligned threshold value and returns the resulting
     * polygon on a given side of the threshold.  The resulting polygon may have 0, 1, 2,
     * 3, or 4 vertices.
     *
     * @param {Number} threshold The threshold coordinate value at which to clip the triangle.
     * @param {Boolean} keepAbove true to keep the portion of the triangle above the threshold, or false
     *                            to keep the portion below.
     * @param {Number} u0 The coordinate of the first vertex in the triangle, in counter-clockwise order.
     * @param {Number} u1 The coordinate of the second vertex in the triangle, in counter-clockwise order.
     * @param {Number} u2 The coordinate of the third vertex in the triangle, in counter-clockwise order.
     * @param {Number[]} [result] The array into which to copy the result.  If this parameter is not supplied,
     *                            a new array is constructed and returned.
     * @returns {Number[]} The polygon that results after the clip, specified as a list of
     *                     vertices.  The vertices are specified in counter-clockwise order.
     *                     Each vertex is either an index from the existing list (identified as
     *                     a 0, 1, or 2) or -1 indicating a new vertex not in the original triangle.
     *                     For new vertices, the -1 is followed by three additional numbers: the
     *                     index of each of the two original vertices forming the line segment that
     *                     the new vertex lies on, and the fraction of the distance from the first
     *                     vertex to the second one.
     *
     * @example
     * var result = Cesium.Intersections2D.clipTriangleAtAxisAlignedThreshold(0.5, false, 0.2, 0.6, 0.4);
     * // result === [2, 0, -1, 1, 0, 0.25, -1, 1, 2, 0.5]
     */
    Intersections2D.clipTriangleAtAxisAlignedThreshold = function(threshold, keepAbove, u0, u1, u2, result) {
                if (!defined(threshold)) {
            throw new DeveloperError('threshold is required.');
        }
        if (!defined(keepAbove)) {
            throw new DeveloperError('keepAbove is required.');
        }
        if (!defined(u0)) {
            throw new DeveloperError('u0 is required.');
        }
        if (!defined(u1)) {
            throw new DeveloperError('u1 is required.');
        }
        if (!defined(u2)) {
            throw new DeveloperError('u2 is required.');
        }
        
        if (!defined(result)) {
            result = [];
        } else {
            result.length = 0;
        }

        var u0Behind;
        var u1Behind;
        var u2Behind;
        if (keepAbove) {
            u0Behind = u0 < threshold;
            u1Behind = u1 < threshold;
            u2Behind = u2 < threshold;
        } else {
            u0Behind = u0 > threshold;
            u1Behind = u1 > threshold;
            u2Behind = u2 > threshold;
        }

        var numBehind = u0Behind + u1Behind + u2Behind;

        var u01Ratio;
        var u02Ratio;
        var u12Ratio;
        var u10Ratio;
        var u20Ratio;
        var u21Ratio;

        if (numBehind === 1) {
            if (u0Behind) {
                u01Ratio = (threshold - u0) / (u1 - u0);
                u02Ratio = (threshold - u0) / (u2 - u0);

                result.push(1);

                result.push(2);

                if (u02Ratio !== 1.0) {
                    result.push(-1);
                    result.push(0);
                    result.push(2);
                    result.push(u02Ratio);
                }

                if (u01Ratio !== 1.0) {
                    result.push(-1);
                    result.push(0);
                    result.push(1);
                    result.push(u01Ratio);
                }
            } else if (u1Behind) {
                u12Ratio = (threshold - u1) / (u2 - u1);
                u10Ratio = (threshold - u1) / (u0 - u1);

                result.push(2);

                result.push(0);

                if (u10Ratio !== 1.0) {
                    result.push(-1);
                    result.push(1);
                    result.push(0);
                    result.push(u10Ratio);
                }

                if (u12Ratio !== 1.0) {
                    result.push(-1);
                    result.push(1);
                    result.push(2);
                    result.push(u12Ratio);
                }
            } else if (u2Behind) {
                u20Ratio = (threshold - u2) / (u0 - u2);
                u21Ratio = (threshold - u2) / (u1 - u2);

                result.push(0);

                result.push(1);

                if (u21Ratio !== 1.0) {
                    result.push(-1);
                    result.push(2);
                    result.push(1);
                    result.push(u21Ratio);
                }

                if (u20Ratio !== 1.0) {
                    result.push(-1);
                    result.push(2);
                    result.push(0);
                    result.push(u20Ratio);
                }
            }
        } else if (numBehind === 2) {
            if (!u0Behind && u0 !== threshold) {
                u10Ratio = (threshold - u1) / (u0 - u1);
                u20Ratio = (threshold - u2) / (u0 - u2);

                result.push(0);

                result.push(-1);
                result.push(1);
                result.push(0);
                result.push(u10Ratio);

                result.push(-1);
                result.push(2);
                result.push(0);
                result.push(u20Ratio);
            } else if (!u1Behind && u1 !== threshold) {
                u21Ratio = (threshold - u2) / (u1 - u2);
                u01Ratio = (threshold - u0) / (u1 - u0);

                result.push(1);

                result.push(-1);
                result.push(2);
                result.push(1);
                result.push(u21Ratio);

                result.push(-1);
                result.push(0);
                result.push(1);
                result.push(u01Ratio);
            } else if (!u2Behind && u2 !== threshold) {
                u02Ratio = (threshold - u0) / (u2 - u0);
                u12Ratio = (threshold - u1) / (u2 - u1);

                result.push(2);

                result.push(-1);
                result.push(0);
                result.push(2);
                result.push(u02Ratio);

                result.push(-1);
                result.push(1);
                result.push(2);
                result.push(u12Ratio);
            }
        } else if (numBehind !== 3) {
            // Completely in front of threshold
            result.push(0);
            result.push(1);
            result.push(2);
        }
        // else Completely behind threshold

        return result;
    };

    /**
     * Compute the barycentric coordinates of a 2D position within a 2D triangle.
     *
     * @param {Number} x The x coordinate of the position for which to find the barycentric coordinates.
     * @param {Number} y The y coordinate of the position for which to find the barycentric coordinates.
     * @param {Number} x1 The x coordinate of the triangle's first vertex.
     * @param {Number} y1 The y coordinate of the triangle's first vertex.
     * @param {Number} x2 The x coordinate of the triangle's second vertex.
     * @param {Number} y2 The y coordinate of the triangle's second vertex.
     * @param {Number} x3 The x coordinate of the triangle's third vertex.
     * @param {Number} y3 The y coordinate of the triangle's third vertex.
     * @param {Cartesian3} [result] The instance into to which to copy the result.  If this parameter
     *                     is undefined, a new instance is created and returned.
     * @returns {Cartesian3} The barycentric coordinates of the position within the triangle.
     *
     * @example
     * var result = Cesium.Intersections2D.computeBarycentricCoordinates(0.0, 0.0, 0.0, 1.0, -1, -0.5, 1, -0.5);
     * // result === new Cesium.Cartesian3(1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0);
     */
    Intersections2D.computeBarycentricCoordinates = function(x, y, x1, y1, x2, y2, x3, y3, result) {
                if (!defined(x)) {
            throw new DeveloperError('x is required.');
        }
        if (!defined(y)) {
            throw new DeveloperError('y is required.');
        }
        if (!defined(x1)) {
            throw new DeveloperError('x1 is required.');
        }
        if (!defined(y1)) {
            throw new DeveloperError('y1 is required.');
        }
        if (!defined(x2)) {
            throw new DeveloperError('x2 is required.');
        }
        if (!defined(y2)) {
            throw new DeveloperError('y2 is required.');
        }
        if (!defined(x3)) {
            throw new DeveloperError('x3 is required.');
        }
        if (!defined(y3)) {
            throw new DeveloperError('y3 is required.');
        }
        
        var x1mx3 = x1 - x3;
        var x3mx2 = x3 - x2;
        var y2my3 = y2 - y3;
        var y1my3 = y1 - y3;
        var inverseDeterminant = 1.0 / (y2my3 * x1mx3 + x3mx2 * y1my3);
        var ymy3 = y - y3;
        var xmx3 = x - x3;
        var l1 = (y2my3 * xmx3 + x3mx2 * ymy3) * inverseDeterminant;
        var l2 = (-y1my3 * xmx3 + x1mx3 * ymy3) * inverseDeterminant;
        var l3 = 1.0 - l1 - l2;

        if (defined(result)) {
            result.x = l1;
            result.y = l2;
            result.z = l3;
            return result;
        } else {
            return new Cartesian3(l1, l2, l3);
        }
    };

    return Intersections2D;
});

/*global define*/
define('Core/AxisAlignedBoundingBox',[
        './Cartesian3',
        './defaultValue',
        './defined',
        './DeveloperError',
        './Intersect'
    ], function(
        Cartesian3,
        defaultValue,
        defined,
        DeveloperError,
        Intersect) {
    'use strict';

    /**
     * Creates an instance of an AxisAlignedBoundingBox from the minimum and maximum points along the x, y, and z axes.
     * @alias AxisAlignedBoundingBox
     * @constructor
     *
     * @param {Cartesian3} [minimum=Cartesian3.ZERO] The minimum point along the x, y, and z axes.
     * @param {Cartesian3} [maximum=Cartesian3.ZERO] The maximum point along the x, y, and z axes.
     * @param {Cartesian3} [center] The center of the box; automatically computed if not supplied.
     *
     * @see BoundingSphere
     * @see BoundingRectangle
     */
    function AxisAlignedBoundingBox(minimum, maximum, center) {
        /**
         * The minimum point defining the bounding box.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.minimum = Cartesian3.clone(defaultValue(minimum, Cartesian3.ZERO));

        /**
         * The maximum point defining the bounding box.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.maximum = Cartesian3.clone(defaultValue(maximum, Cartesian3.ZERO));

        //If center was not defined, compute it.
        if (!defined(center)) {
            center = Cartesian3.add(this.minimum, this.maximum, new Cartesian3());
            Cartesian3.multiplyByScalar(center, 0.5, center);
        } else {
            center = Cartesian3.clone(center);
        }

        /**
         * The center point of the bounding box.
         * @type {Cartesian3}
         */
        this.center = center;
    }

    /**
     * Computes an instance of an AxisAlignedBoundingBox. The box is determined by
     * finding the points spaced the farthest apart on the x, y, and z axes.
     *
     * @param {Cartesian3[]} positions List of points that the bounding box will enclose.  Each point must have a <code>x</code>, <code>y</code>, and <code>z</code> properties.
     * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
     * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
     *
     * @example
     * // Compute an axis aligned bounding box enclosing two points.
     * var box = Cesium.AxisAlignedBoundingBox.fromPoints([new Cesium.Cartesian3(2, 0, 0), new Cesium.Cartesian3(-2, 0, 0)]);
     */
    AxisAlignedBoundingBox.fromPoints = function(positions, result) {
        if (!defined(result)) {
            result = new AxisAlignedBoundingBox();
        }

        if (!defined(positions) || positions.length === 0) {
            result.minimum = Cartesian3.clone(Cartesian3.ZERO, result.minimum);
            result.maximum = Cartesian3.clone(Cartesian3.ZERO, result.maximum);
            result.center = Cartesian3.clone(Cartesian3.ZERO, result.center);
            return result;
        }

        var minimumX = positions[0].x;
        var minimumY = positions[0].y;
        var minimumZ = positions[0].z;

        var maximumX = positions[0].x;
        var maximumY = positions[0].y;
        var maximumZ = positions[0].z;

        var length = positions.length;
        for ( var i = 1; i < length; i++) {
            var p = positions[i];
            var x = p.x;
            var y = p.y;
            var z = p.z;

            minimumX = Math.min(x, minimumX);
            maximumX = Math.max(x, maximumX);
            minimumY = Math.min(y, minimumY);
            maximumY = Math.max(y, maximumY);
            minimumZ = Math.min(z, minimumZ);
            maximumZ = Math.max(z, maximumZ);
        }

        var minimum = result.minimum;
        minimum.x = minimumX;
        minimum.y = minimumY;
        minimum.z = minimumZ;

        var maximum = result.maximum;
        maximum.x = maximumX;
        maximum.y = maximumY;
        maximum.z = maximumZ;

        var center = Cartesian3.add(minimum, maximum, result.center);
        Cartesian3.multiplyByScalar(center, 0.5, center);

        return result;
    };

    /**
     * Duplicates a AxisAlignedBoundingBox instance.
     *
     * @param {AxisAlignedBoundingBox} box The bounding box to duplicate.
     * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
     * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
     */
    AxisAlignedBoundingBox.clone = function(box, result) {
        if (!defined(box)) {
            return undefined;
        }

        if (!defined(result)) {
            return new AxisAlignedBoundingBox(box.minimum, box.maximum);
        }

        result.minimum = Cartesian3.clone(box.minimum, result.minimum);
        result.maximum = Cartesian3.clone(box.maximum, result.maximum);
        result.center = Cartesian3.clone(box.center, result.center);
        return result;
    };

    /**
     * Compares the provided AxisAlignedBoundingBox componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {AxisAlignedBoundingBox} [left] The first AxisAlignedBoundingBox.
     * @param {AxisAlignedBoundingBox} [right] The second AxisAlignedBoundingBox.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    AxisAlignedBoundingBox.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                Cartesian3.equals(left.center, right.center) &&
                Cartesian3.equals(left.minimum, right.minimum) &&
                Cartesian3.equals(left.maximum, right.maximum));
    };

    var intersectScratch = new Cartesian3();
    /**
     * Determines which side of a plane a box is located.
     *
     * @param {AxisAlignedBoundingBox} box The bounding box to test.
     * @param {Plane} plane The plane to test against.
     * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
     *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
     *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
     *                      intersects the plane.
     */
    AxisAlignedBoundingBox.intersectPlane = function(box, plane) {
                if (!defined(box)) {
            throw new DeveloperError('box is required.');
        }
        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }
        
        intersectScratch = Cartesian3.subtract(box.maximum, box.minimum, intersectScratch);
        var h = Cartesian3.multiplyByScalar(intersectScratch, 0.5, intersectScratch); //The positive half diagonal
        var normal = plane.normal;
        var e = h.x * Math.abs(normal.x) + h.y * Math.abs(normal.y) + h.z * Math.abs(normal.z);
        var s = Cartesian3.dot(box.center, normal) + plane.distance; //signed distance from center

        if (s - e > 0) {
            return Intersect.INSIDE;
        }

        if (s + e < 0) {
            //Not in front because normals point inward
            return Intersect.OUTSIDE;
        }

        return Intersect.INTERSECTING;
    };

    /**
     * Duplicates this AxisAlignedBoundingBox instance.
     *
     * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
     * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
     */
    AxisAlignedBoundingBox.prototype.clone = function(result) {
        return AxisAlignedBoundingBox.clone(this, result);
    };

    /**
     * Determines which side of a plane this box is located.
     *
     * @param {Plane} plane The plane to test against.
     * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
     *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
     *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
     *                      intersects the plane.
     */
    AxisAlignedBoundingBox.prototype.intersectPlane = function(plane) {
        return AxisAlignedBoundingBox.intersectPlane(this, plane);
    };

    /**
     * Compares this AxisAlignedBoundingBox against the provided AxisAlignedBoundingBox componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {AxisAlignedBoundingBox} [right] The right hand side AxisAlignedBoundingBox.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    AxisAlignedBoundingBox.prototype.equals = function(right) {
        return AxisAlignedBoundingBox.equals(this, right);
    };

    return AxisAlignedBoundingBox;
});

/*global define*/
define('Core/QuadraticRealPolynomial',[
        './DeveloperError',
        './Math'
    ], function(
        DeveloperError,
        CesiumMath) {
    'use strict';

    /**
     * Defines functions for 2nd order polynomial functions of one variable with only real coefficients.
     *
     * @exports QuadraticRealPolynomial
     */
    var QuadraticRealPolynomial = {};

    /**
     * Provides the discriminant of the quadratic equation from the supplied coefficients.
     *
     * @param {Number} a The coefficient of the 2nd order monomial.
     * @param {Number} b The coefficient of the 1st order monomial.
     * @param {Number} c The coefficient of the 0th order monomial.
     * @returns {Number} The value of the discriminant.
     */
    QuadraticRealPolynomial.computeDiscriminant = function(a, b, c) {
                if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        
        var discriminant = b * b - 4.0 * a * c;
        return discriminant;
    };

    function addWithCancellationCheck(left, right, tolerance) {
        var difference = left + right;
        if ((CesiumMath.sign(left) !== CesiumMath.sign(right)) &&
                Math.abs(difference / Math.max(Math.abs(left), Math.abs(right))) < tolerance) {
            return 0.0;
        }

        return difference;
    }

    /**
     * Provides the real valued roots of the quadratic polynomial with the provided coefficients.
     *
     * @param {Number} a The coefficient of the 2nd order monomial.
     * @param {Number} b The coefficient of the 1st order monomial.
     * @param {Number} c The coefficient of the 0th order monomial.
     * @returns {Number[]} The real valued roots.
     */
    QuadraticRealPolynomial.computeRealRoots = function(a, b, c) {
                if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        
        var ratio;
        if (a === 0.0) {
            if (b === 0.0) {
                // Constant function: c = 0.
                return [];
            }

            // Linear function: b * x + c = 0.
            return [-c / b];
        } else if (b === 0.0) {
            if (c === 0.0) {
                // 2nd order monomial: a * x^2 = 0.
                return [0.0, 0.0];
            }

            var cMagnitude = Math.abs(c);
            var aMagnitude = Math.abs(a);

            if ((cMagnitude < aMagnitude) && (cMagnitude / aMagnitude < CesiumMath.EPSILON14)) { // c ~= 0.0.
                // 2nd order monomial: a * x^2 = 0.
                return [0.0, 0.0];
            } else if ((cMagnitude > aMagnitude) && (aMagnitude / cMagnitude < CesiumMath.EPSILON14)) { // a ~= 0.0.
                // Constant function: c = 0.
                return [];
            }

            // a * x^2 + c = 0
            ratio = -c / a;

            if (ratio < 0.0) {
                // Both roots are complex.
                return [];
            }

            // Both roots are real.
            var root = Math.sqrt(ratio);
            return [-root, root];
        } else if (c === 0.0) {
            // a * x^2 + b * x = 0
            ratio = -b / a;
            if (ratio < 0.0) {
                return [ratio, 0.0];
            }

            return [0.0, ratio];
        }

        // a * x^2 + b * x + c = 0
        var b2 = b * b;
        var four_ac = 4.0 * a * c;
        var radicand = addWithCancellationCheck(b2, -four_ac, CesiumMath.EPSILON14);

        if (radicand < 0.0) {
            // Both roots are complex.
            return [];
        }

        var q = -0.5 * addWithCancellationCheck(b, CesiumMath.sign(b) * Math.sqrt(radicand), CesiumMath.EPSILON14);
        if (b > 0.0) {
            return [q / a, c / q];
        }

        return [c / q, q / a];
    };

    return QuadraticRealPolynomial;
});

/*global define*/
define('Core/CubicRealPolynomial',[
        './DeveloperError',
        './QuadraticRealPolynomial'
    ], function(
        DeveloperError,
        QuadraticRealPolynomial) {
    'use strict';

    /**
     * Defines functions for 3rd order polynomial functions of one variable with only real coefficients.
     *
     * @exports CubicRealPolynomial
     */
    var CubicRealPolynomial = {};

    /**
     * Provides the discriminant of the cubic equation from the supplied coefficients.
     *
     * @param {Number} a The coefficient of the 3rd order monomial.
     * @param {Number} b The coefficient of the 2nd order monomial.
     * @param {Number} c The coefficient of the 1st order monomial.
     * @param {Number} d The coefficient of the 0th order monomial.
     * @returns {Number} The value of the discriminant.
     */
    CubicRealPolynomial.computeDiscriminant = function(a, b, c, d) {
                if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }
        
        var a2 = a * a;
        var b2 = b * b;
        var c2 = c * c;
        var d2 = d * d;

        var discriminant = 18.0 * a * b * c * d + b2 * c2 - 27.0 * a2 * d2 - 4.0 * (a * c2 * c + b2 * b * d);
        return discriminant;
    };

    function computeRealRoots(a, b, c, d) {
        var A = a;
        var B = b / 3.0;
        var C = c / 3.0;
        var D = d;

        var AC = A * C;
        var BD = B * D;
        var B2 = B * B;
        var C2 = C * C;
        var delta1 = A * C - B2;
        var delta2 = A * D - B * C;
        var delta3 = B * D - C2;

        var discriminant = 4.0 * delta1 * delta3 - delta2 * delta2;
        var temp;
        var temp1;

        if (discriminant < 0.0) {
            var ABar;
            var CBar;
            var DBar;

            if (B2 * BD >= AC * C2) {
                ABar = A;
                CBar = delta1;
                DBar = -2.0 * B * delta1 + A * delta2;
            } else {
                ABar = D;
                CBar = delta3;
                DBar = -D * delta2 + 2.0 * C * delta3;
            }

            var s = (DBar < 0.0) ? -1.0 : 1.0; // This is not Math.Sign()!
            var temp0 = -s * Math.abs(ABar) * Math.sqrt(-discriminant);
            temp1 = -DBar + temp0;

            var x = temp1 / 2.0;
            var p = x < 0.0 ? -Math.pow(-x, 1.0 / 3.0) : Math.pow(x, 1.0 / 3.0);
            var q = (temp1 === temp0) ? -p : -CBar / p;

            temp = (CBar <= 0.0) ? p + q : -DBar / (p * p + q * q + CBar);

            if (B2 * BD >= AC * C2) {
                return [(temp - B) / A];
            }

            return [-D / (temp + C)];
        }

        var CBarA = delta1;
        var DBarA = -2.0 * B * delta1 + A * delta2;

        var CBarD = delta3;
        var DBarD = -D * delta2 + 2.0 * C * delta3;

        var squareRootOfDiscriminant = Math.sqrt(discriminant);
        var halfSquareRootOf3 = Math.sqrt(3.0) / 2.0;

        var theta = Math.abs(Math.atan2(A * squareRootOfDiscriminant, -DBarA) / 3.0);
        temp = 2.0 * Math.sqrt(-CBarA);
        var cosine = Math.cos(theta);
        temp1 = temp * cosine;
        var temp3 = temp * (-cosine / 2.0 - halfSquareRootOf3 * Math.sin(theta));

        var numeratorLarge = (temp1 + temp3 > 2.0 * B) ? temp1 - B : temp3 - B;
        var denominatorLarge = A;

        var root1 = numeratorLarge / denominatorLarge;

        theta = Math.abs(Math.atan2(D * squareRootOfDiscriminant, -DBarD) / 3.0);
        temp = 2.0 * Math.sqrt(-CBarD);
        cosine = Math.cos(theta);
        temp1 = temp * cosine;
        temp3 = temp * (-cosine / 2.0 - halfSquareRootOf3 * Math.sin(theta));

        var numeratorSmall = -D;
        var denominatorSmall = (temp1 + temp3 < 2.0 * C) ? temp1 + C : temp3 + C;

        var root3 = numeratorSmall / denominatorSmall;

        var E = denominatorLarge * denominatorSmall;
        var F = -numeratorLarge * denominatorSmall - denominatorLarge * numeratorSmall;
        var G = numeratorLarge * numeratorSmall;

        var root2 = (C * F - B * G) / (-B * F + C * E);

        if (root1 <= root2) {
            if (root1 <= root3) {
                if (root2 <= root3) {
                    return [root1, root2, root3];
                }
                return [root1, root3, root2];
            }
            return [root3, root1, root2];
        }
        if (root1 <= root3) {
            return [root2, root1, root3];
        }
        if (root2 <= root3) {
            return [root2, root3, root1];
        }
        return [root3, root2, root1];
    }

    /**
     * Provides the real valued roots of the cubic polynomial with the provided coefficients.
     *
     * @param {Number} a The coefficient of the 3rd order monomial.
     * @param {Number} b The coefficient of the 2nd order monomial.
     * @param {Number} c The coefficient of the 1st order monomial.
     * @param {Number} d The coefficient of the 0th order monomial.
     * @returns {Number[]} The real valued roots.
     */
    CubicRealPolynomial.computeRealRoots = function(a, b, c, d) {
                if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }
        
        var roots;
        var ratio;
        if (a === 0.0) {
            // Quadratic function: b * x^2 + c * x + d = 0.
            return QuadraticRealPolynomial.computeRealRoots(b, c, d);
        } else if (b === 0.0) {
            if (c === 0.0) {
                if (d === 0.0) {
                    // 3rd order monomial: a * x^3 = 0.
                    return [0.0, 0.0, 0.0];
                }

                // a * x^3 + d = 0
                ratio = -d / a;
                var root = (ratio < 0.0) ? -Math.pow(-ratio, 1.0 / 3.0) : Math.pow(ratio, 1.0 / 3.0);
                return [root, root, root];
            } else if (d === 0.0) {
                // x * (a * x^2 + c) = 0.
                roots = QuadraticRealPolynomial.computeRealRoots(a, 0, c);

                // Return the roots in ascending order.
                if (roots.Length === 0) {
                    return [0.0];
                }
                return [roots[0], 0.0, roots[1]];
            }

            // Deflated cubic polynomial: a * x^3 + c * x + d= 0.
            return computeRealRoots(a, 0, c, d);
        } else if (c === 0.0) {
            if (d === 0.0) {
                // x^2 * (a * x + b) = 0.
                ratio = -b / a;
                if (ratio < 0.0) {
                    return [ratio, 0.0, 0.0];
                }
                return [0.0, 0.0, ratio];
            }
            // a * x^3 + b * x^2 + d = 0.
            return computeRealRoots(a, b, 0, d);
        } else if (d === 0.0) {
            // x * (a * x^2 + b * x + c) = 0
            roots = QuadraticRealPolynomial.computeRealRoots(a, b, c);

            // Return the roots in ascending order.
            if (roots.length === 0) {
                return [0.0];
            } else if (roots[1] <= 0.0) {
                return [roots[0], roots[1], 0.0];
            } else if (roots[0] >= 0.0) {
                return [0.0, roots[0], roots[1]];
            }
            return [roots[0], 0.0, roots[1]];
        }

        return computeRealRoots(a, b, c, d);
    };

    return CubicRealPolynomial;
});

/*global define*/
define('Core/QuarticRealPolynomial',[
        './CubicRealPolynomial',
        './DeveloperError',
        './Math',
        './QuadraticRealPolynomial'
    ], function(
        CubicRealPolynomial,
        DeveloperError,
        CesiumMath,
        QuadraticRealPolynomial) {
    'use strict';

    /**
     * Defines functions for 4th order polynomial functions of one variable with only real coefficients.
     *
     * @exports QuarticRealPolynomial
     */
    var QuarticRealPolynomial = {};

    /**
     * Provides the discriminant of the quartic equation from the supplied coefficients.
     *
     * @param {Number} a The coefficient of the 4th order monomial.
     * @param {Number} b The coefficient of the 3rd order monomial.
     * @param {Number} c The coefficient of the 2nd order monomial.
     * @param {Number} d The coefficient of the 1st order monomial.
     * @param {Number} e The coefficient of the 0th order monomial.
     * @returns {Number} The value of the discriminant.
     */
    QuarticRealPolynomial.computeDiscriminant = function(a, b, c, d, e) {
                if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }
        if (typeof e !== 'number') {
            throw new DeveloperError('e is a required number.');
        }
        
        var a2 = a * a;
        var a3 = a2 * a;
        var b2 = b * b;
        var b3 = b2 * b;
        var c2 = c * c;
        var c3 = c2 * c;
        var d2 = d * d;
        var d3 = d2 * d;
        var e2 = e * e;
        var e3 = e2 * e;

        var discriminant = (b2 * c2 * d2 - 4.0 * b3 * d3 - 4.0 * a * c3 * d2 + 18 * a * b * c * d3 - 27.0 * a2 * d2 * d2 + 256.0 * a3 * e3) +
            e * (18.0 * b3 * c * d - 4.0 * b2 * c3 + 16.0 * a * c2 * c2 - 80.0 * a * b * c2 * d - 6.0 * a * b2 * d2 + 144.0 * a2 * c * d2) +
            e2 * (144.0 * a * b2 * c - 27.0 * b2 * b2 - 128.0 * a2 * c2 - 192.0 * a2 * b * d);
        return discriminant;
    };

    function original(a3, a2, a1, a0) {
        var a3Squared = a3 * a3;

        var p = a2 - 3.0 * a3Squared / 8.0;
        var q = a1 - a2 * a3 / 2.0 + a3Squared * a3 / 8.0;
        var r = a0 - a1 * a3 / 4.0 + a2 * a3Squared / 16.0 - 3.0 * a3Squared * a3Squared / 256.0;

        // Find the roots of the cubic equations:  h^6 + 2 p h^4 + (p^2 - 4 r) h^2 - q^2 = 0.
        var cubicRoots = CubicRealPolynomial.computeRealRoots(1.0, 2.0 * p, p * p - 4.0 * r, -q * q);

        if (cubicRoots.length > 0) {
            var temp = -a3 / 4.0;

            // Use the largest positive root.
            var hSquared = cubicRoots[cubicRoots.length - 1];

            if (Math.abs(hSquared) < CesiumMath.EPSILON14) {
                // y^4 + p y^2 + r = 0.
                var roots = QuadraticRealPolynomial.computeRealRoots(1.0, p, r);

                if (roots.length === 2) {
                    var root0 = roots[0];
                    var root1 = roots[1];

                    var y;
                    if (root0 >= 0.0 && root1 >= 0.0) {
                        var y0 = Math.sqrt(root0);
                        var y1 = Math.sqrt(root1);

                        return [temp - y1, temp - y0, temp + y0, temp + y1];
                    } else if (root0 >= 0.0 && root1 < 0.0) {
                        y = Math.sqrt(root0);
                        return [temp - y, temp + y];
                    } else if (root0 < 0.0 && root1 >= 0.0) {
                        y = Math.sqrt(root1);
                        return [temp - y, temp + y];
                    }
                }
                return [];
            } else if (hSquared > 0.0) {
                var h = Math.sqrt(hSquared);

                var m = (p + hSquared - q / h) / 2.0;
                var n = (p + hSquared + q / h) / 2.0;

                // Now solve the two quadratic factors:  (y^2 + h y + m)(y^2 - h y + n);
                var roots1 = QuadraticRealPolynomial.computeRealRoots(1.0, h, m);
                var roots2 = QuadraticRealPolynomial.computeRealRoots(1.0, -h, n);

                if (roots1.length !== 0) {
                    roots1[0] += temp;
                    roots1[1] += temp;

                    if (roots2.length !== 0) {
                        roots2[0] += temp;
                        roots2[1] += temp;

                        if (roots1[1] <= roots2[0]) {
                            return [roots1[0], roots1[1], roots2[0], roots2[1]];
                        } else if (roots2[1] <= roots1[0]) {
                            return [roots2[0], roots2[1], roots1[0], roots1[1]];
                        } else if (roots1[0] >= roots2[0] && roots1[1] <= roots2[1]) {
                            return [roots2[0], roots1[0], roots1[1], roots2[1]];
                        } else if (roots2[0] >= roots1[0] && roots2[1] <= roots1[1]) {
                            return [roots1[0], roots2[0], roots2[1], roots1[1]];
                        } else if (roots1[0] > roots2[0] && roots1[0] < roots2[1]) {
                            return [roots2[0], roots1[0], roots2[1], roots1[1]];
                        }
                        return [roots1[0], roots2[0], roots1[1], roots2[1]];
                    }
                    return roots1;
                }

                if (roots2.length !== 0) {
                    roots2[0] += temp;
                    roots2[1] += temp;

                    return roots2;
                }
                return [];
            }
        }
        return [];
    }

    function neumark(a3, a2, a1, a0) {
        var a1Squared = a1 * a1;
        var a2Squared = a2 * a2;
        var a3Squared = a3 * a3;

        var p = -2.0 * a2;
        var q = a1 * a3 + a2Squared - 4.0 * a0;
        var r = a3Squared * a0 - a1 * a2 * a3 + a1Squared;

        var cubicRoots = CubicRealPolynomial.computeRealRoots(1.0, p, q, r);

        if (cubicRoots.length > 0) {
            // Use the most positive root
            var y = cubicRoots[0];

            var temp = (a2 - y);
            var tempSquared = temp * temp;

            var g1 = a3 / 2.0;
            var h1 = temp / 2.0;

            var m = tempSquared - 4.0 * a0;
            var mError = tempSquared + 4.0 * Math.abs(a0);

            var n = a3Squared - 4.0 * y;
            var nError = a3Squared + 4.0 * Math.abs(y);

            var g2;
            var h2;

            if (y < 0.0 || (m * nError < n * mError)) {
                var squareRootOfN = Math.sqrt(n);
                g2 = squareRootOfN / 2.0;
                h2 = squareRootOfN === 0.0 ? 0.0 : (a3 * h1 - a1) / squareRootOfN;
            } else {
                var squareRootOfM = Math.sqrt(m);
                g2 = squareRootOfM === 0.0 ? 0.0 : (a3 * h1 - a1) / squareRootOfM;
                h2 = squareRootOfM / 2.0;
            }

            var G;
            var g;
            if (g1 === 0.0 && g2 === 0.0) {
                G = 0.0;
                g = 0.0;
            } else if (CesiumMath.sign(g1) === CesiumMath.sign(g2)) {
                G = g1 + g2;
                g = y / G;
            } else {
                g = g1 - g2;
                G = y / g;
            }

            var H;
            var h;
            if (h1 === 0.0 && h2 === 0.0) {
                H = 0.0;
                h = 0.0;
            } else if (CesiumMath.sign(h1) === CesiumMath.sign(h2)) {
                H = h1 + h2;
                h = a0 / H;
            } else {
                h = h1 - h2;
                H = a0 / h;
            }

            // Now solve the two quadratic factors:  (y^2 + G y + H)(y^2 + g y + h);
            var roots1 = QuadraticRealPolynomial.computeRealRoots(1.0, G, H);
            var roots2 = QuadraticRealPolynomial.computeRealRoots(1.0, g, h);

            if (roots1.length !== 0) {
                if (roots2.length !== 0) {
                    if (roots1[1] <= roots2[0]) {
                        return [roots1[0], roots1[1], roots2[0], roots2[1]];
                    } else if (roots2[1] <= roots1[0]) {
                        return [roots2[0], roots2[1], roots1[0], roots1[1]];
                    } else if (roots1[0] >= roots2[0] && roots1[1] <= roots2[1]) {
                        return [roots2[0], roots1[0], roots1[1], roots2[1]];
                    } else if (roots2[0] >= roots1[0] && roots2[1] <= roots1[1]) {
                        return [roots1[0], roots2[0], roots2[1], roots1[1]];
                    } else if (roots1[0] > roots2[0] && roots1[0] < roots2[1]) {
                        return [roots2[0], roots1[0], roots2[1], roots1[1]];
                    } else {
                        return [roots1[0], roots2[0], roots1[1], roots2[1]];
                    }
                }
                return roots1;
            }
            if (roots2.length !== 0) {
                return roots2;
            }
        }
        return [];
    }

    /**
     * Provides the real valued roots of the quartic polynomial with the provided coefficients.
     *
     * @param {Number} a The coefficient of the 4th order monomial.
     * @param {Number} b The coefficient of the 3rd order monomial.
     * @param {Number} c The coefficient of the 2nd order monomial.
     * @param {Number} d The coefficient of the 1st order monomial.
     * @param {Number} e The coefficient of the 0th order monomial.
     * @returns {Number[]} The real valued roots.
     */
    QuarticRealPolynomial.computeRealRoots = function(a, b, c, d, e) {
                if (typeof a !== 'number') {
            throw new DeveloperError('a is a required number.');
        }
        if (typeof b !== 'number') {
            throw new DeveloperError('b is a required number.');
        }
        if (typeof c !== 'number') {
            throw new DeveloperError('c is a required number.');
        }
        if (typeof d !== 'number') {
            throw new DeveloperError('d is a required number.');
        }
        if (typeof e !== 'number') {
            throw new DeveloperError('e is a required number.');
        }
        
        if (Math.abs(a) < CesiumMath.EPSILON15) {
            return CubicRealPolynomial.computeRealRoots(b, c, d, e);
        }
        var a3 = b / a;
        var a2 = c / a;
        var a1 = d / a;
        var a0 = e / a;

        var k = (a3 < 0.0) ? 1 : 0;
        k += (a2 < 0.0) ? k + 1 : k;
        k += (a1 < 0.0) ? k + 1 : k;
        k += (a0 < 0.0) ? k + 1 : k;

        switch (k) {
        case 0:
            return original(a3, a2, a1, a0);
        case 1:
            return neumark(a3, a2, a1, a0);
        case 2:
            return neumark(a3, a2, a1, a0);
        case 3:
            return original(a3, a2, a1, a0);
        case 4:
            return original(a3, a2, a1, a0);
        case 5:
            return neumark(a3, a2, a1, a0);
        case 6:
            return original(a3, a2, a1, a0);
        case 7:
            return original(a3, a2, a1, a0);
        case 8:
            return neumark(a3, a2, a1, a0);
        case 9:
            return original(a3, a2, a1, a0);
        case 10:
            return original(a3, a2, a1, a0);
        case 11:
            return neumark(a3, a2, a1, a0);
        case 12:
            return original(a3, a2, a1, a0);
        case 13:
            return original(a3, a2, a1, a0);
        case 14:
            return original(a3, a2, a1, a0);
        case 15:
            return original(a3, a2, a1, a0);
        default:
            return undefined;
        }
    };

    return QuarticRealPolynomial;
});

/*global define*/
define('Core/Ray',[
        './Cartesian3',
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        Cartesian3,
        defaultValue,
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Represents a ray that extends infinitely from the provided origin in the provided direction.
     * @alias Ray
     * @constructor
     *
     * @param {Cartesian3} [origin=Cartesian3.ZERO] The origin of the ray.
     * @param {Cartesian3} [direction=Cartesian3.ZERO] The direction of the ray.
     */
    function Ray(origin, direction) {
        direction = Cartesian3.clone(defaultValue(direction, Cartesian3.ZERO));
        if (!Cartesian3.equals(direction, Cartesian3.ZERO)) {
            Cartesian3.normalize(direction, direction);
        }

        /**
         * The origin of the ray.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.origin = Cartesian3.clone(defaultValue(origin, Cartesian3.ZERO));

        /**
         * The direction of the ray.
         * @type {Cartesian3}
         */
        this.direction = direction;
    }

    /**
     * Computes the point along the ray given by r(t) = o + t*d,
     * where o is the origin of the ray and d is the direction.
     *
     * @param {Ray} ray The ray.
     * @param {Number} t A scalar value.
     * @param {Cartesian3} [result] The object in which the result will be stored.
     * @returns {Cartesian3} The modified result parameter, or a new instance if none was provided.
     *
     * @example
     * //Get the first intersection point of a ray and an ellipsoid.
     * var intersection = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);
     * var point = Cesium.Ray.getPoint(ray, intersection.start);
     */
    Ray.getPoint = function(ray, t, result) {
                if (!defined(ray)){
            throw new DeveloperError('ray is requred');
        }
        if (typeof t !== 'number') {
            throw new DeveloperError('t is a required number');
        }
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        result = Cartesian3.multiplyByScalar(ray.direction, t, result);
        return Cartesian3.add(ray.origin, result, result);
    };

    return Ray;
});

/*global define*/
define('Core/IntersectionTests',[
        './Cartesian3',
        './Cartographic',
        './defaultValue',
        './defined',
        './DeveloperError',
        './Interval',
        './Math',
        './Matrix3',
        './QuadraticRealPolynomial',
        './QuarticRealPolynomial',
        './Ray'
    ], function(
        Cartesian3,
        Cartographic,
        defaultValue,
        defined,
        DeveloperError,
        Interval,
        CesiumMath,
        Matrix3,
        QuadraticRealPolynomial,
        QuarticRealPolynomial,
        Ray) {
    'use strict';

    /**
     * Functions for computing the intersection between geometries such as rays, planes, triangles, and ellipsoids.
     *
     * @exports IntersectionTests
     */
    var IntersectionTests = {};

    /**
     * Computes the intersection of a ray and a plane.
     *
     * @param {Ray} ray The ray.
     * @param {Plane} plane The plane.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
     */
    IntersectionTests.rayPlane = function(ray, plane, result) {
                if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }
        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        var origin = ray.origin;
        var direction = ray.direction;
        var normal = plane.normal;
        var denominator = Cartesian3.dot(normal, direction);

        if (Math.abs(denominator) < CesiumMath.EPSILON15) {
            // Ray is parallel to plane.  The ray may be in the polygon's plane.
            return undefined;
        }

        var t = (-plane.distance - Cartesian3.dot(normal, origin)) / denominator;

        if (t < 0) {
            return undefined;
        }

        result = Cartesian3.multiplyByScalar(direction, t, result);
        return Cartesian3.add(origin, result, result);
    };

    var scratchEdge0 = new Cartesian3();
    var scratchEdge1 = new Cartesian3();
    var scratchPVec = new Cartesian3();
    var scratchTVec = new Cartesian3();
    var scratchQVec = new Cartesian3();

    /**
     * Computes the intersection of a ray and a triangle as a parametric distance along the input ray.
     *
     * Implements {@link https://cadxfem.org/inf/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf|
     * Fast Minimum Storage Ray/Triangle Intersection} by Tomas Moller and Ben Trumbore.
     *
     * @memberof IntersectionTests
     *
     * @param {Ray} ray The ray.
     * @param {Cartesian3} p0 The first vertex of the triangle.
     * @param {Cartesian3} p1 The second vertex of the triangle.
     * @param {Cartesian3} p2 The third vertex of the triangle.
     * @param {Boolean} [cullBackFaces=false] If <code>true</code>, will only compute an intersection with the front face of the triangle
     *                  and return undefined for intersections with the back face.
     * @returns {Number} The intersection as a parametric distance along the ray, or undefined if there is no intersection.
     */
    IntersectionTests.rayTriangleParametric  = function(ray, p0, p1, p2, cullBackFaces) {
                if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }
        if (!defined(p0)) {
            throw new DeveloperError('p0 is required.');
        }
        if (!defined(p1)) {
            throw new DeveloperError('p1 is required.');
        }
        if (!defined(p2)) {
            throw new DeveloperError('p2 is required.');
        }
        
        cullBackFaces = defaultValue(cullBackFaces, false);

        var origin = ray.origin;
        var direction = ray.direction;

        var edge0 = Cartesian3.subtract(p1, p0, scratchEdge0);
        var edge1 = Cartesian3.subtract(p2, p0, scratchEdge1);

        var p = Cartesian3.cross(direction, edge1, scratchPVec);
        var det = Cartesian3.dot(edge0, p);

        var tvec;
        var q;

        var u;
        var v;
        var t;

        if (cullBackFaces) {
            if (det < CesiumMath.EPSILON6) {
                return undefined;
            }

            tvec = Cartesian3.subtract(origin, p0, scratchTVec);
            u = Cartesian3.dot(tvec, p);
            if (u < 0.0 || u > det) {
                return undefined;
            }

            q = Cartesian3.cross(tvec, edge0, scratchQVec);

            v = Cartesian3.dot(direction, q);
            if (v < 0.0 || u + v > det) {
                return undefined;
            }

            t = Cartesian3.dot(edge1, q) / det;
        } else {
            if (Math.abs(det) < CesiumMath.EPSILON6) {
                return undefined;
            }
            var invDet = 1.0 / det;

            tvec = Cartesian3.subtract(origin, p0, scratchTVec);
            u = Cartesian3.dot(tvec, p) * invDet;
            if (u < 0.0 || u > 1.0) {
                return undefined;
            }

            q = Cartesian3.cross(tvec, edge0, scratchQVec);

            v = Cartesian3.dot(direction, q) * invDet;
            if (v < 0.0 || u + v > 1.0) {
                return undefined;
            }

            t = Cartesian3.dot(edge1, q) * invDet;
        }

        return t;
    };

    /**
     * Computes the intersection of a ray and a triangle as a Cartesian3 coordinate.
     *
     * Implements {@link https://cadxfem.org/inf/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf|
     * Fast Minimum Storage Ray/Triangle Intersection} by Tomas Moller and Ben Trumbore.
     *
     * @memberof IntersectionTests
     *
     * @param {Ray} ray The ray.
     * @param {Cartesian3} p0 The first vertex of the triangle.
     * @param {Cartesian3} p1 The second vertex of the triangle.
     * @param {Cartesian3} p2 The third vertex of the triangle.
     * @param {Boolean} [cullBackFaces=false] If <code>true</code>, will only compute an intersection with the front face of the triangle
     *                  and return undefined for intersections with the back face.
     * @param {Cartesian3} [result] The <code>Cartesian3</code> onto which to store the result.
     * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
     */
    IntersectionTests.rayTriangle = function(ray, p0, p1, p2, cullBackFaces, result) {
        var t = IntersectionTests.rayTriangleParametric(ray, p0, p1, p2, cullBackFaces);
        if (!defined(t) || t < 0.0) {
            return undefined;
        }

        if (!defined(result)) {
            result = new Cartesian3();
        }

        Cartesian3.multiplyByScalar(ray.direction, t, result);
        return Cartesian3.add(ray.origin, result, result);
    };

    var scratchLineSegmentTriangleRay = new Ray();

    /**
     * Computes the intersection of a line segment and a triangle.
     * @memberof IntersectionTests
     *
     * @param {Cartesian3} v0 The an end point of the line segment.
     * @param {Cartesian3} v1 The other end point of the line segment.
     * @param {Cartesian3} p0 The first vertex of the triangle.
     * @param {Cartesian3} p1 The second vertex of the triangle.
     * @param {Cartesian3} p2 The third vertex of the triangle.
     * @param {Boolean} [cullBackFaces=false] If <code>true</code>, will only compute an intersection with the front face of the triangle
     *                  and return undefined for intersections with the back face.
     * @param {Cartesian3} [result] The <code>Cartesian3</code> onto which to store the result.
     * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
     */
    IntersectionTests.lineSegmentTriangle = function(v0, v1, p0, p1, p2, cullBackFaces, result) {
                if (!defined(v0)) {
            throw new DeveloperError('v0 is required.');
        }
        if (!defined(v1)) {
            throw new DeveloperError('v1 is required.');
        }
        if (!defined(p0)) {
            throw new DeveloperError('p0 is required.');
        }
        if (!defined(p1)) {
            throw new DeveloperError('p1 is required.');
        }
        if (!defined(p2)) {
            throw new DeveloperError('p2 is required.');
        }
        
        var ray = scratchLineSegmentTriangleRay;
        Cartesian3.clone(v0, ray.origin);
        Cartesian3.subtract(v1, v0, ray.direction);
        Cartesian3.normalize(ray.direction, ray.direction);

        var t = IntersectionTests.rayTriangleParametric(ray, p0, p1, p2, cullBackFaces);
        if (!defined(t) || t < 0.0 || t > Cartesian3.distance(v0, v1)) {
            return undefined;
        }

        if (!defined(result)) {
            result = new Cartesian3();
        }

        Cartesian3.multiplyByScalar(ray.direction, t, result);
        return Cartesian3.add(ray.origin, result, result);
    };

    function solveQuadratic(a, b, c, result) {
        var det = b * b - 4.0 * a * c;
        if (det < 0.0) {
            return undefined;
        } else if (det > 0.0) {
            var denom = 1.0 / (2.0 * a);
            var disc = Math.sqrt(det);
            var root0 = (-b + disc) * denom;
            var root1 = (-b - disc) * denom;

            if (root0 < root1) {
                result.root0 = root0;
                result.root1 = root1;
            } else {
                result.root0 = root1;
                result.root1 = root0;
            }

            return result;
        }

        var root = -b / (2.0 * a);
        if (root === 0.0) {
            return undefined;
        }

        result.root0 = result.root1 = root;
        return result;
    }

    var raySphereRoots = {
        root0 : 0.0,
        root1 : 0.0
    };

    function raySphere(ray, sphere, result) {
        if (!defined(result)) {
            result = new Interval();
        }

        var origin = ray.origin;
        var direction = ray.direction;

        var center = sphere.center;
        var radiusSquared = sphere.radius * sphere.radius;

        var diff = Cartesian3.subtract(origin, center, scratchPVec);

        var a = Cartesian3.dot(direction, direction);
        var b = 2.0 * Cartesian3.dot(direction, diff);
        var c = Cartesian3.magnitudeSquared(diff) - radiusSquared;

        var roots = solveQuadratic(a, b, c, raySphereRoots);
        if (!defined(roots)) {
            return undefined;
        }

        result.start = roots.root0;
        result.stop = roots.root1;
        return result;
    }

    /**
     * Computes the intersection points of a ray with a sphere.
     * @memberof IntersectionTests
     *
     * @param {Ray} ray The ray.
     * @param {BoundingSphere} sphere The sphere.
     * @param {Interval} [result] The result onto which to store the result.
     * @returns {Interval} The interval containing scalar points along the ray or undefined if there are no intersections.
     */
    IntersectionTests.raySphere = function(ray, sphere, result) {
                if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }
        
        result = raySphere(ray, sphere, result);
        if (!defined(result) || result.stop < 0.0) {
            return undefined;
        }

        result.start = Math.max(result.start, 0.0);
        return result;
    };

    var scratchLineSegmentRay = new Ray();

    /**
     * Computes the intersection points of a line segment with a sphere.
     * @memberof IntersectionTests
     *
     * @param {Cartesian3} p0 An end point of the line segment.
     * @param {Cartesian3} p1 The other end point of the line segment.
     * @param {BoundingSphere} sphere The sphere.
     * @param {Interval} [result] The result onto which to store the result.
     * @returns {Interval} The interval containing scalar points along the ray or undefined if there are no intersections.
     */
    IntersectionTests.lineSegmentSphere = function(p0, p1, sphere, result) {
                if (!defined(p0)) {
            throw new DeveloperError('p0 is required.');
        }
        if (!defined(p1)) {
            throw new DeveloperError('p1 is required.');
        }
        if (!defined(sphere)) {
            throw new DeveloperError('sphere is required.');
        }
        
        var ray = scratchLineSegmentRay;
        Cartesian3.clone(p0, ray.origin);
        var direction = Cartesian3.subtract(p1, p0, ray.direction);

        var maxT = Cartesian3.magnitude(direction);
        Cartesian3.normalize(direction, direction);

        result = raySphere(ray, sphere, result);
        if (!defined(result) || result.stop < 0.0 || result.start > maxT) {
            return undefined;
        }

        result.start = Math.max(result.start, 0.0);
        result.stop = Math.min(result.stop, maxT);
        return result;
    };

    var scratchQ = new Cartesian3();
    var scratchW = new Cartesian3();

    /**
     * Computes the intersection points of a ray with an ellipsoid.
     *
     * @param {Ray} ray The ray.
     * @param {Ellipsoid} ellipsoid The ellipsoid.
     * @returns {Interval} The interval containing scalar points along the ray or undefined if there are no intersections.
     */
    IntersectionTests.rayEllipsoid = function(ray, ellipsoid) {
                if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }
        if (!defined(ellipsoid)) {
            throw new DeveloperError('ellipsoid is required.');
        }
        
        var inverseRadii = ellipsoid.oneOverRadii;
        var q = Cartesian3.multiplyComponents(inverseRadii, ray.origin, scratchQ);
        var w = Cartesian3.multiplyComponents(inverseRadii, ray.direction, scratchW);

        var q2 = Cartesian3.magnitudeSquared(q);
        var qw = Cartesian3.dot(q, w);

        var difference, w2, product, discriminant, temp;

        if (q2 > 1.0) {
            // Outside ellipsoid.
            if (qw >= 0.0) {
                // Looking outward or tangent (0 intersections).
                return undefined;
            }

            // qw < 0.0.
            var qw2 = qw * qw;
            difference = q2 - 1.0; // Positively valued.
            w2 = Cartesian3.magnitudeSquared(w);
            product = w2 * difference;

            if (qw2 < product) {
                // Imaginary roots (0 intersections).
                return undefined;
            } else if (qw2 > product) {
                // Distinct roots (2 intersections).
                discriminant = qw * qw - product;
                temp = -qw + Math.sqrt(discriminant); // Avoid cancellation.
                var root0 = temp / w2;
                var root1 = difference / temp;
                if (root0 < root1) {
                    return new Interval(root0, root1);
                }

                return {
                    start : root1,
                    stop : root0
                };
            } else {
                // qw2 == product.  Repeated roots (2 intersections).
                var root = Math.sqrt(difference / w2);
                return new Interval(root, root);
            }
        } else if (q2 < 1.0) {
            // Inside ellipsoid (2 intersections).
            difference = q2 - 1.0; // Negatively valued.
            w2 = Cartesian3.magnitudeSquared(w);
            product = w2 * difference; // Negatively valued.

            discriminant = qw * qw - product;
            temp = -qw + Math.sqrt(discriminant); // Positively valued.
            return new Interval(0.0, temp / w2);
        } else {
            // q2 == 1.0. On ellipsoid.
            if (qw < 0.0) {
                // Looking inward.
                w2 = Cartesian3.magnitudeSquared(w);
                return new Interval(0.0, -qw / w2);
            }

            // qw >= 0.0.  Looking outward or tangent.
            return undefined;
        }
    };

    function addWithCancellationCheck(left, right, tolerance) {
        var difference = left + right;
        if ((CesiumMath.sign(left) !== CesiumMath.sign(right)) &&
                Math.abs(difference / Math.max(Math.abs(left), Math.abs(right))) < tolerance) {
            return 0.0;
        }

        return difference;
    }

    function quadraticVectorExpression(A, b, c, x, w) {
        var xSquared = x * x;
        var wSquared = w * w;

        var l2 = (A[Matrix3.COLUMN1ROW1] - A[Matrix3.COLUMN2ROW2]) * wSquared;
        var l1 = w * (x * addWithCancellationCheck(A[Matrix3.COLUMN1ROW0], A[Matrix3.COLUMN0ROW1], CesiumMath.EPSILON15) + b.y);
        var l0 = (A[Matrix3.COLUMN0ROW0] * xSquared + A[Matrix3.COLUMN2ROW2] * wSquared) + x * b.x + c;

        var r1 = wSquared * addWithCancellationCheck(A[Matrix3.COLUMN2ROW1], A[Matrix3.COLUMN1ROW2], CesiumMath.EPSILON15);
        var r0 = w * (x * addWithCancellationCheck(A[Matrix3.COLUMN2ROW0], A[Matrix3.COLUMN0ROW2]) + b.z);

        var cosines;
        var solutions = [];
        if (r0 === 0.0 && r1 === 0.0) {
            cosines = QuadraticRealPolynomial.computeRealRoots(l2, l1, l0);
            if (cosines.length === 0) {
                return solutions;
            }

            var cosine0 = cosines[0];
            var sine0 = Math.sqrt(Math.max(1.0 - cosine0 * cosine0, 0.0));
            solutions.push(new Cartesian3(x, w * cosine0, w * -sine0));
            solutions.push(new Cartesian3(x, w * cosine0, w * sine0));

            if (cosines.length === 2) {
                var cosine1 = cosines[1];
                var sine1 = Math.sqrt(Math.max(1.0 - cosine1 * cosine1, 0.0));
                solutions.push(new Cartesian3(x, w * cosine1, w * -sine1));
                solutions.push(new Cartesian3(x, w * cosine1, w * sine1));
            }

            return solutions;
        }

        var r0Squared = r0 * r0;
        var r1Squared = r1 * r1;
        var l2Squared = l2 * l2;
        var r0r1 = r0 * r1;

        var c4 = l2Squared + r1Squared;
        var c3 = 2.0 * (l1 * l2 + r0r1);
        var c2 = 2.0 * l0 * l2 + l1 * l1 - r1Squared + r0Squared;
        var c1 = 2.0 * (l0 * l1 - r0r1);
        var c0 = l0 * l0 - r0Squared;

        if (c4 === 0.0 && c3 === 0.0 && c2 === 0.0 && c1 === 0.0) {
            return solutions;
        }

        cosines = QuarticRealPolynomial.computeRealRoots(c4, c3, c2, c1, c0);
        var length = cosines.length;
        if (length === 0) {
            return solutions;
        }

        for ( var i = 0; i < length; ++i) {
            var cosine = cosines[i];
            var cosineSquared = cosine * cosine;
            var sineSquared = Math.max(1.0 - cosineSquared, 0.0);
            var sine = Math.sqrt(sineSquared);

            //var left = l2 * cosineSquared + l1 * cosine + l0;
            var left;
            if (CesiumMath.sign(l2) === CesiumMath.sign(l0)) {
                left = addWithCancellationCheck(l2 * cosineSquared + l0, l1 * cosine, CesiumMath.EPSILON12);
            } else if (CesiumMath.sign(l0) === CesiumMath.sign(l1 * cosine)) {
                left = addWithCancellationCheck(l2 * cosineSquared, l1 * cosine + l0, CesiumMath.EPSILON12);
            } else {
                left = addWithCancellationCheck(l2 * cosineSquared + l1 * cosine, l0, CesiumMath.EPSILON12);
            }

            var right = addWithCancellationCheck(r1 * cosine, r0, CesiumMath.EPSILON15);
            var product = left * right;

            if (product < 0.0) {
                solutions.push(new Cartesian3(x, w * cosine, w * sine));
            } else if (product > 0.0) {
                solutions.push(new Cartesian3(x, w * cosine, w * -sine));
            } else if (sine !== 0.0) {
                solutions.push(new Cartesian3(x, w * cosine, w * -sine));
                solutions.push(new Cartesian3(x, w * cosine, w * sine));
                ++i;
            } else {
                solutions.push(new Cartesian3(x, w * cosine, w * sine));
            }
        }

        return solutions;
    }

    var firstAxisScratch = new Cartesian3();
    var secondAxisScratch = new Cartesian3();
    var thirdAxisScratch = new Cartesian3();
    var referenceScratch = new Cartesian3();
    var bCart = new Cartesian3();
    var bScratch = new Matrix3();
    var btScratch = new Matrix3();
    var diScratch = new Matrix3();
    var dScratch = new Matrix3();
    var cScratch = new Matrix3();
    var tempMatrix = new Matrix3();
    var aScratch = new Matrix3();
    var sScratch = new Cartesian3();
    var closestScratch = new Cartesian3();
    var surfPointScratch = new Cartographic();

    /**
     * Provides the point along the ray which is nearest to the ellipsoid.
     *
     * @param {Ray} ray The ray.
     * @param {Ellipsoid} ellipsoid The ellipsoid.
     * @returns {Cartesian3} The nearest planetodetic point on the ray.
     */
    IntersectionTests.grazingAltitudeLocation = function(ray, ellipsoid) {
                if (!defined(ray)) {
            throw new DeveloperError('ray is required.');
        }
        if (!defined(ellipsoid)) {
            throw new DeveloperError('ellipsoid is required.');
        }
        
        var position = ray.origin;
        var direction = ray.direction;

        if (!Cartesian3.equals(position, Cartesian3.ZERO)) {
            var normal = ellipsoid.geodeticSurfaceNormal(position, firstAxisScratch);
            if (Cartesian3.dot(direction, normal) >= 0.0) { // The location provided is the closest point in altitude
                return position;
            }
        }

        var intersects = defined(this.rayEllipsoid(ray, ellipsoid));

        // Compute the scaled direction vector.
        var f = ellipsoid.transformPositionToScaledSpace(direction, firstAxisScratch);

        // Constructs a basis from the unit scaled direction vector. Construct its rotation and transpose.
        var firstAxis = Cartesian3.normalize(f, f);
        var reference = Cartesian3.mostOrthogonalAxis(f, referenceScratch);
        var secondAxis = Cartesian3.normalize(Cartesian3.cross(reference, firstAxis, secondAxisScratch), secondAxisScratch);
        var thirdAxis  = Cartesian3.normalize(Cartesian3.cross(firstAxis, secondAxis, thirdAxisScratch), thirdAxisScratch);
        var B = bScratch;
        B[0] = firstAxis.x;
        B[1] = firstAxis.y;
        B[2] = firstAxis.z;
        B[3] = secondAxis.x;
        B[4] = secondAxis.y;
        B[5] = secondAxis.z;
        B[6] = thirdAxis.x;
        B[7] = thirdAxis.y;
        B[8] = thirdAxis.z;

        var B_T = Matrix3.transpose(B, btScratch);

        // Get the scaling matrix and its inverse.
        var D_I = Matrix3.fromScale(ellipsoid.radii, diScratch);
        var D = Matrix3.fromScale(ellipsoid.oneOverRadii, dScratch);

        var C = cScratch;
        C[0] = 0.0;
        C[1] = -direction.z;
        C[2] = direction.y;
        C[3] = direction.z;
        C[4] = 0.0;
        C[5] = -direction.x;
        C[6] = -direction.y;
        C[7] = direction.x;
        C[8] = 0.0;

        var temp = Matrix3.multiply(Matrix3.multiply(B_T, D, tempMatrix), C, tempMatrix);
        var A = Matrix3.multiply(Matrix3.multiply(temp, D_I, aScratch), B, aScratch);
        var b = Matrix3.multiplyByVector(temp, position, bCart);

        // Solve for the solutions to the expression in standard form:
        var solutions = quadraticVectorExpression(A, Cartesian3.negate(b, firstAxisScratch), 0.0, 0.0, 1.0);

        var s;
        var altitude;
        var length = solutions.length;
        if (length > 0) {
            var closest = Cartesian3.clone(Cartesian3.ZERO, closestScratch);
            var maximumValue = Number.NEGATIVE_INFINITY;

            for ( var i = 0; i < length; ++i) {
                s = Matrix3.multiplyByVector(D_I, Matrix3.multiplyByVector(B, solutions[i], sScratch), sScratch);
                var v = Cartesian3.normalize(Cartesian3.subtract(s, position, referenceScratch), referenceScratch);
                var dotProduct = Cartesian3.dot(v, direction);

                if (dotProduct > maximumValue) {
                    maximumValue = dotProduct;
                    closest = Cartesian3.clone(s, closest);
                }
            }

            var surfacePoint = ellipsoid.cartesianToCartographic(closest, surfPointScratch);
            maximumValue = CesiumMath.clamp(maximumValue, 0.0, 1.0);
            altitude = Cartesian3.magnitude(Cartesian3.subtract(closest, position, referenceScratch)) * Math.sqrt(1.0 - maximumValue * maximumValue);
            altitude = intersects ? -altitude : altitude;
            surfacePoint.height = altitude;
            return ellipsoid.cartographicToCartesian(surfacePoint, new Cartesian3());
        }

        return undefined;
    };

    var lineSegmentPlaneDifference = new Cartesian3();

    /**
     * Computes the intersection of a line segment and a plane.
     *
     * @param {Cartesian3} endPoint0 An end point of the line segment.
     * @param {Cartesian3} endPoint1 The other end point of the line segment.
     * @param {Plane} plane The plane.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3} The intersection point or undefined if there is no intersection.
     *
     * @example
     * var origin = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
     * var normal = ellipsoid.geodeticSurfaceNormal(origin);
     * var plane = Cesium.Plane.fromPointNormal(origin, normal);
     *
     * var p0 = new Cesium.Cartesian3(...);
     * var p1 = new Cesium.Cartesian3(...);
     *
     * // find the intersection of the line segment from p0 to p1 and the tangent plane at origin.
     * var intersection = Cesium.IntersectionTests.lineSegmentPlane(p0, p1, plane);
     */
    IntersectionTests.lineSegmentPlane = function(endPoint0, endPoint1, plane, result) {
                if (!defined(endPoint0)) {
            throw new DeveloperError('endPoint0 is required.');
        }
        if (!defined(endPoint1)) {
            throw new DeveloperError('endPoint1 is required.');
        }
        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }
        
        if (!defined(result)) {
            result = new Cartesian3();
        }

        var difference = Cartesian3.subtract(endPoint1, endPoint0, lineSegmentPlaneDifference);
        var normal = plane.normal;
        var nDotDiff = Cartesian3.dot(normal, difference);

        // check if the segment and plane are parallel
        if (Math.abs(nDotDiff) < CesiumMath.EPSILON6) {
            return undefined;
        }

        var nDotP0 = Cartesian3.dot(normal, endPoint0);
        var t = -(plane.distance + nDotP0) / nDotDiff;

        // intersection only if t is in [0, 1]
        if (t < 0.0 || t > 1.0) {
            return undefined;
        }

        // intersection is endPoint0 + t * (endPoint1 - endPoint0)
        Cartesian3.multiplyByScalar(difference, t, result);
        Cartesian3.add(endPoint0, result, result);
        return result;
    };

    /**
     * Computes the intersection of a triangle and a plane
     *
     * @param {Cartesian3} p0 First point of the triangle
     * @param {Cartesian3} p1 Second point of the triangle
     * @param {Cartesian3} p2 Third point of the triangle
     * @param {Plane} plane Intersection plane
     * @returns {Object} An object with properties <code>positions</code> and <code>indices</code>, which are arrays that represent three triangles that do not cross the plane. (Undefined if no intersection exists)
     *
     * @example
     * var origin = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
     * var normal = ellipsoid.geodeticSurfaceNormal(origin);
     * var plane = Cesium.Plane.fromPointNormal(origin, normal);
     *
     * var p0 = new Cesium.Cartesian3(...);
     * var p1 = new Cesium.Cartesian3(...);
     * var p2 = new Cesium.Cartesian3(...);
     *
     * // convert the triangle composed of points (p0, p1, p2) to three triangles that don't cross the plane
     * var triangles = Cesium.IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
     */
    IntersectionTests.trianglePlaneIntersection = function(p0, p1, p2, plane) {
                if ((!defined(p0)) ||
            (!defined(p1)) ||
            (!defined(p2)) ||
            (!defined(plane))) {
            throw new DeveloperError('p0, p1, p2, and plane are required.');
        }
        
        var planeNormal = plane.normal;
        var planeD = plane.distance;
        var p0Behind = (Cartesian3.dot(planeNormal, p0) + planeD) < 0.0;
        var p1Behind = (Cartesian3.dot(planeNormal, p1) + planeD) < 0.0;
        var p2Behind = (Cartesian3.dot(planeNormal, p2) + planeD) < 0.0;
        // Given these dots products, the calls to lineSegmentPlaneIntersection
        // always have defined results.

        var numBehind = 0;
        numBehind += p0Behind ? 1 : 0;
        numBehind += p1Behind ? 1 : 0;
        numBehind += p2Behind ? 1 : 0;

        var u1, u2;
        if (numBehind === 1 || numBehind === 2) {
            u1 = new Cartesian3();
            u2 = new Cartesian3();
        }

        if (numBehind === 1) {
            if (p0Behind) {
                IntersectionTests.lineSegmentPlane(p0, p1, plane, u1);
                IntersectionTests.lineSegmentPlane(p0, p2, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        0, 3, 4,

                        // In front
                        1, 2, 4,
                        1, 4, 3
                    ]
                };
            } else if (p1Behind) {
                IntersectionTests.lineSegmentPlane(p1, p2, plane, u1);
                IntersectionTests.lineSegmentPlane(p1, p0, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        1, 3, 4,

                        // In front
                        2, 0, 4,
                        2, 4, 3
                    ]
                };
            } else if (p2Behind) {
                IntersectionTests.lineSegmentPlane(p2, p0, plane, u1);
                IntersectionTests.lineSegmentPlane(p2, p1, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        2, 3, 4,

                        // In front
                        0, 1, 4,
                        0, 4, 3
                    ]
                };
            }
        } else if (numBehind === 2) {
            if (!p0Behind) {
                IntersectionTests.lineSegmentPlane(p1, p0, plane, u1);
                IntersectionTests.lineSegmentPlane(p2, p0, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        1, 2, 4,
                        1, 4, 3,

                        // In front
                        0, 3, 4
                    ]
                };
            } else if (!p1Behind) {
                IntersectionTests.lineSegmentPlane(p2, p1, plane, u1);
                IntersectionTests.lineSegmentPlane(p0, p1, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        2, 0, 4,
                        2, 4, 3,

                        // In front
                        1, 3, 4
                    ]
                };
            } else if (!p2Behind) {
                IntersectionTests.lineSegmentPlane(p0, p2, plane, u1);
                IntersectionTests.lineSegmentPlane(p1, p2, plane, u2);

                return {
                    positions : [p0, p1, p2, u1, u2 ],
                    indices : [
                        // Behind
                        0, 1, 4,
                        0, 4, 3,

                        // In front
                        2, 3, 4
                    ]
                };
            }
        }

        // if numBehind is 3, the triangle is completely behind the plane;
        // otherwise, it is completely in front (numBehind is 0).
        return undefined;
    };

    return IntersectionTests;
});

/*global define*/
define('Core/Plane',[
        './Cartesian3',
        './defined',
        './DeveloperError',
        './freezeObject'
    ], function(
        Cartesian3,
        defined,
        DeveloperError,
        freezeObject) {
    'use strict';

    /**
     * A plane in Hessian Normal Form defined by
     * <pre>
     * ax + by + cz + d = 0
     * </pre>
     * where (a, b, c) is the plane's <code>normal</code>, d is the signed
     * <code>distance</code> to the plane, and (x, y, z) is any point on
     * the plane.
     *
     * @alias Plane
     * @constructor
     *
     * @param {Cartesian3} normal The plane's normal (normalized).
     * @param {Number} distance The shortest distance from the origin to the plane.  The sign of
     * <code>distance</code> determines which side of the plane the origin
     * is on.  If <code>distance</code> is positive, the origin is in the half-space
     * in the direction of the normal; if negative, the origin is in the half-space
     * opposite to the normal; if zero, the plane passes through the origin.
     *
     * @example
     * // The plane x=0
     * var plane = new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0);
     */
    function Plane(normal, distance) {
                if (!defined(normal))  {
            throw new DeveloperError('normal is required.');
        }
        if (!defined(distance)) {
            throw new DeveloperError('distance is required.');
        }
        
        /**
         * The plane's normal.
         *
         * @type {Cartesian3}
         */
        this.normal = Cartesian3.clone(normal);

        /**
         * The shortest distance from the origin to the plane.  The sign of
         * <code>distance</code> determines which side of the plane the origin
         * is on.  If <code>distance</code> is positive, the origin is in the half-space
         * in the direction of the normal; if negative, the origin is in the half-space
         * opposite to the normal; if zero, the plane passes through the origin.
         *
         * @type {Number}
         */
        this.distance = distance;
    }

    /**
     * Creates a plane from a normal and a point on the plane.
     *
     * @param {Cartesian3} point The point on the plane.
     * @param {Cartesian3} normal The plane's normal (normalized).
     * @param {Plane} [result] The object onto which to store the result.
     * @returns {Plane} A new plane instance or the modified result parameter.
     *
     * @example
     * var point = Cesium.Cartesian3.fromDegrees(-72.0, 40.0);
     * var normal = ellipsoid.geodeticSurfaceNormal(point);
     * var tangentPlane = Cesium.Plane.fromPointNormal(point, normal);
     */
    Plane.fromPointNormal = function(point, normal, result) {
                if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }
        if (!defined(normal)) {
            throw new DeveloperError('normal is required.');
        }
        
        var distance = -Cartesian3.dot(normal, point);

        if (!defined(result)) {
            return new Plane(normal, distance);
        }

        Cartesian3.clone(normal, result.normal);
        result.distance = distance;
        return result;
    };

    var scratchNormal = new Cartesian3();
    /**
     * Creates a plane from the general equation
     *
     * @param {Cartesian4} coefficients The plane's normal (normalized).
     * @param {Plane} [result] The object onto which to store the result.
     * @returns {Plane} A new plane instance or the modified result parameter.
     */
    Plane.fromCartesian4 = function(coefficients, result) {
                if (!defined(coefficients)) {
            throw new DeveloperError('coefficients is required.');
        }
        
        var normal = Cartesian3.fromCartesian4(coefficients, scratchNormal);
        var distance = coefficients.w;

        if (!defined(result)) {
            return new Plane(normal, distance);
        } else {
            Cartesian3.clone(normal, result.normal);
            result.distance = distance;
            return result;
        }
    };

    /**
     * Computes the signed shortest distance of a point to a plane.
     * The sign of the distance determines which side of the plane the point
     * is on.  If the distance is positive, the point is in the half-space
     * in the direction of the normal; if negative, the point is in the half-space
     * opposite to the normal; if zero, the plane passes through the point.
     *
     * @param {Plane} plane The plane.
     * @param {Cartesian3} point The point.
     * @returns {Number} The signed shortest distance of the point to the plane.
     */
    Plane.getPointDistance = function(plane, point) {
                if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }
        if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }
        
        return Cartesian3.dot(plane.normal, point) + plane.distance;
    };

    /**
     * A constant initialized to the XY plane passing through the origin, with normal in positive Z.
     *
     * @type {Plane}
     * @constant
     */
    Plane.ORIGIN_XY_PLANE = freezeObject(new Plane(Cartesian3.UNIT_Z, 0.0));

    /**
     * A constant initialized to the YZ plane passing through the origin, with normal in positive X.
     *
     * @type {Plane}
     * @constant
     */
    Plane.ORIGIN_YZ_PLANE = freezeObject(new Plane(Cartesian3.UNIT_X, 0.0));

    /**
     * A constant initialized to the ZX plane passing through the origin, with normal in positive Y.
     *
     * @type {Plane}
     * @constant
     */
    Plane.ORIGIN_ZX_PLANE = freezeObject(new Plane(Cartesian3.UNIT_Y, 0.0));

    return Plane;
});

/**
  @license
  when.js - https://github.com/cujojs/when

  MIT License (c) copyright B Cavalier & J Hann

 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.7.1
 */

(function(define) { 'use strict';
define('ThirdParty/when',[],function () {
	var reduceArray, slice, undef;

	//
	// Public API
	//

	when.defer     = defer;     // Create a deferred
	when.resolve   = resolve;   // Create a resolved promise
	when.reject    = reject;    // Create a rejected promise

	when.join      = join;      // Join 2 or more promises

	when.all       = all;       // Resolve a list of promises
	when.map       = map;       // Array.map() for promises
	when.reduce    = reduce;    // Array.reduce() for promises

	when.any       = any;       // One-winner race
	when.some      = some;      // Multi-winner race

	when.chain     = chain;     // Make a promise trigger another resolver

	when.isPromise = isPromise; // Determine if a thing is a promise

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Returns promiseOrValue if promiseOrValue is a {@link Promise}, a new Promise if
	 * promiseOrValue is a foreign promise, or a new, already-fulfilled {@link Promise}
	 * whose value is promiseOrValue if promiseOrValue is an immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @returns Guaranteed to return a trusted Promise.  If promiseOrValue is a when.js {@link Promise}
	 *   returns promiseOrValue, otherwise, returns a new, already-resolved, when.js {@link Promise}
	 *   whose resolution value is:
	 *   * the resolution value of promiseOrValue if it's a foreign promise, or
	 *   * promiseOrValue if it's a value
	 */
	function resolve(promiseOrValue) {
		var promise, deferred;

		if(promiseOrValue instanceof Promise) {
			// It's a when.js promise, so we trust it
			promise = promiseOrValue;

		} else {
			// It's not a when.js promise. See if it's a foreign promise or a value.
			if(isPromise(promiseOrValue)) {
				// It's a thenable, but we don't know where it came from, so don't trust
				// its implementation entirely.  Introduce a trusted middleman when.js promise
				deferred = defer();

				// IMPORTANT: This is the only place when.js should ever call .then() on an
				// untrusted promise. Don't expose the return value to the untrusted promise
				promiseOrValue.then(
					function(value)  { deferred.resolve(value); },
					function(reason) { deferred.reject(reason); },
					function(update) { deferred.progress(update); }
				);

				promise = deferred.promise;

			} else {
				// It's a value, not a promise.  Create a resolved promise for it.
				promise = fulfilled(promiseOrValue);
			}
		}

		return promise;
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @returns {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @name Promise
	 */
	function Promise(then) {
		this.then = then;
	}

	Promise.prototype = {
		/**
		 * Register a callback that will be called when a promise is
		 * fulfilled or rejected.  Optionally also register a progress handler.
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress)
		 * @param {function?} [onFulfilledOrRejected]
		 * @param {function?} [onProgress]
		 * @returns {Promise}
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		},

		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @returns {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @returns {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		yield: function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.spread(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @returns {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		}
	};

	/**
	 * Create an already-resolved promise for the supplied value
	 * @private
	 *
	 * @param {*} value
	 * @returns {Promise} fulfilled promise
	 */
	function fulfilled(value) {
		var p = new Promise(function(onFulfilled) {
			// TODO: Promises/A+ check typeof onFulfilled
			try {
				return resolve(onFulfilled ? onFulfilled(value) : value);
			} catch(e) {
				return rejected(e);
			}
		});

		return p;
	}

	/**
	 * Create an already-rejected {@link Promise} with the supplied
	 * rejection reason.
	 * @private
	 *
	 * @param {*} reason
	 * @returns {Promise} rejected promise
	 */
	function rejected(reason) {
		var p = new Promise(function(_, onRejected) {
			// TODO: Promises/A+ check typeof onRejected
			try {
				return onRejected ? resolve(onRejected(reason)) : rejected(reason);
			} catch(e) {
				return rejected(e);
			}
		});

		return p;
	}

	/**
	 * Creates a new, Deferred with fully isolated resolver and promise parts,
	 * either or both of which may be given out safely to consumers.
	 * The Deferred itself has the full API: resolve, reject, progress, and
	 * then. The resolver has resolve, reject, and progress.  The promise
	 * only has then.
	 *
	 * @returns {Deferred}
	 */
	function defer() {
		var deferred, promise, handlers, progressHandlers,
			_then, _progress, _resolve;

		/**
		 * The promise for the new deferred
		 * @type {Promise}
		 */
		promise = new Promise(then);

		/**
		 * The full Deferred object, with {@link Promise} and {@link Resolver} parts
		 * @class Deferred
		 * @name Deferred
		 */
		deferred = {
			then:     then, // DEPRECATED: use deferred.promise.then
			resolve:  promiseResolve,
			reject:   promiseReject,
			// TODO: Consider renaming progress() to notify()
			progress: promiseProgress,

			promise:  promise,

			resolver: {
				resolve:  promiseResolve,
				reject:   promiseReject,
				progress: promiseProgress
			}
		};

		handlers = [];
		progressHandlers = [];

		/**
		 * Pre-resolution then() that adds the supplied callback, errback, and progback
		 * functions to the registered listeners
		 * @private
		 *
		 * @param {function?} [onFulfilled] resolution handler
		 * @param {function?} [onRejected] rejection handler
		 * @param {function?} [onProgress] progress handler
		 */
		_then = function(onFulfilled, onRejected, onProgress) {
			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
			var deferred, progressHandler;

			deferred = defer();

			progressHandler = typeof onProgress === 'function'
				? function(update) {
					try {
						// Allow progress handler to transform progress event
						deferred.progress(onProgress(update));
					} catch(e) {
						// Use caught value as progress
						deferred.progress(e);
					}
				}
				: function(update) { deferred.progress(update); };

			handlers.push(function(promise) {
				promise.then(onFulfilled, onRejected)
					.then(deferred.resolve, deferred.reject, progressHandler);
			});

			progressHandlers.push(progressHandler);

			return deferred.promise;
		};

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @private
		 * @param {*} update progress event payload to pass to all listeners
		 */
		_progress = function(update) {
			processQueue(progressHandlers, update);
			return update;
		};

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the resolution or rejection
		 * @private
		 * @param {*} value the value of this deferred
		 */
		_resolve = function(value) {
			value = resolve(value);

			// Replace _then with one that directly notifies with the result.
			_then = value.then;
			// Replace _resolve so that this Deferred can only be resolved once
			_resolve = resolve;
			// Make _progress a noop, to disallow progress for the resolved promise.
			_progress = noop;

			// Notify handlers
			processQueue(handlers, value);

			// Free progressHandlers array since we'll never issue progress events
			progressHandlers = handlers = undef;

			return value;
		};

		return deferred;

		/**
		 * Wrapper to allow _then to be replaced safely
		 * @param {function?} [onFulfilled] resolution handler
		 * @param {function?} [onRejected] rejection handler
		 * @param {function?} [onProgress] progress handler
		 * @returns {Promise} new promise
		 */
		function then(onFulfilled, onRejected, onProgress) {
			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
			return _then(onFulfilled, onRejected, onProgress);
		}

		/**
		 * Wrapper to allow _resolve to be replaced
		 */
		function promiseResolve(val) {
			return _resolve(val);
		}

		/**
		 * Wrapper to allow _reject to be replaced
		 */
		function promiseReject(err) {
			return _resolve(rejected(err));
		}

		/**
		 * Wrapper to allow _progress to be replaced
		 */
		function promiseProgress(update) {
			return _progress(update);
		}
	}

	/**
	 * Determines if promiseOrValue is a promise or not.  Uses the feature
	 * test from http://wiki.commonjs.org/wiki/Promises/A to determine if
	 * promiseOrValue is a promise.
	 *
	 * @param {*} promiseOrValue anything
	 * @returns {boolean} true if promiseOrValue is a {@link Promise}
	 */
	function isPromise(promiseOrValue) {
		return promiseOrValue && typeof promiseOrValue.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 * resolved first, or will reject with an array of (promisesOrValues.length - howMany) + 1
	 * rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		checkCallbacks(2, arguments);

		return when(promisesOrValues, function(promisesOrValues) {

			var toResolve, toReject, values, reasons, deferred, fulfillOne, rejectOne, progress, len, i;

			len = promisesOrValues.length >>> 0;

			toResolve = Math.max(0, Math.min(howMany, len));
			values = [];

			toReject = (len - toResolve) + 1;
			reasons = [];

			deferred = defer();

			// No items in the input, resolve immediately
			if (!toResolve) {
				deferred.resolve(values);

			} else {
				progress = deferred.progress;

				rejectOne = function(reason) {
					reasons.push(reason);
					if(!--toReject) {
						fulfillOne = rejectOne = noop;
						deferred.reject(reasons);
					}
				};

				fulfillOne = function(val) {
					// This orders the values based on promise resolution order
					// Another strategy would be to use the original position of
					// the corresponding promise.
					values.push(val);

					if (!--toResolve) {
						fulfillOne = rejectOne = noop;
						deferred.resolve(values);
					}
				};

				for(i = 0; i < len; ++i) {
					if(i in promisesOrValues) {
						when(promisesOrValues[i], fulfiller, rejecter, progress);
					}
				}
			}

			return deferred.then(onFulfilled, onRejected, onProgress);

			function rejecter(reason) {
				rejectOne(reason);
			}

			function fulfiller(val) {
				fulfillOne(val);
			}

		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] resolution handler
	 * @param {function?} [onRejected] rejection handler
	 * @param {function?} [onProgress] progress handler
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		checkCallbacks(1, arguments);
		return map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @returns {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return map(arguments, identity);
	}

	/**
	 * Traditional map function, similar to `Array.prototype.map()`, but allows
	 * input to contain {@link Promise}s and/or values, and mapFunc may return
	 * either a value or a {@link Promise}
	 *
	 * @param {Array|Promise} promise array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function} mapFunc mapping function mapFunc(value) which may return
	 *      either a {@link Promise} or value
	 * @returns {Promise} a {@link Promise} that will resolve to an array containing
	 *      the mapped output values.
	 */
	function map(promise, mapFunc) {
		return when(promise, function(array) {
			var results, len, toResolve, resolve, i, d;

			// Since we know the resulting length, we can preallocate the results
			// array to avoid array expansions.
			toResolve = len = array.length >>> 0;
			results = [];
			d = defer();

			if(!toResolve) {
				d.resolve(results);
			} else {

				resolve = function resolveOne(item, i) {
					when(item, mapFunc).then(function(mapped) {
						results[i] = mapped;

						if(!--toResolve) {
							d.resolve(results);
						}
					}, d.reject);
				};

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolve(array[i], i);
					} else {
						--toResolve;
					}
				}

			}

			return d.promise;

		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = slice.call(arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	/**
	 * Ensure that resolution of promiseOrValue will trigger resolver with the
	 * value or reason of promiseOrValue, or instead with resolveValue if it is provided.
	 *
	 * @param promiseOrValue
	 * @param {Object} resolver
	 * @param {function} resolver.resolve
	 * @param {function} resolver.reject
	 * @param {*} [resolveValue]
	 * @returns {Promise}
	 */
	function chain(promiseOrValue, resolver, resolveValue) {
		var useResolveValue = arguments.length > 2;

		return when(promiseOrValue,
			function(val) {
				val = useResolveValue ? resolveValue : val;
				resolver.resolve(val);
				return val;
			},
			function(reason) {
				resolver.reject(reason);
				return rejected(reason);
			},
			resolver.progress
		);
	}

	//
	// Utility functions
	//

	/**
	 * Apply all functions in queue to value
	 * @param {Array} queue array of functions to execute
	 * @param {*} value argument passed to each function
	 */
	function processQueue(queue, value) {
		var handler, i = 0;

		while (handler = queue[i++]) {
			handler(value);
		}
	}

	/**
	 * Helper that checks arrayOfCallbacks to ensure that each element is either
	 * a function, or null or undefined.
	 * @private
	 * @param {number} start index at which to start checking items in arrayOfCallbacks
	 * @param {Array} arrayOfCallbacks array to check
	 * @throws {Error} if any element of arrayOfCallbacks is something other than
	 * a functions, null, or undefined.
	 */
	function checkCallbacks(start, arrayOfCallbacks) {
		// TODO: Promises/A+ update type checking and docs
		var arg, i = arrayOfCallbacks.length;

		while(i > start) {
			arg = arrayOfCallbacks[--i];

			if (arg != null && typeof arg != 'function') {
				throw new Error('arg '+i+' must be a function');
			}
		}
	}

	/**
	 * No-Op function used in method replacement
	 * @private
	 */
	function noop() {}

	slice = [].slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.
	reduceArray = [].reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/

			// ES5 dictates that reduce.length === 1

			// This implementation deviates from ES5 spec in the following ways:
			// 1. It does not check if reduceFunc is a Callable

			var arr, args, reduced, len, i;

			i = 0;
			// This generates a jshint warning, despite being valid
			// "Missing 'new' prefix when invoking a constructor."
			// See https://github.com/jshint/jshint/issues/392
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				// Skip holes
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(typeof define == 'function' && define.amd
	? define
	: function (factory) { typeof exports === 'object'
		? (module.exports = factory())
		: (this.when      = factory());
	}
	// Boilerplate for AMD, Node, and browser global
);

/*global define*/
define('Core/oneTimeWarning',[
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        defaultValue,
        defined,
        DeveloperError) {
    "use strict";

    var warnings = {};

    /**
     * Logs a one time message to the console.  Use this function instead of
     * <code>console.log</code> directly since this does not log duplicate messages
     * unless it is called from multiple workers.
     *
     * @exports oneTimeWarning
     *
     * @param {String} identifier The unique identifier for this warning.
     * @param {String} [message=identifier] The message to log to the console.
     *
     * @example
     * for(var i=0;i<foo.length;++i) {
     *    if (!defined(foo[i].bar)) {
     *       // Something that can be recovered from but may happen a lot
     *       oneTimeWarning('foo.bar undefined', 'foo.bar is undefined. Setting to 0.');
     *       foo[i].bar = 0;
     *       // ...
     *    }
     * }
     *
     * @private
     */
    function oneTimeWarning(identifier, message) {
                if (!defined(identifier)) {
            throw new DeveloperError('identifier is required.');
        }
        
        if (!defined(warnings[identifier])) {
            warnings[identifier] = true;
            console.warn(defaultValue(message, identifier));
        }
    }

    oneTimeWarning.geometryOutlines = 'Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.';

    return oneTimeWarning;
});

/*global define*/
define('Core/deprecationWarning',[
        './defined',
        './DeveloperError',
        './oneTimeWarning'
    ], function(
        defined,
        DeveloperError,
        oneTimeWarning) {
    'use strict';
    
    /**
     * Logs a deprecation message to the console.  Use this function instead of
     * <code>console.log</code> directly since this does not log duplicate messages
     * unless it is called from multiple workers.
     *
     * @exports deprecationWarning
     *
     * @param {String} identifier The unique identifier for this deprecated API.
     * @param {String} message The message to log to the console.
     *
     * @example
     * // Deprecated function or class
     * function Foo() {
     *    deprecationWarning('Foo', 'Foo was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use newFoo instead.');
     *    // ...
     * }
     *
     * // Deprecated function
     * Bar.prototype.func = function() {
     *    deprecationWarning('Bar.func', 'Bar.func() was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use Bar.newFunc() instead.');
     *    // ...
     * };
     *
     * // Deprecated property
     * defineProperties(Bar.prototype, {
     *     prop : {
     *         get : function() {
     *             deprecationWarning('Bar.prop', 'Bar.prop was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use Bar.newProp instead.');
     *             // ...
     *         },
     *         set : function(value) {
     *             deprecationWarning('Bar.prop', 'Bar.prop was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use Bar.newProp instead.');
     *             // ...
     *         }
     *     }
     * });
     *
     * @private
     */
    function deprecationWarning(identifier, message) {
                if (!defined(identifier) || !defined(message)) {
            throw new DeveloperError('identifier and message are required.');
        }
        
        oneTimeWarning(identifier, message);
    }

    return deprecationWarning;
});

/*global define*/
define('Core/binarySearch',[
        './defined',
        './DeveloperError'
    ], function(
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Finds an item in a sorted array.
     *
     * @exports binarySearch
     *
     * @param {Array} array The sorted array to search.
     * @param {Object} itemToFind The item to find in the array.
     * @param {binarySearch~Comparator} comparator The function to use to compare the item to
     *        elements in the array.
     * @returns {Number} The index of <code>itemToFind</code> in the array, if it exists.  If <code>itemToFind</code>
     *        does not exist, the return value is a negative number which is the bitwise complement (~)
     *        of the index before which the itemToFind should be inserted in order to maintain the
     *        sorted order of the array.
     *
     * @example
     * // Create a comparator function to search through an array of numbers.
     * function comparator(a, b) {
     *     return a - b;
     * };
     * var numbers = [0, 2, 4, 6, 8];
     * var index = Cesium.binarySearch(numbers, 6, comparator); // 3
     */
    function binarySearch(array, itemToFind, comparator) {
                if (!defined(array)) {
            throw new DeveloperError('array is required.');
        }
        if (!defined(itemToFind)) {
            throw new DeveloperError('itemToFind is required.');
        }
        if (!defined(comparator)) {
            throw new DeveloperError('comparator is required.');
        }
        
        var low = 0;
        var high = array.length - 1;
        var i;
        var comparison;

        while (low <= high) {
            i = ~~((low + high) / 2);
            comparison = comparator(array[i], itemToFind);
            if (comparison < 0) {
                low = i + 1;
                continue;
            }
            if (comparison > 0) {
                high = i - 1;
                continue;
            }
            return i;
        }
        return ~(high + 1);
    }

    /**
     * A function used to compare two items while performing a binary search.
     * @callback binarySearch~Comparator
     *
     * @param {Object} a An item in the array.
     * @param {Object} b The item being searched for.
     * @returns {Number} Returns a negative value if <code>a</code> is less than <code>b</code>,
     *          a positive value if <code>a</code> is greater than <code>b</code>, or
     *          0 if <code>a</code> is equal to <code>b</code>.
     *
     * @example
     * function compareNumbers(a, b) {
     *     return a - b;
     * }
     */

    return binarySearch;
});

/*global define*/
define('Core/EarthOrientationParametersSample',[],function() {
    'use strict';

    /**
     * A set of Earth Orientation Parameters (EOP) sampled at a time.
     *
     * @alias EarthOrientationParametersSample
     * @constructor
     *
     * @param {Number} xPoleWander The pole wander about the X axis, in radians.
     * @param {Number} yPoleWander The pole wander about the Y axis, in radians.
     * @param {Number} xPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
     * @param {Number} yPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
     * @param {Number} ut1MinusUtc The difference in time standards, UT1 - UTC, in seconds.
     *
     * @private
     */
    function EarthOrientationParametersSample(xPoleWander, yPoleWander, xPoleOffset, yPoleOffset, ut1MinusUtc) {
        /**
         * The pole wander about the X axis, in radians.
         * @type {Number}
         */
        this.xPoleWander = xPoleWander;

        /**
         * The pole wander about the Y axis, in radians.
         * @type {Number}
         */
        this.yPoleWander = yPoleWander;

        /**
         * The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
         * @type {Number}
         */
        this.xPoleOffset = xPoleOffset;

        /**
         * The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
         * @type {Number}
         */
        this.yPoleOffset = yPoleOffset;

        /**
         * The difference in time standards, UT1 - UTC, in seconds.
         * @type {Number}
         */
        this.ut1MinusUtc = ut1MinusUtc;
    }

    return EarthOrientationParametersSample;
});

/**
@license
sprintf.js from the php.js project - https://github.com/kvz/phpjs
Directly from https://github.com/kvz/phpjs/blob/master/functions/strings/sprintf.js

php.js is copyright 2012 Kevin van Zonneveld.

Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
(http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
(http://getsprink.com), Waldo Malqui Silva, Paulo Freitas, Jack, Jonas
Raoni Soares Silva (http://www.jsfromhell.com), Philip Peterson, Legaev
Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn Wieringa,
Rafa? Kukawski (http://blog.kukawski.pl), lmeyrick
(https://sourceforge.net/projects/bcmath-js/), Nate, Philippe Baumann,
Enrique Gonzalez, Webtoolkit.info (http://www.webtoolkit.info/), Carlos R.
L. Rodrigues (http://www.jsfromhell.com), Ash Searle
(http://hexmen.com/blog/), Jani Hartikainen, travc, Ole Vrijenhoek,
Erkekjetter, Michael Grier, Rafa? Kukawski (http://kukawski.pl), Johnny
Mast (http://www.phpvrouwen.nl), T.Wild, d3x,
http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
Rafa? Kukawski (http://blog.kukawski.pl/), stag019, pilus, WebDevHobo
(http://webdevhobo.blogspot.com/), marrtins, GeekFG
(http://geekfg.blogspot.com), Andrea Giammarchi
(http://webreflection.blogspot.com), Arpad Ray (mailto:arpad@php.net),
gorthaur, Paul Smith, Tim de Koning (http://www.kingsquare.nl), Joris, Oleg
Eremeev, Steve Hilder, majak, gettimeofday, KELAN, Josh Fraser
(http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
Marc Palau, Martin
(http://www.erlenwiese.de/), Breaking Par Consulting Inc
(http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
Chris, Mirek Slugen, saulius, Alfonso Jimenez
(http://www.alfonsojimenez.com), Diplom@t (http://difane.com/), felix,
Mailfaker (http://www.weedem.fr/), Tyler Akins (http://rumkin.com), Caio
Ariede (http://caioariede.com), Robin, Kankrelune
(http://www.webfaktory.info/), Karol Kowalski, Imgen Tata
(http://www.myipdf.com/), mdsjack (http://www.mdsjack.bo.it), Dreamer,
Felix Geisendoerfer (http://www.debuggable.com/felix), Lars Fischer, AJ,
David, Aman Gupta, Michael White, Public Domain
(http://www.json.org/json2.js), Steven Levithan
(http://blog.stevenlevithan.com), Sakimori, Pellentesque Malesuada,
Thunder.m, Dj (http://phpjs.org/functions/htmlentities:425#comment_134018),
Steve Clay, David James, Francois, class_exists, nobbler, T. Wild, Itsacon
(http://www.itsacon.net/), date, Ole Vrijenhoek (http://www.nervous.nl/),
Fox, Raphael (Ao RUDLER), Marco, noname, Mateusz "loonquawl" Zalega, Frank
Forte, Arno, ger, mktime, john (http://www.jd-tech.net), Nick Kolosov
(http://sammy.ru), marc andreu, Scott Cariss, Douglas Crockford
(http://javascript.crockford.com), madipta, Slawomir Kaniecki,
ReverseSyntax, Nathan, Alex Wilson, kenneth, Bayron Guevara, Adam Wallner
(http://web2.bitbaro.hu/), paulo kuong, jmweb, Lincoln Ramsay, djmix,
Pyerre, Jon Hohle, Thiago Mata (http://thiagomata.blog.com), lmeyrick
(https://sourceforge.net/projects/bcmath-js/this.), Linuxworld, duncan,
Gilbert, Sanjoy Roy, Shingo, sankai, Oskar Larsson H?gfeldt
(http://oskar-lh.name/), Denny Wardhana, 0m3r, Everlasto, Subhasis Deb,
josh, jd, Pier Paolo Ramon (http://www.mastersoup.com/), P, merabi, Soren
Hansen, Eugene Bulkin (http://doubleaw.com/), Der Simon
(http://innerdom.sourceforge.net/), echo is bad, Ozh, XoraX
(http://www.xorax.info), EdorFaus, JB, J A R, Marc Jansen, Francesco, LH,
Stoyan Kyosev (http://www.svest.org/), nord_ua, omid
(http://phpjs.org/functions/380:380#comment_137122), Brad Touesnard, MeEtc
(http://yass.meetcweb.com), Peter-Paul Koch
(http://www.quirksmode.org/js/beat.html), Olivier Louvignes
(http://mg-crea.com/), T0bsn, Tim Wiel, Bryan Elliott, Jalal Berrami,
Martin, JT, David Randall, Thomas Beaucourt (http://www.webapp.fr), taith,
vlado houba, Pierre-Luc Paour, Kristof Coomans (SCK-CEN Belgian Nucleair
Research Centre), Martin Pool, Kirk Strobeck, Rick Waldron, Brant Messenger
(http://www.brantmessenger.com/), Devan Penner-Woelk, Saulo Vallory, Wagner
B. Soares, Artur Tchernychev, Valentina De Rosa, Jason Wong
(http://carrot.org/), Christoph, Daniel Esteban, strftime, Mick@el, rezna,
Simon Willison (http://simonwillison.net), Anton Ongson, Gabriel Paderni,
Marco van Oort, penutbutterjelly, Philipp Lenssen, Bjorn Roesbeke
(http://www.bjornroesbeke.be/), Bug?, Eric Nagel, Tomasz Wesolowski,
Evertjan Garretsen, Bobby Drake, Blues (http://tech.bluesmoon.info/), Luke
Godfrey, Pul, uestla, Alan C, Ulrich, Rafal Kukawski, Yves Sucaet,
sowberry, Norman "zEh" Fuchs, hitwork, Zahlii, johnrembo, Nick Callen,
Steven Levithan (stevenlevithan.com), ejsanders, Scott Baker, Brian Tafoya
(http://www.premasolutions.com/), Philippe Jausions
(http://pear.php.net/user/jausions), Aidan Lister
(http://aidanlister.com/), Rob, e-mike, HKM, ChaosNo1, metjay, strcasecmp,
strcmp, Taras Bogach, jpfle, Alexander Ermolaev
(http://snippets.dzone.com/user/AlexanderErmolaev), DxGx, kilops, Orlando,
dptr1988, Le Torbi, James (http://www.james-bell.co.uk/), Pedro Tainha
(http://www.pedrotainha.com), James, Arnout Kazemier
(http://www.3rd-Eden.com), Chris McMacken, gabriel paderni, Yannoo,
FGFEmperor, baris ozdil, Tod Gentille, Greg Frazier, jakes, 3D-GRAF, Allan
Jensen (http://www.winternet.no), Howard Yeend, Benjamin Lupton, davook,
daniel airton wermann (http://wermann.com.br), Atli T¨®r, Maximusya, Ryan
W Tenney (http://ryan.10e.us), Alexander M Beedie, fearphage
(http://http/my.opera.com/fearphage/), Nathan Sepulveda, Victor, Matteo,
Billy, stensi, Cord, Manish, T.J. Leahy, Riddler
(http://www.frontierwebdev.com/), Rafa? Kukawski, FremyCompany, Matt
Bradley, Tim de Koning, Luis Salazar (http://www.freaky-media.com/), Diogo
Resende, Rival, Andrej Pavlovic, Garagoth, Le Torbi
(http://www.letorbi.de/), Dino, Josep Sanz (http://www.ws3.es/), rem,
Russell Walker (http://www.nbill.co.uk/), Jamie Beck
(http://www.terabit.ca/), setcookie, Michael, YUI Library:
http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Blues at
http://hacks.bluesmoon.info/strftime/strftime.js, Ben
(http://benblume.co.uk/), DtTvB
(http://dt.in.th/2008-09-16.string-length-in-bytes.html), Andreas, William,
meo, incidence, Cagri Ekin, Amirouche, Amir Habibi
(http://www.residence-mixte.com/), Luke Smith (http://lucassmith.name),
Kheang Hok Chin (http://www.distantia.ca/), Jay Klehr, Lorenzo Pisani,
Tony, Yen-Wei Liu, Greenseed, mk.keck, Leslie Hoare, dude, booeyOH, Ben
Bryan

Licensed under the MIT (MIT-LICENSE.txt) license.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*global define*/
define('ThirdParty/sprintf',[],function() {

function sprintf () {
  // http://kevin.vanzonneveld.net
  // +   original by: Ash Searle (http://hexmen.com/blog/)
  // + namespaced by: Michael White (http://getsprink.com)
  // +    tweaked by: Jack
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Paulo Freitas
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Dj
  // +   improved by: Allidylls
  // *     example 1: sprintf("%01.2f", 123.1);
  // *     returns 1: 123.10
  // *     example 2: sprintf("[%10s]", 'monkey');
  // *     returns 2: '[    monkey]'
  // *     example 3: sprintf("[%'#10s]", 'monkey');
  // *     returns 3: '[####monkey]'
  // *     example 4: sprintf("%d", 123456789012345);
  // *     returns 4: '123456789012345'
  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments,
    i = 0,
    format = a[i++];

  // pad()
  var pad = function (str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }

    var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
    var number;
    var prefix;
    var method;
    var textTransform;
    var value;

    if (substring == '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false,
      positivePrefix = '',
      zeroPad = false,
      prefixBaseX = false,
      customPadChar = ' ';
    var flagsl = flags.length;
    for (var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
      case ' ':
        positivePrefix = ' ';
        break;
      case '+':
        positivePrefix = '+';
        break;
      case '-':
        leftJustify = true;
        break;
      case "'":
        customPadChar = flags.charAt(j + 1);
        break;
      case '0':
        zeroPad = true;
        break;
      case '#':
        prefixBaseX = true;
        break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth == '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
    } else if (precision == '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
    case 's':
      return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
    case 'c':
      return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
    case 'b':
      return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'o':
      return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'x':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'X':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
    case 'u':
      return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'i':
    case 'd':
      number = +value || 0;
      number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
      prefix = number < 0 ? '-' : positivePrefix;
      value = prefix + pad(String(Math.abs(number)), precision, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    case 'e':
    case 'E':
    case 'f': // Should handle locales (as per setlocale)
    case 'F':
    case 'g':
    case 'G':
      number = +value;
      prefix = number < 0 ? '-' : positivePrefix;
      method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
      textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
      value = prefix + Math.abs(number)[method](precision);
      return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
    default:
      return substring;
    }
  };

  return format.replace(regex, doFormat);
}

return sprintf;
});

/*global define*/
define('Core/GregorianDate',[],function() {
    'use strict';

    /**
     * Represents a Gregorian date in a more precise format than the JavaScript Date object.
     * In addition to submillisecond precision, this object can also represent leap seconds.
     * @alias GregorianDate
     * @constructor
     *
     * @see JulianDate#toGregorianDate
     */
    function GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond) {
        /**
         * Gets or sets the year as a whole number.
         * @type {Number}
         */
        this.year = year;
        /**
         * Gets or sets the month as a whole number with range [1, 12].
         * @type {Number}
         */
        this.month = month;
        /**
         * Gets or sets the day of the month as a whole number starting at 1.
         * @type {Number}
         */
        this.day = day;
        /**
         * Gets or sets the hour as a whole number with range [0, 23].
         * @type {Number}
         */
        this.hour = hour;
        /**
         * Gets or sets the minute of the hour as a whole number with range [0, 59].
         * @type {Number}
         */
        this.minute = minute;
        /**
         * Gets or sets the second of the minute as a whole number with range [0, 60], with 60 representing a leap second.
         * @type {Number}
         */
        this.second = second;
        /**
         * Gets or sets the millisecond of the second as a floating point number with range [0.0, 1000.0).
         * @type {Number}
         */
        this.millisecond = millisecond;
        /**
         * Gets or sets whether this time is during a leap second.
         * @type {Boolean}
         */
        this.isLeapSecond = isLeapSecond;
    }

    return GregorianDate;
});

/*global define*/
define('Core/isLeapYear',[
        './DeveloperError'
    ], function(
        DeveloperError) {
    'use strict';

    /**
     * Determines if a given date is a leap year.
     *
     * @exports isLeapYear
     *
     * @param {Number} year The year to be tested.
     * @returns {Boolean} True if <code>year</code> is a leap year.
     *
     * @example
     * var leapYear = Cesium.isLeapYear(2000); // true
     */
    function isLeapYear(year) {
                if (year === null || isNaN(year)) {
            throw new DeveloperError('year is required and must be a number.');
        }
        
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    return isLeapYear;
});

/*global define*/
define('Core/LeapSecond',[],function() {
    'use strict';

    /**
     * Describes a single leap second, which is constructed from a {@link JulianDate} and a
     * numerical offset representing the number of seconds TAI is ahead of the UTC time standard.
     * @alias LeapSecond
     * @constructor
     *
     * @param {JulianDate} [date] A Julian date representing the time of the leap second.
     * @param {Number} [offset] The cumulative number of seconds that TAI is ahead of UTC at the provided date.
     */
    function LeapSecond(date, offset) {
        /**
         * Gets or sets the date at which this leap second occurs.
         * @type {JulianDate}
         */
        this.julianDate = date;

        /**
         * Gets or sets the cumulative number of seconds between the UTC and TAI time standards at the time
         * of this leap second.
         * @type {Number}
         */
        this.offset = offset;
    }

    return LeapSecond;
});

/*global define*/
define('Core/TimeConstants',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * Constants for time conversions like those done by {@link JulianDate}.
     *
     * @exports TimeConstants
     *
     * @see JulianDate
     *
     * @private
     */
    var TimeConstants = {
        /**
         * The number of seconds in one millisecond: <code>0.001</code>
         * @type {Number}
         * @constant
         */
        SECONDS_PER_MILLISECOND : 0.001,

        /**
         * The number of seconds in one minute: <code>60</code>.
         * @type {Number}
         * @constant
         */
        SECONDS_PER_MINUTE : 60.0,

        /**
         * The number of minutes in one hour: <code>60</code>.
         * @type {Number}
         * @constant
         */
        MINUTES_PER_HOUR : 60.0,

        /**
         * The number of hours in one day: <code>24</code>.
         * @type {Number}
         * @constant
         */
        HOURS_PER_DAY : 24.0,

        /**
         * The number of seconds in one hour: <code>3600</code>.
         * @type {Number}
         * @constant
         */
        SECONDS_PER_HOUR : 3600.0,

        /**
         * The number of minutes in one day: <code>1440</code>.
         * @type {Number}
         * @constant
         */
        MINUTES_PER_DAY : 1440.0,

        /**
         * The number of seconds in one day, ignoring leap seconds: <code>86400</code>.
         * @type {Number}
         * @constant
         */
        SECONDS_PER_DAY : 86400.0,

        /**
         * The number of days in one Julian century: <code>36525</code>.
         * @type {Number}
         * @constant
         */
        DAYS_PER_JULIAN_CENTURY : 36525.0,

        /**
         * One trillionth of a second.
         * @type {Number}
         * @constant
         */
        PICOSECOND : 0.000000001,

        /**
         * The number of days to subtract from a Julian date to determine the
         * modified Julian date, which gives the number of days since midnight
         * on November 17, 1858.
         * @type {Number}
         * @constant
         */
        MODIFIED_JULIAN_DATE_DIFFERENCE : 2400000.5
    };

    return freezeObject(TimeConstants);
});

/*global define*/
define('Core/TimeStandard',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * Provides the type of time standards which JulianDate can take as input.
     *
     * @exports TimeStandard
     *
     * @see JulianDate
     */
    var TimeStandard = {
        /**
         * Represents the coordinated Universal Time (UTC) time standard.
         *
         * UTC is related to TAI according to the relationship
         * <code>UTC = TAI - deltaT</code> where <code>deltaT</code> is the number of leap
         * seconds which have been introduced as of the time in TAI.
         *
         */
        UTC : 0,

        /**
         * Represents the International Atomic Time (TAI) time standard.
         * TAI is the principal time standard to which the other time standards are related.
         */
        TAI : 1
    };

    return freezeObject(TimeStandard);
});

/*global define*/
define('Core/JulianDate',[
        '../ThirdParty/sprintf',
        './binarySearch',
        './defaultValue',
        './defined',
        './DeveloperError',
        './GregorianDate',
        './isLeapYear',
        './LeapSecond',
        './TimeConstants',
        './TimeStandard'
    ], function(
        sprintf,
        binarySearch,
        defaultValue,
        defined,
        DeveloperError,
        GregorianDate,
        isLeapYear,
        LeapSecond,
        TimeConstants,
        TimeStandard) {
    'use strict';

    var gregorianDateScratch = new GregorianDate();
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var daysInLeapFeburary = 29;

    function compareLeapSecondDates(leapSecond, dateToFind) {
        return JulianDate.compare(leapSecond.julianDate, dateToFind.julianDate);
    }

    // we don't really need a leap second instance, anything with a julianDate property will do
    var binarySearchScratchLeapSecond = new LeapSecond();

    function convertUtcToTai(julianDate) {
        //Even though julianDate is in UTC, we'll treat it as TAI and
        //search the leap second table for it.
        binarySearchScratchLeapSecond.julianDate = julianDate;
        var leapSeconds = JulianDate.leapSeconds;
        var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates);

        if (index < 0) {
            index = ~index;
        }

        if (index >= leapSeconds.length) {
            index = leapSeconds.length - 1;
        }

        var offset = leapSeconds[index].offset;
        if (index > 0) {
            //Now we have the index of the closest leap second that comes on or after our UTC time.
            //However, if the difference between the UTC date being converted and the TAI
            //defined leap second is greater than the offset, we are off by one and need to use
            //the previous leap second.
            var difference = JulianDate.secondsDifference(leapSeconds[index].julianDate, julianDate);
            if (difference > offset) {
                index--;
                offset = leapSeconds[index].offset;
            }
        }

        JulianDate.addSeconds(julianDate, offset, julianDate);
    }

    function convertTaiToUtc(julianDate, result) {
        binarySearchScratchLeapSecond.julianDate = julianDate;
        var leapSeconds = JulianDate.leapSeconds;
        var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates);
        if (index < 0) {
            index = ~index;
        }

        //All times before our first leap second get the first offset.
        if (index === 0) {
            return JulianDate.addSeconds(julianDate, -leapSeconds[0].offset, result);
        }

        //All times after our leap second get the last offset.
        if (index >= leapSeconds.length) {
            return JulianDate.addSeconds(julianDate, -leapSeconds[index - 1].offset, result);
        }

        //Compute the difference between the found leap second and the time we are converting.
        var difference = JulianDate.secondsDifference(leapSeconds[index].julianDate, julianDate);

        if (difference === 0) {
            //The date is in our leap second table.
            return JulianDate.addSeconds(julianDate, -leapSeconds[index].offset, result);
        }

        if (difference <= 1.0) {
            //The requested date is during the moment of a leap second, then we cannot convert to UTC
            return undefined;
        }

        //The time is in between two leap seconds, index is the leap second after the date
        //we're converting, so we subtract one to get the correct LeapSecond instance.
        return JulianDate.addSeconds(julianDate, -leapSeconds[--index].offset, result);
    }

    function setComponents(wholeDays, secondsOfDay, julianDate) {
        var extraDays = (secondsOfDay / TimeConstants.SECONDS_PER_DAY) | 0;
        wholeDays += extraDays;
        secondsOfDay -= TimeConstants.SECONDS_PER_DAY * extraDays;

        if (secondsOfDay < 0) {
            wholeDays--;
            secondsOfDay += TimeConstants.SECONDS_PER_DAY;
        }

        julianDate.dayNumber = wholeDays;
        julianDate.secondsOfDay = secondsOfDay;
        return julianDate;
    }

    function computeJulianDateComponents(year, month, day, hour, minute, second, millisecond) {
        // Algorithm from page 604 of the Explanatory Supplement to the
        // Astronomical Almanac (Seidelmann 1992).

        var a = ((month - 14) / 12) | 0;
        var b = year + 4800 + a;
        var dayNumber = (((1461 * b) / 4) | 0) + (((367 * (month - 2 - 12 * a)) / 12) | 0) - (((3 * (((b + 100) / 100) | 0)) / 4) | 0) + day - 32075;

        // JulianDates are noon-based
        hour = hour - 12;
        if (hour < 0) {
            hour += 24;
        }

        var secondsOfDay = second + ((hour * TimeConstants.SECONDS_PER_HOUR) + (minute * TimeConstants.SECONDS_PER_MINUTE) + (millisecond * TimeConstants.SECONDS_PER_MILLISECOND));

        if (secondsOfDay >= 43200.0) {
            dayNumber -= 1;
        }

        return [dayNumber, secondsOfDay];
    }

    //Regular expressions used for ISO8601 date parsing.
    //YYYY
    var matchCalendarYear = /^(\d{4})$/;
    //YYYY-MM (YYYYMM is invalid)
    var matchCalendarMonth = /^(\d{4})-(\d{2})$/;
    //YYYY-DDD or YYYYDDD
    var matchOrdinalDate = /^(\d{4})-?(\d{3})$/;
    //YYYY-Www or YYYYWww or YYYY-Www-D or YYYYWwwD
    var matchWeekDate = /^(\d{4})-?W(\d{2})-?(\d{1})?$/;
    //YYYY-MM-DD or YYYYMMDD
    var matchCalendarDate = /^(\d{4})-?(\d{2})-?(\d{2})$/;
    // Match utc offset
    var utcOffset = /([Z+\-])?(\d{2})?:?(\d{2})?$/;
    // Match hours HH or HH.xxxxx
    var matchHours = /^(\d{2})(\.\d+)?/.source + utcOffset.source;
    // Match hours/minutes HH:MM HHMM.xxxxx
    var matchHoursMinutes = /^(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
    // Match hours/minutes HH:MM:SS HHMMSS.xxxxx
    var matchHoursMinutesSeconds = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;

    var iso8601ErrorMessage = 'Invalid ISO 8601 date.';

    /**
     * Represents an astronomical Julian date, which is the number of days since noon on January 1, -4712 (4713 BC).
     * For increased precision, this class stores the whole number part of the date and the seconds
     * part of the date in separate components.  In order to be safe for arithmetic and represent
     * leap seconds, the date is always stored in the International Atomic Time standard
     * {@link TimeStandard.TAI}.
     * @alias JulianDate
     * @constructor
     *
     * @param {Number} [julianDayNumber=0.0] The Julian Day Number representing the number of whole days.  Fractional days will also be handled correctly.
     * @param {Number} [secondsOfDay=0.0] The number of seconds into the current Julian Day Number.  Fractional seconds, negative seconds and seconds greater than a day will be handled correctly.
     * @param {TimeStandard} [timeStandard=TimeStandard.UTC] The time standard in which the first two parameters are defined.
     */
    function JulianDate(julianDayNumber, secondsOfDay, timeStandard) {
        /**
         * Gets or sets the number of whole days.
         * @type {Number}
         */
        this.dayNumber = undefined;

        /**
         * Gets or sets the number of seconds into the current day.
         * @type {Number}
         */
        this.secondsOfDay = undefined;

        julianDayNumber = defaultValue(julianDayNumber, 0.0);
        secondsOfDay = defaultValue(secondsOfDay, 0.0);
        timeStandard = defaultValue(timeStandard, TimeStandard.UTC);

        //If julianDayNumber is fractional, make it an integer and add the number of seconds the fraction represented.
        var wholeDays = julianDayNumber | 0;
        secondsOfDay = secondsOfDay + (julianDayNumber - wholeDays) * TimeConstants.SECONDS_PER_DAY;

        setComponents(wholeDays, secondsOfDay, this);

        if (timeStandard === TimeStandard.UTC) {
            convertUtcToTai(this);
        }
    }

    /**
     * Creates a new instance from a JavaScript Date.
     *
     * @param {Date} date A JavaScript Date.
     * @param {JulianDate} [result] An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
     *
     * @exception {DeveloperError} date must be a valid JavaScript Date.
     */
    JulianDate.fromDate = function(date, result) {
                if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new DeveloperError('date must be a valid JavaScript Date.');
        }
        
        var components = computeJulianDateComponents(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        if (!defined(result)) {
            return new JulianDate(components[0], components[1], TimeStandard.UTC);
        }
        setComponents(components[0], components[1], result);
        convertUtcToTai(result);
        return result;
    };

    /**
     * Creates a new instance from a from an {@link http://en.wikipedia.org/wiki/ISO_8601|ISO 8601} date.
     * This method is superior to <code>Date.parse</code> because it will handle all valid formats defined by the ISO 8601
     * specification, including leap seconds and sub-millisecond times, which discarded by most JavaScript implementations.
     *
     * @param {String} iso8601String An ISO 8601 date.
     * @param {JulianDate} [result] An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
     *
     * @exception {DeveloperError} Invalid ISO 8601 date.
     */
    JulianDate.fromIso8601 = function(iso8601String, result) {
                if (typeof iso8601String !== 'string') {
            throw new DeveloperError(iso8601ErrorMessage);
        }
        
        //Comma and decimal point both indicate a fractional number according to ISO 8601,
        //start out by blanket replacing , with . which is the only valid such symbol in JS.
        iso8601String = iso8601String.replace(',', '.');

        //Split the string into its date and time components, denoted by a mandatory T
        var tokens = iso8601String.split('T');
        var year;
        var month = 1;
        var day = 1;
        var hour = 0;
        var minute = 0;
        var second = 0;
        var millisecond = 0;

        //Lacking a time is okay, but a missing date is illegal.
        var date = tokens[0];
        var time = tokens[1];
        var tmp;
        var inLeapYear;
                if (!defined(date)) {
            throw new DeveloperError(iso8601ErrorMessage);
        }

        var dashCount;
        
        //First match the date against possible regular expressions.
        tokens = date.match(matchCalendarDate);
        if (tokens !== null) {
                        dashCount = date.split('-').length - 1;
            if (dashCount > 0 && dashCount !== 2) {
                throw new DeveloperError(iso8601ErrorMessage);
            }
                        year = +tokens[1];
            month = +tokens[2];
            day = +tokens[3];
        } else {
            tokens = date.match(matchCalendarMonth);
            if (tokens !== null) {
                year = +tokens[1];
                month = +tokens[2];
            } else {
                tokens = date.match(matchCalendarYear);
                if (tokens !== null) {
                    year = +tokens[1];
                } else {
                    //Not a year/month/day so it must be an ordinal date.
                    var dayOfYear;
                    tokens = date.match(matchOrdinalDate);
                    if (tokens !== null) {

                        year = +tokens[1];
                        dayOfYear = +tokens[2];
                        inLeapYear = isLeapYear(year);

                        //This validation is only applicable for this format.
                                                if (dayOfYear < 1 || (inLeapYear && dayOfYear > 366) || (!inLeapYear && dayOfYear > 365)) {
                            throw new DeveloperError(iso8601ErrorMessage);
                        }
                                            } else {
                        tokens = date.match(matchWeekDate);
                        if (tokens !== null) {
                            //ISO week date to ordinal date from
                            //http://en.wikipedia.org/w/index.php?title=ISO_week_date&oldid=474176775
                            year = +tokens[1];
                            var weekNumber = +tokens[2];
                            var dayOfWeek = +tokens[3] || 0;

                                                        dashCount = date.split('-').length - 1;
                            if (dashCount > 0 &&
                               ((!defined(tokens[3]) && dashCount !== 1) ||
                               (defined(tokens[3]) && dashCount !== 2))) {
                                throw new DeveloperError(iso8601ErrorMessage);
                            }
                            
                            var january4 = new Date(Date.UTC(year, 0, 4));
                            dayOfYear = (weekNumber * 7) + dayOfWeek - january4.getUTCDay() - 3;
                        } else {
                            //None of our regular expressions succeeded in parsing the date properly.
                                                        throw new DeveloperError(iso8601ErrorMessage);
                                                    }
                    }
                    //Split an ordinal date into month/day.
                    tmp = new Date(Date.UTC(year, 0, 1));
                    tmp.setUTCDate(dayOfYear);
                    month = tmp.getUTCMonth() + 1;
                    day = tmp.getUTCDate();
                }
            }
        }

        //Now that we have all of the date components, validate them to make sure nothing is out of range.
        inLeapYear = isLeapYear(year);
                if (month < 1 || month > 12 || day < 1 || ((month !== 2 || !inLeapYear) && day > daysInMonth[month - 1]) || (inLeapYear && month === 2 && day > daysInLeapFeburary)) {
            throw new DeveloperError(iso8601ErrorMessage);
        }
        
        //Not move onto the time string, which is much simpler.
        var offsetIndex;
        if (defined(time)) {
            tokens = time.match(matchHoursMinutesSeconds);
            if (tokens !== null) {
                                dashCount = time.split(':').length - 1;
                if (dashCount > 0 && dashCount !== 2 && dashCount !== 3) {
                    throw new DeveloperError(iso8601ErrorMessage);
                }
                
                hour = +tokens[1];
                minute = +tokens[2];
                second = +tokens[3];
                millisecond = +(tokens[4] || 0) * 1000.0;
                offsetIndex = 5;
            } else {
                tokens = time.match(matchHoursMinutes);
                if (tokens !== null) {
                                        dashCount = time.split(':').length - 1;
                    if (dashCount > 2) {
                        throw new DeveloperError(iso8601ErrorMessage);
                    }
                    
                    hour = +tokens[1];
                    minute = +tokens[2];
                    second = +(tokens[3] || 0) * 60.0;
                    offsetIndex = 4;
                } else {
                    tokens = time.match(matchHours);
                    if (tokens !== null) {
                        hour = +tokens[1];
                        minute = +(tokens[2] || 0) * 60.0;
                        offsetIndex = 3;
                    } else {
                                                throw new DeveloperError(iso8601ErrorMessage);
                                            }
                }
            }

            //Validate that all values are in proper range.  Minutes and hours have special cases at 60 and 24.
                        if (minute >= 60 || second >= 61 || hour > 24 || (hour === 24 && (minute > 0 || second > 0 || millisecond > 0))) {
                throw new DeveloperError(iso8601ErrorMessage);
            }
            
            //Check the UTC offset value, if no value exists, use local time
            //a Z indicates UTC, + or - are offsets.
            var offset = tokens[offsetIndex];
            var offsetHours = +(tokens[offsetIndex + 1]);
            var offsetMinutes = +(tokens[offsetIndex + 2] || 0);
            switch (offset) {
            case '+':
                hour = hour - offsetHours;
                minute = minute - offsetMinutes;
                break;
            case '-':
                hour = hour + offsetHours;
                minute = minute + offsetMinutes;
                break;
            case 'Z':
                break;
            default:
                minute = minute + new Date(Date.UTC(year, month - 1, day, hour, minute)).getTimezoneOffset();
                break;
            }
        } else {
            //If no time is specified, it is considered the beginning of the day, local time.
            minute = minute + new Date(year, month - 1, day).getTimezoneOffset();
        }

        //ISO8601 denotes a leap second by any time having a seconds component of 60 seconds.
        //If that's the case, we need to temporarily subtract a second in order to build a UTC date.
        //Then we add it back in after converting to TAI.
        var isLeapSecond = second === 60;
        if (isLeapSecond) {
            second--;
        }

        //Even if we successfully parsed the string into its components, after applying UTC offset or
        //special cases like 24:00:00 denoting midnight, we need to normalize the data appropriately.

        //milliseconds can never be greater than 1000, and seconds can't be above 60, so we start with minutes
        while (minute >= 60) {
            minute -= 60;
            hour++;
        }

        while (hour >= 24) {
            hour -= 24;
            day++;
        }

        tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
        while (day > tmp) {
            day -= tmp;
            month++;

            if (month > 12) {
                month -= 12;
                year++;
            }

            tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
        }

        //If UTC offset is at the beginning/end of the day, minutes can be negative.
        while (minute < 0) {
            minute += 60;
            hour--;
        }

        while (hour < 0) {
            hour += 24;
            day--;
        }

        while (day < 1) {
            month--;
            if (month < 1) {
                month += 12;
                year--;
            }

            tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
            day += tmp;
        }

        //Now create the JulianDate components from the Gregorian date and actually create our instance.
        var components = computeJulianDateComponents(year, month, day, hour, minute, second, millisecond);

        if (!defined(result)) {
            result = new JulianDate(components[0], components[1], TimeStandard.UTC);
        } else {
            setComponents(components[0], components[1], result);
            convertUtcToTai(result);
        }

        //If we were on a leap second, add it back.
        if (isLeapSecond) {
            JulianDate.addSeconds(result, 1, result);
        }

        return result;
    };

    /**
     * Creates a new instance that represents the current system time.
     * This is equivalent to calling <code>JulianDate.fromDate(new Date());</code>.
     *
     * @param {JulianDate} [result] An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
     */
    JulianDate.now = function(result) {
        return JulianDate.fromDate(new Date(), result);
    };

    var toGregorianDateScratch = new JulianDate(0, 0, TimeStandard.TAI);

    /**
     * Creates a {@link GregorianDate} from the provided instance.
     *
     * @param {JulianDate} julianDate The date to be converted.
     * @param {GregorianDate} [result] An existing instance to use for the result.
     * @returns {GregorianDate} The modified result parameter or a new instance if none was provided.
     */
    JulianDate.toGregorianDate = function(julianDate, result) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        
        var isLeapSecond = false;
        var thisUtc = convertTaiToUtc(julianDate, toGregorianDateScratch);
        if (!defined(thisUtc)) {
            //Conversion to UTC will fail if we are during a leap second.
            //If that's the case, subtract a second and convert again.
            //JavaScript doesn't support leap seconds, so this results in second 59 being repeated twice.
            JulianDate.addSeconds(julianDate, -1, toGregorianDateScratch);
            thisUtc = convertTaiToUtc(toGregorianDateScratch, toGregorianDateScratch);
            isLeapSecond = true;
        }

        var julianDayNumber = thisUtc.dayNumber;
        var secondsOfDay = thisUtc.secondsOfDay;

        if (secondsOfDay >= 43200.0) {
            julianDayNumber += 1;
        }

        // Algorithm from page 604 of the Explanatory Supplement to the
        // Astronomical Almanac (Seidelmann 1992).
        var L = (julianDayNumber + 68569) | 0;
        var N = (4 * L / 146097) | 0;
        L = (L - (((146097 * N + 3) / 4) | 0)) | 0;
        var I = ((4000 * (L + 1)) / 1461001) | 0;
        L = (L - (((1461 * I) / 4) | 0) + 31) | 0;
        var J = ((80 * L) / 2447) | 0;
        var day = (L - (((2447 * J) / 80) | 0)) | 0;
        L = (J / 11) | 0;
        var month = (J + 2 - 12 * L) | 0;
        var year = (100 * (N - 49) + I + L) | 0;

        var hour = (secondsOfDay / TimeConstants.SECONDS_PER_HOUR) | 0;
        var remainingSeconds = secondsOfDay - (hour * TimeConstants.SECONDS_PER_HOUR);
        var minute = (remainingSeconds / TimeConstants.SECONDS_PER_MINUTE) | 0;
        remainingSeconds = remainingSeconds - (minute * TimeConstants.SECONDS_PER_MINUTE);
        var second = remainingSeconds | 0;
        var millisecond = ((remainingSeconds - second) / TimeConstants.SECONDS_PER_MILLISECOND);

        // JulianDates are noon-based
        hour += 12;
        if (hour > 23) {
            hour -= 24;
        }

        //If we were on a leap second, add it back.
        if (isLeapSecond) {
            second += 1;
        }

        if (!defined(result)) {
            return new GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond);
        }

        result.year = year;
        result.month = month;
        result.day = day;
        result.hour = hour;
        result.minute = minute;
        result.second = second;
        result.millisecond = millisecond;
        result.isLeapSecond = isLeapSecond;
        return result;
    };

    /**
     * Creates a JavaScript Date from the provided instance.
     * Since JavaScript dates are only accurate to the nearest millisecond and
     * cannot represent a leap second, consider using {@link JulianDate.toGregorianDate} instead.
     * If the provided JulianDate is during a leap second, the previous second is used.
     *
     * @param {JulianDate} julianDate The date to be converted.
     * @returns {Date} A new instance representing the provided date.
     */
    JulianDate.toDate = function(julianDate) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        
        var gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
        var second = gDate.second;
        if (gDate.isLeapSecond) {
            second -= 1;
        }
        return new Date(Date.UTC(gDate.year, gDate.month - 1, gDate.day, gDate.hour, gDate.minute, second, gDate.millisecond));
    };

    /**
     * Creates an ISO8601 representation of the provided date.
     *
     * @param {JulianDate} julianDate The date to be converted.
     * @param {Number} [precision] The number of fractional digits used to represent the seconds component.  By default, the most precise representation is used.
     * @returns {String} The ISO8601 representation of the provided date.
     */
    JulianDate.toIso8601 = function(julianDate, precision) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        
        var gDate = JulianDate.toGregorianDate(julianDate, gDate);
        var millisecondStr;

        if (!defined(precision) && gDate.millisecond !== 0) {
            //Forces milliseconds into a number with at least 3 digits to whatever the default toString() precision is.
            millisecondStr = (gDate.millisecond * 0.01).toString().replace('.', '');
            return sprintf("%04d-%02d-%02dT%02d:%02d:%02d.%sZ", gDate.year, gDate.month, gDate.day, gDate.hour, gDate.minute, gDate.second, millisecondStr);
        }

        //Precision is either 0 or milliseconds is 0 with undefined precision, in either case, leave off milliseconds entirely
        if (!defined(precision) || precision === 0) {
            return sprintf("%04d-%02d-%02dT%02d:%02d:%02dZ", gDate.year, gDate.month, gDate.day, gDate.hour, gDate.minute, gDate.second);
        }

        //Forces milliseconds into a number with at least 3 digits to whatever the specified precision is.
        millisecondStr = (gDate.millisecond * 0.01).toFixed(precision).replace('.', '').slice(0, precision);
        return sprintf("%04d-%02d-%02dT%02d:%02d:%02d.%sZ", gDate.year, gDate.month, gDate.day, gDate.hour, gDate.minute, gDate.second, millisecondStr);
    };

    /**
     * Duplicates a JulianDate instance.
     *
     * @param {JulianDate} julianDate The date to duplicate.
     * @param {JulianDate} [result] An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter or a new instance if none was provided. Returns undefined if julianDate is undefined.
     */
    JulianDate.clone = function(julianDate, result) {
        if (!defined(julianDate)) {
            return undefined;
        }
        if (!defined(result)) {
            return new JulianDate(julianDate.dayNumber, julianDate.secondsOfDay, TimeStandard.TAI);
        }
        result.dayNumber = julianDate.dayNumber;
        result.secondsOfDay = julianDate.secondsOfDay;
        return result;
    };

    /**
     * Compares two instances.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Number} A negative value if left is less than right, a positive value if left is greater than right, or zero if left and right are equal.
     */
    JulianDate.compare = function(left, right) {
                if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        
        var julianDayNumberDifference = left.dayNumber - right.dayNumber;
        if (julianDayNumberDifference !== 0) {
            return julianDayNumberDifference;
        }
        return left.secondsOfDay - right.secondsOfDay;
    };

    /**
     * Compares two instances and returns <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {JulianDate} [left] The first instance.
     * @param {JulianDate} [right] The second instance.
     * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
     */
    JulianDate.equals = function(left, right) {
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                left.dayNumber === right.dayNumber &&
                left.secondsOfDay === right.secondsOfDay);
    };

    /**
     * Compares two instances and returns <code>true</code> if they are within <code>epsilon</code> seconds of
     * each other.  That is, in order for the dates to be considered equal (and for
     * this function to return <code>true</code>), the absolute value of the difference between them, in
     * seconds, must be less than <code>epsilon</code>.
     *
     * @param {JulianDate} [left] The first instance.
     * @param {JulianDate} [right] The second instance.
     * @param {Number} epsilon The maximum number of seconds that should separate the two instances.
     * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
     */
    JulianDate.equalsEpsilon = function(left, right, epsilon) {
                if (!defined(epsilon)) {
            throw new DeveloperError('epsilon is required.');
        }
        
        return (left === right) ||
               (defined(left) &&
                defined(right) &&
                Math.abs(JulianDate.secondsDifference(left, right)) <= epsilon);
    };

    /**
     * Computes the total number of whole and fractional days represented by the provided instance.
     *
     * @param {JulianDate} julianDate The date.
     * @returns {Number} The Julian date as single floating point number.
     */
    JulianDate.totalDays = function(julianDate) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
                return julianDate.dayNumber + (julianDate.secondsOfDay / TimeConstants.SECONDS_PER_DAY);
    };

    /**
     * Computes the difference in seconds between the provided instance.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Number} The difference, in seconds, when subtracting <code>right</code> from <code>left</code>.
     */
    JulianDate.secondsDifference = function(left, right) {
                if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        
        var dayDifference = (left.dayNumber - right.dayNumber) * TimeConstants.SECONDS_PER_DAY;
        return (dayDifference + (left.secondsOfDay - right.secondsOfDay));
    };

    /**
     * Computes the difference in days between the provided instance.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Number} The difference, in days, when subtracting <code>right</code> from <code>left</code>.
     */
    JulianDate.daysDifference = function(left, right) {
                if (!defined(left)) {
            throw new DeveloperError('left is required.');
        }
        if (!defined(right)) {
            throw new DeveloperError('right is required.');
        }
        
        var dayDifference = (left.dayNumber - right.dayNumber);
        var secondDifference = (left.secondsOfDay - right.secondsOfDay) / TimeConstants.SECONDS_PER_DAY;
        return dayDifference + secondDifference;
    };

    /**
     * Computes the number of seconds the provided instance is ahead of UTC.
     *
     * @param {JulianDate} julianDate The date.
     * @returns {Number} The number of seconds the provided instance is ahead of UTC
     */
    JulianDate.computeTaiMinusUtc = function(julianDate) {
        binarySearchScratchLeapSecond.julianDate = julianDate;
        var leapSeconds = JulianDate.leapSeconds;
        var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates);
        if (index < 0) {
            index = ~index;
            --index;
            if (index < 0) {
                index = 0;
            }
        }
        return leapSeconds[index].offset;
    };

    /**
     * Adds the provided number of seconds to the provided date instance.
     *
     * @param {JulianDate} julianDate The date.
     * @param {Number} seconds The number of seconds to add or subtract.
     * @param {JulianDate} result An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter.
     */
    JulianDate.addSeconds = function(julianDate, seconds, result) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        if (!defined(seconds)) {
            throw new DeveloperError('seconds is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        return setComponents(julianDate.dayNumber, julianDate.secondsOfDay + seconds, result);
    };

    /**
     * Adds the provided number of minutes to the provided date instance.
     *
     * @param {JulianDate} julianDate The date.
     * @param {Number} minutes The number of minutes to add or subtract.
     * @param {JulianDate} result An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter.
     */
    JulianDate.addMinutes = function(julianDate, minutes, result) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        if (!defined(minutes)) {
            throw new DeveloperError('minutes is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var newSecondsOfDay = julianDate.secondsOfDay + (minutes * TimeConstants.SECONDS_PER_MINUTE);
        return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
    };

    /**
     * Adds the provided number of hours to the provided date instance.
     *
     * @param {JulianDate} julianDate The date.
     * @param {Number} hours The number of hours to add or subtract.
     * @param {JulianDate} result An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter.
     */
    JulianDate.addHours = function(julianDate, hours, result) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        if (!defined(hours)) {
            throw new DeveloperError('hours is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var newSecondsOfDay = julianDate.secondsOfDay + (hours * TimeConstants.SECONDS_PER_HOUR);
        return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
    };

    /**
     * Adds the provided number of days to the provided date instance.
     *
     * @param {JulianDate} julianDate The date.
     * @param {Number} days The number of days to add or subtract.
     * @param {JulianDate} result An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter.
     */
    JulianDate.addDays = function(julianDate, days, result) {
                if (!defined(julianDate)) {
            throw new DeveloperError('julianDate is required.');
        }
        if (!defined(days)) {
            throw new DeveloperError('days is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var newJulianDayNumber = julianDate.dayNumber + days;
        return setComponents(newJulianDayNumber, julianDate.secondsOfDay, result);
    };

    /**
     * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
     */
    JulianDate.lessThan = function(left, right) {
        return JulianDate.compare(left, right) < 0;
    };

    /**
     * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
     */
    JulianDate.lessThanOrEquals = function(left, right) {
        return JulianDate.compare(left, right) <= 0;
    };

    /**
     * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Boolean} <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
     */
    JulianDate.greaterThan = function(left, right) {
        return JulianDate.compare(left, right) > 0;
    };

    /**
     * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
     *
     * @param {JulianDate} left The first instance.
     * @param {JulianDate} right The second instance.
     * @returns {Boolean} <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
     */
    JulianDate.greaterThanOrEquals = function(left, right) {
        return JulianDate.compare(left, right) >= 0;
    };

    /**
     * Duplicates this instance.
     *
     * @param {JulianDate} [result] An existing instance to use for the result.
     * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
     */
    JulianDate.prototype.clone = function(result) {
        return JulianDate.clone(this, result);
    };

    /**
     * Compares this and the provided instance and returns <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {JulianDate} [right] The second instance.
     * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
     */
    JulianDate.prototype.equals = function(right) {
        return JulianDate.equals(this, right);
    };

    /**
     * Compares this and the provided instance and returns <code>true</code> if they are within <code>epsilon</code> seconds of
     * each other.  That is, in order for the dates to be considered equal (and for
     * this function to return <code>true</code>), the absolute value of the difference between them, in
     * seconds, must be less than <code>epsilon</code>.
     *
     * @param {JulianDate} [right] The second instance.
     * @param {Number} epsilon The maximum number of seconds that should separate the two instances.
     * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
     */
    JulianDate.prototype.equalsEpsilon = function(right, epsilon) {
        return JulianDate.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Creates a string representing this date in ISO8601 format.
     *
     * @returns {String} A string representing this date in ISO8601 format.
     */
    JulianDate.prototype.toString = function() {
        return JulianDate.toIso8601(this);
    };

    /**
     * Gets or sets the list of leap seconds used throughout Cesium.
     * @memberof JulianDate
     * @type {LeapSecond[]}
     */
    JulianDate.leapSeconds = [
                               new LeapSecond(new JulianDate(2441317, 43210.0, TimeStandard.TAI), 10), // January 1, 1972 00:00:00 UTC
                               new LeapSecond(new JulianDate(2441499, 43211.0, TimeStandard.TAI), 11), // July 1, 1972 00:00:00 UTC
                               new LeapSecond(new JulianDate(2441683, 43212.0, TimeStandard.TAI), 12), // January 1, 1973 00:00:00 UTC
                               new LeapSecond(new JulianDate(2442048, 43213.0, TimeStandard.TAI), 13), // January 1, 1974 00:00:00 UTC
                               new LeapSecond(new JulianDate(2442413, 43214.0, TimeStandard.TAI), 14), // January 1, 1975 00:00:00 UTC
                               new LeapSecond(new JulianDate(2442778, 43215.0, TimeStandard.TAI), 15), // January 1, 1976 00:00:00 UTC
                               new LeapSecond(new JulianDate(2443144, 43216.0, TimeStandard.TAI), 16), // January 1, 1977 00:00:00 UTC
                               new LeapSecond(new JulianDate(2443509, 43217.0, TimeStandard.TAI), 17), // January 1, 1978 00:00:00 UTC
                               new LeapSecond(new JulianDate(2443874, 43218.0, TimeStandard.TAI), 18), // January 1, 1979 00:00:00 UTC
                               new LeapSecond(new JulianDate(2444239, 43219.0, TimeStandard.TAI), 19), // January 1, 1980 00:00:00 UTC
                               new LeapSecond(new JulianDate(2444786, 43220.0, TimeStandard.TAI), 20), // July 1, 1981 00:00:00 UTC
                               new LeapSecond(new JulianDate(2445151, 43221.0, TimeStandard.TAI), 21), // July 1, 1982 00:00:00 UTC
                               new LeapSecond(new JulianDate(2445516, 43222.0, TimeStandard.TAI), 22), // July 1, 1983 00:00:00 UTC
                               new LeapSecond(new JulianDate(2446247, 43223.0, TimeStandard.TAI), 23), // July 1, 1985 00:00:00 UTC
                               new LeapSecond(new JulianDate(2447161, 43224.0, TimeStandard.TAI), 24), // January 1, 1988 00:00:00 UTC
                               new LeapSecond(new JulianDate(2447892, 43225.0, TimeStandard.TAI), 25), // January 1, 1990 00:00:00 UTC
                               new LeapSecond(new JulianDate(2448257, 43226.0, TimeStandard.TAI), 26), // January 1, 1991 00:00:00 UTC
                               new LeapSecond(new JulianDate(2448804, 43227.0, TimeStandard.TAI), 27), // July 1, 1992 00:00:00 UTC
                               new LeapSecond(new JulianDate(2449169, 43228.0, TimeStandard.TAI), 28), // July 1, 1993 00:00:00 UTC
                               new LeapSecond(new JulianDate(2449534, 43229.0, TimeStandard.TAI), 29), // July 1, 1994 00:00:00 UTC
                               new LeapSecond(new JulianDate(2450083, 43230.0, TimeStandard.TAI), 30), // January 1, 1996 00:00:00 UTC
                               new LeapSecond(new JulianDate(2450630, 43231.0, TimeStandard.TAI), 31), // July 1, 1997 00:00:00 UTC
                               new LeapSecond(new JulianDate(2451179, 43232.0, TimeStandard.TAI), 32), // January 1, 1999 00:00:00 UTC
                               new LeapSecond(new JulianDate(2453736, 43233.0, TimeStandard.TAI), 33), // January 1, 2006 00:00:00 UTC
                               new LeapSecond(new JulianDate(2454832, 43234.0, TimeStandard.TAI), 34), // January 1, 2009 00:00:00 UTC
                               new LeapSecond(new JulianDate(2456109, 43235.0, TimeStandard.TAI), 35), // July 1, 2012 00:00:00 UTC
                               new LeapSecond(new JulianDate(2457204, 43236.0, TimeStandard.TAI), 36), // July 1, 2015 00:00:00 UTC
                               new LeapSecond(new JulianDate(2457754, 43237.0, TimeStandard.TAI), 37)  // January 1, 2017 00:00:00 UTC
                             ];

    return JulianDate;
});

/*global define*/
define('Core/clone',[
        './defaultValue'
    ], function(
        defaultValue) {
    'use strict';

    /**
     * Clones an object, returning a new object containing the same properties.
     *
     * @exports clone
     *
     * @param {Object} object The object to clone.
     * @param {Boolean} [deep=false] If true, all properties will be deep cloned recursively.
     * @returns {Object} The cloned object.
     */
    function clone(object, deep) {
        if (object === null || typeof object !== 'object') {
            return object;
        }

        deep = defaultValue(deep, false);

        var result = new object.constructor();
        for ( var propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                var value = object[propertyName];
                if (deep) {
                    value = clone(value, deep);
                }
                result[propertyName] = value;
            }
        }

        return result;
    }

    return clone;
});

/*global define*/
define('Core/parseResponseHeaders',[], function() {
    'use strict';

    /**
     * Parses the result of XMLHttpRequest's getAllResponseHeaders() method into
     * a dictionary.
     *
     * @exports parseResponseHeaders
     *
     * @param {String} headerString The header string returned by getAllResponseHeaders().  The format is
     *                 described here: http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
     * @returns {Object} A dictionary of key/value pairs, where each key is the name of a header and the corresponding value
     *                   is that header's value.
     * 
     * @private
     */
    function parseResponseHeaders(headerString) {
        var headers = {};

        if (!headerString) {
          return headers;
        }

        var headerPairs = headerString.split('\u000d\u000a');

        for (var i = 0; i < headerPairs.length; ++i) {
          var headerPair = headerPairs[i];
          // Can't use split() here because it does the wrong thing
          // if the header value has the string ": " in it.
          var index = headerPair.indexOf('\u003a\u0020');
          if (index > 0) {
            var key = headerPair.substring(0, index);
            var val = headerPair.substring(index + 2);
            headers[key] = val;
          }
        }

        return headers;
    }

    return parseResponseHeaders;
});

/*global define*/
define('Core/RequestErrorEvent',[
        './defined',
        './parseResponseHeaders'
    ], function(
        defined,
        parseResponseHeaders) {
    'use strict';

    /**
     * An event that is raised when a request encounters an error.
     *
     * @constructor
     * @alias RequestErrorEvent
     *
     * @param {Number} [statusCode] The HTTP error status code, such as 404.
     * @param {Object} [response] The response included along with the error.
     * @param {String|Object} [responseHeaders] The response headers, represented either as an object literal or as a
     *                        string in the format returned by XMLHttpRequest's getAllResponseHeaders() function.
     */
    function RequestErrorEvent(statusCode, response, responseHeaders) {
        /**
         * The HTTP error status code, such as 404.  If the error does not have a particular
         * HTTP code, this property will be undefined.
         *
         * @type {Number}
         */
        this.statusCode = statusCode;

        /**
         * The response included along with the error.  If the error does not include a response,
         * this property will be undefined.
         *
         * @type {Object}
         */
        this.response = response;

        /**
         * The headers included in the response, represented as an object literal of key/value pairs.
         * If the error does not include any headers, this property will be undefined.
         *
         * @type {Object}
         */
        this.responseHeaders = responseHeaders;

        if (typeof this.responseHeaders === 'string') {
            this.responseHeaders = parseResponseHeaders(this.responseHeaders);
        }
    }

    /**
     * Creates a string representing this RequestErrorEvent.
     * @memberof RequestErrorEvent
     *
     * @returns {String} A string representing the provided RequestErrorEvent.
     */
    RequestErrorEvent.prototype.toString = function() {
        var str = 'Request has failed.';
        if (defined(this.statusCode)) {
            str += ' Status Code: ' + this.statusCode;
        }
        return str;
    };

    return RequestErrorEvent;
});

/**
 * @license
 *
 * Grauw URI utilities
 *
 * See: http://hg.grauw.nl/grauw-lib/file/tip/src/uri.js
 *
 * @author Laurens Holst (http://www.grauw.nl/)
 *
 *   Copyright 2012 Laurens Holst
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
/*global define*/
define('ThirdParty/Uri',[],function() {

	/**
	 * Constructs a URI object.
	 * @constructor
	 * @class Implementation of URI parsing and base URI resolving algorithm in RFC 3986.
	 * @param {string|URI} uri A string or URI object to create the object from.
	 */
	function URI(uri) {
		if (uri instanceof URI) {  // copy constructor
			this.scheme = uri.scheme;
			this.authority = uri.authority;
			this.path = uri.path;
			this.query = uri.query;
			this.fragment = uri.fragment;
		} else if (uri) {  // uri is URI string or cast to string
			var c = parseRegex.exec(uri);
			this.scheme = c[1];
			this.authority = c[2];
			this.path = c[3];
			this.query = c[4];
			this.fragment = c[5];
		}
	}
	// Initial values on the prototype
	URI.prototype.scheme    = null;
	URI.prototype.authority = null;
	URI.prototype.path      = '';
	URI.prototype.query     = null;
	URI.prototype.fragment  = null;

	// Regular expression from RFC 3986 appendix B
	var parseRegex = new RegExp('^(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$');

	/**
	 * Returns the scheme part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "http".
	 */
	URI.prototype.getScheme = function() {
		return this.scheme;
	};

	/**
	 * Returns the authority part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "example.com:80".
	 */
	URI.prototype.getAuthority = function() {
		return this.authority;
	};

	/**
	 * Returns the path part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "/a/b".
	 * In "mailto:mike@example.com" this is "mike@example.com".
	 */
	URI.prototype.getPath = function() {
		return this.path;
	};

	/**
	 * Returns the query part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "x".
	 */
	URI.prototype.getQuery = function() {
		return this.query;
	};

	/**
	 * Returns the fragment part of the URI.
	 * In "http://example.com:80/a/b?x#y" this is "y".
	 */
	URI.prototype.getFragment = function() {
		return this.fragment;
	};

	/**
	 * Tests whether the URI is an absolute URI.
	 * See RFC 3986 section 4.3.
	 */
	URI.prototype.isAbsolute = function() {
		return !!this.scheme && !this.fragment;
	};

	///**
	//* Extensive validation of the URI against the ABNF in RFC 3986
	//*/
	//URI.prototype.validate

	/**
	 * Tests whether the URI is a same-document reference.
	 * See RFC 3986 section 4.4.
	 *
	 * To perform more thorough comparison, you can normalise the URI objects.
	 */
	URI.prototype.isSameDocumentAs = function(uri) {
		return uri.scheme == this.scheme &&
		    uri.authority == this.authority &&
		         uri.path == this.path &&
		        uri.query == this.query;
	};

	/**
	 * Simple String Comparison of two URIs.
	 * See RFC 3986 section 6.2.1.
	 *
	 * To perform more thorough comparison, you can normalise the URI objects.
	 */
	URI.prototype.equals = function(uri) {
		return this.isSameDocumentAs(uri) && uri.fragment == this.fragment;
	};

	/**
	 * Normalizes the URI using syntax-based normalization.
	 * This includes case normalization, percent-encoding normalization and path segment normalization.
	 * XXX: Percent-encoding normalization does not escape characters that need to be escaped.
	 *      (Although that would not be a valid URI in the first place. See validate().)
	 * See RFC 3986 section 6.2.2.
	 */
	URI.prototype.normalize = function() {
		this.removeDotSegments();
		if (this.scheme)
			this.scheme = this.scheme.toLowerCase();
		if (this.authority)
			this.authority = this.authority.replace(authorityRegex, replaceAuthority).
									replace(caseRegex, replaceCase);
		if (this.path)
			this.path = this.path.replace(caseRegex, replaceCase);
		if (this.query)
			this.query = this.query.replace(caseRegex, replaceCase);
		if (this.fragment)
			this.fragment = this.fragment.replace(caseRegex, replaceCase);
	};

	var caseRegex = /%[0-9a-z]{2}/gi;
	var percentRegex = /[a-zA-Z0-9\-\._~]/;
	var authorityRegex = /(.*@)?([^@:]*)(:.*)?/;

	function replaceCase(str) {
		var dec = unescape(str);
		return percentRegex.test(dec) ? dec : str.toUpperCase();
	}

	function replaceAuthority(str, p1, p2, p3) {
		return (p1 || '') + p2.toLowerCase() + (p3 || '');
	}

	/**
	 * Resolve a relative URI (this) against a base URI.
	 * The base URI must be an absolute URI.
	 * See RFC 3986 section 5.2
	 */
	URI.prototype.resolve = function(baseURI) {
		var uri = new URI();
		if (this.scheme) {
			uri.scheme = this.scheme;
			uri.authority = this.authority;
			uri.path = this.path;
			uri.query = this.query;
		} else {
			uri.scheme = baseURI.scheme;
			if (this.authority) {
				uri.authority = this.authority;
				uri.path = this.path;
				uri.query = this.query;
			} else {
				uri.authority = baseURI.authority;
				if (this.path == '') {
					uri.path = baseURI.path;
					uri.query = this.query || baseURI.query;
				} else {
					if (this.path.charAt(0) == '/') {
						uri.path = this.path;
						uri.removeDotSegments();
					} else {
						if (baseURI.authority && baseURI.path == '') {
							uri.path = '/' + this.path;
						} else {
							uri.path = baseURI.path.substring(0, baseURI.path.lastIndexOf('/') + 1) + this.path;
						}
						uri.removeDotSegments();
					}
					uri.query = this.query;
				}
			}
		}
		uri.fragment = this.fragment;
		return uri;
	};

	/**
	 * Remove dot segments from path.
	 * See RFC 3986 section 5.2.4
	 * @private
	 */
	URI.prototype.removeDotSegments = function() {
		var input = this.path.split('/'),
			output = [],
			segment,
			absPath = input[0] == '';
		if (absPath)
			input.shift();
		var sFirst = input[0] == '' ? input.shift() : null;
		while (input.length) {
			segment = input.shift();
			if (segment == '..') {
				output.pop();
			} else if (segment != '.') {
				output.push(segment);
			}
		}
		if (segment == '.' || segment == '..')
			output.push('');
		if (absPath)
			output.unshift('');
		this.path = output.join('/');
	};

	// We don't like this function because it builds up a cache that is never cleared.
//	/**
//	 * Resolves a relative URI against an absolute base URI.
//	 * Convenience method.
//	 * @param {String} uri the relative URI to resolve
//	 * @param {String} baseURI the base URI (must be absolute) to resolve against
//	 */
//	URI.resolve = function(sURI, sBaseURI) {
//		var uri = cache[sURI] || (cache[sURI] = new URI(sURI));
//		var baseURI = cache[sBaseURI] || (cache[sBaseURI] = new URI(sBaseURI));
//		return uri.resolve(baseURI).toString();
//	};

//	var cache = {};

	/**
	 * Serialises the URI to a string.
	 */
	URI.prototype.toString = function() {
		var result = '';
		if (this.scheme)
			result += this.scheme + ':';
		if (this.authority)
			result += '//' + this.authority;
		result += this.path;
		if (this.query)
			result += '?' + this.query;
		if (this.fragment)
			result += '#' + this.fragment;
		return result;
	};

return URI;
});

/*global define*/
define('Core/TrustedServers',[
        '../ThirdParty/Uri',
        './defined',
        './DeveloperError'
    ], function(
        Uri,
        defined,
        DeveloperError) {
    'use strict';
    
    /**
     * A singleton that contains all of the servers that are trusted. Credentials will be sent with
     * any requests to these servers.
     *
     * @exports TrustedServers
     *
     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
     */
    var TrustedServers = {};
    var _servers = {};

    /**
     * Adds a trusted server to the registry
     *
     * @param {String} host The host to be added.
     * @param {Number} port The port used to access the host.
     *
     * @example
     * // Add a trusted server
     * TrustedServers.add('my.server.com', 80);
     */
    TrustedServers.add = function(host, port) {
                if (!defined(host)) {
            throw new DeveloperError('host is required.');
        }
        if (!defined(port) || port <= 0) {
            throw new DeveloperError('port is required to be greater than 0.');
        }
        
        var authority = host.toLowerCase() + ':' + port;
        if (!defined(_servers[authority])) {
            _servers[authority] = true;
        }
    };

    /**
     * Removes a trusted server from the registry
     *
     * @param {String} host The host to be removed.
     * @param {Number} port The port used to access the host.
     *
     * @example
     * // Remove a trusted server
     * TrustedServers.remove('my.server.com', 80);
     */
    TrustedServers.remove = function(host, port) {
                if (!defined(host)) {
            throw new DeveloperError('host is required.');
        }
        if (!defined(port) || port <= 0) {
            throw new DeveloperError('port is required to be greater than 0.');
        }
        
        var authority = host.toLowerCase() + ':' + port;
        if (defined(_servers[authority])) {
            delete _servers[authority];
        }
    };

    function getAuthority(url) {
        var uri = new Uri(url);
        uri.normalize();

        // Removes username:password@ so we just have host[:port]
        var authority = uri.getAuthority();
        if (!defined(authority)) {
            return undefined; // Relative URL
        }

        if (authority.indexOf('@') !== -1) {
            var parts = authority.split('@');
            authority = parts[1];
        }

        // If the port is missing add one based on the scheme
        if (authority.indexOf(':') === -1) {
            var scheme = uri.getScheme();
            if (!defined(scheme)) {
                scheme = window.location.protocol;
                scheme = scheme.substring(0, scheme.length-1);
            }
            if (scheme === 'http') {
                authority += ':80';
            } else if (scheme === 'https') {
                authority += ':443';
            } else {
                return undefined;
            }
        }

        return authority;
    }

    /**
     * Tests whether a server is trusted or not. The server must have been added with the port if it is included in the url.
     *
     * @param {String} url The url to be tested against the trusted list
     *
     * @returns {boolean} Returns true if url is trusted, false otherwise.
     *
     * @example
     * // Add server
     * TrustedServers.add('my.server.com', 81);
     *
     * // Check if server is trusted
     * if (TrustedServers.contains('https://my.server.com:81/path/to/file.png')) {
     *     // my.server.com:81 is trusted
     * }
     * if (TrustedServers.contains('https://my.server.com/path/to/file.png')) {
     *     // my.server.com isn't trusted
     * }
     */
    TrustedServers.contains = function(url) {
                if (!defined(url)) {
            throw new DeveloperError('url is required.');
        }
                var authority = getAuthority(url);
        if (defined(authority) && defined(_servers[authority])) {
            return true;
        }

        return false;
    };

    /**
     * Clears the registry
     *
     * @example
     * // Remove a trusted server
     * TrustedServers.clear();
     */
    TrustedServers.clear = function() {
        _servers = {};
    };
    
    return TrustedServers;
});

/*global define*/
define('Core/loadWithXhr',[
        '../ThirdParty/when',
        './defaultValue',
        './defined',
        './DeveloperError',
        './RequestErrorEvent',
        './RuntimeError',
        './TrustedServers'
    ], function(
        when,
        defaultValue,
        defined,
        DeveloperError,
        RequestErrorEvent,
        RuntimeError,
        TrustedServers) {
    'use strict';

    /**
     * Asynchronously loads the given URL.  Returns a promise that will resolve to
     * the result once loaded, or reject if the URL failed to load.  The data is loaded
     * using XMLHttpRequest, which means that in order to make requests to another origin,
     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
     *
     * @exports loadWithXhr
     *
     * @param {Object} options Object with the following properties:
     * @param {String|Promise.<String>} options.url The URL of the data, or a promise for the URL.
     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
     * @param {String} [options.method='GET'] The HTTP method to use.
     * @param {String} [options.data] The data to send with the request, if any.
     * @param {Object} [options.headers] HTTP headers to send with the request, if any.
     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
     * @returns {Promise.<Object>} a promise that will resolve to the requested data when loaded.
     *
     *
     * @example
     * // Load a single URL asynchronously. In real code, you should use loadBlob instead.
     * Cesium.loadWithXhr({
     *     url : 'some/url',
     *     responseType : 'blob'
     * }).then(function(blob) {
     *     // use the data
     * }).otherwise(function(error) {
     *     // an error occurred
     * });
     *
     * @see loadArrayBuffer
     * @see loadBlob
     * @see loadJson
     * @see loadText
     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
     */
    function loadWithXhr(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

                if (!defined(options.url)) {
            throw new DeveloperError('options.url is required.');
        }
        
        var responseType = options.responseType;
        var method = defaultValue(options.method, 'GET');
        var data = options.data;
        var headers = options.headers;
        var overrideMimeType = options.overrideMimeType;

        return when(options.url, function(url) {
            var deferred = when.defer();

            loadWithXhr.load(url, responseType, method, data, headers, deferred, overrideMimeType);

            return deferred.promise;
        });
    }

    var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;

    function decodeDataUriText(isBase64, data) {
        var result = decodeURIComponent(data);
        if (isBase64) {
            return atob(result);
        }
        return result;
    }

    function decodeDataUriArrayBuffer(isBase64, data) {
        var byteString = decodeDataUriText(isBase64, data);
        var buffer = new ArrayBuffer(byteString.length);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < byteString.length; i++) {
            view[i] = byteString.charCodeAt(i);
        }
        return buffer;
    }

    function decodeDataUri(dataUriRegexResult, responseType) {
        responseType = defaultValue(responseType, '');
        var mimeType = dataUriRegexResult[1];
        var isBase64 = !!dataUriRegexResult[2];
        var data = dataUriRegexResult[3];

        switch (responseType) {
            case '':
            case 'text':
                return decodeDataUriText(isBase64, data);
            case 'arraybuffer':
                return decodeDataUriArrayBuffer(isBase64, data);
            case 'blob':
                var buffer = decodeDataUriArrayBuffer(isBase64, data);
                return new Blob([buffer], {
                    type : mimeType
                });
            case 'document':
                var parser = new DOMParser();
                return parser.parseFromString(decodeDataUriText(isBase64, data), mimeType);
            case 'json':
                return JSON.parse(decodeDataUriText(isBase64, data));
            default:
                                throw new DeveloperError('Unhandled responseType: ' + responseType);
                        }
    }

    // This is broken out into a separate function so that it can be mocked for testing purposes.
    loadWithXhr.load = function(url, responseType, method, data, headers, deferred, overrideMimeType) {
        var dataUriRegexResult = dataUriRegex.exec(url);
        if (dataUriRegexResult !== null) {
            deferred.resolve(decodeDataUri(dataUriRegexResult, responseType));
            return;
        }

        var xhr = new XMLHttpRequest();

        if (TrustedServers.contains(url)) {
            xhr.withCredentials = true;
        }

        if (defined(overrideMimeType) && defined(xhr.overrideMimeType)) {
            xhr.overrideMimeType(overrideMimeType);
        }

        xhr.open(method, url, true);

        if (defined(headers)) {
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
        }

        if (defined(responseType)) {
            xhr.responseType = responseType;
        }

        xhr.onload = function() {
            if (xhr.status < 200 || xhr.status >= 300) {
                deferred.reject(new RequestErrorEvent(xhr.status, xhr.response, xhr.getAllResponseHeaders()));
                return;
            }

            var response = xhr.response;
            var browserResponseType = xhr.responseType;

            //All modern browsers will go into either the first if block or last else block.
            //Other code paths support older browsers that either do not support the supplied responseType
            //or do not support the xhr.response property.
            if (defined(response) && (!defined(responseType) || (browserResponseType === responseType))) {
                deferred.resolve(response);
            } else if ((responseType === 'json') && typeof response === 'string') {
                try {
                    deferred.resolve(JSON.parse(response));
                } catch (e) {
                    deferred.reject(e);
                }
            } else if ((browserResponseType === '' || browserResponseType === 'document') && defined(xhr.responseXML) && xhr.responseXML.hasChildNodes()) {
                deferred.resolve(xhr.responseXML);
            } else if ((browserResponseType === '' || browserResponseType === 'text') && defined(xhr.responseText)) {
                deferred.resolve(xhr.responseText);
            } else {
                deferred.reject(new RuntimeError('Invalid XMLHttpRequest response type.'));
            }
        };

        xhr.onerror = function(e) {
            deferred.reject(new RequestErrorEvent());
        };

        xhr.send(data);
    };

    loadWithXhr.defaultLoad = loadWithXhr.load;

    return loadWithXhr;
});

/*global define*/
define('Core/loadText',[
        './loadWithXhr'
    ], function(
        loadWithXhr) {
    'use strict';

    /**
     * Asynchronously loads the given URL as text.  Returns a promise that will resolve to
     * a String once loaded, or reject if the URL failed to load.  The data is loaded
     * using XMLHttpRequest, which means that in order to make requests to another origin,
     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
     *
     * @exports loadText
     *
     * @param {String|Promise.<String>} url The URL to request, or a promise for the URL.
     * @param {Object} [headers] HTTP headers to send with the request.
     * @returns {Promise.<String>} a promise that will resolve to the requested data when loaded.
     *
     *
     * @example
     * // load text from a URL, setting a custom header
     * Cesium.loadText('http://someUrl.com/someJson.txt', {
     *   'X-Custom-Header' : 'some value'
     * }).then(function(text) {
     *     // Do something with the text
     * }).otherwise(function(error) {
     *     // an error occurred
     * });
     * 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
     */
    function loadText(url, headers) {
        return loadWithXhr({
            url : url,
            headers : headers
        });
    }

    return loadText;
});

/*global define*/
define('Core/loadJson',[
        './clone',
        './defined',
        './DeveloperError',
        './loadText'
    ], function(
        clone,
        defined,
        DeveloperError,
        loadText) {
    'use strict';

    var defaultHeaders = {
        Accept : 'application/json,*/*;q=0.01'
    };

    // note: &#42;&#47;&#42; below is */* but that ends the comment block early
    /**
     * Asynchronously loads the given URL as JSON.  Returns a promise that will resolve to
     * a JSON object once loaded, or reject if the URL failed to load.  The data is loaded
     * using XMLHttpRequest, which means that in order to make requests to another origin,
     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled. This function
     * adds 'Accept: application/json,&#42;&#47;&#42;;q=0.01' to the request headers, if not
     * already specified.
     *
     * @exports loadJson
     *
     * @param {String|Promise.<String>} url The URL to request, or a promise for the URL.
     * @param {Object} [headers] HTTP headers to send with the request.
     * 'Accept: application/json,&#42;&#47;&#42;;q=0.01' is added to the request headers automatically
     * if not specified.
     * @returns {Promise.<Object>} a promise that will resolve to the requested data when loaded.
     *
     *
     * @example
     * Cesium.loadJson('http://someUrl.com/someJson.txt').then(function(jsonData) {
     *     // Do something with the JSON object
     * }).otherwise(function(error) {
     *     // an error occurred
     * });
     * 
     * @see loadText
     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
     */
    function loadJson(url, headers) {
                if (!defined(url)) {
            throw new DeveloperError('url is required.');
        }
        
        if (!defined(headers)) {
            headers = defaultHeaders;
        } else if (!defined(headers.Accept)) {
            // clone before adding the Accept header
            headers = clone(headers);
            headers.Accept = defaultHeaders.Accept;
        }

        return loadText(url, headers).then(function(value) {
            return JSON.parse(value);
        });
    }

    return loadJson;
});

/*global define*/
define('Core/isDataUri',[
        './defined'
    ], function(
        defined) {
    'use strict';

    var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;

    /**
     * Determines if the specified uri is a data uri.
     *
     * @exports isDataUri
     *
     * @param {String} uri The uri to test.
     * @returns {Boolean} true when the uri is a data uri; otherwise, false.
     *
     * @private
     */
    function isDataUri(uri) {
        if (defined(uri)) {
            return dataUriRegex.test(uri);
        }

        return false;
    }

    return isDataUri;
});

/*global define*/
define('Core/Queue',[
        './defineProperties'
    ], function(
        defineProperties) {
    'use strict';

    /**
     * A queue that can enqueue items at the end, and dequeue items from the front.
     *
     * @alias Queue
     * @constructor
     */
    function Queue() {
        this._array = [];
        this._offset = 0;
        this._length = 0;
    }

    defineProperties(Queue.prototype, {
        /**
         * The length of the queue.
         *
         * @memberof Queue.prototype
         *
         * @type {Number}
         * @readonly
         */
        length : {
            get : function() {
                return this._length;
            }
        }
    });

    /**
     * Enqueues the specified item.
     *
     * @param {Object} item The item to enqueue.
     */
    Queue.prototype.enqueue = function(item) {
        this._array.push(item);
        this._length++;
    };

    /**
     * Dequeues an item.  Returns undefined if the queue is empty.
     *
     * @returns {Object} The the dequeued item.
     */
    Queue.prototype.dequeue = function() {
        if (this._length === 0) {
            return undefined;
        }

        var array = this._array;
        var offset = this._offset;
        var item = array[offset];
        array[offset] = undefined;

        offset++;
        if ((offset > 10) && (offset * 2 > array.length)) {
            //compact array
            this._array = array.slice(offset);
            offset = 0;
        }

        this._offset = offset;
        this._length--;

        return item;
    };

    /**
     * Returns the item at the front of the queue.  Returns undefined if the queue is empty.
     *
     * @returns {Object} The item at the front of the queue.
     */
    Queue.prototype.peek = function() {
        if (this._length === 0) {
            return undefined;
        }

        return this._array[this._offset];
    };

    /**
     * Check whether this queue contains the specified item.
     *
     * @param {Object} item The item to search for.
     */
    Queue.prototype.contains = function(item) {
        return this._array.indexOf(item) !== -1;
    };

    /**
     * Remove all items from the queue.
     */
    Queue.prototype.clear = function() {
        this._array.length = this._offset = this._length = 0;
    };

    /**
     * Sort the items in the queue in-place.
     *
     * @param {Queue~Comparator} compareFunction A function that defines the sort order.
     */
    Queue.prototype.sort = function(compareFunction) {
        if (this._offset > 0) {
            //compact array
            this._array = this._array.slice(this._offset);
            this._offset = 0;
        }

        this._array.sort(compareFunction);
    };

    /**
     * A function used to compare two items while sorting a queue.
     * @callback Queue~Comparator
     *
     * @param {Object} a An item in the array.
     * @param {Object} b An item in the array.
     * @returns {Number} Returns a negative value if <code>a</code> is less than <code>b</code>,
     *          a positive value if <code>a</code> is greater than <code>b</code>, or
     *          0 if <code>a</code> is equal to <code>b</code>.
     *
     * @example
     * function compareNumbers(a, b) {
     *     return a - b;
     * }
     */

    return Queue;
});

/*global define*/
define('Core/Request',[
        './defaultValue'
    ], function(
        defaultValue) {
    'use strict';

    /**
     * Stores information for making a request using {@link RequestScheduler}.
     *
     * @exports Request
     *
     * @private
     */
    function Request(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        /**
         * The URL to request.
         */
        this.url = options.url;

        /**
         * Extra parameters to send with the request. For example, HTTP headers or jsonp parameters.
         */
        this.parameters = options.parameters;

        /**
         * The actual function that makes the request.
         */
        this.requestFunction = options.requestFunction;

        /**
         * Type of request. Used for more fine-grained priority sorting.
         */
        this.type = options.type;

        /**
         * Specifies that the request should be deferred until an open slot is available.
         * A deferred request will always return a promise, which is suitable for data
         * sources and utility functions.
         */
        this.defer = defaultValue(options.defer, false);

        /**
         * The distance from the camera, used to prioritize requests.
         */
        this.distance = defaultValue(options.distance, 0.0);

        // Helper members for RequestScheduler

        /**
         * A promise for when a deferred request can start.
         *
         * @private
         */
        this.startPromise = undefined;

        /**
         * Reference to a {@link RequestScheduler~RequestServer}.
         *
         * @private
         */
        this.server = options.server;
    }

    return Request;
});

/*global define*/
define('Core/RequestType',[
        '../Core/freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * @private
     */
    var RequestType = {
        TERRAIN : 0,
        IMAGERY : 1,
        TILES3D : 2,
        OTHER : 3
    };

    return freezeObject(RequestType);
});

/*global define*/
define('Core/RequestScheduler',[
        '../ThirdParty/Uri',
        '../ThirdParty/when',
        './defaultValue',
        './defined',
        './DeveloperError',
        './isDataUri',
        './Queue',
        './Request',
        './RequestType'
    ], function(
        Uri,
        when,
        defaultValue,
        defined,
        DeveloperError,
        isDataUri,
        Queue,
        Request,
        RequestType) {
    'use strict';

    function RequestBudget(request) {
        /**
         * Total requests allowed this frame.
         */
        this.total = 0;

        /**
         * Total requests used this frame.
         */
        this.used = 0;

        /**
         * Server of the request.
         */
        this.server = request.server;

        /**
         * Type of request. Used for more fine-grained priority sorting.
         */
        this.type = request.type;
    }

    /**
     * Stores the number of active requests at a particular server. Areas that commonly makes requests may store
     * a reference to this object in order to quickly determine whether a request can be issued (e.g. Cesium3DTile).
     */
    function RequestServer(serverName) {
        /**
         * Number of active requests at this server.
         */
        this.activeRequests = 0;

        /**
         * The name of the server.
         */
        this.serverName = serverName;
    }

    RequestServer.prototype.hasAvailableRequests = function() {
        return RequestScheduler.hasAvailableRequests() && (this.activeRequests < RequestScheduler.maximumRequestsPerServer);
    };

    RequestServer.prototype.getNumberOfAvailableRequests = function() {
        return RequestScheduler.maximumRequestsPerServer - this.activeRequests;
    };

    var activeRequestsByServer = {};
    var activeRequests = 0;
    var budgets = [];
    var leftoverRequests = [];
    var deferredRequests = new Queue();

    var stats = {
        numberOfRequestsThisFrame : 0
    };

    /**
     * Because browsers throttle the number of parallel requests allowed to each server
     * and across all servers, this class tracks the number of active requests in progress
     * and prioritizes incoming requests.
     *
     * @exports RequestScheduler
     *
     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
     *
     * @private
     */
    function RequestScheduler() {
    }

    function distanceSortFunction(a, b) {
        return a.distance - b.distance;
    }

    function getBudget(request) {
        var budget;
        var length = budgets.length;
        for (var i = 0; i < length; ++i) {
            budget = budgets[i];
            if ((budget.server === request.server) && (budget.type === request.type)) {
                return budget;
            }
        }
        // Not found, create a new budget
        budget = new RequestBudget(request);
        budgets.push(budget);
        return budget;
    }

    RequestScheduler.resetBudgets = function() {
        showStats();
        clearStats();

        if (!RequestScheduler.prioritize || !RequestScheduler.throttle) {
            return;
        }

        // Reset budget totals
        var length = budgets.length;
        for (var i = 0; i < length; ++i) {
            budgets[i].total = 0;
            budgets[i].used = 0;
        }

        // Sort all leftover requests by distance
        var requests = leftoverRequests;
        requests.sort(distanceSortFunction);

        // Allocate new budgets based on the distances of leftover requests
        var availableRequests = RequestScheduler.getNumberOfAvailableRequests();
        var requestsLength = requests.length;
        for (var j = 0; (j < requestsLength) && (availableRequests > 0); ++j) {
            var request = requests[j];
            var budget = getBudget(request);
            var budgetAvailable = budget.server.getNumberOfAvailableRequests();
            if (budget.total < budgetAvailable) {
                ++budget.total;
                --availableRequests;
            }
        }

        requests.length = 0;
    };

    var pageUri = typeof document !== 'undefined' ? new Uri(document.location.href) : new Uri();

    /**
     * Get the server name from a given url.
     *
     * @param {String} url The url.
     * @returns {String} The server name.
     */
    RequestScheduler.getServerName = function(url) {
                if (!defined(url)) {
            throw new DeveloperError('url is required.');
        }
        
        var uri = new Uri(url).resolve(pageUri);
        uri.normalize();
        var serverName = uri.authority;
        if (!/:/.test(serverName)) {
            serverName = serverName + ':' + (uri.scheme === 'https' ? '443' : '80');
        }
        return serverName;
    };

    /**
     * Get the request server from a given url.
     *
     * @param {String} url The url.
     * @returns {RequestServer} The request server.
     */
    RequestScheduler.getRequestServer = function(url) {
        var serverName = RequestScheduler.getServerName(url);
        var server = activeRequestsByServer[serverName];
        if (!defined(server)) {
            server = new RequestServer(serverName);
            activeRequestsByServer[serverName] = server;
        }
        return server;
    };

    /**
     * Get the number of available slots at the server pointed to by the url.
     *
     * @param {String} url The url to check.
     * @returns {Number} The number of available slots.
     */
    RequestScheduler.getNumberOfAvailableRequestsByServer = function(url) {
        return RequestScheduler.getRequestServer(url).getNumberOfAvailableRequests();
    };

    /**
     * Get the number of available slots across all servers.
     *
     * @returns {Number} The number of available slots.
     */
    RequestScheduler.getNumberOfAvailableRequests = function() {
        return RequestScheduler.maximumRequests - activeRequests;
    };

    /**
     * Checks if there are available slots to make a request at the server pointed to by the url.
     *
     * @param {String} [url] The url to check.
     * @returns {Boolean} Returns true if there are available slots, otherwise false.
     */
    RequestScheduler.hasAvailableRequestsByServer = function(url) {
        return RequestScheduler.getRequestServer(url).hasAvailableRequests();
    };

    /**
     * Checks if there are available slots to make a request, considering the total
     * number of available slots across all servers.
     *
     * @returns {Boolean} Returns true if there are available slots, otherwise false.
     */
    RequestScheduler.hasAvailableRequests = function() {
        return activeRequests < RequestScheduler.maximumRequests;
    };

    function requestComplete(request) {
        --activeRequests;
        --request.server.activeRequests;

        // Start a deferred request immediately now that a slot is open
        var deferredRequest = deferredRequests.dequeue();
        if (defined(deferredRequest)) {
            deferredRequest.startPromise.resolve(deferredRequest);
        }
    }

    function startRequest(request) {
        ++activeRequests;
        ++request.server.activeRequests;

        return when(request.requestFunction(request.url, request.parameters), function(result) {
            requestComplete(request);
            return result;
        }).otherwise(function(error) {
            requestComplete(request);
            return when.reject(error);
        });
    }

    function deferRequest(request) {
        deferredRequests.enqueue(request);
        var deferred = when.defer();
        request.startPromise = deferred;
        return deferred.promise.then(startRequest);
    }

    function handleLeftoverRequest(request) {
        if (RequestScheduler.prioritize) {
            leftoverRequests.push(request);
        }
    }

    /**
     * A function that will make a request if there are available slots to the server.
     * Returns undefined immediately if the request would exceed the maximum, allowing
     * the caller to retry later instead of queueing indefinitely under the browser's control.
     *
     * @param {Request} request The request object.
     *
     * @returns {Promise.<Object>|undefined} Either undefined, meaning the request would exceed the maximum number of
     *          parallel requests, or a Promise for the requested data.
     *
     * @example
     * // throttle requests for an image
     * var url = 'http://madeupserver.example.com/myImage.png';
     * var requestFunction = function(url) {
     *   // in this simple example, loadImage could be used directly as requestFunction.
     *   return Cesium.loadImage(url);
     * };
     * var request = new Request({
     *   url : url,
     *   requestFunction : requestFunction
     * });
     * var promise = Cesium.RequestScheduler.schedule(request);
     * if (!Cesium.defined(promise)) {
     *   // too many active requests in progress, try again later.
     * } else {
     *   promise.then(function(image) {
     *     // handle loaded image
     *   });
     * }
     *
     */
    RequestScheduler.schedule = function(request) {
                if (!defined(request)) {
            throw new DeveloperError('request is required.');
        }
        if (!defined(request.url)) {
            throw new DeveloperError('request.url is required.');
        }
        if (!defined(request.requestFunction)) {
            throw new DeveloperError('request.requestFunction is required.');
        }
        
        ++stats.numberOfRequestsThisFrame;

        if (!RequestScheduler.throttle || isDataUri(request.url)) {
            return request.requestFunction(request.url, request.parameters);
        }

        if (!defined(request.server)) {
            request.server = RequestScheduler.getRequestServer(request.url);
        }

        if (!request.server.hasAvailableRequests()) {
            if (!request.defer) {
                // No available slots to make the request, return undefined
                handleLeftoverRequest(request);
                return undefined;
            } else {
                // If no slots are available, the request is deferred until a slot opens up.
                // Return a promise even if the request can't be completed immediately.
                return deferRequest(request);
            }
        }

        if (RequestScheduler.prioritize && defined(request.type) && !request.defer) {
            var budget = getBudget(request);
            if (budget.used >= budget.total) {
                // Request does not fit in the budget, return undefined
                handleLeftoverRequest(request);
                return undefined;
            }
            ++budget.used;
        }

        return startRequest(request);
    };

    /**
     * A function that will make a request when an open slot is available. Always returns
     * a promise, which is suitable for data sources and utility functions.
     *
     * @param {String} url The URL to request.
     * @param {RequestScheduler~RequestFunction} requestFunction The actual function that
     *        makes the request.
     * @param {Object} [parameters] Extra parameters to send with the request.
     * @param {RequestType} [requestType] Type of request. Used for more fine-grained priority sorting.
     *
     * @returns {Promise.<Object>} A Promise for the requested data.
     */
    RequestScheduler.request = function(url, requestFunction, parameters, requestType) {
        return RequestScheduler.schedule(new Request({
            url : url,
            parameters : parameters,
            requestFunction : requestFunction,
            defer : true,
            type : defaultValue(requestType, RequestType.OTHER)
        }));
    };

    function clearStats() {
        stats.numberOfRequestsThisFrame = 0;
    }

    function showStats() {
        if (!RequestScheduler.debugShowStatistics) {
            return;
        }

        if (stats.numberOfRequestsThisFrame > 0) {
            console.log('Number of requests attempted: ' + stats.numberOfRequestsThisFrame);
        }

        var numberOfActiveRequests = RequestScheduler.maximumRequests - RequestScheduler.getNumberOfAvailableRequests();
        if (numberOfActiveRequests > 0) {
            console.log('Number of active requests: ' + numberOfActiveRequests);
        }
    }

    /**
     * Clears the request scheduler before each spec.
     *
     * @private
     */
    RequestScheduler.clearForSpecs = function() {
        activeRequestsByServer = {};
        activeRequests = 0;
        budgets = [];
        leftoverRequests = [];
        deferredRequests = new Queue();
        stats = {
            numberOfRequestsThisFrame : 0
        };
    };

    /**
     * Specifies the maximum number of requests that can be simultaneously open to a single server.  If this value is higher than
     * the number of requests per server actually allowed by the web browser, Cesium's ability to prioritize requests will be adversely
     * affected.
     * @type {Number}
     * @default 6
     */
    RequestScheduler.maximumRequestsPerServer = 6;

    /**
     * Specifies the maximum number of requests that can be simultaneously open for all servers.  If this value is higher than
     * the number of requests actually allowed by the web browser, Cesium's ability to prioritize requests will be adversely
     * affected.
     * @type {Number}
     * @default 10
     */
    RequestScheduler.maximumRequests = 10;

    /**
     * Specifies if the request scheduler should prioritize incoming requests
     * @type {Boolean}
     * @default true
     */
    RequestScheduler.prioritize = true;

    /**
     * Specifies if the request scheduler should throttle incoming requests, or let the browser queue requests under its control.
     * @type {Boolean}
     * @default true
     */
    RequestScheduler.throttle = true;

    /**
     * When true, log statistics to the console every frame
     * @type {Boolean}
     * @default false
     */
    RequestScheduler.debugShowStatistics = false;

    return RequestScheduler;
});

/*global define*/
define('Core/EarthOrientationParameters',[
        '../ThirdParty/when',
        './binarySearch',
        './defaultValue',
        './defined',
        './EarthOrientationParametersSample',
        './freezeObject',
        './JulianDate',
        './LeapSecond',
        './loadJson',
        './RequestScheduler',
        './RuntimeError',
        './TimeConstants',
        './TimeStandard'
    ], function(
        when,
        binarySearch,
        defaultValue,
        defined,
        EarthOrientationParametersSample,
        freezeObject,
        JulianDate,
        LeapSecond,
        loadJson,
        RequestScheduler,
        RuntimeError,
        TimeConstants,
        TimeStandard) {
    'use strict';

    /**
     * Specifies Earth polar motion coordinates and the difference between UT1 and UTC.
     * These Earth Orientation Parameters (EOP) are primarily used in the transformation from
     * the International Celestial Reference Frame (ICRF) to the International Terrestrial
     * Reference Frame (ITRF).
     *
     * @alias EarthOrientationParameters
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {String} [options.url] The URL from which to obtain EOP data.  If neither this
     *                 parameter nor options.data is specified, all EOP values are assumed
     *                 to be 0.0.  If options.data is specified, this parameter is
     *                 ignored.
     * @param {Object} [options.data] The actual EOP data.  If neither this
     *                 parameter nor options.data is specified, all EOP values are assumed
     *                 to be 0.0.
     * @param {Boolean} [options.addNewLeapSeconds=true] True if leap seconds that
     *                  are specified in the EOP data but not in {@link JulianDate.leapSeconds}
     *                  should be added to {@link JulianDate.leapSeconds}.  False if
     *                  new leap seconds should be handled correctly in the context
     *                  of the EOP data but otherwise ignored.
     *
     * @example
     * // An example EOP data file, EOP.json:
     * {
     *   "columnNames" : ["dateIso8601","modifiedJulianDateUtc","xPoleWanderRadians","yPoleWanderRadians","ut1MinusUtcSeconds","lengthOfDayCorrectionSeconds","xCelestialPoleOffsetRadians","yCelestialPoleOffsetRadians","taiMinusUtcSeconds"],
     *   "samples" : [
     *      "2011-07-01T00:00:00Z",55743.0,2.117957047295119e-7,2.111518721609984e-6,-0.2908948,-2.956e-4,3.393695767766752e-11,3.3452143996557983e-10,34.0,
     *      "2011-07-02T00:00:00Z",55744.0,2.193297093339541e-7,2.115460256837405e-6,-0.29065,-1.824e-4,-8.241832578862112e-11,5.623838700870617e-10,34.0,
     *      "2011-07-03T00:00:00Z",55745.0,2.262286080161428e-7,2.1191157519929706e-6,-0.2905572,1.9e-6,-3.490658503988659e-10,6.981317007977318e-10,34.0
     *   ]
     * }
     *
     * @example
     * // Loading the EOP data
     * var eop = new Cesium.EarthOrientationParameters({ url : 'Data/EOP.json' });
     * Cesium.Transforms.earthOrientationParameters = eop;
     *
     * @private
     */
    function EarthOrientationParameters(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._dates = undefined;
        this._samples = undefined;

        this._dateColumn = -1;
        this._xPoleWanderRadiansColumn = -1;
        this._yPoleWanderRadiansColumn = -1;
        this._ut1MinusUtcSecondsColumn = -1;
        this._xCelestialPoleOffsetRadiansColumn = -1;
        this._yCelestialPoleOffsetRadiansColumn = -1;
        this._taiMinusUtcSecondsColumn = -1;

        this._columnCount = 0;
        this._lastIndex = -1;

        this._downloadPromise = undefined;
        this._dataError = undefined;

        this._addNewLeapSeconds = defaultValue(options.addNewLeapSeconds, true);

        if (defined(options.data)) {
            // Use supplied EOP data.
            onDataReady(this, options.data);
        } else if (defined(options.url)) {
            // Download EOP data.
            var that = this;
            this._downloadPromise = when(RequestScheduler.request(options.url, loadJson), function(eopData) {
                onDataReady(that, eopData);
            }, function() {
                that._dataError = 'An error occurred while retrieving the EOP data from the URL ' + options.url + '.';
            });
        } else {
            // Use all zeros for EOP data.
            onDataReady(this, {
                'columnNames' : ['dateIso8601', 'modifiedJulianDateUtc', 'xPoleWanderRadians', 'yPoleWanderRadians', 'ut1MinusUtcSeconds', 'lengthOfDayCorrectionSeconds', 'xCelestialPoleOffsetRadians', 'yCelestialPoleOffsetRadians', 'taiMinusUtcSeconds'],
                'samples' : []
            });
        }
    }

    /**
     * A default {@link EarthOrientationParameters} instance that returns zero for all EOP values.
     */
    EarthOrientationParameters.NONE = freezeObject({
            getPromiseToLoad : function() {
                return when();
            },
            compute : function(date, result) {
                if (!defined(result)) {
                    result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
                } else {
                    result.xPoleWander = 0.0;
                    result.yPoleWander = 0.0;
                    result.xPoleOffset = 0.0;
                    result.yPoleOffset = 0.0;
                    result.ut1MinusUtc = 0.0;
                }
                return result;
            }
    });

    /**
     * Gets a promise that, when resolved, indicates that the EOP data has been loaded and is
     * ready to use.
     *
     * @returns {Promise.<undefined>} The promise.
     *
     * @see when
     */
    EarthOrientationParameters.prototype.getPromiseToLoad = function() {
        return when(this._downloadPromise);
    };

    /**
     * Computes the Earth Orientation Parameters (EOP) for a given date by interpolating.
     * If the EOP data has not yet been download, this method returns undefined.
     *
     * @param {JulianDate} date The date for each to evaluate the EOP.
     * @param {EarthOrientationParametersSample} [result] The instance to which to copy the result.
     *        If this parameter is undefined, a new instance is created and returned.
     * @returns {EarthOrientationParametersSample} The EOP evaluated at the given date, or
     *          undefined if the data necessary to evaluate EOP at the date has not yet been
     *          downloaded.
     *
     * @exception {RuntimeError} The loaded EOP data has an error and cannot be used.
     *
     * @see EarthOrientationParameters#getPromiseToLoad
     */
    EarthOrientationParameters.prototype.compute = function(date, result) {
        // We cannot compute until the samples are available.
        if (!defined(this._samples)) {
            if (defined(this._dataError)) {
                throw new RuntimeError(this._dataError);
            }

            return undefined;
        }

        if (!defined(result)) {
            result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
        }

        if (this._samples.length === 0) {
            result.xPoleWander = 0.0;
            result.yPoleWander = 0.0;
            result.xPoleOffset = 0.0;
            result.yPoleOffset = 0.0;
            result.ut1MinusUtc = 0.0;
            return result;
        }

        var dates = this._dates;
        var lastIndex = this._lastIndex;

        var before = 0;
        var after = 0;
        if (defined(lastIndex)) {
            var previousIndexDate = dates[lastIndex];
            var nextIndexDate = dates[lastIndex + 1];
            var isAfterPrevious = JulianDate.lessThanOrEquals(previousIndexDate, date);
            var isAfterLastSample = !defined(nextIndexDate);
            var isBeforeNext = isAfterLastSample || JulianDate.greaterThanOrEquals(nextIndexDate, date);

            if (isAfterPrevious && isBeforeNext) {
                before = lastIndex;

                if (!isAfterLastSample && nextIndexDate.equals(date)) {
                    ++before;
                }
                after = before + 1;

                interpolate(this, dates, this._samples, date, before, after, result);
                return result;
            }
        }

        var index = binarySearch(dates, date, JulianDate.compare, this._dateColumn);
        if (index >= 0) {
            // If the next entry is the same date, use the later entry.  This way, if two entries
            // describe the same moment, one before a leap second and the other after, then we will use
            // the post-leap second data.
            if (index < dates.length - 1 && dates[index + 1].equals(date)) {
                ++index;
            }
            before = index;
            after = index;
        } else {
            after = ~index;
            before = after - 1;

            // Use the first entry if the date requested is before the beginning of the data.
            if (before < 0) {
                before = 0;
            }
        }

        this._lastIndex = before;

        interpolate(this, dates, this._samples, date, before, after, result);
        return result;
    };

    function compareLeapSecondDates(leapSecond, dateToFind) {
        return JulianDate.compare(leapSecond.julianDate, dateToFind);
    }

    function onDataReady(eop, eopData) {
        if (!defined(eopData.columnNames)) {
            eop._dataError = 'Error in loaded EOP data: The columnNames property is required.';
            return;
        }

        if (!defined(eopData.samples)) {
            eop._dataError = 'Error in loaded EOP data: The samples property is required.';
            return;
        }

        var dateColumn = eopData.columnNames.indexOf('modifiedJulianDateUtc');
        var xPoleWanderRadiansColumn = eopData.columnNames.indexOf('xPoleWanderRadians');
        var yPoleWanderRadiansColumn = eopData.columnNames.indexOf('yPoleWanderRadians');
        var ut1MinusUtcSecondsColumn = eopData.columnNames.indexOf('ut1MinusUtcSeconds');
        var xCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('xCelestialPoleOffsetRadians');
        var yCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('yCelestialPoleOffsetRadians');
        var taiMinusUtcSecondsColumn = eopData.columnNames.indexOf('taiMinusUtcSeconds');

        if (dateColumn < 0 || xPoleWanderRadiansColumn < 0 || yPoleWanderRadiansColumn < 0 || ut1MinusUtcSecondsColumn < 0 || xCelestialPoleOffsetRadiansColumn < 0 || yCelestialPoleOffsetRadiansColumn < 0 || taiMinusUtcSecondsColumn < 0) {
            eop._dataError = 'Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns';
            return;
        }

        var samples = eop._samples = eopData.samples;
        var dates = eop._dates = [];

        eop._dateColumn = dateColumn;
        eop._xPoleWanderRadiansColumn = xPoleWanderRadiansColumn;
        eop._yPoleWanderRadiansColumn = yPoleWanderRadiansColumn;
        eop._ut1MinusUtcSecondsColumn = ut1MinusUtcSecondsColumn;
        eop._xCelestialPoleOffsetRadiansColumn = xCelestialPoleOffsetRadiansColumn;
        eop._yCelestialPoleOffsetRadiansColumn = yCelestialPoleOffsetRadiansColumn;
        eop._taiMinusUtcSecondsColumn = taiMinusUtcSecondsColumn;

        eop._columnCount = eopData.columnNames.length;
        eop._lastIndex = undefined;

        var lastTaiMinusUtc;

        var addNewLeapSeconds = eop._addNewLeapSeconds;

        // Convert the ISO8601 dates to JulianDates.
        for (var i = 0, len = samples.length; i < len; i += eop._columnCount) {
            var mjd = samples[i + dateColumn];
            var taiMinusUtc = samples[i + taiMinusUtcSecondsColumn];
            var day = mjd + TimeConstants.MODIFIED_JULIAN_DATE_DIFFERENCE;
            var date = new JulianDate(day, taiMinusUtc, TimeStandard.TAI);
            dates.push(date);

            if (addNewLeapSeconds) {
                if (taiMinusUtc !== lastTaiMinusUtc && defined(lastTaiMinusUtc)) {
                    // We crossed a leap second boundary, so add the leap second
                    // if it does not already exist.
                    var leapSeconds = JulianDate.leapSeconds;
                    var leapSecondIndex = binarySearch(leapSeconds, date, compareLeapSecondDates);
                    if (leapSecondIndex < 0) {
                        var leapSecond = new LeapSecond(date, taiMinusUtc);
                        leapSeconds.splice(~leapSecondIndex, 0, leapSecond);
                    }
                }
                lastTaiMinusUtc = taiMinusUtc;
            }
        }
    }

    function fillResultFromIndex(eop, samples, index, columnCount, result) {
        var start = index * columnCount;
        result.xPoleWander = samples[start + eop._xPoleWanderRadiansColumn];
        result.yPoleWander = samples[start + eop._yPoleWanderRadiansColumn];
        result.xPoleOffset = samples[start + eop._xCelestialPoleOffsetRadiansColumn];
        result.yPoleOffset = samples[start + eop._yCelestialPoleOffsetRadiansColumn];
        result.ut1MinusUtc = samples[start + eop._ut1MinusUtcSecondsColumn];
    }

    function linearInterp(dx, y1, y2) {
        return y1 + dx * (y2 - y1);
    }

    function interpolate(eop, dates, samples, date, before, after, result) {
        var columnCount = eop._columnCount;

        // First check the bounds on the EOP data
        // If we are after the bounds of the data, return zeros.
        // The 'before' index should never be less than zero.
        if (after > dates.length - 1) {
            result.xPoleWander = 0;
            result.yPoleWander = 0;
            result.xPoleOffset = 0;
            result.yPoleOffset = 0;
            result.ut1MinusUtc = 0;
            return result;
        }

        var beforeDate = dates[before];
        var afterDate = dates[after];
        if (beforeDate.equals(afterDate) || date.equals(beforeDate)) {
            fillResultFromIndex(eop, samples, before, columnCount, result);
            return result;
        } else if (date.equals(afterDate)) {
            fillResultFromIndex(eop, samples, after, columnCount, result);
            return result;
        }

        var factor = JulianDate.secondsDifference(date, beforeDate) / JulianDate.secondsDifference(afterDate, beforeDate);

        var startBefore = before * columnCount;
        var startAfter = after * columnCount;

        // Handle UT1 leap second edge case
        var beforeUt1MinusUtc = samples[startBefore + eop._ut1MinusUtcSecondsColumn];
        var afterUt1MinusUtc = samples[startAfter + eop._ut1MinusUtcSecondsColumn];

        var offsetDifference = afterUt1MinusUtc - beforeUt1MinusUtc;
        if (offsetDifference > 0.5 || offsetDifference < -0.5) {
            // The absolute difference between the values is more than 0.5, so we may have
            // crossed a leap second.  Check if this is the case and, if so, adjust the
            // afterValue to account for the leap second.  This way, our interpolation will
            // produce reasonable results.
            var beforeTaiMinusUtc = samples[startBefore + eop._taiMinusUtcSecondsColumn];
            var afterTaiMinusUtc = samples[startAfter + eop._taiMinusUtcSecondsColumn];
            if (beforeTaiMinusUtc !== afterTaiMinusUtc) {
                if (afterDate.equals(date)) {
                    // If we are at the end of the leap second interval, take the second value
                    // Otherwise, the interpolation below will yield the wrong side of the
                    // discontinuity
                    // At the end of the leap second, we need to start accounting for the jump
                    beforeUt1MinusUtc = afterUt1MinusUtc;
                } else {
                    // Otherwise, remove the leap second so that the interpolation is correct
                    afterUt1MinusUtc -= afterTaiMinusUtc - beforeTaiMinusUtc;
                }
            }
        }

        result.xPoleWander = linearInterp(factor, samples[startBefore + eop._xPoleWanderRadiansColumn], samples[startAfter + eop._xPoleWanderRadiansColumn]);
        result.yPoleWander = linearInterp(factor, samples[startBefore + eop._yPoleWanderRadiansColumn], samples[startAfter + eop._yPoleWanderRadiansColumn]);
        result.xPoleOffset = linearInterp(factor, samples[startBefore + eop._xCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._xCelestialPoleOffsetRadiansColumn]);
        result.yPoleOffset = linearInterp(factor, samples[startBefore + eop._yCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._yCelestialPoleOffsetRadiansColumn]);
        result.ut1MinusUtc = linearInterp(factor, beforeUt1MinusUtc, afterUt1MinusUtc);
        return result;
    }

    return EarthOrientationParameters;
});

/*global define*/
define('Core/getAbsoluteUri',[
        '../ThirdParty/Uri',
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        Uri,
        defaultValue,
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Given a relative Uri and a base Uri, returns the absolute Uri of the relative Uri.
     * @exports getAbsoluteUri
     *
     * @param {String} relative The relative Uri.
     * @param {String} [base] The base Uri.
     * @returns {String} The absolute Uri of the given relative Uri.
     *
     * @example
     * //absolute Uri will be "https://test.com/awesome.png";
     * var absoluteUri = Cesium.getAbsoluteUri('awesome.png', 'https://test.com');
     */
    function getAbsoluteUri(relative, base) {
                if (!defined(relative)) {
            throw new DeveloperError('relative uri is required.');
        }
                base = defaultValue(base, document.location.href);
        var baseUri = new Uri(base);
        var relativeUri = new Uri(relative);
        return relativeUri.resolve(baseUri).toString();
    }

    return getAbsoluteUri;
});

/*global define*/
define('Core/joinUrls',[
        '../ThirdParty/Uri',
        './defaultValue',
        './defined',
        './DeveloperError'
    ], function(
        Uri,
        defaultValue,
        defined,
        DeveloperError) {
    'use strict';

    /**
     * Function for joining URLs in a manner that is aware of query strings and fragments.
     * This is useful when the base URL has a query string that needs to be maintained
     * (e.g. a presigned base URL).
     * @param {String|Uri} first The base URL.
     * @param {String|Uri} second The URL path to join to the base URL.  If this URL is absolute, it is returned unmodified.
     * @param {Boolean} [appendSlash=true] The boolean determining whether there should be a forward slash between first and second.
     *
     * @return {String} The combined url
     * @private
     */
    function joinUrls(first, second, appendSlash) {
                if (!defined(first)) {
            throw new DeveloperError('first is required');
        }
        if (!defined(second)) {
            throw new DeveloperError('second is required');
        }
        
        appendSlash = defaultValue(appendSlash, true);

        if (!(first instanceof Uri)) {
            first = new Uri(first);
        }

        if (!(second instanceof Uri)) {
            second = new Uri(second);
        }

        // Uri.isAbsolute returns false for a URL like '//foo.com'.  So if we have an authority but
        // not a scheme, add a scheme matching the page's scheme.
        if (defined(second.authority) && !defined(second.scheme)) {
            if (typeof document !== 'undefined' && defined(document.location) && defined(document.location.href)) {
                second.scheme = new Uri(document.location.href).scheme;
            } else {
                // Not in a browser?  Use the first URL's scheme instead.
                second.scheme = first.scheme;
            }
        }

        // If the second URL is absolute, use it for the scheme, authority, and path.
        var baseUri = first;
        if (second.isAbsolute()) {
            baseUri = second;
            if (second.scheme === 'data') {
                return second.toString();
            }
        }

        var url = '';
        if (defined(baseUri.scheme)) {
            url += baseUri.scheme + ':';
        }
        if (defined(baseUri.authority)) {
            url += '//' + baseUri.authority;

            if (baseUri.path !== '' && baseUri.path !== '/') {
                url = url.replace(/\/?$/, '/');
                baseUri.path = baseUri.path.replace(/^\/?/g, '');
            }
        }

        // Combine the paths (only if second is relative).
        if (baseUri === first) {
            if (appendSlash) {
                url += first.path.replace(/\/?$/, '/') + second.path.replace(/^\/?/g, '');
            } else {
                url += first.path + second.path;
            }
        } else {
            url += second.path;
        }

        // Combine the queries and fragments.
        var hasFirstQuery = defined(first.query);
        var hasSecondQuery = defined(second.query);
        if (hasFirstQuery && hasSecondQuery) {
            url += '?' + first.query + '&' + second.query;
        } else if (hasFirstQuery && !hasSecondQuery) {
            url += '?' + first.query;
        } else if (!hasFirstQuery && hasSecondQuery) {
            url += '?' + second.query;
        }

        var hasSecondFragment = defined(second.fragment);
        if (defined(first.fragment) && !hasSecondFragment) {
            url += '#' + first.fragment;
        } else if (hasSecondFragment) {
            url += '#' + second.fragment;
        }

        return url;
    }

    return joinUrls;
});

/*global define*/
define('Core/buildModuleUrl',[
        '../ThirdParty/Uri',
        './defined',
        './DeveloperError',
        './getAbsoluteUri',
        './joinUrls',
        'require'
    ], function(
        Uri,
        defined,
        DeveloperError,
        getAbsoluteUri,
        joinUrls,
        require) {
    'use strict';
    /*global CESIUM_BASE_URL*/

    var cesiumScriptRegex = /((?:.*\/)|^)cesium[\w-]*\.js(?:\W|$)/i;
    function getBaseUrlFromCesiumScript() {
        var scripts = document.getElementsByTagName('script');
        for ( var i = 0, len = scripts.length; i < len; ++i) {
            var src = scripts[i].getAttribute('src');
            var result = cesiumScriptRegex.exec(src);
            if (result !== null) {
                return result[1];
            }
        }
        return undefined;
    }

    var baseUrl;
    function getCesiumBaseUrl() {
        if (defined(baseUrl)) {
            return baseUrl;
        }

        var baseUrlString;
        if (typeof CESIUM_BASE_URL !== 'undefined') {
            baseUrlString = CESIUM_BASE_URL;
        } else {
            baseUrlString = getBaseUrlFromCesiumScript();
        }

                if (!defined(baseUrlString)) {
            throw new DeveloperError('Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.');
        }
        
        baseUrl = new Uri(getAbsoluteUri(baseUrlString));

        return baseUrl;
    }

    function buildModuleUrlFromRequireToUrl(moduleID) {
        //moduleID will be non-relative, so require it relative to this module, in Core.
        return require.toUrl('../' + moduleID);
    }

    function buildModuleUrlFromBaseUrl(moduleID) {
        return joinUrls(getCesiumBaseUrl(), moduleID);
    }

    var implementation;
    var a;

    /**
     * Given a non-relative moduleID, returns an absolute URL to the file represented by that module ID,
     * using, in order of preference, require.toUrl, the value of a global CESIUM_BASE_URL, or
     * the base URL of the Cesium.js script.
     *
     * @private
     */
    function buildModuleUrl(moduleID) {
        if (!defined(implementation)) {
            //select implementation
            if (defined(require.toUrl)) {
                implementation = buildModuleUrlFromRequireToUrl;
            } else {
                implementation = buildModuleUrlFromBaseUrl;
            }
        }

        if (!defined(a)) {
            a = document.createElement('a');
        }

        var url = implementation(moduleID);

        a.href = url;
        a.href = a.href; // IE only absolutizes href on get, not set

        return a.href;
    }

    // exposed for testing
    buildModuleUrl._cesiumScriptRegex = cesiumScriptRegex;

    /**
     * Sets the base URL for resolving modules.
     * @param {String} value The new base URL.
     */
    buildModuleUrl.setBaseUrl = function(value) {
        baseUrl = new Uri(value).resolve(new Uri(document.location.href));
    };

    return buildModuleUrl;
});

/*global define*/
define('Core/Iau2006XysSample',[],function() {
    'use strict';

    /**
     * An IAU 2006 XYS value sampled at a particular time.
     *
     * @alias Iau2006XysSample
     * @constructor
     *
     * @param {Number} x The X value.
     * @param {Number} y The Y value.
     * @param {Number} s The S value.
     *
     * @private
     */
    function Iau2006XysSample(x, y, s) {
        /**
         * The X value.
         * @type {Number}
         */
        this.x = x;

        /**
         * The Y value.
         * @type {Number}
         */
        this.y = y;

        /**
         * The S value.
         * @type {Number}
         */
        this.s = s;
    }

    return Iau2006XysSample;
});

/*global define*/
define('Core/Iau2006XysData',[
        '../ThirdParty/when',
        './buildModuleUrl',
        './defaultValue',
        './defined',
        './Iau2006XysSample',
        './JulianDate',
        './loadJson',
        './RequestScheduler',
        './TimeStandard'
    ], function(
        when,
        buildModuleUrl,
        defaultValue,
        defined,
        Iau2006XysSample,
        JulianDate,
        loadJson,
        RequestScheduler,
        TimeStandard) {
    'use strict';

    /**
     * A set of IAU2006 XYS data that is used to evaluate the transformation between the International
     * Celestial Reference Frame (ICRF) and the International Terrestrial Reference Frame (ITRF).
     *
     * @alias Iau2006XysData
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {String} [options.xysFileUrlTemplate='Assets/IAU2006_XYS/IAU2006_XYS_{0}.json'] A template URL for obtaining the XYS data.  In the template,
     *                 `{0}` will be replaced with the file index.
     * @param {Number} [options.interpolationOrder=9] The order of interpolation to perform on the XYS data.
     * @param {Number} [options.sampleZeroJulianEphemerisDate=2442396.5] The Julian ephemeris date (JED) of the
     *                 first XYS sample.
     * @param {Number} [options.stepSizeDays=1.0] The step size, in days, between successive XYS samples.
     * @param {Number} [options.samplesPerXysFile=1000] The number of samples in each XYS file.
     * @param {Number} [options.totalSamples=27426] The total number of samples in all XYS files.
     *
     * @private
     */
    function Iau2006XysData(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._xysFileUrlTemplate = options.xysFileUrlTemplate;
        this._interpolationOrder = defaultValue(options.interpolationOrder, 9);
        this._sampleZeroJulianEphemerisDate = defaultValue(options.sampleZeroJulianEphemerisDate, 2442396.5);
        this._sampleZeroDateTT = new JulianDate(this._sampleZeroJulianEphemerisDate, 0.0, TimeStandard.TAI);
        this._stepSizeDays = defaultValue(options.stepSizeDays, 1.0);
        this._samplesPerXysFile = defaultValue(options.samplesPerXysFile, 1000);
        this._totalSamples = defaultValue(options.totalSamples, 27426);
        this._samples = new Array(this._totalSamples * 3);
        this._chunkDownloadsInProgress = [];

        var order = this._interpolationOrder;

        // Compute denominators and X values for interpolation.
        var denom = this._denominators = new Array(order + 1);
        var xTable = this._xTable = new Array(order + 1);

        var stepN = Math.pow(this._stepSizeDays, order);

        for ( var i = 0; i <= order; ++i) {
            denom[i] = stepN;
            xTable[i] = i * this._stepSizeDays;

            for ( var j = 0; j <= order; ++j) {
                if (j !== i) {
                    denom[i] *= (i - j);
                }
            }

            denom[i] = 1.0 / denom[i];
        }

        // Allocate scratch arrays for interpolation.
        this._work = new Array(order + 1);
        this._coef = new Array(order + 1);
    }

    var julianDateScratch = new JulianDate(0, 0.0, TimeStandard.TAI);

    function getDaysSinceEpoch(xys, dayTT, secondTT) {
        var dateTT = julianDateScratch;
        dateTT.dayNumber = dayTT;
        dateTT.secondsOfDay = secondTT;
        return JulianDate.daysDifference(dateTT, xys._sampleZeroDateTT);
    }

    /**
     * Preloads XYS data for a specified date range.
     *
     * @param {Number} startDayTT The Julian day number of the beginning of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} startSecondTT The seconds past noon of the beginning of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} stopDayTT The Julian day number of the end of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} stopSecondTT The seconds past noon of the end of the interval to preload, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @returns {Promise.<undefined>} A promise that, when resolved, indicates that the requested interval has been
     *                    preloaded.
     */
    Iau2006XysData.prototype.preload = function(startDayTT, startSecondTT, stopDayTT, stopSecondTT) {
        var startDaysSinceEpoch = getDaysSinceEpoch(this, startDayTT, startSecondTT);
        var stopDaysSinceEpoch = getDaysSinceEpoch(this, stopDayTT, stopSecondTT);

        var startIndex = (startDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0;
        if (startIndex < 0) {
            startIndex = 0;
        }

        var stopIndex = (stopDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0 + this._interpolationOrder;
        if (stopIndex >= this._totalSamples) {
            stopIndex = this._totalSamples - 1;
        }

        var startChunk = (startIndex / this._samplesPerXysFile) | 0;
        var stopChunk = (stopIndex / this._samplesPerXysFile) | 0;

        var promises = [];
        for ( var i = startChunk; i <= stopChunk; ++i) {
            promises.push(requestXysChunk(this, i));
        }

        return when.all(promises);
    };

    /**
     * Computes the XYS values for a given date by interpolating.  If the required data is not yet downloaded,
     * this method will return undefined.
     *
     * @param {Number} dayTT The Julian day number for which to compute the XYS value, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Number} secondTT The seconds past noon of the date for which to compute the XYS value, expressed in
     *                 the Terrestrial Time (TT) time standard.
     * @param {Iau2006XysSample} [result] The instance to which to copy the interpolated result.  If this parameter
     *                           is undefined, a new instance is allocated and returned.
     * @returns {Iau2006XysSample} The interpolated XYS values, or undefined if the required data for this
     *                             computation has not yet been downloaded.
     *
     * @see Iau2006XysData#preload
     */
    Iau2006XysData.prototype.computeXysRadians = function(dayTT, secondTT, result) {
        var daysSinceEpoch = getDaysSinceEpoch(this, dayTT, secondTT);
        if (daysSinceEpoch < 0.0) {
            // Can't evaluate prior to the epoch of the data.
            return undefined;
        }

        var centerIndex = (daysSinceEpoch / this._stepSizeDays) | 0;
        if (centerIndex >= this._totalSamples) {
            // Can't evaluate after the last sample in the data.
            return undefined;
        }

        var degree = this._interpolationOrder;

        var firstIndex = centerIndex - ((degree / 2) | 0);
        if (firstIndex < 0) {
            firstIndex = 0;
        }
        var lastIndex = firstIndex + degree;
        if (lastIndex >= this._totalSamples) {
            lastIndex = this._totalSamples - 1;
            firstIndex = lastIndex - degree;
            if (firstIndex < 0) {
                firstIndex = 0;
            }
        }

        // Are all the samples we need present?
        // We can assume so if the first and last are present
        var isDataMissing = false;
        var samples = this._samples;
        if (!defined(samples[firstIndex * 3])) {
            requestXysChunk(this, (firstIndex / this._samplesPerXysFile) | 0);
            isDataMissing = true;
        }

        if (!defined(samples[lastIndex * 3])) {
            requestXysChunk(this, (lastIndex / this._samplesPerXysFile) | 0);
            isDataMissing = true;
        }

        if (isDataMissing) {
            return undefined;
        }

        if (!defined(result)) {
            result = new Iau2006XysSample(0.0, 0.0, 0.0);
        } else {
            result.x = 0.0;
            result.y = 0.0;
            result.s = 0.0;
        }

        var x = daysSinceEpoch - firstIndex * this._stepSizeDays;

        var work = this._work;
        var denom = this._denominators;
        var coef = this._coef;
        var xTable = this._xTable;

        var i, j;
        for (i = 0; i <= degree; ++i) {
            work[i] = x - xTable[i];
        }

        for (i = 0; i <= degree; ++i) {
            coef[i] = 1.0;

            for (j = 0; j <= degree; ++j) {
                if (j !== i) {
                    coef[i] *= work[j];
                }
            }

            coef[i] *= denom[i];

            var sampleIndex = (firstIndex + i) * 3;
            result.x += coef[i] * samples[sampleIndex++];
            result.y += coef[i] * samples[sampleIndex++];
            result.s += coef[i] * samples[sampleIndex];
        }

        return result;
    };

    function requestXysChunk(xysData, chunkIndex) {
        if (xysData._chunkDownloadsInProgress[chunkIndex]) {
            // Chunk has already been requested.
            return xysData._chunkDownloadsInProgress[chunkIndex];
        }

        var deferred = when.defer();

        xysData._chunkDownloadsInProgress[chunkIndex] = deferred;

        var chunkUrl;
        var xysFileUrlTemplate = xysData._xysFileUrlTemplate;
        if (defined(xysFileUrlTemplate)) {
            chunkUrl = xysFileUrlTemplate.replace('{0}', chunkIndex);
        } else {
            chunkUrl = buildModuleUrl('Assets/IAU2006_XYS/IAU2006_XYS_' + chunkIndex + '.json');
        }

        when(RequestScheduler.request(chunkUrl, loadJson), function(chunk) {
            xysData._chunkDownloadsInProgress[chunkIndex] = false;

            var samples = xysData._samples;
            var newSamples = chunk.samples;
            var startIndex = chunkIndex * xysData._samplesPerXysFile * 3;

            for ( var i = 0, len = newSamples.length; i < len; ++i) {
                samples[startIndex + i] = newSamples[i];
            }

            deferred.resolve();
        });

        return deferred.promise;
    }

    return Iau2006XysData;
});

/*global define*/
define('Core/Fullscreen',[
        './defined',
        './defineProperties'
    ], function(
        defined,
        defineProperties) {
    'use strict';

    var _supportsFullscreen;
    var _names = {
        requestFullscreen : undefined,
        exitFullscreen : undefined,
        fullscreenEnabled : undefined,
        fullscreenElement : undefined,
        fullscreenchange : undefined,
        fullscreenerror : undefined
    };

    /**
     * Browser-independent functions for working with the standard fullscreen API.
     *
     * @exports Fullscreen
     *
     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
     */
    var Fullscreen = {};

    defineProperties(Fullscreen, {
        /**
         * The element that is currently fullscreen, if any.  To simply check if the
         * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
         * @memberof Fullscreen
         * @type {Object}
         * @readonly
         */
        element : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return document[_names.fullscreenElement];
            }
        },

        /**
         * The name of the event on the document that is fired when fullscreen is
         * entered or exited.  This event name is intended for use with addEventListener.
         * In your event handler, to determine if the browser is in fullscreen mode or not,
         * use {@link Fullscreen#fullscreen}.
         * @memberof Fullscreen
         * @type {String}
         * @readonly
         */
        changeEventName : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return _names.fullscreenchange;
            }
        },

        /**
         * The name of the event that is fired when a fullscreen error
         * occurs.  This event name is intended for use with addEventListener.
         * @memberof Fullscreen
         * @type {String}
         * @readonly
         */
        errorEventName : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return _names.fullscreenerror;
            }
        },

        /**
         * Determine whether the browser will allow an element to be made fullscreen, or not.
         * For example, by default, iframes cannot go fullscreen unless the containing page
         * adds an "allowfullscreen" attribute (or prefixed equivalent).
         * @memberof Fullscreen
         * @type {Boolean}
         * @readonly
         */
        enabled : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return document[_names.fullscreenEnabled];
            }
        },

        /**
         * Determines if the browser is currently in fullscreen mode.
         * @memberof Fullscreen
         * @type {Boolean}
         * @readonly
         */
        fullscreen : {
            get : function() {
                if (!Fullscreen.supportsFullscreen()) {
                    return undefined;
                }

                return Fullscreen.element !== null;
            }
        }
    });

    /**
     * Detects whether the browser supports the standard fullscreen API.
     *
     * @returns {Boolean} <code>true</code> if the browser supports the standard fullscreen API,
     * <code>false</code> otherwise.
     */
    Fullscreen.supportsFullscreen = function() {
        if (defined(_supportsFullscreen)) {
            return _supportsFullscreen;
        }

        _supportsFullscreen = false;

        var body = document.body;
        if (typeof body.requestFullscreen === 'function') {
            // go with the unprefixed, standard set of names
            _names.requestFullscreen = 'requestFullscreen';
            _names.exitFullscreen = 'exitFullscreen';
            _names.fullscreenEnabled = 'fullscreenEnabled';
            _names.fullscreenElement = 'fullscreenElement';
            _names.fullscreenchange = 'fullscreenchange';
            _names.fullscreenerror = 'fullscreenerror';
            _supportsFullscreen = true;
            return _supportsFullscreen;
        }

        //check for the correct combination of prefix plus the various names that browsers use
        var prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
        var name;
        for (var i = 0, len = prefixes.length; i < len; ++i) {
            var prefix = prefixes[i];

            // casing of Fullscreen differs across browsers
            name = prefix + 'RequestFullscreen';
            if (typeof body[name] === 'function') {
                _names.requestFullscreen = name;
                _supportsFullscreen = true;
            } else {
                name = prefix + 'RequestFullScreen';
                if (typeof body[name] === 'function') {
                    _names.requestFullscreen = name;
                    _supportsFullscreen = true;
                }
            }

            // disagreement about whether it's "exit" as per spec, or "cancel"
            name = prefix + 'ExitFullscreen';
            if (typeof document[name] === 'function') {
                _names.exitFullscreen = name;
            } else {
                name = prefix + 'CancelFullScreen';
                if (typeof document[name] === 'function') {
                    _names.exitFullscreen = name;
                }
            }

            // casing of Fullscreen differs across browsers
            name = prefix + 'FullscreenEnabled';
            if (document[name] !== undefined) {
                _names.fullscreenEnabled = name;
            } else {
                name = prefix + 'FullScreenEnabled';
                if (document[name] !== undefined) {
                    _names.fullscreenEnabled = name;
                }
            }

            // casing of Fullscreen differs across browsers
            name = prefix + 'FullscreenElement';
            if (document[name] !== undefined) {
                _names.fullscreenElement = name;
            } else {
                name = prefix + 'FullScreenElement';
                if (document[name] !== undefined) {
                    _names.fullscreenElement = name;
                }
            }

            // thankfully, event names are all lowercase per spec
            name = prefix + 'fullscreenchange';
            // event names do not have 'on' in the front, but the property on the document does
            if (document['on' + name] !== undefined) {
                //except on IE
                if (prefix === 'ms') {
                    name = 'MSFullscreenChange';
                }
                _names.fullscreenchange = name;
            }

            name = prefix + 'fullscreenerror';
            if (document['on' + name] !== undefined) {
                //except on IE
                if (prefix === 'ms') {
                    name = 'MSFullscreenError';
                }
                _names.fullscreenerror = name;
            }
        }

        return _supportsFullscreen;
    };

    /**
     * Asynchronously requests the browser to enter fullscreen mode on the given element.
     * If fullscreen mode is not supported by the browser, does nothing.
     *
     * @param {Object} element The HTML element which will be placed into fullscreen mode.
     * @param {HMDVRDevice} [vrDevice] The VR device.
     *
     * @example
     * // Put the entire page into fullscreen.
     * Cesium.Fullscreen.requestFullscreen(document.body)
     *
     * // Place only the Cesium canvas into fullscreen.
     * Cesium.Fullscreen.requestFullscreen(scene.canvas)
     */
    Fullscreen.requestFullscreen = function(element, vrDevice) {
        if (!Fullscreen.supportsFullscreen()) {
            return;
        }

        element[_names.requestFullscreen]({ vrDisplay: vrDevice });
    };

    /**
     * Asynchronously exits fullscreen mode.  If the browser is not currently
     * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
     */
    Fullscreen.exitFullscreen = function() {
        if (!Fullscreen.supportsFullscreen()) {
            return;
        }

        document[_names.exitFullscreen]();
    };

    return Fullscreen;
});

/*global define*/
define('Core/FeatureDetection',[
        './defaultValue',
        './defined',
        './Fullscreen'
    ], function(
        defaultValue,
        defined,
        Fullscreen) {
    'use strict';

    var theNavigator;
    if (typeof navigator !== 'undefined') {
        theNavigator = navigator;
    } else {
        theNavigator = {};
    }

    function extractVersion(versionString) {
        var parts = versionString.split('.');
        for (var i = 0, len = parts.length; i < len; ++i) {
            parts[i] = parseInt(parts[i], 10);
        }
        return parts;
    }

    var isChromeResult;
    var chromeVersionResult;
    function isChrome() {
        if (!defined(isChromeResult)) {
            isChromeResult = false;
            // Edge contains Chrome in the user agent too
            if (!isEdge()) {
                var fields = (/ Chrome\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isChromeResult = true;
                    chromeVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isChromeResult;
    }

    function chromeVersion() {
        return isChrome() && chromeVersionResult;
    }

    var isSafariResult;
    var safariVersionResult;
    function isSafari() {
        if (!defined(isSafariResult)) {
            isSafariResult = false;

            // Chrome and Edge contain Safari in the user agent too
            if (!isChrome() && !isEdge() && (/ Safari\/[\.0-9]+/).test(theNavigator.userAgent)) {
                var fields = (/ Version\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isSafariResult = true;
                    safariVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isSafariResult;
    }

    function safariVersion() {
        return isSafari() && safariVersionResult;
    }

    var isWebkitResult;
    var webkitVersionResult;
    function isWebkit() {
        if (!defined(isWebkitResult)) {
            isWebkitResult = false;

            var fields = (/ AppleWebKit\/([\.0-9]+)(\+?)/).exec(theNavigator.userAgent);
            if (fields !== null) {
                isWebkitResult = true;
                webkitVersionResult = extractVersion(fields[1]);
                webkitVersionResult.isNightly = !!fields[2];
            }
        }

        return isWebkitResult;
    }

    function webkitVersion() {
        return isWebkit() && webkitVersionResult;
    }

    var isInternetExplorerResult;
    var internetExplorerVersionResult;
    function isInternetExplorer() {
        if (!defined(isInternetExplorerResult)) {
            isInternetExplorerResult = false;

            var fields;
            if (theNavigator.appName === 'Microsoft Internet Explorer') {
                fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isInternetExplorerResult = true;
                    internetExplorerVersionResult = extractVersion(fields[1]);
                }
            } else if (theNavigator.appName === 'Netscape') {
                fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isInternetExplorerResult = true;
                    internetExplorerVersionResult = extractVersion(fields[1]);
                }
            }
        }
        return isInternetExplorerResult;
    }

    function internetExplorerVersion() {
        return isInternetExplorer() && internetExplorerVersionResult;
    }

    var isEdgeResult;
    var edgeVersionResult;
    function isEdge() {
        if (!defined(isEdgeResult)) {
            isEdgeResult = false;
            var fields = (/ Edge\/([\.0-9]+)/).exec(theNavigator.userAgent);
            if (fields !== null) {
                isEdgeResult = true;
                edgeVersionResult = extractVersion(fields[1]);
            }
        }
        return isEdgeResult;
    }

    function edgeVersion() {
        return isEdge() && edgeVersionResult;
    }

    var isFirefoxResult;
    var firefoxVersionResult;
    function isFirefox() {
        if (!defined(isFirefoxResult)) {
            isFirefoxResult = false;

            var fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
            if (fields !== null) {
                isFirefoxResult = true;
                firefoxVersionResult = extractVersion(fields[1]);
            }
        }
        return isFirefoxResult;
    }

    var isWindowsResult;
    function isWindows() {
        if (!defined(isWindowsResult)) {
            isWindowsResult = /Windows/i.test(theNavigator.appVersion);
        }
        return isWindowsResult;
    }


    function firefoxVersion() {
        return isFirefox() && firefoxVersionResult;
    }

    var hasPointerEvents;
    function supportsPointerEvents() {
        if (!defined(hasPointerEvents)) {
            //While navigator.pointerEnabled is deprecated in the W3C specification
            //we still need to use it if it exists in order to support browsers
            //that rely on it, such as the Windows WebBrowser control which defines
            //PointerEvent but sets navigator.pointerEnabled to false.
            hasPointerEvents = typeof PointerEvent !== 'undefined' && (!defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
        }
        return hasPointerEvents;
    }

    var imageRenderingValueResult;
    var supportsImageRenderingPixelatedResult;
    function supportsImageRenderingPixelated() {
        if (!defined(supportsImageRenderingPixelatedResult)) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('style',
                                'image-rendering: -moz-crisp-edges;' +
                                'image-rendering: pixelated;');
            //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
            var tmp = canvas.style.imageRendering;
            supportsImageRenderingPixelatedResult = defined(tmp) && tmp !== '';
            if (supportsImageRenderingPixelatedResult) {
                imageRenderingValueResult = tmp;
            }
        }
        return supportsImageRenderingPixelatedResult;
    }

    function imageRenderingValue() {
        return supportsImageRenderingPixelated() ? imageRenderingValueResult : undefined;
    }

    /**
     * A set of functions to detect whether the current browser supports
     * various features.
     *
     * @exports FeatureDetection
     */
    var FeatureDetection = {
        isChrome : isChrome,
        chromeVersion : chromeVersion,
        isSafari : isSafari,
        safariVersion : safariVersion,
        isWebkit : isWebkit,
        webkitVersion : webkitVersion,
        isInternetExplorer : isInternetExplorer,
        internetExplorerVersion : internetExplorerVersion,
        isEdge : isEdge,
        edgeVersion : edgeVersion,
        isFirefox : isFirefox,
        firefoxVersion : firefoxVersion,
        isWindows : isWindows,
        hardwareConcurrency : defaultValue(theNavigator.hardwareConcurrency, 3),
        supportsPointerEvents : supportsPointerEvents,
        supportsImageRenderingPixelated: supportsImageRenderingPixelated,
        imageRenderingValue: imageRenderingValue
    };

    /**
     * Detects whether the current browser supports the full screen standard.
     *
     * @returns {Boolean} true if the browser supports the full screen standard, false if not.
     *
     * @see Fullscreen
     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
     */
    FeatureDetection.supportsFullscreen = function() {
        return Fullscreen.supportsFullscreen();
    };

    /**
     * Detects whether the current browser supports typed arrays.
     *
     * @returns {Boolean} true if the browser supports typed arrays, false if not.
     *
     * @see {@link http://www.khronos.org/registry/typedarray/specs/latest/|Typed Array Specification}
     */
    FeatureDetection.supportsTypedArrays = function() {
        return typeof ArrayBuffer !== 'undefined';
    };

    /**
     * Detects whether the current browser supports Web Workers.
     *
     * @returns {Boolean} true if the browsers supports Web Workers, false if not.
     *
     * @see {@link http://www.w3.org/TR/workers/}
     */
    FeatureDetection.supportsWebWorkers = function() {
        return typeof Worker !== 'undefined';
    };

    return FeatureDetection;
});

/*global define*/
define('Core/HeadingPitchRoll',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './Math'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        CesiumMath) {
    "use strict";

    /**
     * A rotation expressed as a heading, pitch, and roll. Heading is the rotation about the
     * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
     * the positive x axis.
     * @alias HeadingPitchRoll
     * @constructor
     *
     * @param {Number} [heading=0.0] The heading component in radians.
     * @param {Number} [pitch=0.0] The pitch component in radians.
     * @param {Number} [roll=0.0] The roll component in radians.
     */
    function HeadingPitchRoll(heading, pitch, roll) {
        this.heading = defaultValue(heading, 0.0);
        this.pitch = defaultValue(pitch, 0.0);
        this.roll = defaultValue(roll, 0.0);
    }

    /**
     * Computes the heading, pitch and roll from a quaternion (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
     *
     * @param {Quaternion} quaternion The quaternion from which to retrieve heading, pitch, and roll, all expressed in radians.
     * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
     * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
     */
    HeadingPitchRoll.fromQuaternion = function(quaternion, result) {
                if (!defined(quaternion)) {
            throw new DeveloperError('quaternion is required');
        }
                if (!defined(result)) {
            result = new HeadingPitchRoll();
        }
        var test = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
        var denominatorRoll = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
        var numeratorRoll = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
        var denominatorHeading = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
        var numeratorHeading = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
        result.heading = -Math.atan2(numeratorHeading, denominatorHeading);
        result.roll = Math.atan2(numeratorRoll, denominatorRoll);
        result.pitch = -Math.asin(test);
        return result;
    };

    /**
     * Returns a new HeadingPitchRoll instance from angles given in degrees.
     *
     * @param {Number} heading the heading in degrees
     * @param {Number} pitch the pitch in degrees
     * @param {Number} roll the heading in degrees
     * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
     * @returns {HeadingPitchRoll} A new HeadingPitchRoll instance
     */
    HeadingPitchRoll.fromDegrees = function(heading, pitch, roll, result) {
                if (!defined(heading)) {
            throw new DeveloperError('heading is required');
        }
        if (!defined(pitch)) {
            throw new DeveloperError('pitch is required');
        }
        if (!defined(roll)) {
            throw new DeveloperError('roll is required');
        }
                if (!defined(result)) {
            result = new HeadingPitchRoll();
        }
        result.heading = heading * CesiumMath.RADIANS_PER_DEGREE;
        result.pitch = pitch * CesiumMath.RADIANS_PER_DEGREE;
        result.roll = roll * CesiumMath.RADIANS_PER_DEGREE;
        return result;
    };

    /**
     * Duplicates a HeadingPitchRoll instance.
     *
     * @param {HeadingPitchRoll} headingPitchRoll The HeadingPitchRoll to duplicate.
     * @param {HeadingPitchRoll} [result] The object onto which to store the result.
     * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided. (Returns undefined if headingPitchRoll is undefined)
     */
    HeadingPitchRoll.clone = function(headingPitchRoll, result) {
        if (!defined(headingPitchRoll)) {
            return undefined;
        }
        if (!defined(result)) {
            return new HeadingPitchRoll(headingPitchRoll.heading, headingPitchRoll.pitch, headingPitchRoll.roll);
        }
        result.heading = headingPitchRoll.heading;
        result.pitch = headingPitchRoll.pitch;
        result.roll = headingPitchRoll.roll;
        return result;
    };

    /**
     * Compares the provided HeadingPitchRolls componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
     * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    HeadingPitchRoll.equals = function(left, right) {
        return (left === right) ||
            ((defined(left)) &&
                (defined(right)) &&
                (left.heading === right.heading) &&
                (left.pitch === right.pitch) &&
                (left.roll === right.roll));
    };

    /**
     * Compares the provided HeadingPitchRolls componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
     * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    HeadingPitchRoll.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
        return (left === right) ||
            (defined(left) &&
                defined(right) &&
                CesiumMath.equalsEpsilon(left.heading, right.heading, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.pitch, right.pitch, relativeEpsilon, absoluteEpsilon) &&
                CesiumMath.equalsEpsilon(left.roll, right.roll, relativeEpsilon, absoluteEpsilon));
    };

    /**
     * Duplicates this HeadingPitchRoll instance.
     *
     * @param {HeadingPitchRoll} [result] The object onto which to store the result.
     * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
     */
    HeadingPitchRoll.prototype.clone = function(result) {
        return HeadingPitchRoll.clone(this, result);
    };

    /**
     * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    HeadingPitchRoll.prototype.equals = function(right) {
        return HeadingPitchRoll.equals(this, right);
    };

    /**
     * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
     * <code>true</code> if they pass an absolute or relative tolerance test,
     * <code>false</code> otherwise.
     *
     * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    HeadingPitchRoll.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
        return HeadingPitchRoll.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
    };

    /**
     * Creates a string representing this HeadingPitchRoll in the format '(heading, pitch, roll)' in radians.
     *
     * @returns {String} A string representing the provided HeadingPitchRoll in the format '(heading, pitch, roll)'.
     */
    HeadingPitchRoll.prototype.toString = function() {
        return '(' + this.heading + ', ' + this.pitch + ', ' + this.roll + ')';
    };

    return HeadingPitchRoll;
});

/*global define*/
define('Core/Quaternion',[
        './Cartesian3',
        './Check',
        './defaultValue',
        './defined',
        './deprecationWarning',
        './FeatureDetection',
        './freezeObject',
        './HeadingPitchRoll',
        './Math',
        './Matrix3'
    ], function(
        Cartesian3,
        Check,
        defaultValue,
        defined,
        deprecationWarning,
        FeatureDetection,
        freezeObject,
        HeadingPitchRoll,
        CesiumMath,
        Matrix3) {
    'use strict';

    /**
     * A set of 4-dimensional coordinates used to represent rotation in 3-dimensional space.
     * @alias Quaternion
     * @constructor
     *
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     * @param {Number} [z=0.0] The Z component.
     * @param {Number} [w=0.0] The W component.
     *
     * @see PackableForInterpolation
     */
    function Quaternion(x, y, z, w) {
        /**
         * The X component.
         * @type {Number}
         * @default 0.0
         */
        this.x = defaultValue(x, 0.0);

        /**
         * The Y component.
         * @type {Number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);

        /**
         * The Z component.
         * @type {Number}
         * @default 0.0
         */
        this.z = defaultValue(z, 0.0);

        /**
         * The W component.
         * @type {Number}
         * @default 0.0
         */
        this.w = defaultValue(w, 0.0);
    }

    var fromAxisAngleScratch = new Cartesian3();

    /**
     * Computes a quaternion representing a rotation around an axis.
     *
     * @param {Cartesian3} axis The axis of rotation.
     * @param {Number} angle The angle in radians to rotate around the axis.
     * @param {Quaternion} [result] The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
     */
    Quaternion.fromAxisAngle = function(axis, angle, result) {
                Check.typeOf.object('axis', axis);
        Check.typeOf.number('angle', angle);
        
        var halfAngle = angle / 2.0;
        var s = Math.sin(halfAngle);
        fromAxisAngleScratch = Cartesian3.normalize(axis, fromAxisAngleScratch);

        var x = fromAxisAngleScratch.x * s;
        var y = fromAxisAngleScratch.y * s;
        var z = fromAxisAngleScratch.z * s;
        var w = Math.cos(halfAngle);
        if (!defined(result)) {
            return new Quaternion(x, y, z, w);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    var fromRotationMatrixNext = [1, 2, 0];
    var fromRotationMatrixQuat = new Array(3);
    /**
     * Computes a Quaternion from the provided Matrix3 instance.
     *
     * @param {Matrix3} matrix The rotation matrix.
     * @param {Quaternion} [result] The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
     *
     * @see Matrix3.fromQuaternion
     */
    Quaternion.fromRotationMatrix = function(matrix, result) {
                Check.typeOf.object('matrix', matrix);
        
        var root;
        var x;
        var y;
        var z;
        var w;

        var m00 = matrix[Matrix3.COLUMN0ROW0];
        var m11 = matrix[Matrix3.COLUMN1ROW1];
        var m22 = matrix[Matrix3.COLUMN2ROW2];
        var trace = m00 + m11 + m22;

        if (trace > 0.0) {
            // |w| > 1/2, may as well choose w > 1/2
            root = Math.sqrt(trace + 1.0); // 2w
            w = 0.5 * root;
            root = 0.5 / root; // 1/(4w)

            x = (matrix[Matrix3.COLUMN1ROW2] - matrix[Matrix3.COLUMN2ROW1]) * root;
            y = (matrix[Matrix3.COLUMN2ROW0] - matrix[Matrix3.COLUMN0ROW2]) * root;
            z = (matrix[Matrix3.COLUMN0ROW1] - matrix[Matrix3.COLUMN1ROW0]) * root;
        } else {
            // |w| <= 1/2
            var next = fromRotationMatrixNext;

            var i = 0;
            if (m11 > m00) {
                i = 1;
            }
            if (m22 > m00 && m22 > m11) {
                i = 2;
            }
            var j = next[i];
            var k = next[j];

            root = Math.sqrt(matrix[Matrix3.getElementIndex(i, i)] - matrix[Matrix3.getElementIndex(j, j)] - matrix[Matrix3.getElementIndex(k, k)] + 1.0);

            var quat = fromRotationMatrixQuat;
            quat[i] = 0.5 * root;
            root = 0.5 / root;
            w = (matrix[Matrix3.getElementIndex(k, j)] - matrix[Matrix3.getElementIndex(j, k)]) * root;
            quat[j] = (matrix[Matrix3.getElementIndex(j, i)] + matrix[Matrix3.getElementIndex(i, j)]) * root;
            quat[k] = (matrix[Matrix3.getElementIndex(k, i)] + matrix[Matrix3.getElementIndex(i, k)]) * root;

            x = -quat[0];
            y = -quat[1];
            z = -quat[2];
        }

        if (!defined(result)) {
            return new Quaternion(x, y, z, w);
        }
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    var scratchHPRQuaternion = new Quaternion();
    var scratchHeadingQuaternion = new Quaternion();
    var scratchPitchQuaternion = new Quaternion();
    var scratchRollQuaternion = new Quaternion();

    /**
     * Computes a rotation from the given heading, pitch and roll angles. Heading is the rotation about the
     * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
     * the positive x axis.
     *
     * @param {Number} heading The heading angle in radians.
     * @param {Number} pitch The pitch angle in radians.
     * @param {Number} roll The roll angle in radians.
     * @param {Quaternion} [result] The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
     */
    Quaternion.fromHeadingPitchRoll = function(headingOrHeadingPitchRoll, pitchOrResult, roll, result) {
                if (headingOrHeadingPitchRoll instanceof HeadingPitchRoll) {
            Check.typeOf.object('headingPitchRoll', headingOrHeadingPitchRoll);
        } else {
            Check.typeOf.number('heading', headingOrHeadingPitchRoll);
            Check.typeOf.number('pitch', pitchOrResult);
            Check.typeOf.number('roll', roll);
        }
                var hpr;
        if (headingOrHeadingPitchRoll instanceof HeadingPitchRoll) {
            hpr = headingOrHeadingPitchRoll;
            result = pitchOrResult;
        } else {
            deprecationWarning('Quaternion.fromHeadingPitchRoll(heading, pitch, roll,result)', 'The method was deprecated in Cesium 1.32 and will be removed in version 1.33. ' + 'Use Quaternion.fromHeadingPitchRoll(hpr,result) where hpr is a HeadingPitchRoll');
            hpr = new HeadingPitchRoll(headingOrHeadingPitchRoll, pitchOrResult, roll);
        }
        scratchRollQuaternion = Quaternion.fromAxisAngle(Cartesian3.UNIT_X, hpr.roll, scratchHPRQuaternion);
        scratchPitchQuaternion = Quaternion.fromAxisAngle(Cartesian3.UNIT_Y, -hpr.pitch, result);
        result = Quaternion.multiply(scratchPitchQuaternion, scratchRollQuaternion, scratchPitchQuaternion);
        scratchHeadingQuaternion = Quaternion.fromAxisAngle(Cartesian3.UNIT_Z, -hpr.heading, scratchHPRQuaternion);
        return Quaternion.multiply(scratchHeadingQuaternion, result, result);
    };

    var sampledQuaternionAxis = new Cartesian3();
    var sampledQuaternionRotation = new Cartesian3();
    var sampledQuaternionTempQuaternion = new Quaternion();
    var sampledQuaternionQuaternion0 = new Quaternion();
    var sampledQuaternionQuaternion0Conjugate = new Quaternion();

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Quaternion.packedLength = 4;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Quaternion} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Quaternion.pack = function(value, array, startingIndex) {
                Check.typeOf.object('value', value);
        Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        array[startingIndex++] = value.x;
        array[startingIndex++] = value.y;
        array[startingIndex++] = value.z;
        array[startingIndex] = value.w;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Quaternion} [result] The object into which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
     */
    Quaternion.unpack = function(array, startingIndex, result) {
                Check.defined('array', array);
        
        startingIndex = defaultValue(startingIndex, 0);

        if (!defined(result)) {
            result = new Quaternion();
        }
        result.x = array[startingIndex];
        result.y = array[startingIndex + 1];
        result.z = array[startingIndex + 2];
        result.w = array[startingIndex + 3];
        return result;
    };

    /**
     * The number of elements used to store the object into an array in its interpolatable form.
     * @type {Number}
     */
    Quaternion.packedInterpolationLength = 3;

    /**
     * Converts a packed array into a form suitable for interpolation.
     *
     * @param {Number[]} packedArray The packed array.
     * @param {Number} [startingIndex=0] The index of the first element to be converted.
     * @param {Number} [lastIndex=packedArray.length] The index of the last element to be converted.
     * @param {Number[]} result The object into which to store the result.
     */
    Quaternion.convertPackedArrayForInterpolation = function(packedArray, startingIndex, lastIndex, result) {
        Quaternion.unpack(packedArray, lastIndex * 4, sampledQuaternionQuaternion0Conjugate);
        Quaternion.conjugate(sampledQuaternionQuaternion0Conjugate, sampledQuaternionQuaternion0Conjugate);

        for (var i = 0, len = lastIndex - startingIndex + 1; i < len; i++) {
            var offset = i * 3;
            Quaternion.unpack(packedArray, (startingIndex + i) * 4, sampledQuaternionTempQuaternion);

            Quaternion.multiply(sampledQuaternionTempQuaternion, sampledQuaternionQuaternion0Conjugate, sampledQuaternionTempQuaternion);

            if (sampledQuaternionTempQuaternion.w < 0) {
                Quaternion.negate(sampledQuaternionTempQuaternion, sampledQuaternionTempQuaternion);
            }

            Quaternion.computeAxis(sampledQuaternionTempQuaternion, sampledQuaternionAxis);
            var angle = Quaternion.computeAngle(sampledQuaternionTempQuaternion);
            result[offset] = sampledQuaternionAxis.x * angle;
            result[offset + 1] = sampledQuaternionAxis.y * angle;
            result[offset + 2] = sampledQuaternionAxis.z * angle;
        }
    };

    /**
     * Retrieves an instance from a packed array converted with {@link convertPackedArrayForInterpolation}.
     *
     * @param {Number[]} array The array previously packed for interpolation.
     * @param {Number[]} sourceArray The original packed array.
     * @param {Number} [firstIndex=0] The firstIndex used to convert the array.
     * @param {Number} [lastIndex=packedArray.length] The lastIndex used to convert the array.
     * @param {Quaternion} [result] The object into which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
     */
    Quaternion.unpackInterpolationResult = function(array, sourceArray, firstIndex, lastIndex, result) {
        if (!defined(result)) {
            result = new Quaternion();
        }
        Cartesian3.fromArray(array, 0, sampledQuaternionRotation);
        var magnitude = Cartesian3.magnitude(sampledQuaternionRotation);

        Quaternion.unpack(sourceArray, lastIndex * 4, sampledQuaternionQuaternion0);

        if (magnitude === 0) {
            Quaternion.clone(Quaternion.IDENTITY, sampledQuaternionTempQuaternion);
        } else {
            Quaternion.fromAxisAngle(sampledQuaternionRotation, magnitude, sampledQuaternionTempQuaternion);
        }

        return Quaternion.multiply(sampledQuaternionTempQuaternion, sampledQuaternionQuaternion0, result);
    };

    /**
     * Duplicates a Quaternion instance.
     *
     * @param {Quaternion} quaternion The quaternion to duplicate.
     * @param {Quaternion} [result] The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided. (Returns undefined if quaternion is undefined)
     */
    Quaternion.clone = function(quaternion, result) {
        if (!defined(quaternion)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }

        result.x = quaternion.x;
        result.y = quaternion.y;
        result.z = quaternion.z;
        result.w = quaternion.w;
        return result;
    };

    /**
     * Computes the conjugate of the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to conjugate.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.conjugate = function(quaternion, result) {
                Check.typeOf.object('quaternion', quaternion);
        Check.typeOf.object('result', result);
        
        result.x = -quaternion.x;
        result.y = -quaternion.y;
        result.z = -quaternion.z;
        result.w = quaternion.w;
        return result;
    };

    /**
     * Computes magnitude squared for the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to conjugate.
     * @returns {Number} The magnitude squared.
     */
    Quaternion.magnitudeSquared = function(quaternion) {
                Check.typeOf.object('quaternion', quaternion);
        
        return quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w;
    };

    /**
     * Computes magnitude for the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to conjugate.
     * @returns {Number} The magnitude.
     */
    Quaternion.magnitude = function(quaternion) {
        return Math.sqrt(Quaternion.magnitudeSquared(quaternion));
    };

    /**
     * Computes the normalized form of the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to normalize.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.normalize = function(quaternion, result) {
                Check.typeOf.object('result', result);
        
        var inverseMagnitude = 1.0 / Quaternion.magnitude(quaternion);
        var x = quaternion.x * inverseMagnitude;
        var y = quaternion.y * inverseMagnitude;
        var z = quaternion.z * inverseMagnitude;
        var w = quaternion.w * inverseMagnitude;

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes the inverse of the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to normalize.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.inverse = function(quaternion, result) {
                Check.typeOf.object('result', result);
        
        var magnitudeSquared = Quaternion.magnitudeSquared(quaternion);
        result = Quaternion.conjugate(quaternion, result);
        return Quaternion.multiplyByScalar(result, 1.0 / magnitudeSquared, result);
    };

    /**
     * Computes the componentwise sum of two quaternions.
     *
     * @param {Quaternion} left The first quaternion.
     * @param {Quaternion} right The second quaternion.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.add = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        result.z = left.z + right.z;
        result.w = left.w + right.w;
        return result;
    };

    /**
     * Computes the componentwise difference of two quaternions.
     *
     * @param {Quaternion} left The first quaternion.
     * @param {Quaternion} right The second quaternion.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.subtract = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        result.x = left.x - right.x;
        result.y = left.y - right.y;
        result.z = left.z - right.z;
        result.w = left.w - right.w;
        return result;
    };

    /**
     * Negates the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to be negated.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.negate = function(quaternion, result) {
                Check.typeOf.object('quaternion', quaternion);
        Check.typeOf.object('result', result);
        
        result.x = -quaternion.x;
        result.y = -quaternion.y;
        result.z = -quaternion.z;
        result.w = -quaternion.w;
        return result;
    };

    /**
     * Computes the dot (scalar) product of two quaternions.
     *
     * @param {Quaternion} left The first quaternion.
     * @param {Quaternion} right The second quaternion.
     * @returns {Number} The dot product.
     */
    Quaternion.dot = function(left, right) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        
        return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
    };

    /**
     * Computes the product of two quaternions.
     *
     * @param {Quaternion} left The first quaternion.
     * @param {Quaternion} right The second quaternion.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.multiply = function(left, right, result) {
                Check.typeOf.object('left', left);
        Check.typeOf.object('right', right);
        Check.typeOf.object('result', result);
        
        var leftX = left.x;
        var leftY = left.y;
        var leftZ = left.z;
        var leftW = left.w;

        var rightX = right.x;
        var rightY = right.y;
        var rightZ = right.z;
        var rightW = right.w;

        var x = leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY;
        var y = leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX;
        var z = leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW;
        var w = leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ;

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Multiplies the provided quaternion componentwise by the provided scalar.
     *
     * @param {Quaternion} quaternion The quaternion to be scaled.
     * @param {Number} scalar The scalar to multiply with.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.multiplyByScalar = function(quaternion, scalar, result) {
                Check.typeOf.object('quaternion', quaternion);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = quaternion.x * scalar;
        result.y = quaternion.y * scalar;
        result.z = quaternion.z * scalar;
        result.w = quaternion.w * scalar;
        return result;
    };

    /**
     * Divides the provided quaternion componentwise by the provided scalar.
     *
     * @param {Quaternion} quaternion The quaternion to be divided.
     * @param {Number} scalar The scalar to divide by.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.divideByScalar = function(quaternion, scalar, result) {
                Check.typeOf.object('quaternion', quaternion);
        Check.typeOf.number('scalar', scalar);
        Check.typeOf.object('result', result);
        
        result.x = quaternion.x / scalar;
        result.y = quaternion.y / scalar;
        result.z = quaternion.z / scalar;
        result.w = quaternion.w / scalar;
        return result;
    };

    /**
     * Computes the axis of rotation of the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to use.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Quaternion.computeAxis = function(quaternion, result) {
                Check.typeOf.object('quaternion', quaternion);
        Check.typeOf.object('result', result);
        
        var w = quaternion.w;
        if (Math.abs(w - 1.0) < CesiumMath.EPSILON6) {
            result.x = result.y = result.z = 0;
            return result;
        }

        var scalar = 1.0 / Math.sqrt(1.0 - (w * w));

        result.x = quaternion.x * scalar;
        result.y = quaternion.y * scalar;
        result.z = quaternion.z * scalar;
        return result;
    };

    /**
     * Computes the angle of rotation of the provided quaternion.
     *
     * @param {Quaternion} quaternion The quaternion to use.
     * @returns {Number} The angle of rotation.
     */
    Quaternion.computeAngle = function(quaternion) {
                Check.typeOf.object('quaternion', quaternion);
        
        if (Math.abs(quaternion.w - 1.0) < CesiumMath.EPSILON6) {
            return 0.0;
        }
        return 2.0 * Math.acos(quaternion.w);
    };

    var lerpScratch = new Quaternion();
    /**
     * Computes the linear interpolation or extrapolation at t using the provided quaternions.
     *
     * @param {Quaternion} start The value corresponding to t at 0.0.
     * @param {Quaternion} end The value corresponding to t at 1.0.
     * @param {Number} t The point along t at which to interpolate.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.lerp = function(start, end, t, result) {
                Check.typeOf.object('start', start);
        Check.typeOf.object('end', end);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        lerpScratch = Quaternion.multiplyByScalar(end, t, lerpScratch);
        result = Quaternion.multiplyByScalar(start, 1.0 - t, result);
        return Quaternion.add(lerpScratch, result, result);
    };

    var slerpEndNegated = new Quaternion();
    var slerpScaledP = new Quaternion();
    var slerpScaledR = new Quaternion();
    /**
     * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
     *
     * @param {Quaternion} start The value corresponding to t at 0.0.
     * @param {Quaternion} end The value corresponding to t at 1.0.
     * @param {Number} t The point along t at which to interpolate.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     *
     * @see Quaternion#fastSlerp
     */
    Quaternion.slerp = function(start, end, t, result) {
                Check.typeOf.object('start', start);
        Check.typeOf.object('end', end);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        var dot = Quaternion.dot(start, end);

        // The angle between start must be acute. Since q and -q represent
        // the same rotation, negate q to get the acute angle.
        var r = end;
        if (dot < 0.0) {
            dot = -dot;
            r = slerpEndNegated = Quaternion.negate(end, slerpEndNegated);
        }

        // dot > 0, as the dot product approaches 1, the angle between the
        // quaternions vanishes. use linear interpolation.
        if (1.0 - dot < CesiumMath.EPSILON6) {
            return Quaternion.lerp(start, r, t, result);
        }

        var theta = Math.acos(dot);
        slerpScaledP = Quaternion.multiplyByScalar(start, Math.sin((1 - t) * theta), slerpScaledP);
        slerpScaledR = Quaternion.multiplyByScalar(r, Math.sin(t * theta), slerpScaledR);
        result = Quaternion.add(slerpScaledP, slerpScaledR, result);
        return Quaternion.multiplyByScalar(result, 1.0 / Math.sin(theta), result);
    };

    /**
     * The logarithmic quaternion function.
     *
     * @param {Quaternion} quaternion The unit quaternion.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Quaternion.log = function(quaternion, result) {
                Check.typeOf.object('quaternion', quaternion);
        Check.typeOf.object('result', result);
        
        var theta = CesiumMath.acosClamped(quaternion.w);
        var thetaOverSinTheta = 0.0;

        if (theta !== 0.0) {
            thetaOverSinTheta = theta / Math.sin(theta);
        }

        return Cartesian3.multiplyByScalar(quaternion, thetaOverSinTheta, result);
    };

    /**
     * The exponential quaternion function.
     *
     * @param {Cartesian3} cartesian The cartesian.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     */
    Quaternion.exp = function(cartesian, result) {
                Check.typeOf.object('cartesian', cartesian);
        Check.typeOf.object('result', result);
        
        var theta = Cartesian3.magnitude(cartesian);
        var sinThetaOverTheta = 0.0;

        if (theta !== 0.0) {
            sinThetaOverTheta = Math.sin(theta) / theta;
        }

        result.x = cartesian.x * sinThetaOverTheta;
        result.y = cartesian.y * sinThetaOverTheta;
        result.z = cartesian.z * sinThetaOverTheta;
        result.w = Math.cos(theta);

        return result;
    };

    var squadScratchCartesian0 = new Cartesian3();
    var squadScratchCartesian1 = new Cartesian3();
    var squadScratchQuaternion0 = new Quaternion();
    var squadScratchQuaternion1 = new Quaternion();

    /**
     * Computes an inner quadrangle point.
     * <p>This will compute quaternions that ensure a squad curve is C<sup>1</sup>.</p>
     *
     * @param {Quaternion} q0 The first quaternion.
     * @param {Quaternion} q1 The second quaternion.
     * @param {Quaternion} q2 The third quaternion.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     *
     * @see Quaternion#squad
     */
    Quaternion.computeInnerQuadrangle = function(q0, q1, q2, result) {
                Check.typeOf.object('q0', q0);
        Check.typeOf.object('q1', q1);
        Check.typeOf.object('q2', q2);
        Check.typeOf.object('result', result);
        
        var qInv = Quaternion.conjugate(q1, squadScratchQuaternion0);
        Quaternion.multiply(qInv, q2, squadScratchQuaternion1);
        var cart0 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian0);

        Quaternion.multiply(qInv, q0, squadScratchQuaternion1);
        var cart1 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian1);

        Cartesian3.add(cart0, cart1, cart0);
        Cartesian3.multiplyByScalar(cart0, 0.25, cart0);
        Cartesian3.negate(cart0, cart0);
        Quaternion.exp(cart0, squadScratchQuaternion0);

        return Quaternion.multiply(q1, squadScratchQuaternion0, result);
    };

    /**
     * Computes the spherical quadrangle interpolation between quaternions.
     *
     * @param {Quaternion} q0 The first quaternion.
     * @param {Quaternion} q1 The second quaternion.
     * @param {Quaternion} s0 The first inner quadrangle.
     * @param {Quaternion} s1 The second inner quadrangle.
     * @param {Number} t The time in [0,1] used to interpolate.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     *
     *
     * @example
     * // 1. compute the squad interpolation between two quaternions on a curve
     * var s0 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i - 1], quaternions[i], quaternions[i + 1], new Cesium.Quaternion());
     * var s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i], quaternions[i + 1], quaternions[i + 2], new Cesium.Quaternion());
     * var q = Cesium.Quaternion.squad(quaternions[i], quaternions[i + 1], s0, s1, t, new Cesium.Quaternion());
     *
     * // 2. compute the squad interpolation as above but where the first quaternion is a end point.
     * var s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[0], quaternions[1], quaternions[2], new Cesium.Quaternion());
     * var q = Cesium.Quaternion.squad(quaternions[0], quaternions[1], quaternions[0], s1, t, new Cesium.Quaternion());
     *
     * @see Quaternion#computeInnerQuadrangle
     */
    Quaternion.squad = function(q0, q1, s0, s1, t, result) {
                Check.typeOf.object('q0', q0);
        Check.typeOf.object('q1', q1);
        Check.typeOf.object('s0', s0);
        Check.typeOf.object('s1', s1);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        var slerp0 = Quaternion.slerp(q0, q1, t, squadScratchQuaternion0);
        var slerp1 = Quaternion.slerp(s0, s1, t, squadScratchQuaternion1);
        return Quaternion.slerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
    };

    var fastSlerpScratchQuaternion = new Quaternion();
    var opmu = 1.90110745351730037;
    var u = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
    var v = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
    var bT = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
    var bD = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];

    for (var i = 0; i < 7; ++i) {
        var s = i + 1.0;
        var t = 2.0 * s + 1.0;
        u[i] = 1.0 / (s * t);
        v[i] = s / t;
    }

    u[7] = opmu / (8.0 * 17.0);
    v[7] = opmu * 8.0 / 17.0;

    /**
     * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
     * This implementation is faster than {@link Quaternion#slerp}, but is only accurate up to 10<sup>-6</sup>.
     *
     * @param {Quaternion} start The value corresponding to t at 0.0.
     * @param {Quaternion} end The value corresponding to t at 1.0.
     * @param {Number} t The point along t at which to interpolate.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter.
     *
     * @see Quaternion#slerp
     */
    Quaternion.fastSlerp = function(start, end, t, result) {
                Check.typeOf.object('start', start);
        Check.typeOf.object('end', end);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        var x = Quaternion.dot(start, end);

        var sign;
        if (x >= 0) {
            sign = 1.0;
        } else {
            sign = -1.0;
            x = -x;
        }

        var xm1 = x - 1.0;
        var d = 1.0 - t;
        var sqrT = t * t;
        var sqrD = d * d;

        for (var i = 7; i >= 0; --i) {
            bT[i] = (u[i] * sqrT - v[i]) * xm1;
            bD[i] = (u[i] * sqrD - v[i]) * xm1;
        }

        var cT = sign * t * (
            1.0 + bT[0] * (1.0 + bT[1] * (1.0 + bT[2] * (1.0 + bT[3] * (
            1.0 + bT[4] * (1.0 + bT[5] * (1.0 + bT[6] * (1.0 + bT[7]))))))));
        var cD = d * (
            1.0 + bD[0] * (1.0 + bD[1] * (1.0 + bD[2] * (1.0 + bD[3] * (
            1.0 + bD[4] * (1.0 + bD[5] * (1.0 + bD[6] * (1.0 + bD[7]))))))));

        var temp = Quaternion.multiplyByScalar(start, cD, fastSlerpScratchQuaternion);
        Quaternion.multiplyByScalar(end, cT, result);
        return Quaternion.add(temp, result, result);
    };

    /**
     * Computes the spherical quadrangle interpolation between quaternions.
     * An implementation that is faster than {@link Quaternion#squad}, but less accurate.
     *
     * @param {Quaternion} q0 The first quaternion.
     * @param {Quaternion} q1 The second quaternion.
     * @param {Quaternion} s0 The first inner quadrangle.
     * @param {Quaternion} s1 The second inner quadrangle.
     * @param {Number} t The time in [0,1] used to interpolate.
     * @param {Quaternion} result The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new instance if none was provided.
     *
     * @see Quaternion#squad
     */
    Quaternion.fastSquad = function(q0, q1, s0, s1, t, result) {
                Check.typeOf.object('q0', q0);
        Check.typeOf.object('q1', q1);
        Check.typeOf.object('s0', s0);
        Check.typeOf.object('s1', s1);
        Check.typeOf.number('t', t);
        Check.typeOf.object('result', result);
        
        var slerp0 = Quaternion.fastSlerp(q0, q1, t, squadScratchQuaternion0);
        var slerp1 = Quaternion.fastSlerp(s0, s1, t, squadScratchQuaternion1);
        return Quaternion.fastSlerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
    };

    /**
     * Compares the provided quaternions componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Quaternion} [left] The first quaternion.
     * @param {Quaternion} [right] The second quaternion.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Quaternion.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.x === right.x) &&
                (left.y === right.y) &&
                (left.z === right.z) &&
                (left.w === right.w));
    };

    /**
     * Compares the provided quaternions componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Quaternion} [left] The first quaternion.
     * @param {Quaternion} [right] The second quaternion.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Quaternion.equalsEpsilon = function(left, right, epsilon) {
                Check.typeOf.number('epsilon', epsilon);
        
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.x - right.x) <= epsilon) &&
                (Math.abs(left.y - right.y) <= epsilon) &&
                (Math.abs(left.z - right.z) <= epsilon) &&
                (Math.abs(left.w - right.w) <= epsilon));
    };

    /**
     * An immutable Quaternion instance initialized to (0.0, 0.0, 0.0, 0.0).
     *
     * @type {Quaternion}
     * @constant
     */
    Quaternion.ZERO = freezeObject(new Quaternion(0.0, 0.0, 0.0, 0.0));

    /**
     * An immutable Quaternion instance initialized to (0.0, 0.0, 0.0, 1.0).
     *
     * @type {Quaternion}
     * @constant
     */
    Quaternion.IDENTITY = freezeObject(new Quaternion(0.0, 0.0, 0.0, 1.0));

    /**
     * Duplicates this Quaternion instance.
     *
     * @param {Quaternion} [result] The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
     */
    Quaternion.prototype.clone = function(result) {
        return Quaternion.clone(this, result);
    };

    /**
     * Compares this and the provided quaternion componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Quaternion} [right] The right hand side quaternion.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    Quaternion.prototype.equals = function(right) {
        return Quaternion.equals(this, right);
    };

    /**
     * Compares this and the provided quaternion componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Quaternion} [right] The right hand side quaternion.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     */
    Quaternion.prototype.equalsEpsilon = function(right, epsilon) {
        return Quaternion.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Returns a string representing this quaternion in the format (x, y, z, w).
     *
     * @returns {String} A string representing this Quaternion.
     */
    Quaternion.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
    };

    return Quaternion;
});

/*global define*/
define('Core/Transforms',[
        '../ThirdParty/when',
        './Cartesian2',
        './Cartesian3',
        './Cartesian4',
        './Cartographic',
        './Check',
        './defaultValue',
        './defined',
        './deprecationWarning',
        './DeveloperError',
        './EarthOrientationParameters',
        './EarthOrientationParametersSample',
        './Ellipsoid',
        './Iau2006XysData',
        './Iau2006XysSample',
        './JulianDate',
        './Math',
        './Matrix3',
        './Matrix4',
        './Quaternion',
        './TimeConstants'
    ], function(
        when,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        Cartographic,
        Check,
        defaultValue,
        defined,
        deprecationWarning,
        DeveloperError,
        EarthOrientationParameters,
        EarthOrientationParametersSample,
        Ellipsoid,
        Iau2006XysData,
        Iau2006XysSample,
        JulianDate,
        CesiumMath,
        Matrix3,
        Matrix4,
        Quaternion,
        TimeConstants) {
    'use strict';

    /**
     * Contains functions for transforming positions to various reference frames.
     *
     * @exports Transforms
     */
    var Transforms = {};

    var vectorProductLocalFrame = {
        up : {
            south : 'east',
            north : 'west',
            west : 'south',
            east : 'north'
        },
        down : {
            south : 'west',
            north : 'east',
            west : 'north',
            east : 'south'
        },
        south : {
            up : 'west',
            down : 'east',
            west : 'down',
            east : 'up'
        },
        north : {
            up : 'east',
            down : 'west',
            west : 'up',
            east : 'down'
        },
        west : {
            up : 'north',
            down : 'south',
            north : 'down',
            south : 'up'
        },
        east : {
            up : 'south',
            down : 'north',
            north : 'up',
            south : 'down'
        }
    };

    var degeneratePositionLocalFrame = {
        north : [-1, 0, 0],
        east : [0, 1, 0],
        up : [0, 0, 1],
        south : [1, 0, 0],
        west : [0, -1, 0],
        down : [0, 0, -1]
    };

    var localFrameToFixedFrameCache = {};

    var scratchCalculateCartesian = {
        east : new Cartesian3(),
        north : new Cartesian3(),
        up : new Cartesian3(),
        west : new Cartesian3(),
        south : new Cartesian3(),
        down : new Cartesian3()
    };
    var scratchFirstCartesian = new Cartesian3();
    var scratchSecondCartesian = new Cartesian3();
    var scratchThirdCartesian = new Cartesian3();
    /**
    * Generates a function that computes a 4x4 transformation matrix from a reference frame
    * centered at the provided origin to the provided ellipsoid's fixed reference frame.
    * @param  {String} firstAxis  name of the first axis of the local reference frame. Must be
    *  'east', 'north', 'up', 'west', 'south' or 'down'.
    * @param  {String} secondAxis  name of the second axis of the local reference frame. Must be
    *  'east', 'north', 'up', 'west', 'south' or 'down'.
    * @return {localFrameToFixedFrameGenerator~resultat} The function that will computes a
    * 4x4 transformation matrix from a reference frame, with first axis and second axis compliant with the parameters,
    */
    Transforms.localFrameToFixedFrameGenerator = function( firstAxis, secondAxis) {
      if (!vectorProductLocalFrame.hasOwnProperty(firstAxis) || !vectorProductLocalFrame[firstAxis].hasOwnProperty(secondAxis)) {
          throw new DeveloperError('firstAxis and secondAxis must be east, north, up, west, south or down.');
      }
      var thirdAxis = vectorProductLocalFrame[firstAxis][secondAxis];

      /**
       * Computes a 4x4 transformation matrix from a reference frame
       * centered at the provided origin to the provided ellipsoid's fixed reference frame.
       * @callback Transforms~LocalFrameToFixedFrame
       * @param {Cartesian3} origin The center point of the local reference frame.
       * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
       * @param {Matrix4} [result] The object onto which to store the result.
       * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
       */
      var resultat;
      var hashAxis = firstAxis + secondAxis;
      if (defined(localFrameToFixedFrameCache[hashAxis])) {
          resultat = localFrameToFixedFrameCache[hashAxis];
      } else {
          resultat = function(origin, ellipsoid, result) {
                            if (!defined(origin)) {
                  throw new DeveloperError('origin is required.');
              }
                            if (!defined(result)) {
                  result = new Matrix4();
              }
              // If x and y are zero, assume origin is at a pole, which is a special case.
              if (CesiumMath.equalsEpsilon(origin.x, 0.0, CesiumMath.EPSILON14) && CesiumMath.equalsEpsilon(origin.y, 0.0, CesiumMath.EPSILON14)) {
                  var sign = CesiumMath.sign(origin.z);

                  Cartesian3.unpack(degeneratePositionLocalFrame[firstAxis], 0, scratchFirstCartesian);
                  if (firstAxis !== 'east' && firstAxis !== 'west') {
                      Cartesian3.multiplyByScalar(scratchFirstCartesian, sign, scratchFirstCartesian);
                  }

                  Cartesian3.unpack(degeneratePositionLocalFrame[secondAxis], 0, scratchSecondCartesian);
                  if (secondAxis !== 'east' && secondAxis !== 'west') {
                      Cartesian3.multiplyByScalar(scratchSecondCartesian, sign, scratchSecondCartesian);
                  }

                  Cartesian3.unpack(degeneratePositionLocalFrame[thirdAxis], 0, scratchThirdCartesian);
                  if (thirdAxis !== 'east' && thirdAxis !== 'west') {
                      Cartesian3.multiplyByScalar(scratchThirdCartesian, sign, scratchThirdCartesian);
                  }
              } else {
                  ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
                  ellipsoid.geodeticSurfaceNormal(origin, scratchCalculateCartesian.up);

                  var up = scratchCalculateCartesian.up;
                  var east = scratchCalculateCartesian.east;
                  east.x = -origin.y;
                  east.y = origin.x;
                  east.z = 0.0;
                  Cartesian3.normalize(east, scratchCalculateCartesian.east);
                  Cartesian3.cross(up, east, scratchCalculateCartesian.north);

                  Cartesian3.multiplyByScalar(scratchCalculateCartesian.up, -1, scratchCalculateCartesian.down);
                  Cartesian3.multiplyByScalar(scratchCalculateCartesian.east, -1, scratchCalculateCartesian.west);
                  Cartesian3.multiplyByScalar(scratchCalculateCartesian.north, -1, scratchCalculateCartesian.south);

                  scratchFirstCartesian = scratchCalculateCartesian[firstAxis];
                  scratchSecondCartesian = scratchCalculateCartesian[secondAxis];
                  scratchThirdCartesian = scratchCalculateCartesian[thirdAxis];
              }
              result[0] = scratchFirstCartesian.x;
              result[1] = scratchFirstCartesian.y;
              result[2] = scratchFirstCartesian.z;
              result[3] = 0.0;
              result[4] = scratchSecondCartesian.x;
              result[5] = scratchSecondCartesian.y;
              result[6] = scratchSecondCartesian.z;
              result[7] = 0.0;
              result[8] = scratchThirdCartesian.x;
              result[9] = scratchThirdCartesian.y;
              result[10] = scratchThirdCartesian.z;
              result[11] = 0.0;
              result[12] = origin.x;
              result[13] = origin.y;
              result[14] = origin.z;
              result[15] = 1.0;
              return result;
          };
          localFrameToFixedFrameCache[hashAxis] = resultat;
      }
      return resultat;
    };

    /**
     * Computes a 4x4 transformation matrix from a reference frame with an east-north-up axes
     * centered at the provided origin to the provided ellipsoid's fixed reference frame.
     * The local axes are defined as:
     * <ul>
     * <li>The <code>x</code> axis points in the local east direction.</li>
     * <li>The <code>y</code> axis points in the local north direction.</li>
     * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
     * </ul>
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     *
     * @example
     * // Get the transform from local east-north-up at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
     * var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
     */
    Transforms.eastNorthUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator('east','north');

    /**
     * Computes a 4x4 transformation matrix from a reference frame with an north-east-down axes
     * centered at the provided origin to the provided ellipsoid's fixed reference frame.
     * The local axes are defined as:
     * <ul>
     * <li>The <code>x</code> axis points in the local north direction.</li>
     * <li>The <code>y</code> axis points in the local east direction.</li>
     * <li>The <code>z</code> axis points in the opposite direction of the ellipsoid surface normal which passes through the position.</li>
     * </ul>
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     *
     * @example
     * // Get the transform from local north-east-down at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
     * var transform = Cesium.Transforms.northEastDownToFixedFrame(center);
     */
    Transforms.northEastDownToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','east');

    /**
     * Computes a 4x4 transformation matrix from a reference frame with an north-up-east axes
     * centered at the provided origin to the provided ellipsoid's fixed reference frame.
     * The local axes are defined as:
     * <ul>
     * <li>The <code>x</code> axis points in the local north direction.</li>
     * <li>The <code>y</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
     * <li>The <code>z</code> axis points in the local east direction.</li>
     * </ul>
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     *
     * @example
     * // Get the transform from local north-up-east at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
     * var transform = Cesium.Transforms.northUpEastToFixedFrame(center);
     */
    Transforms.northUpEastToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','up');

    /**
    * Computes a 4x4 transformation matrix from a reference frame with an north-west-up axes
    * centered at the provided origin to the provided ellipsoid's fixed reference frame.
    * The local axes are defined as:
    * <ul>
    * <li>The <code>x</code> axis points in the local north direction.</li>
    * <li>The <code>y</code> axis points in the local west direction.</li>
    * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
    * </ul>
    *
    * @param {Cartesian3} origin The center point of the local reference frame.
    * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
    * @param {Matrix4} [result] The object onto which to store the result.
    * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
    *
    * @example
    * // Get the transform from local north-West-Up at cartographic (0.0, 0.0) to Earth's fixed frame.
    * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
    * var transform = Cesium.Transforms.northWestUpToFixedFrame(center);
    */
   Transforms.northWestUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','west');

    var scratchHPRQuaternion = new Quaternion();
    var scratchScale = new Cartesian3(1.0, 1.0, 1.0);
    var scratchHPRMatrix4 = new Matrix4();

    /**
     * Computes a 4x4 transformation matrix from a reference frame with axes computed from the heading-pitch-roll angles
     * centered at the provided origin to the provided ellipsoid's fixed reference frame. Heading is the rotation from the local north
     * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
     * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransformOrResult=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
     *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     *
     * @example
     * // Get the transform from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
     * var heading = -Cesium.Math.PI_OVER_TWO;
     * var pitch = Cesium.Math.PI_OVER_FOUR;
     * var roll = 0.0;
     * var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
     * var transform = Cesium.Transforms.headingPitchRollToFixedFrame(center, hpr);
     */
    Transforms.headingPitchRollToFixedFrame = function(origin, headingPitchRoll, ellipsoid, fixedFrameTransformOrResult, result) {
                Check.typeOf.object( 'HeadingPitchRoll', headingPitchRoll);
        
        // checks for required parameters happen in the called functions
        if(fixedFrameTransformOrResult instanceof Matrix4){
            result = fixedFrameTransformOrResult;
            fixedFrameTransformOrResult = undefined;
            deprecationWarning('Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, result)', 'The method was deprecated in Cesium 1.31 and will be removed in version 1.33. Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) where fixedFrameTransform is a a 4x4 transformation matrix (see Transforms.localFrameToFixedFrameGenerator)');
        }
        fixedFrameTransformOrResult = defaultValue(fixedFrameTransformOrResult,Transforms.eastNorthUpToFixedFrame);
        var hprQuaternion = Quaternion.fromHeadingPitchRoll(headingPitchRoll, scratchHPRQuaternion);
        var hprMatrix = Matrix4.fromTranslationQuaternionRotationScale(Cartesian3.ZERO, hprQuaternion, scratchScale, scratchHPRMatrix4);
        result = fixedFrameTransformOrResult(origin, ellipsoid, result);
        return Matrix4.multiply(result, hprMatrix, result);
    };

    var scratchENUMatrix4 = new Matrix4();
    var scratchHPRMatrix3 = new Matrix3();

    /**
     * Computes a quaternion from a reference frame with axes computed from the heading-pitch-roll angles
     * centered at the provided origin. Heading is the rotation from the local north
     * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
     * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
     *
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransformOrResult=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
     *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
     * @param {Quaternion} [result] The object onto which to store the result.
     * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
     *
     * @example
     * // Get the quaternion from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
     * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
     * var heading = -Cesium.Math.PI_OVER_TWO;
     * var pitch = Cesium.Math.PI_OVER_FOUR;
     * var roll = 0.0;
     * var hpr = new HeadingPitchRoll(heading, pitch, roll);
     * var quaternion = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);
     */
    Transforms.headingPitchRollQuaternion = function(origin, headingPitchRoll, ellipsoid, fixedFrameTransformOrResult, result) {
                Check.typeOf.object( 'HeadingPitchRoll', headingPitchRoll);
                if (fixedFrameTransformOrResult instanceof Quaternion) {
            result = fixedFrameTransformOrResult;
            fixedFrameTransformOrResult = undefined;
            deprecationWarning('Transforms.headingPitchRollQuaternion(origin, headingPitchRoll, ellipsoid, result)', 'The method was deprecated in Cesium 1.31 and will be removed in version 1.33. Transforms.headingPitchRollQuaternion(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) where fixedFrameTransform is a a 4x4 transformation matrix (see Transforms.localFrameToFixedFrameGenerator)');
        }
        var transform = Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid,fixedFrameTransformOrResult, scratchENUMatrix4);
        var rotation = Matrix4.getRotation(transform, scratchHPRMatrix3);
        return Quaternion.fromRotationMatrix(rotation, result);
    };

    var gmstConstant0 = 6 * 3600 + 41 * 60 + 50.54841;
    var gmstConstant1 = 8640184.812866;
    var gmstConstant2 = 0.093104;
    var gmstConstant3 = -6.2E-6;
    var rateCoef = 1.1772758384668e-19;
    var wgs84WRPrecessing = 7.2921158553E-5;
    var twoPiOverSecondsInDay = CesiumMath.TWO_PI / 86400.0;
    var dateInUtc = new JulianDate();

    /**
     * Computes a rotation matrix to transform a point or vector from True Equator Mean Equinox (TEME) axes to the
     * pseudo-fixed axes at a given time.  This method treats the UT1 time standard as equivalent to UTC.
     *
     * @param {JulianDate} date The time at which to compute the rotation matrix.
     * @param {Matrix3} [result] The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if none was provided.
     *
     * @example
     * //Set the view to in the inertial frame.
     * scene.preRender.addEventListener(function(scene, time) {
     *    var now = Cesium.JulianDate.now();
     *    var offset = Cesium.Matrix4.multiplyByPoint(camera.transform, camera.position, new Cesium.Cartesian3());
     *    var transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Transforms.computeTemeToPseudoFixedMatrix(now));
     *    var inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
     *    Cesium.Matrix4.multiplyByPoint(inverseTransform, offset, offset);
     *    camera.lookAtTransform(transform, offset);
     * });
     */
    Transforms.computeTemeToPseudoFixedMatrix = function (date, result) {
                if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }
        
        // GMST is actually computed using UT1.  We're using UTC as an approximation of UT1.
        // We do not want to use the function like convertTaiToUtc in JulianDate because
        // we explicitly do not want to fail when inside the leap second.

        dateInUtc = JulianDate.addSeconds(date, -JulianDate.computeTaiMinusUtc(date), dateInUtc);
        var utcDayNumber = dateInUtc.dayNumber;
        var utcSecondsIntoDay = dateInUtc.secondsOfDay;

        var t;
        var diffDays = utcDayNumber - 2451545;
        if (utcSecondsIntoDay >= 43200.0) {
            t = (diffDays + 0.5) / TimeConstants.DAYS_PER_JULIAN_CENTURY;
        } else {
            t = (diffDays - 0.5) / TimeConstants.DAYS_PER_JULIAN_CENTURY;
        }

        var gmst0 = gmstConstant0 + t * (gmstConstant1 + t * (gmstConstant2 + t * gmstConstant3));
        var angle = (gmst0 * twoPiOverSecondsInDay) % CesiumMath.TWO_PI;
        var ratio = wgs84WRPrecessing + rateCoef * (utcDayNumber - 2451545.5);
        var secondsSinceMidnight = (utcSecondsIntoDay + TimeConstants.SECONDS_PER_DAY * 0.5) % TimeConstants.SECONDS_PER_DAY;
        var gha = angle + (ratio * secondsSinceMidnight);
        var cosGha = Math.cos(gha);
        var sinGha = Math.sin(gha);

        if (!defined(result)) {
            return new Matrix3(cosGha, sinGha, 0.0,
                              -sinGha, cosGha, 0.0,
                                  0.0,    0.0, 1.0);
        }
        result[0] = cosGha;
        result[1] = -sinGha;
        result[2] = 0.0;
        result[3] = sinGha;
        result[4] = cosGha;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 1.0;
        return result;
    };

    /**
     * The source of IAU 2006 XYS data, used for computing the transformation between the
     * Fixed and ICRF axes.
     * @type {Iau2006XysData}
     *
     * @see Transforms.computeIcrfToFixedMatrix
     * @see Transforms.computeFixedToIcrfMatrix
     *
     * @private
     */
    Transforms.iau2006XysData = new Iau2006XysData();

    /**
     * The source of Earth Orientation Parameters (EOP) data, used for computing the transformation
     * between the Fixed and ICRF axes.  By default, zero values are used for all EOP values,
     * yielding a reasonable but not completely accurate representation of the ICRF axes.
     * @type {EarthOrientationParameters}
     *
     * @see Transforms.computeIcrfToFixedMatrix
     * @see Transforms.computeFixedToIcrfMatrix
     *
     * @private
     */
    Transforms.earthOrientationParameters = EarthOrientationParameters.NONE;

    var ttMinusTai = 32.184;
    var j2000ttDays = 2451545.0;

    /**
     * Preloads the data necessary to transform between the ICRF and Fixed axes, in either
     * direction, over a given interval.  This function returns a promise that, when resolved,
     * indicates that the preload has completed.
     *
     * @param {TimeInterval} timeInterval The interval to preload.
     * @returns {Promise.<undefined>} A promise that, when resolved, indicates that the preload has completed
     *          and evaluation of the transformation between the fixed and ICRF axes will
     *          no longer return undefined for a time inside the interval.
     *
     *
     * @example
     * var interval = new Cesium.TimeInterval(...);
     * when(Cesium.Transforms.preloadIcrfFixed(interval), function() {
     *     // the data is now loaded
     * });
     *
     * @see Transforms.computeIcrfToFixedMatrix
     * @see Transforms.computeFixedToIcrfMatrix
     * @see when
     */
    Transforms.preloadIcrfFixed = function(timeInterval) {
        var startDayTT = timeInterval.start.dayNumber;
        var startSecondTT = timeInterval.start.secondsOfDay + ttMinusTai;
        var stopDayTT = timeInterval.stop.dayNumber;
        var stopSecondTT = timeInterval.stop.secondsOfDay + ttMinusTai;

        var xysPromise = Transforms.iau2006XysData.preload(startDayTT, startSecondTT, stopDayTT, stopSecondTT);
        var eopPromise = Transforms.earthOrientationParameters.getPromiseToLoad();

        return when.all([xysPromise, eopPromise]);
    };

    /**
     * Computes a rotation matrix to transform a point or vector from the International Celestial
     * Reference Frame (GCRF/ICRF) inertial frame axes to the Earth-Fixed frame axes (ITRF)
     * at a given time.  This function may return undefined if the data necessary to
     * do the transformation is not yet loaded.
     *
     * @param {JulianDate} date The time at which to compute the rotation matrix.
     * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
     *                  not specified, a new instance is created and returned.
     * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
     *                   transformation is not yet loaded.
     *
     *
     * @example
     * scene.preRender.addEventListener(function(scene, time) {
     *   var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
     *   if (Cesium.defined(icrfToFixed)) {
     *     var offset = Cesium.Matrix4.multiplyByPoint(camera.transform, camera.position, new Cesium.Cartesian3());
     *     var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
     *     var inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
     *     Cesium.Matrix4.multiplyByPoint(inverseTransform, offset, offset);
     *     camera.lookAtTransform(transform, offset);
     *   }
     * });
     *
     * @see Transforms.preloadIcrfFixed
     */
    Transforms.computeIcrfToFixedMatrix = function(date, result) {
                if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }
                if (!defined(result)) {
            result = new Matrix3();
        }

        var fixedToIcrfMtx = Transforms.computeFixedToIcrfMatrix(date, result);
        if (!defined(fixedToIcrfMtx)) {
            return undefined;
        }

        return Matrix3.transpose(fixedToIcrfMtx, result);
    };

    var xysScratch = new Iau2006XysSample(0.0, 0.0, 0.0);
    var eopScratch = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    var rotation1Scratch = new Matrix3();
    var rotation2Scratch = new Matrix3();

    /**
     * Computes a rotation matrix to transform a point or vector from the Earth-Fixed frame axes (ITRF)
     * to the International Celestial Reference Frame (GCRF/ICRF) inertial frame axes
     * at a given time.  This function may return undefined if the data necessary to
     * do the transformation is not yet loaded.
     *
     * @param {JulianDate} date The time at which to compute the rotation matrix.
     * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
     *                  not specified, a new instance is created and returned.
     * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
     *                   transformation is not yet loaded.
     *
     *
     * @example
     * // Transform a point from the ICRF axes to the Fixed axes.
     * var now = Cesium.JulianDate.now();
     * var pointInFixed = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
     * var fixedToIcrf = Cesium.Transforms.computeIcrfToFixedMatrix(now);
     * var pointInInertial = new Cesium.Cartesian3();
     * if (Cesium.defined(fixedToIcrf)) {
     *     pointInInertial = Cesium.Matrix3.multiplyByVector(fixedToIcrf, pointInFixed, pointInInertial);
     * }
     *
     * @see Transforms.preloadIcrfFixed
     */
    Transforms.computeFixedToIcrfMatrix = function(date, result) {
                if (!defined(date)) {
            throw new DeveloperError('date is required.');
        }
        
        if (!defined(result)) {
            result = new Matrix3();
        }

        // Compute pole wander
        var eop = Transforms.earthOrientationParameters.compute(date, eopScratch);
        if (!defined(eop)) {
            return undefined;
        }

        // There is no external conversion to Terrestrial Time (TT).
        // So use International Atomic Time (TAI) and convert using offsets.
        // Here we are assuming that dayTT and secondTT are positive
        var dayTT = date.dayNumber;
        // It's possible here that secondTT could roll over 86400
        // This does not seem to affect the precision (unit tests check for this)
        var secondTT = date.secondsOfDay + ttMinusTai;

        var xys = Transforms.iau2006XysData.computeXysRadians(dayTT, secondTT, xysScratch);
        if (!defined(xys)) {
            return undefined;
        }

        var x = xys.x + eop.xPoleOffset;
        var y = xys.y + eop.yPoleOffset;

        // Compute XYS rotation
        var a = 1.0 / (1.0 + Math.sqrt(1.0 - x * x - y * y));

        var rotation1 = rotation1Scratch;
        rotation1[0] = 1.0 - a * x * x;
        rotation1[3] = -a * x * y;
        rotation1[6] = x;
        rotation1[1] = -a * x * y;
        rotation1[4] = 1 - a * y * y;
        rotation1[7] = y;
        rotation1[2] = -x;
        rotation1[5] = -y;
        rotation1[8] = 1 - a * (x * x + y * y);

        var rotation2 = Matrix3.fromRotationZ(-xys.s, rotation2Scratch);
        var matrixQ = Matrix3.multiply(rotation1, rotation2, rotation1Scratch);

        // Similar to TT conversions above
        // It's possible here that secondTT could roll over 86400
        // This does not seem to affect the precision (unit tests check for this)
        var dateUt1day = date.dayNumber;
        var dateUt1sec = date.secondsOfDay - JulianDate.computeTaiMinusUtc(date) + eop.ut1MinusUtc;

        // Compute Earth rotation angle
        // The IERS standard for era is
        //    era = 0.7790572732640 + 1.00273781191135448 * Tu
        // where
        //    Tu = JulianDateInUt1 - 2451545.0
        // However, you get much more precision if you make the following simplification
        //    era = a + (1 + b) * (JulianDayNumber + FractionOfDay - 2451545)
        //    era = a + (JulianDayNumber - 2451545) + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
        //    era = a + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
        // since (JulianDayNumber - 2451545) represents an integer number of revolutions which will be discarded anyway.
        var daysSinceJ2000 = dateUt1day - 2451545;
        var fractionOfDay = dateUt1sec / TimeConstants.SECONDS_PER_DAY;
        var era = 0.7790572732640 + fractionOfDay + 0.00273781191135448 * (daysSinceJ2000 + fractionOfDay);
        era = (era % 1.0) * CesiumMath.TWO_PI;

        var earthRotation = Matrix3.fromRotationZ(era, rotation2Scratch);

        // pseudoFixed to ICRF
        var pfToIcrf = Matrix3.multiply(matrixQ, earthRotation, rotation1Scratch);

        // Compute pole wander matrix
        var cosxp = Math.cos(eop.xPoleWander);
        var cosyp = Math.cos(eop.yPoleWander);
        var sinxp = Math.sin(eop.xPoleWander);
        var sinyp = Math.sin(eop.yPoleWander);

        var ttt = (dayTT - j2000ttDays) + secondTT / TimeConstants.SECONDS_PER_DAY;
        ttt /= 36525.0;

        // approximate sp value in rad
        var sp = -47.0e-6 * ttt * CesiumMath.RADIANS_PER_DEGREE / 3600.0;
        var cossp = Math.cos(sp);
        var sinsp = Math.sin(sp);

        var fToPfMtx = rotation2Scratch;
        fToPfMtx[0] = cosxp * cossp;
        fToPfMtx[1] = cosxp * sinsp;
        fToPfMtx[2] = sinxp;
        fToPfMtx[3] = -cosyp * sinsp + sinyp * sinxp * cossp;
        fToPfMtx[4] = cosyp * cossp + sinyp * sinxp * sinsp;
        fToPfMtx[5] = -sinyp * cosxp;
        fToPfMtx[6] = -sinyp * sinsp - cosyp * sinxp * cossp;
        fToPfMtx[7] = sinyp * cossp - cosyp * sinxp * sinsp;
        fToPfMtx[8] = cosyp * cosxp;

        return Matrix3.multiply(pfToIcrf, fToPfMtx, result);
    };

    var pointToWindowCoordinatesTemp = new Cartesian4();

    /**
     * Transform a point from model coordinates to window coordinates.
     *
     * @param {Matrix4} modelViewProjectionMatrix The 4x4 model-view-projection matrix.
     * @param {Matrix4} viewportTransformation The 4x4 viewport transformation.
     * @param {Cartesian3} point The point to transform.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
     */
    Transforms.pointToWindowCoordinates = function (modelViewProjectionMatrix, viewportTransformation, point, result) {
        result = Transforms.pointToGLWindowCoordinates(modelViewProjectionMatrix, viewportTransformation, point, result);
        result.y = 2.0 * viewportTransformation[5] - result.y;
        return result;
    };

    /**
     * @private
     */
    Transforms.pointToGLWindowCoordinates = function(modelViewProjectionMatrix, viewportTransformation, point, result) {
                if (!defined(modelViewProjectionMatrix)) {
            throw new DeveloperError('modelViewProjectionMatrix is required.');
        }

        if (!defined(viewportTransformation)) {
            throw new DeveloperError('viewportTransformation is required.');
        }

        if (!defined(point)) {
            throw new DeveloperError('point is required.');
        }
        
        if (!defined(result)) {
            result = new Cartesian2();
        }

        var tmp = pointToWindowCoordinatesTemp;

        Matrix4.multiplyByVector(modelViewProjectionMatrix, Cartesian4.fromElements(point.x, point.y, point.z, 1, tmp), tmp);
        Cartesian4.multiplyByScalar(tmp, 1.0 / tmp.w, tmp);
        Matrix4.multiplyByVector(viewportTransformation, tmp, tmp);
        return Cartesian2.fromCartesian4(tmp, result);
    };

    var normalScratch = new Cartesian3();
    var rightScratch = new Cartesian3();
    var upScratch = new Cartesian3();

    /**
     * @private
     */
    Transforms.rotationMatrixFromPositionVelocity = function(position, velocity, ellipsoid, result) {
                if (!defined(position)) {
            throw new DeveloperError('position is required.');
        }

        if (!defined(velocity)) {
            throw new DeveloperError('velocity is required.');
        }
        
        var normal = defaultValue(ellipsoid, Ellipsoid.WGS84).geodeticSurfaceNormal(position, normalScratch);
        var right = Cartesian3.cross(velocity, normal, rightScratch);
        if (Cartesian3.equalsEpsilon(right, Cartesian3.ZERO, CesiumMath.EPSILON6)) {
            right = Cartesian3.clone(Cartesian3.UNIT_X, right);
        }

        var up = Cartesian3.cross(right, velocity, upScratch);
        Cartesian3.cross(velocity, up, right);
        Cartesian3.negate(right, right);

        if (!defined(result)) {
            result = new Matrix3();
        }

        result[0] = velocity.x;
        result[1] = velocity.y;
        result[2] = velocity.z;
        result[3] = right.x;
        result[4] = right.y;
        result[5] = right.z;
        result[6] = up.x;
        result[7] = up.y;
        result[8] = up.z;

        return result;
    };

    var swizzleMatrix = new Matrix4(
        0.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    var scratchCartographic = new Cartographic();
    var scratchCartesian3Projection = new Cartesian3();
    var scratchCenter = new Cartesian3();
    var scratchRotation = new Matrix3();
    var scratchFromENU = new Matrix4();
    var scratchToENU = new Matrix4();

    /**
     * @private
     */
    Transforms.basisTo2D = function(projection, matrix, result) {
                if (!defined(projection)) {
            throw new DeveloperError('projection is required.');
        }
        if (!defined(matrix)) {
            throw new DeveloperError('matrix is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var rtcCenter = Matrix4.getTranslation(matrix, scratchCenter);
        var ellipsoid = projection.ellipsoid;

        // Get the 2D Center
        var cartographic = ellipsoid.cartesianToCartographic(rtcCenter, scratchCartographic);
        var projectedPosition = projection.project(cartographic, scratchCartesian3Projection);
        Cartesian3.fromElements(projectedPosition.z, projectedPosition.x, projectedPosition.y, projectedPosition);

        // Assuming the instance are positioned in WGS84, invert the WGS84 transform to get the local transform and then convert to 2D
        var fromENU = Transforms.eastNorthUpToFixedFrame(rtcCenter, ellipsoid, scratchFromENU);
        var toENU = Matrix4.inverseTransformation(fromENU, scratchToENU);
        var rotation = Matrix4.getRotation(matrix, scratchRotation);
        var local = Matrix4.multiplyByMatrix3(toENU, rotation, result);
        Matrix4.multiply(swizzleMatrix, local, result); // Swap x, y, z for 2D
        Matrix4.setTranslation(result, projectedPosition, result); // Use the projected center

        return result;
    };

    /**
     * @private
     */
    Transforms.wgs84To2DModelMatrix = function(projection, center, result) {
                if (!defined(projection)) {
            throw new DeveloperError('projection is required.');
        }
        if (!defined(center)) {
            throw new DeveloperError('center is required.');
        }
        if (!defined(result)) {
            throw new DeveloperError('result is required.');
        }
        
        var ellipsoid = projection.ellipsoid;

        var fromENU = Transforms.eastNorthUpToFixedFrame(center, ellipsoid, scratchFromENU);
        var toENU = Matrix4.inverseTransformation(fromENU, scratchToENU);

        var cartographic = ellipsoid.cartesianToCartographic(center, scratchCartographic);
        var projectedPosition = projection.project(cartographic, scratchCartesian3Projection);
        Cartesian3.fromElements(projectedPosition.z, projectedPosition.x, projectedPosition.y, projectedPosition);

        var translation = Matrix4.fromTranslation(projectedPosition, scratchFromENU);
        Matrix4.multiply(swizzleMatrix, toENU, result);
        Matrix4.multiply(translation, result, result);

        return result;
    };

    return Transforms;
});

/*global define*/
define('Core/EllipsoidTangentPlane',[
        './AxisAlignedBoundingBox',
        './Cartesian2',
        './Cartesian3',
        './Cartesian4',
        './defaultValue',
        './defined',
        './defineProperties',
        './DeveloperError',
        './Ellipsoid',
        './IntersectionTests',
        './Matrix4',
        './Plane',
        './Ray',
        './Transforms'
    ], function(
        AxisAlignedBoundingBox,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Ellipsoid,
        IntersectionTests,
        Matrix4,
        Plane,
        Ray,
        Transforms) {
    'use strict';

    var scratchCart4 = new Cartesian4();
    /**
     * A plane tangent to the provided ellipsoid at the provided origin.
     * If origin is not on the surface of the ellipsoid, it's surface projection will be used.
     * If origin is at the center of the ellipsoid, an exception will be thrown.
     * @alias EllipsoidTangentPlane
     * @constructor
     *
     * @param {Cartesian3} origin The point on the surface of the ellipsoid where the tangent plane touches.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
     *
     * @exception {DeveloperError} origin must not be at the center of the ellipsoid.
     */
    function EllipsoidTangentPlane(origin, ellipsoid) {
                if (!defined(origin)) {
            throw new DeveloperError('origin is required.');
        }
        
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        origin = ellipsoid.scaleToGeodeticSurface(origin);

                if (!defined(origin)) {
            throw new DeveloperError('origin must not be at the center of the ellipsoid.');
        }
        
        var eastNorthUp = Transforms.eastNorthUpToFixedFrame(origin, ellipsoid);
        this._ellipsoid = ellipsoid;
        this._origin = origin;
        this._xAxis = Cartesian3.fromCartesian4(Matrix4.getColumn(eastNorthUp, 0, scratchCart4));
        this._yAxis = Cartesian3.fromCartesian4(Matrix4.getColumn(eastNorthUp, 1, scratchCart4));

        var normal = Cartesian3.fromCartesian4(Matrix4.getColumn(eastNorthUp, 2, scratchCart4));
        this._plane = Plane.fromPointNormal(origin, normal);
    }

    defineProperties(EllipsoidTangentPlane.prototype, {
        /**
         * Gets the ellipsoid.
         * @memberof EllipsoidTangentPlane.prototype
         * @type {Ellipsoid}
         */
        ellipsoid : {
            get : function() {
                return this._ellipsoid;
            }
        },

        /**
         * Gets the origin.
         * @memberof EllipsoidTangentPlane.prototype
         * @type {Cartesian3}
         */
        origin : {
            get : function() {
                return this._origin;
            }
        },

        /**
         * Gets the plane which is tangent to the ellipsoid.
         * @memberof EllipsoidTangentPlane.prototype
         * @readonly
         * @type {Plane}
         */
        plane : {
            get : function() {
                return this._plane;
            }
        },

        /**
         * Gets the local X-axis (east) of the tangent plane.
         * @memberof EllipsoidTangentPlane.prototype
         * @readonly
         * @type {Cartesian3}
         */
        xAxis : {
            get : function() {
                return this._xAxis;
            }
        },

        /**
         * Gets the local Y-axis (north) of the tangent plane.
         * @memberof EllipsoidTangentPlane.prototype
         * @readonly
         * @type {Cartesian3}
         */
        yAxis : {
            get : function() {
                return this._yAxis;
            }
        },

        /**
         * Gets the local Z-axis (up) of the tangent plane.
         * @member EllipsoidTangentPlane.prototype
         * @readonly
         * @type {Cartesian3}
         */
        zAxis : {
            get : function() {
                return this._plane.normal;
            }
        }
    });

    var tmp = new AxisAlignedBoundingBox();
    /**
     * Creates a new instance from the provided ellipsoid and the center
     * point of the provided Cartesians.
     *
     * @param {Ellipsoid} ellipsoid The ellipsoid to use.
     * @param {Cartesian3} cartesians The list of positions surrounding the center point.
     */
    EllipsoidTangentPlane.fromPoints = function(cartesians, ellipsoid) {
                if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }
        
        var box = AxisAlignedBoundingBox.fromPoints(cartesians, tmp);
        return new EllipsoidTangentPlane(box.center, ellipsoid);
    };

    var scratchProjectPointOntoPlaneRay = new Ray();
    var scratchProjectPointOntoPlaneCartesian3 = new Cartesian3();

    /**
     * Computes the projection of the provided 3D position onto the 2D plane, radially outward from the {@link EllipsoidTangentPlane.ellipsoid} coordinate system origin.
     *
     * @param {Cartesian3} cartesian The point to project.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided. Undefined if there is no intersection point
     */
    EllipsoidTangentPlane.prototype.projectPointOntoPlane = function(cartesian, result) {
                if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }
        
        var ray = scratchProjectPointOntoPlaneRay;
        ray.origin = cartesian;
        Cartesian3.normalize(cartesian, ray.direction);

        var intersectionPoint = IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
        if (!defined(intersectionPoint)) {
            Cartesian3.negate(ray.direction, ray.direction);
            intersectionPoint = IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
        }

        if (defined(intersectionPoint)) {
            var v = Cartesian3.subtract(intersectionPoint, this._origin, intersectionPoint);
            var x = Cartesian3.dot(this._xAxis, v);
            var y = Cartesian3.dot(this._yAxis, v);

            if (!defined(result)) {
                return new Cartesian2(x, y);
            }
            result.x = x;
            result.y = y;
            return result;
        }
        return undefined;
    };

    /**
     * Computes the projection of the provided 3D positions onto the 2D plane (where possible), radially outward from the global origin.
     * The resulting array may be shorter than the input array - if a single projection is impossible it will not be included.
     *
     * @see EllipsoidTangentPlane.projectPointOntoPlane
     *
     * @param {Cartesian3[]} cartesians The array of points to project.
     * @param {Cartesian2[]} [result] The array of Cartesian2 instances onto which to store results.
     * @returns {Cartesian2[]} The modified result parameter or a new array of Cartesian2 instances if none was provided.
     */
    EllipsoidTangentPlane.prototype.projectPointsOntoPlane = function(cartesians, result) {
                if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }
        
        if (!defined(result)) {
            result = [];
        }

        var count = 0;
        var length = cartesians.length;
        for ( var i = 0; i < length; i++) {
            var p = this.projectPointOntoPlane(cartesians[i], result[count]);
            if (defined(p)) {
                result[count] = p;
                count++;
            }
        }
        result.length = count;
        return result;
    };

    /**
     * Computes the projection of the provided 3D position onto the 2D plane, along the plane normal.
     *
     * @param {Cartesian3} cartesian The point to project.
     * @param {Cartesian2} [result] The object onto which to store the result.
     * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
     */
    EllipsoidTangentPlane.prototype.projectPointToNearestOnPlane = function(cartesian, result) {
                if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }
        
        if (!defined(result)) {
            result = new Cartesian2();
        }

        var ray = scratchProjectPointOntoPlaneRay;
        ray.origin = cartesian;
        Cartesian3.clone(this._plane.normal, ray.direction);

        var intersectionPoint = IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
        if (!defined(intersectionPoint)) {
            Cartesian3.negate(ray.direction, ray.direction);
            intersectionPoint = IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
        }

        var v = Cartesian3.subtract(intersectionPoint, this._origin, intersectionPoint);
        var x = Cartesian3.dot(this._xAxis, v);
        var y = Cartesian3.dot(this._yAxis, v);

        result.x = x;
        result.y = y;
        return result;
    };

    /**
     * Computes the projection of the provided 3D positions onto the 2D plane, along the plane normal.
     *
     * @see EllipsoidTangentPlane.projectPointToNearestOnPlane
     *
     * @param {Cartesian3[]} cartesians The array of points to project.
     * @param {Cartesian2[]} [result] The array of Cartesian2 instances onto which to store results.
     * @returns {Cartesian2[]} The modified result parameter or a new array of Cartesian2 instances if none was provided. This will have the same length as <code>cartesians</code>.
     */
    EllipsoidTangentPlane.prototype.projectPointsToNearestOnPlane = function(cartesians, result) {
                if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }
        
        if (!defined(result)) {
            result = [];
        }

        var length = cartesians.length;
        result.length = length;
        for (var i = 0; i < length; i++) {
            result[i] = this.projectPointToNearestOnPlane(cartesians[i], result[i]);
        }
        return result;
    };

    var projectPointsOntoEllipsoidScratch = new Cartesian3();
    /**
     * Computes the projection of the provided 2D positions onto the 3D ellipsoid.
     *
     * @param {Cartesian2[]} cartesians The array of points to project.
     * @param {Cartesian3[]} [result] The array of Cartesian3 instances onto which to store results.
     * @returns {Cartesian3[]} The modified result parameter or a new array of Cartesian3 instances if none was provided.
     */
    EllipsoidTangentPlane.prototype.projectPointsOntoEllipsoid = function(cartesians, result) {
                if (!defined(cartesians)) {
            throw new DeveloperError('cartesians is required.');
        }
        
        var length = cartesians.length;
        if (!defined(result)) {
            result = new Array(length);
        } else {
            result.length = length;
        }

        var ellipsoid = this._ellipsoid;
        var origin = this._origin;
        var xAxis = this._xAxis;
        var yAxis = this._yAxis;
        var tmp = projectPointsOntoEllipsoidScratch;

        for ( var i = 0; i < length; ++i) {
            var position = cartesians[i];
            Cartesian3.multiplyByScalar(xAxis, position.x, tmp);
            if (!defined(result[i])) {
                result[i] = new Cartesian3();
            }
            var point = Cartesian3.add(origin, tmp, result[i]);
            Cartesian3.multiplyByScalar(yAxis, position.y, tmp);
            Cartesian3.add(point, tmp, point);
            ellipsoid.scaleToGeocentricSurface(point, point);
        }

        return result;
    };

    return EllipsoidTangentPlane;
});

/*global define*/
define('Core/OrientedBoundingBox',[
        './BoundingSphere',
        './Cartesian2',
        './Cartesian3',
        './Cartographic',
        './defaultValue',
        './defined',
        './DeveloperError',
        './Ellipsoid',
        './EllipsoidTangentPlane',
        './Intersect',
        './Interval',
        './Math',
        './Matrix3',
        './Plane',
        './Rectangle'
    ], function(
        BoundingSphere,
        Cartesian2,
        Cartesian3,
        Cartographic,
        defaultValue,
        defined,
        DeveloperError,
        Ellipsoid,
        EllipsoidTangentPlane,
        Intersect,
        Interval,
        CesiumMath,
        Matrix3,
        Plane,
        Rectangle) {
    'use strict';

    /**
     * Creates an instance of an OrientedBoundingBox.
     * An OrientedBoundingBox of some object is a closed and convex cuboid. It can provide a tighter bounding volume than {@link BoundingSphere} or {@link AxisAlignedBoundingBox} in many cases.
     * @alias OrientedBoundingBox
     * @constructor
     *
     * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the box.
     * @param {Matrix3} [halfAxes=Matrix3.ZERO] The three orthogonal half-axes of the bounding box.
     *                                          Equivalently, the transformation matrix, to rotate and scale a 2x2x2
     *                                          cube centered at the origin.
     *
     *
     * @example
     * // Create an OrientedBoundingBox using a transformation matrix, a position where the box will be translated, and a scale.
     * var center = new Cesium.Cartesian3(1.0, 0.0, 0.0);
     * var halfAxes = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(1.0, 3.0, 2.0), new Cesium.Matrix3());
     *
     * var obb = new Cesium.OrientedBoundingBox(center, halfAxes);
     *
     * @see BoundingSphere
     * @see BoundingRectangle
     */
    function OrientedBoundingBox(center, halfAxes) {
        /**
         * The center of the box.
         * @type {Cartesian3}
         * @default {@link Cartesian3.ZERO}
         */
        this.center = Cartesian3.clone(defaultValue(center, Cartesian3.ZERO));
        /**
         * The transformation matrix, to rotate the box to the right position.
         * @type {Matrix3}
         * @default {@link Matrix3.IDENTITY}
         */
        this.halfAxes = Matrix3.clone(defaultValue(halfAxes, Matrix3.ZERO));
    }

    var scratchCartesian1 = new Cartesian3();
    var scratchCartesian2 = new Cartesian3();
    var scratchCartesian3 = new Cartesian3();
    var scratchCartesian4 = new Cartesian3();
    var scratchCartesian5 = new Cartesian3();
    var scratchCartesian6 = new Cartesian3();
    var scratchCovarianceResult = new Matrix3();
    var scratchEigenResult = {
        unitary : new Matrix3(),
        diagonal : new Matrix3()
    };

    /**
     * Computes an instance of an OrientedBoundingBox of the given positions.
     * This is an implementation of Stefan Gottschalk's Collision Queries using Oriented Bounding Boxes solution (PHD thesis).
     * Reference: http://gamma.cs.unc.edu/users/gottschalk/main.pdf
     *
     * @param {Cartesian3[]} positions List of {@link Cartesian3} points that the bounding box will enclose.
     * @param {OrientedBoundingBox} [result] The object onto which to store the result.
     * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if one was not provided.
     *
     * @example
     * // Compute an object oriented bounding box enclosing two points.
     * var box = Cesium.OrientedBoundingBox.fromPoints([new Cesium.Cartesian3(2, 0, 0), new Cesium.Cartesian3(-2, 0, 0)]);
     */
    OrientedBoundingBox.fromPoints = function(positions, result) {
        if (!defined(result)) {
            result = new OrientedBoundingBox();
        }

        if (!defined(positions) || positions.length === 0) {
            result.halfAxes = Matrix3.ZERO;
            result.center = Cartesian3.ZERO;
            return result;
        }

        var i;
        var length = positions.length;

        var meanPoint = Cartesian3.clone(positions[0], scratchCartesian1);
        for (i = 1; i < length; i++) {
            Cartesian3.add(meanPoint, positions[i], meanPoint);
        }
        var invLength = 1.0 / length;
        Cartesian3.multiplyByScalar(meanPoint, invLength, meanPoint);

        var exx = 0.0;
        var exy = 0.0;
        var exz = 0.0;
        var eyy = 0.0;
        var eyz = 0.0;
        var ezz = 0.0;
        var p;

        for (i = 0; i < length; i++) {
            p = Cartesian3.subtract(positions[i], meanPoint, scratchCartesian2);
            exx += p.x * p.x;
            exy += p.x * p.y;
            exz += p.x * p.z;
            eyy += p.y * p.y;
            eyz += p.y * p.z;
            ezz += p.z * p.z;
        }

        exx *= invLength;
        exy *= invLength;
        exz *= invLength;
        eyy *= invLength;
        eyz *= invLength;
        ezz *= invLength;

        var covarianceMatrix = scratchCovarianceResult;
        covarianceMatrix[0] = exx;
        covarianceMatrix[1] = exy;
        covarianceMatrix[2] = exz;
        covarianceMatrix[3] = exy;
        covarianceMatrix[4] = eyy;
        covarianceMatrix[5] = eyz;
        covarianceMatrix[6] = exz;
        covarianceMatrix[7] = eyz;
        covarianceMatrix[8] = ezz;

        var eigenDecomposition = Matrix3.computeEigenDecomposition(covarianceMatrix, scratchEigenResult);
        var rotation = Matrix3.clone(eigenDecomposition.unitary, result.halfAxes);

        var v1 = Matrix3.getColumn(rotation, 0, scratchCartesian4);
        var v2 = Matrix3.getColumn(rotation, 1, scratchCartesian5);
        var v3 = Matrix3.getColumn(rotation, 2, scratchCartesian6);

        var u1 = -Number.MAX_VALUE;
        var u2 = -Number.MAX_VALUE;
        var u3 = -Number.MAX_VALUE;
        var l1 = Number.MAX_VALUE;
        var l2 = Number.MAX_VALUE;
        var l3 = Number.MAX_VALUE;

        for (i = 0; i < length; i++) {
            p = positions[i];
            u1 = Math.max(Cartesian3.dot(v1, p), u1);
            u2 = Math.max(Cartesian3.dot(v2, p), u2);
            u3 = Math.max(Cartesian3.dot(v3, p), u3);

            l1 = Math.min(Cartesian3.dot(v1, p), l1);
            l2 = Math.min(Cartesian3.dot(v2, p), l2);
            l3 = Math.min(Cartesian3.dot(v3, p), l3);
        }

        v1 = Cartesian3.multiplyByScalar(v1, 0.5 * (l1 + u1), v1);
        v2 = Cartesian3.multiplyByScalar(v2, 0.5 * (l2 + u2), v2);
        v3 = Cartesian3.multiplyByScalar(v3, 0.5 * (l3 + u3), v3);

        var center = Cartesian3.add(v1, v2, result.center);
        center = Cartesian3.add(center, v3, center);

        var scale = scratchCartesian3;
        scale.x = u1 - l1;
        scale.y = u2 - l2;
        scale.z = u3 - l3;
        Cartesian3.multiplyByScalar(scale, 0.5, scale);
        Matrix3.multiplyByScale(result.halfAxes, scale, result.halfAxes);

        return result;
    };

    var scratchOffset = new Cartesian3();
    var scratchScale = new Cartesian3();
    /**
     * Computes an OrientedBoundingBox given extents in the east-north-up space of the tangent plane.
     *
     * @param {Plane} tangentPlane The tangent place corresponding to east-north-up.
     * @param {Number} minimumX Minimum X extent in tangent plane space.
     * @param {Number} maximumX Maximum X extent in tangent plane space.
     * @param {Number} minimumY Minimum Y extent in tangent plane space.
     * @param {Number} maximumY Maximum Y extent in tangent plane space.
     * @param {Number} minimumZ Minimum Z extent in tangent plane space.
     * @param {Number} maximumZ Maximum Z extent in tangent plane space.
     * @param {OrientedBoundingBox} [result] The object onto which to store the result.
     * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if one was not provided.
     */
    function fromTangentPlaneExtents(tangentPlane, minimumX, maximumX, minimumY, maximumY, minimumZ, maximumZ, result) {
                if (!defined(minimumX) ||
            !defined(maximumX) ||
            !defined(minimumY) ||
            !defined(maximumY) ||
            !defined(minimumZ) ||
            !defined(maximumZ)) {
            throw new DeveloperError('all extents (minimum/maximum X/Y/Z) are required.');
        }
        
        if (!defined(result)) {
            result = new OrientedBoundingBox();
        }

        var halfAxes = result.halfAxes;
        Matrix3.setColumn(halfAxes, 0, tangentPlane.xAxis, halfAxes);
        Matrix3.setColumn(halfAxes, 1, tangentPlane.yAxis, halfAxes);
        Matrix3.setColumn(halfAxes, 2, tangentPlane.zAxis, halfAxes);

        var centerOffset = scratchOffset;
        centerOffset.x = (minimumX + maximumX) / 2.0;
        centerOffset.y = (minimumY + maximumY) / 2.0;
        centerOffset.z = (minimumZ + maximumZ) / 2.0;

        var scale = scratchScale;
        scale.x = (maximumX - minimumX) / 2.0;
        scale.y = (maximumY - minimumY) / 2.0;
        scale.z = (maximumZ - minimumZ) / 2.0;

        var center = result.center;
        centerOffset = Matrix3.multiplyByVector(halfAxes, centerOffset, centerOffset);
        Cartesian3.add(tangentPlane.origin, centerOffset, center);
        Matrix3.multiplyByScale(halfAxes, scale, halfAxes);

        return result;
    }

    var scratchRectangleCenterCartographic = new Cartographic();
    var scratchRectangleCenter = new Cartesian3();
    var perimeterCartographicScratch = [new Cartographic(), new Cartographic(), new Cartographic(), new Cartographic(), new Cartographic(), new Cartographic(), new Cartographic(), new Cartographic()];
    var perimeterCartesianScratch = [new Cartesian3(), new Cartesian3(), new Cartesian3(), new Cartesian3(), new Cartesian3(), new Cartesian3(), new Cartesian3(), new Cartesian3()];
    var perimeterProjectedScratch = [new Cartesian2(), new Cartesian2(), new Cartesian2(), new Cartesian2(), new Cartesian2(), new Cartesian2(), new Cartesian2(), new Cartesian2()];
    /**
     * Computes an OrientedBoundingBox that bounds a {@link Rectangle} on the surface of an {@link Ellipsoid}.
     * There are no guarantees about the orientation of the bounding box.
     *
     * @param {Rectangle} rectangle The cartographic rectangle on the surface of the ellipsoid.
     * @param {Number} [minimumHeight=0.0] The minimum height (elevation) within the tile.
     * @param {Number} [maximumHeight=0.0] The maximum height (elevation) within the tile.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the rectangle is defined.
     * @param {OrientedBoundingBox} [result] The object onto which to store the result.
     * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if none was provided.
     *
     * @exception {DeveloperError} rectangle.width must be between 0 and pi.
     * @exception {DeveloperError} rectangle.height must be between 0 and pi.
     * @exception {DeveloperError} ellipsoid must be an ellipsoid of revolution (<code>radii.x == radii.y</code>)
     */
    OrientedBoundingBox.fromRectangle = function(rectangle, minimumHeight, maximumHeight, ellipsoid, result) {
                if (!defined(rectangle)) {
            throw new DeveloperError('rectangle is required');
        }
        if (rectangle.width < 0.0 || rectangle.width > CesiumMath.PI) {
            throw new DeveloperError('Rectangle width must be between 0 and pi');
        }
        if (rectangle.height < 0.0 || rectangle.height > CesiumMath.PI) {
            throw new DeveloperError('Rectangle height must be between 0 and pi');
        }
        if (defined(ellipsoid) && !CesiumMath.equalsEpsilon(ellipsoid.radii.x, ellipsoid.radii.y, CesiumMath.EPSILON15)) {
            throw new DeveloperError('Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)');
        }
        
        minimumHeight = defaultValue(minimumHeight, 0.0);
        maximumHeight = defaultValue(maximumHeight, 0.0);
        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

        // The bounding box will be aligned with the tangent plane at the center of the rectangle.
        var tangentPointCartographic = Rectangle.center(rectangle, scratchRectangleCenterCartographic);
        var tangentPoint = ellipsoid.cartographicToCartesian(tangentPointCartographic, scratchRectangleCenter);
        var tangentPlane = new EllipsoidTangentPlane(tangentPoint, ellipsoid);
        var plane = tangentPlane.plane;

        // Corner arrangement:
        //          N/+y
        //      [0] [1] [2]
        // W/-x [7]     [3] E/+x
        //      [6] [5] [4]
        //          S/-y
        // "C" refers to the central lat/long, which by default aligns with the tangent point (above).
        // If the rectangle spans the equator, CW and CE are instead aligned with the equator.
        var perimeterNW = perimeterCartographicScratch[0];
        var perimeterNC = perimeterCartographicScratch[1];
        var perimeterNE = perimeterCartographicScratch[2];
        var perimeterCE = perimeterCartographicScratch[3];
        var perimeterSE = perimeterCartographicScratch[4];
        var perimeterSC = perimeterCartographicScratch[5];
        var perimeterSW = perimeterCartographicScratch[6];
        var perimeterCW = perimeterCartographicScratch[7];

        var lonCenter = tangentPointCartographic.longitude;
        var latCenter = (rectangle.south < 0.0 && rectangle.north > 0.0) ? 0.0 : tangentPointCartographic.latitude;
        perimeterSW.latitude = perimeterSC.latitude = perimeterSE.latitude = rectangle.south;
        perimeterCW.latitude = perimeterCE.latitude = latCenter;
        perimeterNW.latitude = perimeterNC.latitude = perimeterNE.latitude = rectangle.north;
        perimeterSW.longitude = perimeterCW.longitude = perimeterNW.longitude = rectangle.west;
        perimeterSC.longitude = perimeterNC.longitude = lonCenter;
        perimeterSE.longitude = perimeterCE.longitude = perimeterNE.longitude = rectangle.east;

        // Compute XY extents using the rectangle at maximum height
        perimeterNE.height = perimeterNC.height = perimeterNW.height = perimeterCW.height = perimeterSW.height = perimeterSC.height = perimeterSE.height = perimeterCE.height = maximumHeight;

        ellipsoid.cartographicArrayToCartesianArray(perimeterCartographicScratch, perimeterCartesianScratch);
        tangentPlane.projectPointsToNearestOnPlane(perimeterCartesianScratch, perimeterProjectedScratch);
        // See the `perimeterXX` definitions above for what these are
        var minX = Math.min(perimeterProjectedScratch[6].x, perimeterProjectedScratch[7].x, perimeterProjectedScratch[0].x);
        var maxX = Math.max(perimeterProjectedScratch[2].x, perimeterProjectedScratch[3].x, perimeterProjectedScratch[4].x);
        var minY = Math.min(perimeterProjectedScratch[4].y, perimeterProjectedScratch[5].y, perimeterProjectedScratch[6].y);
        var maxY = Math.max(perimeterProjectedScratch[0].y, perimeterProjectedScratch[1].y, perimeterProjectedScratch[2].y);

        // Compute minimum Z using the rectangle at minimum height
        perimeterNE.height = perimeterNW.height = perimeterSE.height = perimeterSW.height = minimumHeight;
        ellipsoid.cartographicArrayToCartesianArray(perimeterCartographicScratch, perimeterCartesianScratch);
        var minZ = Math.min(Plane.getPointDistance(plane, perimeterCartesianScratch[0]),
                            Plane.getPointDistance(plane, perimeterCartesianScratch[2]),
                            Plane.getPointDistance(plane, perimeterCartesianScratch[4]),
                            Plane.getPointDistance(plane, perimeterCartesianScratch[6]));
        var maxZ = maximumHeight;  // Since the tangent plane touches the surface at height = 0, this is okay

        return fromTangentPlaneExtents(tangentPlane, minX, maxX, minY, maxY, minZ, maxZ, result);
    };

    /**
     * Duplicates a OrientedBoundingBox instance.
     *
     * @param {OrientedBoundingBox} box The bounding box to duplicate.
     * @param {OrientedBoundingBox} [result] The object onto which to store the result.
     * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
     */
    OrientedBoundingBox.clone = function(box, result) {
        if (!defined(box)) {
            return undefined;
        }

        if (!defined(result)) {
            return new OrientedBoundingBox(box.center, box.halfAxes);
        }

        Cartesian3.clone(box.center, result.center);
        Matrix3.clone(box.halfAxes, result.halfAxes);

        return result;
    };

    /**
     * Determines which side of a plane the oriented bounding box is located.
     *
     * @param {OrientedBoundingBox} box The oriented bounding box to test.
     * @param {Plane} plane The plane to test against.
     * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
     *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
     *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
     *                      intersects the plane.
     */
    OrientedBoundingBox.intersectPlane = function(box, plane) {
                if (!defined(box)) {
            throw new DeveloperError('box is required.');
        }

        if (!defined(plane)) {
            throw new DeveloperError('plane is required.');
        }
        
        var center = box.center;
        var normal = plane.normal;
        var halfAxes = box.halfAxes;
        var normalX = normal.x, normalY = normal.y, normalZ = normal.z;
        // plane is used as if it is its normal; the first three components are assumed to be normalized
        var radEffective = Math.abs(normalX * halfAxes[Matrix3.COLUMN0ROW0] + normalY * halfAxes[Matrix3.COLUMN0ROW1] + normalZ * halfAxes[Matrix3.COLUMN0ROW2]) +
                           Math.abs(normalX * halfAxes[Matrix3.COLUMN1ROW0] + normalY * halfAxes[Matrix3.COLUMN1ROW1] + normalZ * halfAxes[Matrix3.COLUMN1ROW2]) +
                           Math.abs(normalX * halfAxes[Matrix3.COLUMN2ROW0] + normalY * halfAxes[Matrix3.COLUMN2ROW1] + normalZ * halfAxes[Matrix3.COLUMN2ROW2]);
        var distanceToPlane = Cartesian3.dot(normal, center) + plane.distance;

        if (distanceToPlane <= -radEffective) {
            // The entire box is on the negative side of the plane normal
            return Intersect.OUTSIDE;
        } else if (distanceToPlane >= radEffective) {
            // The entire box is on the positive side of the plane normal
            return Intersect.INSIDE;
        }
        return Intersect.INTERSECTING;
    };

    var scratchCartesianU = new Cartesian3();
    var scratchCartesianV = new Cartesian3();
    var scratchCartesianW = new Cartesian3();
    var scratchPPrime = new Cartesian3();

    /**
     * Computes the estimated distance squared from the closest point on a bounding box to a point.
     *
     * @param {OrientedBoundingBox} box The box.
     * @param {Cartesian3} cartesian The point
     * @returns {Number} The estimated distance squared from the bounding sphere to the point.
     *
     * @example
     * // Sort bounding boxes from back to front
     * boxes.sort(function(a, b) {
     *     return Cesium.OrientedBoundingBox.distanceSquaredTo(b, camera.positionWC) - Cesium.OrientedBoundingBox.distanceSquaredTo(a, camera.positionWC);
     * });
     */
    OrientedBoundingBox.distanceSquaredTo = function(box, cartesian) {
        // See Geometric Tools for Computer Graphics 10.4.2

                if (!defined(box)) {
            throw new DeveloperError('box is required.');
        }
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required.');
        }
        
        var offset = Cartesian3.subtract(cartesian, box.center, scratchOffset);

        var halfAxes = box.halfAxes;
        var u = Matrix3.getColumn(halfAxes, 0, scratchCartesianU);
        var v = Matrix3.getColumn(halfAxes, 1, scratchCartesianV);
        var w = Matrix3.getColumn(halfAxes, 2, scratchCartesianW);

        var uHalf = Cartesian3.magnitude(u);
        var vHalf = Cartesian3.magnitude(v);
        var wHalf = Cartesian3.magnitude(w);

        Cartesian3.normalize(u, u);
        Cartesian3.normalize(v, v);
        Cartesian3.normalize(w, w);

        var pPrime = scratchPPrime;
        pPrime.x = Cartesian3.dot(offset, u);
        pPrime.y = Cartesian3.dot(offset, v);
        pPrime.z = Cartesian3.dot(offset, w);

        var distanceSquared = 0.0;
        var d;

        if (pPrime.x < -uHalf) {
            d = pPrime.x + uHalf;
            distanceSquared += d * d;
        } else if (pPrime.x > uHalf) {
            d = pPrime.x - uHalf;
            distanceSquared += d * d;
        }

        if (pPrime.y < -vHalf) {
            d = pPrime.y + vHalf;
            distanceSquared += d * d;
        } else if (pPrime.y > vHalf) {
            d = pPrime.y - vHalf;
            distanceSquared += d * d;
        }

        if (pPrime.z < -wHalf) {
            d = pPrime.z + wHalf;
            distanceSquared += d * d;
        } else if (pPrime.z > wHalf) {
            d = pPrime.z - wHalf;
            distanceSquared += d * d;
        }

        return distanceSquared;
    };

    var scratchCorner = new Cartesian3();
    var scratchToCenter = new Cartesian3();

    /**
     * The distances calculated by the vector from the center of the bounding box to position projected onto direction.
     * <br>
     * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
     * closest and farthest planes from position that intersect the bounding box.
     *
     * @param {OrientedBoundingBox} box The bounding box to calculate the distance to.
     * @param {Cartesian3} position The position to calculate the distance from.
     * @param {Cartesian3} direction The direction from position.
     * @param {Interval} [result] A Interval to store the nearest and farthest distances.
     * @returns {Interval} The nearest and farthest distances on the bounding box from position in direction.
     */
    OrientedBoundingBox.computePlaneDistances = function(box, position, direction, result) {
                if (!defined(box)) {
            throw new DeveloperError('box is required.');
        }

        if (!defined(position)) {
            throw new DeveloperError('position is required.');
        }

        if (!defined(direction)) {
            throw new DeveloperError('direction is required.');
        }
        
        if (!defined(result)) {
            result = new Interval();
        }

        var minDist = Number.POSITIVE_INFINITY;
        var maxDist = Number.NEGATIVE_INFINITY;

        var center = box.center;
        var halfAxes = box.halfAxes;

        var u = Matrix3.getColumn(halfAxes, 0, scratchCartesianU);
        var v = Matrix3.getColumn(halfAxes, 1, scratchCartesianV);
        var w = Matrix3.getColumn(halfAxes, 2, scratchCartesianW);

        // project first corner
        var corner = Cartesian3.add(u, v, scratchCorner);
        Cartesian3.add(corner, w, corner);
        Cartesian3.add(corner, center, corner);

        var toCenter = Cartesian3.subtract(corner, position, scratchToCenter);
        var mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project second corner
        Cartesian3.add(center, u, corner);
        Cartesian3.add(corner, v, corner);
        Cartesian3.subtract(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project third corner
        Cartesian3.add(center, u, corner);
        Cartesian3.subtract(corner, v, corner);
        Cartesian3.add(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project fourth corner
        Cartesian3.add(center, u, corner);
        Cartesian3.subtract(corner, v, corner);
        Cartesian3.subtract(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project fifth corner
        Cartesian3.subtract(center, u, corner);
        Cartesian3.add(corner, v, corner);
        Cartesian3.add(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project sixth corner
        Cartesian3.subtract(center, u, corner);
        Cartesian3.add(corner, v, corner);
        Cartesian3.subtract(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project seventh corner
        Cartesian3.subtract(center, u, corner);
        Cartesian3.subtract(corner, v, corner);
        Cartesian3.add(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        // project eighth corner
        Cartesian3.subtract(center, u, corner);
        Cartesian3.subtract(corner, v, corner);
        Cartesian3.subtract(corner, w, corner);

        Cartesian3.subtract(corner, position, toCenter);
        mag = Cartesian3.dot(direction, toCenter);

        minDist = Math.min(mag, minDist);
        maxDist = Math.max(mag, maxDist);

        result.start = minDist;
        result.stop = maxDist;
        return result;
    };

    var scratchBoundingSphere = new BoundingSphere();

    /**
     * Determines whether or not a bounding box is hidden from view by the occluder.
     *
     * @param {OrientedBoundingBox} box The bounding box surrounding the occludee object.
     * @param {Occluder} occluder The occluder.
     * @returns {Boolean} <code>true</code> if the box is not visible; otherwise <code>false</code>.
     */
    OrientedBoundingBox.isOccluded = function(box, occluder) {
                if (!defined(box)) {
            throw new DeveloperError('box is required.');
        }
        if (!defined(occluder)) {
            throw new DeveloperError('occluder is required.');
        }
        
        var sphere = BoundingSphere.fromOrientedBoundingBox(box, scratchBoundingSphere);

        return !occluder.isBoundingSphereVisible(sphere);
    };

    /**
     * Determines which side of a plane the oriented bounding box is located.
     *
     * @param {Plane} plane The plane to test against.
     * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
     *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
     *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
     *                      intersects the plane.
     */
    OrientedBoundingBox.prototype.intersectPlane = function(plane) {
        return OrientedBoundingBox.intersectPlane(this, plane);
    };

    /**
     * Computes the estimated distance squared from the closest point on a bounding box to a point.
     *
     * @param {Cartesian3} cartesian The point
     * @returns {Number} The estimated distance squared from the bounding sphere to the point.
     *
     * @example
     * // Sort bounding boxes from back to front
     * boxes.sort(function(a, b) {
     *     return b.distanceSquaredTo(camera.positionWC) - a.distanceSquaredTo(camera.positionWC);
     * });
     */
    OrientedBoundingBox.prototype.distanceSquaredTo = function(cartesian) {
        return OrientedBoundingBox.distanceSquaredTo(this, cartesian);
    };

    /**
     * The distances calculated by the vector from the center of the bounding box to position projected onto direction.
     * <br>
     * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
     * closest and farthest planes from position that intersect the bounding box.
     *
     * @param {Cartesian3} position The position to calculate the distance from.
     * @param {Cartesian3} direction The direction from position.
     * @param {Interval} [result] A Interval to store the nearest and farthest distances.
     * @returns {Interval} The nearest and farthest distances on the bounding box from position in direction.
     */
    OrientedBoundingBox.prototype.computePlaneDistances = function(position, direction, result) {
        return OrientedBoundingBox.computePlaneDistances(this, position, direction, result);
    };

    /**
     * Determines whether or not a bounding box is hidden from view by the occluder.
     *
     * @param {Occluder} occluder The occluder.
     * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
     */
    OrientedBoundingBox.prototype.isOccluded = function(occluder) {
        return OrientedBoundingBox.isOccluded(this, occluder);
    };

    /**
     * Compares the provided OrientedBoundingBox componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {OrientedBoundingBox} left The first OrientedBoundingBox.
     * @param {OrientedBoundingBox} right The second OrientedBoundingBox.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    OrientedBoundingBox.equals = function(left, right) {
        return (left === right) ||
                ((defined(left)) &&
                 (defined(right)) &&
                 Cartesian3.equals(left.center, right.center) &&
                 Matrix3.equals(left.halfAxes, right.halfAxes));
    };

    /**
     * Duplicates this OrientedBoundingBox instance.
     *
     * @param {OrientedBoundingBox} [result] The object onto which to store the result.
     * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if one was not provided.
     */
    OrientedBoundingBox.prototype.clone = function(result) {
        return OrientedBoundingBox.clone(this, result);
    };

    /**
     * Compares this OrientedBoundingBox against the provided OrientedBoundingBox componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {OrientedBoundingBox} [right] The right hand side OrientedBoundingBox.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    OrientedBoundingBox.prototype.equals = function(right) {
        return OrientedBoundingBox.equals(this, right);
    };

    return OrientedBoundingBox;
});

/*global define*/
define('Core/ComponentDatatype',[
        './defaultValue',
        './defined',
        './DeveloperError',
        './FeatureDetection',
        './freezeObject',
        './WebGLConstants'
    ], function(
        defaultValue,
        defined,
        DeveloperError,
        FeatureDetection,
        freezeObject,
        WebGLConstants) {
    'use strict';

    // Bail out if the browser doesn't support typed arrays, to prevent the setup function
    // from failing, since we won't be able to create a WebGL context anyway.
    if (!FeatureDetection.supportsTypedArrays()) {
        return {};
    }

    /**
     * WebGL component datatypes.  Components are intrinsics,
     * which form attributes, which form vertices.
     *
     * @exports ComponentDatatype
     */
    var ComponentDatatype = {
        /**
         * 8-bit signed byte corresponding to <code>gl.BYTE</code> and the type
         * of an element in <code>Int8Array</code>.
         *
         * @type {Number}
         * @constant
         */
        BYTE : WebGLConstants.BYTE,

        /**
         * 8-bit unsigned byte corresponding to <code>UNSIGNED_BYTE</code> and the type
         * of an element in <code>Uint8Array</code>.
         *
         * @type {Number}
         * @constant
         */
        UNSIGNED_BYTE : WebGLConstants.UNSIGNED_BYTE,

        /**
         * 16-bit signed short corresponding to <code>SHORT</code> and the type
         * of an element in <code>Int16Array</code>.
         *
         * @type {Number}
         * @constant
         */
        SHORT : WebGLConstants.SHORT,

        /**
         * 16-bit unsigned short corresponding to <code>UNSIGNED_SHORT</code> and the type
         * of an element in <code>Uint16Array</code>.
         *
         * @type {Number}
         * @constant
         */
        UNSIGNED_SHORT : WebGLConstants.UNSIGNED_SHORT,

        /**
         * 32-bit signed int corresponding to <code>INT</code> and the type
         * of an element in <code>Int32Array</code>.
         *
         * @memberOf ComponentDatatype
         *
         * @type {Number}
         * @constant
         */
        INT : WebGLConstants.INT,

        /**
         * 32-bit unsigned int corresponding to <code>UNSIGNED_INT</code> and the type
         * of an element in <code>Uint32Array</code>.
         *
         * @memberOf ComponentDatatype
         *
         * @type {Number}
         * @constant
         */
        UNSIGNED_INT : WebGLConstants.UNSIGNED_INT,

        /**
         * 32-bit floating-point corresponding to <code>FLOAT</code> and the type
         * of an element in <code>Float32Array</code>.
         *
         * @type {Number}
         * @constant
         */
        FLOAT : WebGLConstants.FLOAT,

        /**
         * 64-bit floating-point corresponding to <code>gl.DOUBLE</code> (in Desktop OpenGL;
         * this is not supported in WebGL, and is emulated in Cesium via {@link GeometryPipeline.encodeAttribute})
         * and the type of an element in <code>Float64Array</code>.
         *
         * @memberOf ComponentDatatype
         *
         * @type {Number}
         * @constant
         * @default 0x140A
         */
        DOUBLE : WebGLConstants.DOUBLE
    };

    /**
     * Returns the size, in bytes, of the corresponding datatype.
     *
     * @param {ComponentDatatype} componentDatatype The component datatype to get the size of.
     * @returns {Number} The size in bytes.
     *
     * @exception {DeveloperError} componentDatatype is not a valid value.
     *
     * @example
     * // Returns Int8Array.BYTES_PER_ELEMENT
     * var size = Cesium.ComponentDatatype.getSizeInBytes(Cesium.ComponentDatatype.BYTE);
     */
    ComponentDatatype.getSizeInBytes = function(componentDatatype){
                if (!defined(componentDatatype)) {
            throw new DeveloperError('value is required.');
        }
        
        switch (componentDatatype) {
        case ComponentDatatype.BYTE:
            return Int8Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.UNSIGNED_BYTE:
            return Uint8Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.SHORT:
            return Int16Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.UNSIGNED_SHORT:
            return Uint16Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.INT:
            return Int32Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.UNSIGNED_INT:
            return Uint32Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.FLOAT:
            return Float32Array.BYTES_PER_ELEMENT;
        case ComponentDatatype.DOUBLE:
            return Float64Array.BYTES_PER_ELEMENT;
                default:
            throw new DeveloperError('componentDatatype is not a valid value.');
                }
    };

    /**
     * Gets the {@link ComponentDatatype} for the provided TypedArray instance.
     *
     * @param {TypedArray} array The typed array.
     * @returns {ComponentDatatype} The ComponentDatatype for the provided array, or undefined if the array is not a TypedArray.
     */
    ComponentDatatype.fromTypedArray = function(array) {
        if (array instanceof Int8Array) {
            return ComponentDatatype.BYTE;
        }
        if (array instanceof Uint8Array) {
            return ComponentDatatype.UNSIGNED_BYTE;
        }
        if (array instanceof Int16Array) {
            return ComponentDatatype.SHORT;
        }
        if (array instanceof Uint16Array) {
            return ComponentDatatype.UNSIGNED_SHORT;
        }
        if (array instanceof Int32Array) {
            return ComponentDatatype.INT;
        }
        if (array instanceof Uint32Array) {
            return ComponentDatatype.UNSIGNED_INT;
        }
        if (array instanceof Float32Array) {
            return ComponentDatatype.FLOAT;
        }
        if (array instanceof Float64Array) {
            return ComponentDatatype.DOUBLE;
        }
    };

    /**
     * Validates that the provided component datatype is a valid {@link ComponentDatatype}
     *
     * @param {ComponentDatatype} componentDatatype The component datatype to validate.
     * @returns {Boolean} <code>true</code> if the provided component datatype is a valid value; otherwise, <code>false</code>.
     *
     * @example
     * if (!Cesium.ComponentDatatype.validate(componentDatatype)) {
     *   throw new Cesium.DeveloperError('componentDatatype must be a valid value.');
     * }
     */
    ComponentDatatype.validate = function(componentDatatype) {
        return defined(componentDatatype) &&
               (componentDatatype === ComponentDatatype.BYTE ||
                componentDatatype === ComponentDatatype.UNSIGNED_BYTE ||
                componentDatatype === ComponentDatatype.SHORT ||
                componentDatatype === ComponentDatatype.UNSIGNED_SHORT ||
                componentDatatype === ComponentDatatype.INT ||
                componentDatatype === ComponentDatatype.UNSIGNED_INT ||
                componentDatatype === ComponentDatatype.FLOAT ||
                componentDatatype === ComponentDatatype.DOUBLE);
    };

    /**
     * Creates a typed array corresponding to component data type.
     *
     * @param {ComponentDatatype} componentDatatype The component data type.
     * @param {Number|Array} valuesOrLength The length of the array to create or an array.
     * @returns {Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} A typed array.
     *
     * @exception {DeveloperError} componentDatatype is not a valid value.
     *
     * @example
     * // creates a Float32Array with length of 100
     * var typedArray = Cesium.ComponentDatatype.createTypedArray(Cesium.ComponentDatatype.FLOAT, 100);
     */
    ComponentDatatype.createTypedArray = function(componentDatatype, valuesOrLength) {
                if (!defined(componentDatatype)) {
            throw new DeveloperError('componentDatatype is required.');
        }
        if (!defined(valuesOrLength)) {
            throw new DeveloperError('valuesOrLength is required.');
        }
        
        switch (componentDatatype) {
        case ComponentDatatype.BYTE:
            return new Int8Array(valuesOrLength);
        case ComponentDatatype.UNSIGNED_BYTE:
            return new Uint8Array(valuesOrLength);
        case ComponentDatatype.SHORT:
            return new Int16Array(valuesOrLength);
        case ComponentDatatype.UNSIGNED_SHORT:
            return new Uint16Array(valuesOrLength);
        case ComponentDatatype.INT:
            return new Int32Array(valuesOrLength);
        case ComponentDatatype.UNSIGNED_INT:
            return new Uint32Array(valuesOrLength);
        case ComponentDatatype.FLOAT:
            return new Float32Array(valuesOrLength);
        case ComponentDatatype.DOUBLE:
            return new Float64Array(valuesOrLength);
                default:
            throw new DeveloperError('componentDatatype is not a valid value.');
                }
    };

    /**
     * Creates a typed view of an array of bytes.
     *
     * @param {ComponentDatatype} componentDatatype The type of the view to create.
     * @param {ArrayBuffer} buffer The buffer storage to use for the view.
     * @param {Number} [byteOffset] The offset, in bytes, to the first element in the view.
     * @param {Number} [length] The number of elements in the view.
     * @returns {Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} A typed array view of the buffer.
     *
     * @exception {DeveloperError} componentDatatype is not a valid value.
     */
    ComponentDatatype.createArrayBufferView = function(componentDatatype, buffer, byteOffset, length) {
                if (!defined(componentDatatype)) {
            throw new DeveloperError('componentDatatype is required.');
        }
        if (!defined(buffer)) {
            throw new DeveloperError('buffer is required.');
        }
        
        byteOffset = defaultValue(byteOffset, 0);
        length = defaultValue(length, (buffer.byteLength - byteOffset) / ComponentDatatype.getSizeInBytes(componentDatatype));

        switch (componentDatatype) {
        case ComponentDatatype.BYTE:
            return new Int8Array(buffer, byteOffset, length);
        case ComponentDatatype.UNSIGNED_BYTE:
            return new Uint8Array(buffer, byteOffset, length);
        case ComponentDatatype.SHORT:
            return new Int16Array(buffer, byteOffset, length);
        case ComponentDatatype.UNSIGNED_SHORT:
            return new Uint16Array(buffer, byteOffset, length);
        case ComponentDatatype.INT:
            return new Int32Array(buffer, byteOffset, length);
        case ComponentDatatype.UNSIGNED_INT:
            return new Uint32Array(buffer, byteOffset, length);
        case ComponentDatatype.FLOAT:
            return new Float32Array(buffer, byteOffset, length);
        case ComponentDatatype.DOUBLE:
            return new Float64Array(buffer, byteOffset, length);
                default:
            throw new DeveloperError('componentDatatype is not a valid value.');
                }
    };

    /**
     * Get the ComponentDatatype from its name.
     *
     * @param {String} name The name of the ComponentDatatype.
     * @returns {ComponentDatatype} The ComponentDatatype.
     *
     * @exception {DeveloperError} name is not a valid value.
     */
    ComponentDatatype.fromName = function(name) {
        switch (name) {
            case 'BYTE':
                return ComponentDatatype.BYTE;
            case 'UNSIGNED_BYTE':
                return ComponentDatatype.UNSIGNED_BYTE;
            case 'SHORT':
                return ComponentDatatype.SHORT;
            case 'UNSIGNED_SHORT':
                return ComponentDatatype.UNSIGNED_SHORT;
            case 'INT':
                return ComponentDatatype.INT;
            case 'UNSIGNED_INT':
                return ComponentDatatype.UNSIGNED_INT;
            case 'FLOAT':
                return ComponentDatatype.FLOAT;
            case 'DOUBLE':
                return ComponentDatatype.DOUBLE;
                        default:
                throw new DeveloperError('name is not a valid value.');
                    }
    };

    return freezeObject(ComponentDatatype);
});

/*global define*/
define('Core/TerrainQuantization',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * This enumerated type is used to determine how the vertices of the terrain mesh are compressed.
     *
     * @exports TerrainQuantization
     *
     * @private
     */
    var TerrainQuantization = {
        /**
         * The vertices are not compressed.
         *
         * @type {Number}
         * @constant
         */
        NONE : 0,

        /**
         * The vertices are compressed to 12 bits.
         *
         * @type {Number}
         * @constant
         */
        BITS12 : 1
    };

    return freezeObject(TerrainQuantization);
});

/*global define*/
define('Core/TerrainEncoding',[
        './AttributeCompression',
        './Cartesian2',
        './Cartesian3',
        './ComponentDatatype',
        './defaultValue',
        './defined',
        './Math',
        './Matrix4',
        './TerrainQuantization'
    ], function(
        AttributeCompression,
        Cartesian2,
        Cartesian3,
        ComponentDatatype,
        defaultValue,
        defined,
        CesiumMath,
        Matrix4,
        TerrainQuantization) {
    'use strict';

    var cartesian3Scratch = new Cartesian3();
    var cartesian3DimScratch = new Cartesian3();
    var cartesian2Scratch = new Cartesian2();
    var matrix4Scratch = new Matrix4();
    var matrix4Scratch2 = new Matrix4();

    var SHIFT_LEFT_12 = Math.pow(2.0, 12.0);

    /**
     * Data used to quantize and pack the terrain mesh. The position can be unpacked for picking and all attributes
     * are unpacked in the vertex shader.
     *
     * @alias TerrainEncoding
     * @constructor
     *
     * @param {AxisAlignedBoundingBox} axisAlignedBoundingBox The bounds of the tile in the east-north-up coordinates at the tiles center.
     * @param {Number} minimumHeight The minimum height.
     * @param {Number} maximumHeight The maximum height.
     * @param {Matrix4} fromENU The east-north-up to fixed frame matrix at the center of the terrain mesh.
     * @param {Boolean} hasVertexNormals If the mesh has vertex normals.
     * @param {Boolean} [hasWebMercatorT=false] true if the terrain data includes a Web Mercator texture coordinate; otherwise, false.
     *
     * @private
     */
    function TerrainEncoding(axisAlignedBoundingBox, minimumHeight, maximumHeight, fromENU, hasVertexNormals, hasWebMercatorT) {
        var quantization;
        var center;
        var toENU;
        var matrix;

        if (defined(axisAlignedBoundingBox) && defined(minimumHeight) && defined(maximumHeight) && defined(fromENU)) {
            var minimum = axisAlignedBoundingBox.minimum;
            var maximum = axisAlignedBoundingBox.maximum;

            var dimensions = Cartesian3.subtract(maximum, minimum, cartesian3DimScratch);
            var hDim = maximumHeight - minimumHeight;
            var maxDim = Math.max(Cartesian3.maximumComponent(dimensions), hDim);

            if (maxDim < SHIFT_LEFT_12 - 1.0) {
                quantization = TerrainQuantization.BITS12;
            } else {
                quantization = TerrainQuantization.NONE;
            }

            center = axisAlignedBoundingBox.center;
            toENU = Matrix4.inverseTransformation(fromENU, new Matrix4());

            var translation = Cartesian3.negate(minimum, cartesian3Scratch);
            Matrix4.multiply(Matrix4.fromTranslation(translation, matrix4Scratch), toENU, toENU);

            var scale = cartesian3Scratch;
            scale.x = 1.0 / dimensions.x;
            scale.y = 1.0 / dimensions.y;
            scale.z = 1.0 / dimensions.z;
            Matrix4.multiply(Matrix4.fromScale(scale, matrix4Scratch), toENU, toENU);

            matrix = Matrix4.clone(fromENU);
            Matrix4.setTranslation(matrix, Cartesian3.ZERO, matrix);

            fromENU = Matrix4.clone(fromENU, new Matrix4());

            var translationMatrix = Matrix4.fromTranslation(minimum, matrix4Scratch);
            var scaleMatrix =  Matrix4.fromScale(dimensions, matrix4Scratch2);
            var st = Matrix4.multiply(translationMatrix, scaleMatrix,matrix4Scratch);

            Matrix4.multiply(fromENU, st, fromENU);
            Matrix4.multiply(matrix, st, matrix);
        }

        /**
         * How the vertices of the mesh were compressed.
         * @type {TerrainQuantization}
         */
        this.quantization = quantization;

        /**
         * The minimum height of the tile including the skirts.
         * @type {Number}
         */
        this.minimumHeight = minimumHeight;

        /**
         * The maximum height of the tile.
         * @type {Number}
         */
        this.maximumHeight = maximumHeight;

        /**
         * The center of the tile.
         * @type {Cartesian3}
         */
        this.center = center;

        /**
         * A matrix that takes a vertex from the tile, transforms it to east-north-up at the center and scales
         * it so each component is in the [0, 1] range.
         * @type {Matrix4}
         */
        this.toScaledENU = toENU;

        /**
         * A matrix that restores a vertex transformed with toScaledENU back to the earth fixed reference frame
         * @type {Matrix4}
         */
        this.fromScaledENU = fromENU;

        /**
         * The matrix used to decompress the terrain vertices in the shader for RTE rendering.
         * @type {Matrix4}
         */
        this.matrix = matrix;

        /**
         * The terrain mesh contains normals.
         * @type {Boolean}
         */
        this.hasVertexNormals = hasVertexNormals;

        /**
         * The terrain mesh contains a vertical texture coordinate following the Web Mercator projection.
         * @type {Boolean}
         */
        this.hasWebMercatorT = defaultValue(hasWebMercatorT, false);
    }

    TerrainEncoding.prototype.encode = function(vertexBuffer, bufferIndex, position, uv, height, normalToPack, webMercatorT) {
        var u = uv.x;
        var v = uv.y;

        if (this.quantization === TerrainQuantization.BITS12) {
            position = Matrix4.multiplyByPoint(this.toScaledENU, position, cartesian3Scratch);

            position.x = CesiumMath.clamp(position.x, 0.0, 1.0);
            position.y = CesiumMath.clamp(position.y, 0.0, 1.0);
            position.z = CesiumMath.clamp(position.z, 0.0, 1.0);

            var hDim = this.maximumHeight - this.minimumHeight;
            var h = CesiumMath.clamp((height - this.minimumHeight) / hDim, 0.0, 1.0);

            Cartesian2.fromElements(position.x, position.y, cartesian2Scratch);
            var compressed0 = AttributeCompression.compressTextureCoordinates(cartesian2Scratch);

            Cartesian2.fromElements(position.z, h, cartesian2Scratch);
            var compressed1 = AttributeCompression.compressTextureCoordinates(cartesian2Scratch);

            Cartesian2.fromElements(u, v, cartesian2Scratch);
            var compressed2 = AttributeCompression.compressTextureCoordinates(cartesian2Scratch);

            vertexBuffer[bufferIndex++] = compressed0;
            vertexBuffer[bufferIndex++] = compressed1;
            vertexBuffer[bufferIndex++] = compressed2;

            if (this.hasWebMercatorT) {
                Cartesian2.fromElements(webMercatorT, 0.0, cartesian2Scratch);
                var compressed3 = AttributeCompression.compressTextureCoordinates(cartesian2Scratch);
                vertexBuffer[bufferIndex++] = compressed3;
            }
        } else {
            Cartesian3.subtract(position, this.center, cartesian3Scratch);

            vertexBuffer[bufferIndex++] = cartesian3Scratch.x;
            vertexBuffer[bufferIndex++] = cartesian3Scratch.y;
            vertexBuffer[bufferIndex++] = cartesian3Scratch.z;
            vertexBuffer[bufferIndex++] = height;
            vertexBuffer[bufferIndex++] = u;
            vertexBuffer[bufferIndex++] = v;

            if (this.hasWebMercatorT) {
                vertexBuffer[bufferIndex++] = webMercatorT;
            }
        }

        if (this.hasVertexNormals) {
            vertexBuffer[bufferIndex++] = AttributeCompression.octPackFloat(normalToPack);
        }

        return bufferIndex;
    };

    TerrainEncoding.prototype.decodePosition = function(buffer, index, result) {
        if (!defined(result)) {
            result = new Cartesian3();
        }

        index *= this.getStride();

        if (this.quantization === TerrainQuantization.BITS12) {
            var xy = AttributeCompression.decompressTextureCoordinates(buffer[index], cartesian2Scratch);
            result.x = xy.x;
            result.y = xy.y;

            var zh = AttributeCompression.decompressTextureCoordinates(buffer[index + 1], cartesian2Scratch);
            result.z = zh.x;

            return Matrix4.multiplyByPoint(this.fromScaledENU, result, result);
        }

        result.x = buffer[index];
        result.y = buffer[index + 1];
        result.z = buffer[index + 2];
        return Cartesian3.add(result, this.center, result);
    };

    TerrainEncoding.prototype.decodeTextureCoordinates = function(buffer, index, result) {
        if (!defined(result)) {
            result = new Cartesian2();
        }

        index *= this.getStride();

        if (this.quantization === TerrainQuantization.BITS12) {
            return AttributeCompression.decompressTextureCoordinates(buffer[index + 2], result);
        }

        return Cartesian2.fromElements(buffer[index + 4], buffer[index + 5], result);
    };

    TerrainEncoding.prototype.decodeHeight = function(buffer, index) {
        index *= this.getStride();

        if (this.quantization === TerrainQuantization.BITS12) {
            var zh = AttributeCompression.decompressTextureCoordinates(buffer[index + 1], cartesian2Scratch);
            return zh.y * (this.maximumHeight - this.minimumHeight) + this.minimumHeight;
        }

        return buffer[index + 3];
    };

    TerrainEncoding.prototype.getOctEncodedNormal = function(buffer, index, result) {
        var stride = this.getStride();
        index = (index + 1) * stride - 1;

        var temp = buffer[index] / 256.0;
        var x = Math.floor(temp);
        var y = (temp - x) * 256.0;

        return Cartesian2.fromElements(x, y, result);
    };

    TerrainEncoding.prototype.getStride = function() {
        var vertexStride;

        switch (this.quantization) {
            case TerrainQuantization.BITS12:
                vertexStride = 3;
                break;
            default:
                vertexStride = 6;
        }

        if (this.hasWebMercatorT) {
            ++vertexStride;
        }

        if (this.hasVertexNormals) {
            ++vertexStride;
        }

        return vertexStride;
    };

    var attributesNone = {
        position3DAndHeight : 0,
        textureCoordAndEncodedNormals : 1
    };
    var attributes = {
        compressed0 : 0,
        compressed1 : 1
    };

    TerrainEncoding.prototype.getAttributes = function(buffer) {
        var datatype = ComponentDatatype.FLOAT;
        var sizeInBytes = ComponentDatatype.getSizeInBytes(datatype);
        var stride;

        if (this.quantization === TerrainQuantization.NONE) {
            var position3DAndHeightLength = 4;
            var numTexCoordComponents = 2;

            if (this.hasWebMercatorT) {
                ++numTexCoordComponents;
            }

            if (this.hasVertexNormals) {
                ++numTexCoordComponents;
            }

            stride = (position3DAndHeightLength + numTexCoordComponents) * sizeInBytes;

            return [{
                index : attributesNone.position3DAndHeight,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : position3DAndHeightLength,
                offsetInBytes : 0,
                strideInBytes : stride
            }, {
                index : attributesNone.textureCoordAndEncodedNormals,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numTexCoordComponents,
                offsetInBytes : position3DAndHeightLength * sizeInBytes,
                strideInBytes : stride
            }];
        }

        var numCompressed0 = 3;
        var numCompressed1 = 0;

        if (this.hasWebMercatorT || this.hasVertexNormals) {
            ++numCompressed0;
        }

        if (this.hasWebMercatorT && this.hasVertexNormals) {
            ++numCompressed1;

            stride = (numCompressed0 + numCompressed1) * sizeInBytes;

            return [{
                index : attributes.compressed0,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numCompressed0,
                offsetInBytes : 0,
                strideInBytes : stride
            }, {
                index : attributes.compressed1,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numCompressed1,
                offsetInBytes : numCompressed0 * sizeInBytes,
                strideInBytes : stride
            }];
        } else {
            return [{
                index : attributes.compressed0,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numCompressed0
            }];
        }
    };

    TerrainEncoding.prototype.getAttributeLocations = function() {
        if (this.quantization === TerrainQuantization.NONE) {
            return attributesNone;
        } else {
            return attributes;
        }
    };

    TerrainEncoding.clone = function(encoding, result) {
        if (!defined(result)) {
            result = new TerrainEncoding();
        }

        result.quantization = encoding.quantization;
        result.minimumHeight = encoding.minimumHeight;
        result.maximumHeight = encoding.maximumHeight;
        result.center = Cartesian3.clone(encoding.center);
        result.toScaledENU = Matrix4.clone(encoding.toScaledENU);
        result.fromScaledENU = Matrix4.clone(encoding.fromScaledENU);
        result.matrix = Matrix4.clone(encoding.matrix);
        result.hasVertexNormals = encoding.hasVertexNormals;
        result.hasWebMercatorT = encoding.hasWebMercatorT;
        return result;
    };

    return TerrainEncoding;
});

/*global define*/
define('Core/formatError',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Formats an error object into a String.  If available, uses name, message, and stack
     * properties, otherwise, falls back on toString().
     *
     * @exports formatError
     *
     * @param {Object} object The item to find in the array.
     * @returns {String} A string containing the formatted error.
     */
    function formatError(object) {
        var result;

        var name = object.name;
        var message = object.message;
        if (defined(name) && defined(message)) {
            result = name + ': ' + message;
        } else {
            result = object.toString();
        }

        var stack = object.stack;
        if (defined(stack)) {
            result += '\n' + stack;
        }

        return result;
    }

    return formatError;
});

/*global define*/
define('Workers/createTaskProcessorWorker',[
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/formatError'
    ], function(
        defaultValue,
        defined,
        formatError) {
    'use strict';

    /**
     * Creates an adapter function to allow a calculation function to operate as a Web Worker,
     * paired with TaskProcessor, to receive tasks and return results.
     *
     * @exports createTaskProcessorWorker
     *
     * @param {createTaskProcessorWorker~WorkerFunction} workerFunction The calculation function,
     *        which takes parameters and returns a result.
     * @returns {createTaskProcessorWorker~TaskProcessorWorkerFunction} A function that adapts the
     *          calculation function to work as a Web Worker onmessage listener with TaskProcessor.
     *
     *
     * @example
     * function doCalculation(parameters, transferableObjects) {
     *   // calculate some result using the inputs in parameters
     *   return result;
     * }
     *
     * return Cesium.createTaskProcessorWorker(doCalculation);
     * // the resulting function is compatible with TaskProcessor
     * 
     * @see TaskProcessor
     * @see {@link http://www.w3.org/TR/workers/|Web Workers}
     * @see {@link http://www.w3.org/TR/html5/common-dom-interfaces.html#transferable-objects|Transferable objects}
     */
    function createTaskProcessorWorker(workerFunction) {
        var postMessage;
        var transferableObjects = [];
        var responseMessage = {
            id : undefined,
            result : undefined,
            error : undefined
        };

        return function(event) {
            /*global self*/
            var data = event.data;

            transferableObjects.length = 0;
            responseMessage.id = data.id;
            responseMessage.error = undefined;
            responseMessage.result = undefined;

            try {
                responseMessage.result = workerFunction(data.parameters, transferableObjects);
            } catch (e) {
                if (e instanceof Error) {
                    // Errors can't be posted in a message, copy the properties
                    responseMessage.error = {
                        name : e.name,
                        message : e.message,
                        stack : e.stack
                    };
                } else {
                    responseMessage.error = e;
                }
            }

            if (!defined(postMessage)) {
                postMessage = defaultValue(self.webkitPostMessage, self.postMessage);
            }

            if (!data.canTransferArrayBuffer) {
                transferableObjects.length = 0;
            }

            try {
                postMessage(responseMessage, transferableObjects);
            } catch (e) {
                // something went wrong trying to post the message, post a simpler
                // error that we can be sure will be cloneable
                responseMessage.result = undefined;
                responseMessage.error = 'postMessage failed with error: ' + formatError(e) + '\n  with responseMessage: ' + JSON.stringify(responseMessage);
                postMessage(responseMessage);
            }
        };
    }

    /**
     * A function that performs a calculation in a Web Worker.
     * @callback createTaskProcessorWorker~WorkerFunction
     *
     * @param {Object} parameters Parameters to the calculation.
     * @param {Array} transferableObjects An array that should be filled with references to objects inside
     *        the result that should be transferred back to the main document instead of copied.
     * @returns {Object} The result of the calculation.
     *
     * @example
     * function calculate(parameters, transferableObjects) {
     *   // perform whatever calculation is necessary.
     *   var typedArray = new Float32Array(0);
     *
     *   // typed arrays are transferable
     *   transferableObjects.push(typedArray)
     *
     *   return {
     *      typedArray : typedArray
     *   };
     * }
     */

    /**
     * A Web Worker message event handler function that handles the interaction with TaskProcessor,
     * specifically, task ID management and posting a response message containing the result.
     * @callback createTaskProcessorWorker~TaskProcessorWorkerFunction
     *
     * @param {Object} event The onmessage event object.
     */

    return createTaskProcessorWorker;
});

/*global define*/
define('Workers/upsampleQuantizedTerrainMesh',[
        '../Core/AttributeCompression',
        '../Core/BoundingSphere',
        '../Core/Cartesian2',
        '../Core/Cartesian3',
        '../Core/Cartographic',
        '../Core/defined',
        '../Core/Ellipsoid',
        '../Core/EllipsoidalOccluder',
        '../Core/IndexDatatype',
        '../Core/Intersections2D',
        '../Core/Math',
        '../Core/OrientedBoundingBox',
        '../Core/TerrainEncoding',
        './createTaskProcessorWorker'
    ], function(
        AttributeCompression,
        BoundingSphere,
        Cartesian2,
        Cartesian3,
        Cartographic,
        defined,
        Ellipsoid,
        EllipsoidalOccluder,
        IndexDatatype,
        Intersections2D,
        CesiumMath,
        OrientedBoundingBox,
        TerrainEncoding,
        createTaskProcessorWorker) {
    'use strict';

    var maxShort = 32767;
    var halfMaxShort = (maxShort / 2) | 0;

    var clipScratch = [];
    var clipScratch2 = [];
    var verticesScratch = [];
    var cartographicScratch = new Cartographic();
    var cartesian3Scratch = new Cartesian3();
    var uScratch = [];
    var vScratch = [];
    var heightScratch = [];
    var indicesScratch = [];
    var normalsScratch = [];
    var horizonOcclusionPointScratch = new Cartesian3();
    var boundingSphereScratch = new BoundingSphere();
    var orientedBoundingBoxScratch = new OrientedBoundingBox();
    var decodeTexCoordsScratch = new Cartesian2();
    var octEncodedNormalScratch = new Cartesian3();

    function upsampleQuantizedTerrainMesh(parameters, transferableObjects) {
        var isEastChild = parameters.isEastChild;
        var isNorthChild = parameters.isNorthChild;

        var minU = isEastChild ? halfMaxShort : 0;
        var maxU = isEastChild ? maxShort : halfMaxShort;
        var minV = isNorthChild ? halfMaxShort : 0;
        var maxV = isNorthChild ? maxShort : halfMaxShort;

        var uBuffer = uScratch;
        var vBuffer = vScratch;
        var heightBuffer = heightScratch;
        var normalBuffer = normalsScratch;

        uBuffer.length = 0;
        vBuffer.length = 0;
        heightBuffer.length = 0;
        normalBuffer.length = 0;

        var indices = indicesScratch;
        indices.length = 0;

        var vertexMap = {};

        var parentVertices = parameters.vertices;
        var parentIndices = parameters.indices;
        parentIndices = parentIndices.subarray(0, parameters.skirtIndex);

        var encoding = TerrainEncoding.clone(parameters.encoding);
        var hasVertexNormals = encoding.hasVertexNormals;
        var exaggeration = parameters.exaggeration;

        var vertexCount = 0;
        var quantizedVertexCount = parameters.vertexCountWithoutSkirts;

        var parentMinimumHeight = parameters.minimumHeight;
        var parentMaximumHeight = parameters.maximumHeight;

        var parentUBuffer = new Array(quantizedVertexCount);
        var parentVBuffer = new Array(quantizedVertexCount);
        var parentHeightBuffer = new Array(quantizedVertexCount);
        var parentNormalBuffer = hasVertexNormals ? new Array(quantizedVertexCount * 2) : undefined;

        var threshold = 20;
        var height;

        var i, n;
        for (i = 0, n = 0; i < quantizedVertexCount; ++i, n += 2) {
            var texCoords = encoding.decodeTextureCoordinates(parentVertices, i, decodeTexCoordsScratch);
            height  = encoding.decodeHeight(parentVertices, i) / exaggeration;

            parentUBuffer[i] = CesiumMath.clamp((texCoords.x * maxShort) | 0, 0, maxShort);
            parentVBuffer[i] = CesiumMath.clamp((texCoords.y * maxShort) | 0, 0, maxShort);
            parentHeightBuffer[i] = CesiumMath.clamp((((height - parentMinimumHeight) / (parentMaximumHeight - parentMinimumHeight)) * maxShort) | 0, 0, maxShort);

            if (parentUBuffer[i] < threshold) {
                parentUBuffer[i] = 0;
            }

            if (parentVBuffer[i] < threshold) {
                parentVBuffer[i] = 0;
            }

            if (maxShort - parentUBuffer[i] < threshold) {
                parentUBuffer[i] = maxShort;
            }

            if (maxShort - parentVBuffer[i] < threshold) {
                parentVBuffer[i] = maxShort;
            }

            if (hasVertexNormals) {
                var encodedNormal = encoding.getOctEncodedNormal(parentVertices, i, octEncodedNormalScratch);
                parentNormalBuffer[n] = encodedNormal.x;
                parentNormalBuffer[n + 1] = encodedNormal.y;
            }
        }

        var u, v;
        for (i = 0, n = 0; i < quantizedVertexCount; ++i, n += 2) {
            u = parentUBuffer[i];
            v = parentVBuffer[i];
            if ((isEastChild && u >= halfMaxShort || !isEastChild && u <= halfMaxShort) &&
                (isNorthChild && v >= halfMaxShort || !isNorthChild && v <= halfMaxShort)) {

                vertexMap[i] = vertexCount;
                uBuffer.push(u);
                vBuffer.push(v);
                heightBuffer.push(parentHeightBuffer[i]);
                if (hasVertexNormals) {
                    normalBuffer.push(parentNormalBuffer[n]);
                    normalBuffer.push(parentNormalBuffer[n + 1]);
                }

                ++vertexCount;
            }
        }

        var triangleVertices = [];
        triangleVertices.push(new Vertex());
        triangleVertices.push(new Vertex());
        triangleVertices.push(new Vertex());

        var clippedTriangleVertices = [];
        clippedTriangleVertices.push(new Vertex());
        clippedTriangleVertices.push(new Vertex());
        clippedTriangleVertices.push(new Vertex());

        var clippedIndex;
        var clipped2;

        for (i = 0; i < parentIndices.length; i += 3) {
            var i0 = parentIndices[i];
            var i1 = parentIndices[i + 1];
            var i2 = parentIndices[i + 2];

            var u0 = parentUBuffer[i0];
            var u1 = parentUBuffer[i1];
            var u2 = parentUBuffer[i2];

            triangleVertices[0].initializeIndexed(parentUBuffer, parentVBuffer, parentHeightBuffer, parentNormalBuffer, i0);
            triangleVertices[1].initializeIndexed(parentUBuffer, parentVBuffer, parentHeightBuffer, parentNormalBuffer, i1);
            triangleVertices[2].initializeIndexed(parentUBuffer, parentVBuffer, parentHeightBuffer, parentNormalBuffer, i2);

            // Clip triangle on the east-west boundary.
            var clipped = Intersections2D.clipTriangleAtAxisAlignedThreshold(halfMaxShort, isEastChild, u0, u1, u2, clipScratch);

            // Get the first clipped triangle, if any.
            clippedIndex = 0;

            if (clippedIndex >= clipped.length) {
                continue;
            }
            clippedIndex = clippedTriangleVertices[0].initializeFromClipResult(clipped, clippedIndex, triangleVertices);

            if (clippedIndex >= clipped.length) {
                continue;
            }
            clippedIndex = clippedTriangleVertices[1].initializeFromClipResult(clipped, clippedIndex, triangleVertices);

            if (clippedIndex >= clipped.length) {
                continue;
            }
            clippedIndex = clippedTriangleVertices[2].initializeFromClipResult(clipped, clippedIndex, triangleVertices);

            // Clip the triangle against the North-south boundary.
            clipped2 = Intersections2D.clipTriangleAtAxisAlignedThreshold(halfMaxShort, isNorthChild, clippedTriangleVertices[0].getV(), clippedTriangleVertices[1].getV(), clippedTriangleVertices[2].getV(), clipScratch2);
            addClippedPolygon(uBuffer, vBuffer, heightBuffer, normalBuffer, indices, vertexMap, clipped2, clippedTriangleVertices, hasVertexNormals);

            // If there's another vertex in the original clipped result,
            // it forms a second triangle.  Clip it as well.
            if (clippedIndex < clipped.length) {
                clippedTriangleVertices[2].clone(clippedTriangleVertices[1]);
                clippedTriangleVertices[2].initializeFromClipResult(clipped, clippedIndex, triangleVertices);

                clipped2 = Intersections2D.clipTriangleAtAxisAlignedThreshold(halfMaxShort, isNorthChild, clippedTriangleVertices[0].getV(), clippedTriangleVertices[1].getV(), clippedTriangleVertices[2].getV(), clipScratch2);
                addClippedPolygon(uBuffer, vBuffer, heightBuffer, normalBuffer, indices, vertexMap, clipped2, clippedTriangleVertices, hasVertexNormals);
            }
        }

        var uOffset = isEastChild ? -maxShort : 0;
        var vOffset = isNorthChild ? -maxShort : 0;

        var westIndices = [];
        var southIndices = [];
        var eastIndices = [];
        var northIndices = [];

        var minimumHeight = Number.MAX_VALUE;
        var maximumHeight = -minimumHeight;

        var cartesianVertices = verticesScratch;
        cartesianVertices.length = 0;

        var ellipsoid = Ellipsoid.clone(parameters.ellipsoid);
        var rectangle = parameters.childRectangle;

        var north = rectangle.north;
        var south = rectangle.south;
        var east = rectangle.east;
        var west = rectangle.west;

        if (east < west) {
            east += CesiumMath.TWO_PI;
        }

        for (i = 0; i < uBuffer.length; ++i) {
            u = Math.round(uBuffer[i]);
            if (u <= minU) {
                westIndices.push(i);
                u = 0;
            } else if (u >= maxU) {
                eastIndices.push(i);
                u = maxShort;
            } else {
                u = u * 2 + uOffset;
            }

            uBuffer[i] = u;

            v = Math.round(vBuffer[i]);
            if (v <= minV) {
                southIndices.push(i);
                v = 0;
            } else if (v >= maxV) {
                northIndices.push(i);
                v = maxShort;
            } else {
                v = v * 2 + vOffset;
            }

            vBuffer[i] = v;

            height = CesiumMath.lerp(parentMinimumHeight, parentMaximumHeight, heightBuffer[i] / maxShort);
            if (height < minimumHeight) {
                minimumHeight = height;
            }
            if (height > maximumHeight) {
                maximumHeight = height;
            }

            heightBuffer[i] = height;

            cartographicScratch.longitude = CesiumMath.lerp(west, east, u / maxShort);
            cartographicScratch.latitude = CesiumMath.lerp(south, north, v / maxShort);
            cartographicScratch.height = height;

            ellipsoid.cartographicToCartesian(cartographicScratch, cartesian3Scratch);

            cartesianVertices.push(cartesian3Scratch.x);
            cartesianVertices.push(cartesian3Scratch.y);
            cartesianVertices.push(cartesian3Scratch.z);
        }

        var boundingSphere = BoundingSphere.fromVertices(cartesianVertices, Cartesian3.ZERO, 3, boundingSphereScratch);
        var orientedBoundingBox = OrientedBoundingBox.fromRectangle(rectangle, minimumHeight, maximumHeight, ellipsoid, orientedBoundingBoxScratch);

        var occluder = new EllipsoidalOccluder(ellipsoid);
        var horizonOcclusionPoint = occluder.computeHorizonCullingPointFromVertices(boundingSphere.center, cartesianVertices, 3, boundingSphere.center, horizonOcclusionPointScratch);

        var heightRange = maximumHeight - minimumHeight;

        var vertices = new Uint16Array(uBuffer.length + vBuffer.length + heightBuffer.length);

        for (i = 0; i < uBuffer.length; ++i) {
            vertices[i] = uBuffer[i];
        }

        var start = uBuffer.length;

        for (i = 0; i < vBuffer.length; ++i) {
            vertices[start + i] = vBuffer[i];
        }

        start += vBuffer.length;

        for (i = 0; i < heightBuffer.length; ++i) {
            vertices[start + i] = maxShort * (heightBuffer[i] - minimumHeight) / heightRange;
        }

        var indicesTypedArray = IndexDatatype.createTypedArray(uBuffer.length, indices);

        var encodedNormals;
        if (hasVertexNormals) {
            var normalArray = new Uint8Array(normalBuffer);
            transferableObjects.push(vertices.buffer, indicesTypedArray.buffer, normalArray.buffer);
            encodedNormals = normalArray.buffer;
        } else {
            transferableObjects.push(vertices.buffer, indicesTypedArray.buffer);
        }

        return {
            vertices : vertices.buffer,
            encodedNormals : encodedNormals,
            indices : indicesTypedArray.buffer,
            minimumHeight : minimumHeight,
            maximumHeight : maximumHeight,
            westIndices : westIndices,
            southIndices : southIndices,
            eastIndices : eastIndices,
            northIndices : northIndices,
            boundingSphere : boundingSphere,
            orientedBoundingBox : orientedBoundingBox,
            horizonOcclusionPoint : horizonOcclusionPoint
        };
    }

    function Vertex() {
        this.vertexBuffer = undefined;
        this.index = undefined;
        this.first = undefined;
        this.second = undefined;
        this.ratio = undefined;
    }

    Vertex.prototype.clone = function(result) {
        if (!defined(result)) {
            result = new Vertex();
        }

        result.uBuffer = this.uBuffer;
        result.vBuffer = this.vBuffer;
        result.heightBuffer = this.heightBuffer;
        result.normalBuffer = this.normalBuffer;
        result.index = this.index;
        result.first = this.first;
        result.second = this.second;
        result.ratio = this.ratio;

        return result;
    };

    Vertex.prototype.initializeIndexed = function(uBuffer, vBuffer, heightBuffer, normalBuffer, index) {
        this.uBuffer = uBuffer;
        this.vBuffer = vBuffer;
        this.heightBuffer = heightBuffer;
        this.normalBuffer = normalBuffer;
        this.index = index;
        this.first = undefined;
        this.second = undefined;
        this.ratio = undefined;
    };

    Vertex.prototype.initializeFromClipResult = function(clipResult, index, vertices) {
        var nextIndex = index + 1;

        if (clipResult[index] !== -1) {
            vertices[clipResult[index]].clone(this);
        } else {
            this.vertexBuffer = undefined;
            this.index = undefined;
            this.first = vertices[clipResult[nextIndex]];
            ++nextIndex;
            this.second = vertices[clipResult[nextIndex]];
            ++nextIndex;
            this.ratio = clipResult[nextIndex];
            ++nextIndex;
        }

        return nextIndex;
    };

    Vertex.prototype.getKey = function() {
        if (this.isIndexed()) {
            return this.index;
        }
        return JSON.stringify({
            first : this.first.getKey(),
            second : this.second.getKey(),
            ratio : this.ratio
        });
    };

    Vertex.prototype.isIndexed = function() {
        return defined(this.index);
    };

    Vertex.prototype.getH = function() {
        if (defined(this.index)) {
            return this.heightBuffer[this.index];
        }
        return CesiumMath.lerp(this.first.getH(), this.second.getH(), this.ratio);
    };

    Vertex.prototype.getU = function() {
        if (defined(this.index)) {
            return this.uBuffer[this.index];
        }
        return CesiumMath.lerp(this.first.getU(), this.second.getU(), this.ratio);
    };

    Vertex.prototype.getV = function() {
        if (defined(this.index)) {
            return this.vBuffer[this.index];
        }
        return CesiumMath.lerp(this.first.getV(), this.second.getV(), this.ratio);
    };

    var encodedScratch = new Cartesian2();
    // An upsampled triangle may be clipped twice before it is assigned an index
    // In this case, we need a buffer to handle the recursion of getNormalX() and getNormalY().
    var depth = -1;
    var cartesianScratch1 = [new Cartesian3(), new Cartesian3()];
    var cartesianScratch2 = [new Cartesian3(), new Cartesian3()];
    function lerpOctEncodedNormal(vertex, result) {
        ++depth;

        var first = cartesianScratch1[depth];
        var second = cartesianScratch2[depth];

        first = AttributeCompression.octDecode(vertex.first.getNormalX(), vertex.first.getNormalY(), first);
        second = AttributeCompression.octDecode(vertex.second.getNormalX(), vertex.second.getNormalY(), second);
        cartesian3Scratch = Cartesian3.lerp(first, second, vertex.ratio, cartesian3Scratch);
        Cartesian3.normalize(cartesian3Scratch, cartesian3Scratch);

        AttributeCompression.octEncode(cartesian3Scratch, result);

        --depth;

        return result;
    }

    Vertex.prototype.getNormalX = function() {
        if (defined(this.index)) {
            return this.normalBuffer[this.index * 2];
        }

        encodedScratch = lerpOctEncodedNormal(this, encodedScratch);
        return encodedScratch.x;
    };

    Vertex.prototype.getNormalY = function() {
        if (defined(this.index)) {
            return this.normalBuffer[this.index * 2 + 1];
        }

        encodedScratch = lerpOctEncodedNormal(this, encodedScratch);
        return encodedScratch.y;
    };

    var polygonVertices = [];
    polygonVertices.push(new Vertex());
    polygonVertices.push(new Vertex());
    polygonVertices.push(new Vertex());
    polygonVertices.push(new Vertex());

    function addClippedPolygon(uBuffer, vBuffer, heightBuffer, normalBuffer, indices, vertexMap, clipped, triangleVertices, hasVertexNormals) {
        if (clipped.length === 0) {
            return;
        }

        var numVertices = 0;
        var clippedIndex = 0;
        while (clippedIndex < clipped.length) {
            clippedIndex = polygonVertices[numVertices++].initializeFromClipResult(clipped, clippedIndex, triangleVertices);
        }

        for (var i = 0; i < numVertices; ++i) {
            var polygonVertex = polygonVertices[i];
            if (!polygonVertex.isIndexed()) {
                var key = polygonVertex.getKey();
                if (defined(vertexMap[key])) {
                    polygonVertex.newIndex = vertexMap[key];
                } else {
                    var newIndex = uBuffer.length;
                    uBuffer.push(polygonVertex.getU());
                    vBuffer.push(polygonVertex.getV());
                    heightBuffer.push(polygonVertex.getH());
                    if (hasVertexNormals) {
                        normalBuffer.push(polygonVertex.getNormalX());
                        normalBuffer.push(polygonVertex.getNormalY());
                    }
                    polygonVertex.newIndex = newIndex;
                    vertexMap[key] = newIndex;
                }
            } else {
                polygonVertex.newIndex = vertexMap[polygonVertex.index];
                polygonVertex.uBuffer = uBuffer;
                polygonVertex.vBuffer = vBuffer;
                polygonVertex.heightBuffer = heightBuffer;
                if (hasVertexNormals) {
                    polygonVertex.normalBuffer = normalBuffer;
                }
            }
        }

        if (numVertices === 3) {
            // A triangle.
            indices.push(polygonVertices[0].newIndex);
            indices.push(polygonVertices[1].newIndex);
            indices.push(polygonVertices[2].newIndex);
        } else if (numVertices === 4) {
            // A quad - two triangles.
            indices.push(polygonVertices[0].newIndex);
            indices.push(polygonVertices[1].newIndex);
            indices.push(polygonVertices[2].newIndex);

            indices.push(polygonVertices[0].newIndex);
            indices.push(polygonVertices[2].newIndex);
            indices.push(polygonVertices[3].newIndex);
        }
    }

    return createTaskProcessorWorker(upsampleQuantizedTerrainMesh);
});

}());