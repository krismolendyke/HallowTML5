goog.provide('hllwtml5.gun');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.math.Rect');
goog.require('goog.math.Vec2');
goog.require('goog.style');
goog.require('hllwtml5.animation');

/**
 * The number of rounds fired.
 *
 * @type {number}
 */
hllwtml5.gun.rounds = 0;

/**
 * The number of enemies hit.
 *
 * @type {number}
 */
hllwtml5.gun.enemiesKilled = 0;

/**
 * Perform simple hit detection.
 *
 * @param {!Element} bullet The bullet that the gun shot.
 * @param {!goog.math.Vec2} shotLoc The gun shot location.
 */
hllwtml5.gun.hitDetection = function(bullet, shotLoc) {
    var bulletRect;
    var enemies;
    var enemy;
    var enemyRect;

    bulletRect = new goog.math.Rect(shotLoc.x, shotLoc.y, 10, 10);
    enemies = goog.dom.query('.enemy');

    for (var i = 0, len = enemies.length; i < len; i += 1) {
        enemy = enemies[i];
        enemyRect = goog.style.getBounds(enemy);
        if (enemyRect.contains(bulletRect)) {
            goog.dom.classes.remove(enemy, 'enemy');
            goog.dom.classes.add(enemy, 'hit');

            (function(enemy) {
                move(enemy)
                    .set('opacity', 0)
                    .duration(500)
                    .then(function() {
                        goog.dom.removeNode(enemy);
                    })
                    .end();
            } (enemy));

            hllwtml5.gun.enemiesKilled += 1;
            hllwtml5.pubsub.publish('enemiesKilledChange',
                    hllwtml5.gun.enemiesKilled);
        }
    }
};

/**
 * Fire a gunshot.
 *
 * @param {!goog.events.BrowserEvent} e A browser event.
 */
hllwtml5.gun.shoot = function(e) {
    var bullet;
    var bulletVec2;
    var gunCenter;
    var shotLoc;

    shotLoc = new goog.math.Vec2(e.clientX, e.clientY);
    gunCenter = hllwtml5.animation.getOffsetCenter(goog.dom.query('#gun')[0]);
    bulletVec2 = new goog.math.Vec2.difference(shotLoc, gunCenter);

    bullet = goog.dom.createDom('div', { 'class': 'bullet' });
    bullet.style.left = gunCenter.x + 'px';
    bullet.style.top = gunCenter.y + 'px';

    goog.dom.query('body')[0].appendChild(bullet);

    // Give move.js a fraction of time to let appendChild finish.
    setTimeout(function() {
        move(bullet)
            .to(bulletVec2.x - (bullet.clientWidth / 2),
                bulletVec2.y - (bullet.clientHeight / 2))
            .scale(.075)
            .duration(500)
            .ease('out')
            .then(function() {
                hllwtml5.gun.hitDetection(bullet, shotLoc);
                goog.dom.removeNode(bullet);
                hllwtml5.gun.rounds += 1;
                hllwtml5.pubsub.publish('roundsChange', hllwtml5.gun.rounds);
            })
            .then()
                .set('opacity', 0)
                .duration(1000)
                .pop()
            .end();
    }, 10);
};

/**
 * Fire the gun on mouse down, and mouse down and mouse movement.
 *
 * @param {number=} opt_rateOfFire The delay in milliseconds between rounds.
 *    Defaults to five rounds per second.
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

    goog.events.listen(document, [goog.events.EventType.TOUCHSTART,
                goog.events.EventType.MOUSEDOWN],
                        mouseDownHandler);

    goog.events.listen(document, [goog.events.EventType.TOUCHSTART,
                goog.events.EventType.MOUSEUP],
                        mouseUpHandler);

    goog.events.listen(document, [goog.events.EventType.TOUCHMOVE,
                goog.events.EventType.MOUSEMOVE],
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
