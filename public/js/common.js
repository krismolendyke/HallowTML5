goog.provide('hllwtml5.common');

/**
 * Generate a random integer between 0 and the given maximum.  If opt_negate
 * is specified, the generated integer will randomly be negated.
 *
 * @param {number} max The maximum inclusive value of the random range.
 * @param {boolean=} opt_negate True: randomly negate the value.  Defaults to
 *     False.
 * @return {number} A random integer.
 */
hllwtml5.common.randomInteger = function(max, opt_negate) {
    var random = Math.random() * max | 0;
    var negate = opt_negate || false;

    if (negate && Math.random() <= Math.random()) {
        random = -1 * random;
    }

    return random;
};
