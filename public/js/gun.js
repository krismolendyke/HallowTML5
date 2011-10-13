goog.provide('hllwtml5.gun');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.math.Rect');
goog.require('goog.math.Vec2');
goog.require('hllwtml5.animation');

hllwtml5.gun.hitDetection = function(bullet, shotLoc) {
    console.group('hitDetection');

    var bulletRect;
    var enemies;
    var enemy;
    var enemyRect;

    bulletRect = new goog.math.Rect(shotLoc.x, shotLoc.y, 10, 10);
    enemies = goog.dom.query('.enemy');

    for (var i = 0, len = enemies.length; i < len; i += 1) {
        enemy = enemies[i];
        enemyRect = new goog.math.Rect(
                enemy.offsetLeft,
                enemy.offsetTop,
                enemy.offsetWidth,
                enemy.offsetHeight);
        if (enemyRect.contains(bulletRect)) {
            goog.dom.classes.add(enemy, 'hit');
        }
    }

    console.groupEnd();
};

/**
 * Fire a gunshot.
 *
 * @param {!goog.events.BrowserEvent} e A browser event.
 */
hllwtml5.gun.shoot = function(e) {
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
                    hllwtml5.gun.hitDetection(bullet, shotLoc);
                    goog.dom.removeNode(bullet);
                })
                .pop()
            .end();
    }, 10);
};

/**
 * Fire the gun on mouse down, and mouse down and mouse movement.
 *
 * @param {number=} opt_rateOfFire The delay in milliseconds between rounds.
 */
hllwtml5.gun.bindToMouse = function(opt_rateOfFire) {
    var browserEvent;
    var fire;
    var fireId;
    var isMouseDown = false;
    var mouseDownHandler;
    var mouseMoveHandler;
    var mouseUpHandler;
    var rateOfFire = opt_rateOfFire || 200;

    /**
     * Fire a gunshot, and schedule the next based on the rate of fire.
     */
    fire = function() {
        hllwtml5.gun.shoot(browserEvent);
        fireId = setTimeout(fire, rateOfFire);
    };

    /**
     * Update the browser event, begin firing, and set mouse down to true.
     *
     * @param {goog.events.BrowserEvent} e A browser event.
     */
    mouseDownHandler = function(e) {
        browserEvent = e;
        fire();
        isMouseDown = true;
    };

    /**
     * If the mouse is down, update the browser event because the shot must be
     * moved to a new position.
     *
     * @param {goog.events.BrowserEvent} e A browser event.
     */
    mouseMoveHandler = function(e) {
        if (isMouseDown) {
            browserEvent = e;
        }
    };

    /**
     * Stop firing and set mouse down to false.
     */
    mouseUpHandler = function() {
        clearTimeout(fireId);
        isMouseDown = false;
    };

    goog.events.listen(document, goog.events.EventType.MOUSEDOWN,
            mouseDownHandler);

    goog.events.listen(document, goog.events.EventType.MOUSEUP,
            mouseUpHandler);

    goog.events.listen(document, goog.events.EventType.MOUSEMOVE,
            mouseMoveHandler);
};

/**
 * Initialize the gun.  Bind it to the mouse for rotation and shooting.
 *
 * @param {!Element} gun A gun element.
 * @param {!number} gunAngleOffset An angle to offset the gun element
 *     rotation by.  This is used to align the barrel of the gun to point at
 *     the crosshair (mouse).
 * @param {!Element} crosshair A crosshair element.
 */
hllwtml5.gun.init = function(gun, gunAngleOffset, crosshair) {
    hllwtml5.animation.rotateTowardMouse(gun, gunAngleOffset);
    hllwtml5.gun.bindToMouse();
    hllwtml5.animation.translateToUnderMouse(crosshair);
};