goog.provide('hllwtml5');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.math.Vec2');
goog.require('hllwtml5.animation');

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
 * Handle a gunshot.
 *
 * @param {!goog.events.BrowserEvent} e A browser event.
 */
hllwtml5.gunShot = function(e) {
    var bullet;
    var bulletVec2;
    var lowerRight;
    var shotLoc;
    var viewportSize;

    shotLoc = new goog.math.Vec2(e.clientX, e.clientY);
    viewportSize = goog.dom.getViewportSize();
    lowerRight = new goog.math.Vec2(viewportSize.width, viewportSize.height);
    bulletVec2 = new goog.math.Vec2.difference(shotLoc, lowerRight);

    bullet = goog.dom.createDom('div', { 'class': 'bullet' });
    bullet.style.left = viewportSize.width + 'px';
    bullet.style.top = viewportSize.height + 'px';

    goog.dom.query('body')[0].appendChild(bullet);

    // Give move.js a fraction of time to let appendChild finish.
    setTimeout(function() {
        move(bullet)
            .to(bulletVec2.x - (bullet.clientWidth / 2),
                bulletVec2.y - (bullet.clientHeight / 2))
            .scale(.075)
            .duration(500)
            .ease('out')
            .then()
                .set('opacity', 0)
                .duration(1000)
                .then(function() {
                    goog.dom.removeNode(bullet);
                })
                .pop()
            .end();
    }, 10);
};

/**
 * Fire the gun on mouse click.
 */
hllwtml5.singleFire = function() {
    goog.events.listen(document, goog.events.EventType.CLICK,
            hllwtml5.gunShot);
};

/**
 * True if the mouse is down, false if it is not.
 *
 * @type {!boolean}
 */
hllwtml5.isMouseDown = false;

/**
 * Fire the gun on mouse movement.
 */
hllwtml5.rapidFire = function() {
    var fire;
    var fireId;

    fire = function(e) {
        hllwtml5.gunShot(e);
        fireId = setTimeout(fire, 200, e);
    };

    goog.events.listen(document, goog.events.EventType.MOUSEDOWN,
            function(e) {
                fire(e);
                hllwtml5.isMouseDown = true;
            });

    goog.events.listen(document, goog.events.EventType.MOUSEUP,
            function() {
                clearTimeout(fireId);
                hllwtml5.isMouseDown = false;
            });

    goog.events.listen(document, goog.events.EventType.MOUSEMOVE,
            function(e) {
                clearTimeout(fireId);
                if (hllwtml5.isMouseDown) {
                    fire(e);
                }
            });
};

/**
 * Initialize the application and kick off animation loops.
 */
hllwtml5.init = function() {
    // Tell move.js to use goog.dom.query for DOM selection.
    move.select = function(selector, scope) {
        return goog.dom.query(selector, scope)[0];
    };

    hllwtml5.wobbleGhostGuy();
    hllwtml5.goBatty();

    var gun = goog.dom.query('#gun')[0];
    var crosshair = goog.dom.query('#crosshair')[0];

    hllwtml5.animation.rotateTowardMouse(gun, 61);
    hllwtml5.singleFire();
    hllwtml5.rapidFire();

    hllwtml5.animation.translateToUnderMouse(crosshair);
};
