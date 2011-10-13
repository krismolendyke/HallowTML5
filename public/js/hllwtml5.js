goog.provide('hllwtml5');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.math.Vec2');
goog.require('hllwtml5.gun');

/**
 * Wobble!
 */
hllwtml5.wobbleGhostGuy = function() {
    move('#ghost-guy')
        .duration('.5s')
        .ease('snap')
        .skew(hllwtml5.randomInteger(5, true))
        .end(hllwtml5.unwobbleGhostGuy);
};

/**
 * Unwobble!
 */
hllwtml5.unwobbleGhostGuy = function() {
    move('#ghost-guy')
        .duration('.1s')
        .ease('snap')
        .skew(0)
        .then(hllwtml5.wobbleGhostGuy)
        .end();
};

/**
 * Generate a random integer between 0 and the given maximum.  If opt_negate
 * is specified, the generated integer will randomly be negated.
 *
 * @param {number} max The maximum inclusive value of the random range.
 * @param {boolean=} opt_negate True: randomly negate the value.  Defaults to
 *     False.
 * @return {number} A random integer.
 */
hllwtml5.randomInteger = function(max, opt_negate) {
    var random = Math.random() * max | 0;
    var negate = opt_negate || false;

    if (negate && Math.random() <= Math.random()) {
        random = -1 * random;
    }

    return random;
};

/**
 * Batshit!
 */
hllwtml5.goBatty = function() {
    var bats = goog.dom.query('.bat');
    var loop;

    /**
     * Loop an animation of a bat.
     *
     * @param {Object} bat The bat to animate.
     * @param {number} index The index of the bat in the bat array.
     * @param {Array<Object>} bats An array of bats.
     * @param {number=} opt_duration The duration of the animation loop.
     *    Defaults to a random integer.
     */
    loop = function(bat, index, bats, opt_duration) {
        var deg = hllwtml5.randomInteger(60, true);
        var duration = opt_duration || hllwtml5.randomInteger(3);
        var scale = Math.random();
        var x = hllwtml5.randomInteger(300, true);
        var y = hllwtml5.randomInteger(300, true);

        move(bat)
            .to(x, y)
            .scale(scale)
            .rotate(deg)
            .ease('cubic-bezier(.2, .4, .6, .2)')
            .duration(duration + 's')
            .then(function() { loop(bat, index, bats, duration); })
            .end();
    };

    goog.array.forEach(bats, loop);
};

/**
 * Initialize the application, bind the mouse and kick off animation loops.
 */
hllwtml5.init = function() {
    var crosshair;
    var gun;

    // Tell move.js to use goog.dom.query for DOM selection.
    move.select = function(selector, scope) {
        return goog.dom.query(selector, scope)[0];
    };

    gun = goog.dom.query('#gun')[0];
    crosshair = goog.dom.query('#crosshair')[0];

    if (gun && crosshair) {
        hllwtml5.gun.init(gun, 61, crosshair);
    }

    hllwtml5.wobbleGhostGuy();
    hllwtml5.goBatty();
};
