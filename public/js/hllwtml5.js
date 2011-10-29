goog.provide('hllwtml5');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.math.Vec2');
goog.require('goog.pubsub.PubSub');
goog.require('hllwtml5.common');
goog.require('hllwtml5.gun');
goog.require('hllwtml5.hud');
goog.require('hllwtml5.zombie');

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
        var deg = hllwtml5.common.randomInteger(60, true);
        var duration = opt_duration || hllwtml5.common.randomInteger(3);
        var scale = Math.random();
        var x = hllwtml5.common.randomInteger(600, true);
        var y = hllwtml5.common.randomInteger(600, true);

        move(bat)
            .to(x, y)
            .scale(scale)
            .rotate(deg)
            // .ease('cubic-bezier(.2, .4, .6, .2)')
            .duration(duration + 's')
            .then(function() { loop(bat, index, bats, duration); })
            .end();
    };

    goog.array.forEach(bats, loop);
};

/**
 * The application-wide event publication and subscription channel.
 *
 * @type {goog.pubsub.PubSub}
 */
hllwtml5.pubsub;

/**
 * Initialize the application, bind the mouse and kick off animation loops.
 */
hllwtml5.init = function() {
    var crosshair;
    var gun;
    var zombie;

    // Tell move.js to use goog.dom.query for DOM selection.
    move.select = function(selector, scope) {
        return goog.dom.query(selector, scope)[0];
    };

    hllwtml5.pubsub = new goog.pubsub.PubSub();

    zombie = goog.dom.query('#zombie')[0];

    if (zombie) {
        hllwtml5.zombie.init(zombie);
    }

    gun = goog.dom.query('#gun')[0];
    crosshair = goog.dom.query('#crosshair')[0];

    if (gun && crosshair) {
        hllwtml5.hud.init();
        hllwtml5.gun.init(gun, 61, crosshair);
    }

    hllwtml5.goBatty();
};
