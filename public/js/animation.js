goog.provide('hllwtml5.animation');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.math.Box');
goog.require('goog.math.Vec2');
goog.require('goog.style');

/**
 * Create a vector representing the center of the given element.
 *
 * @param {!Element} el The element.
 * @return {goog.math.Vec2|undefined} center The center of the given element
 *     or undefined if it could not be created.
 */
hllwtml5.animation.getOffsetCenter = function(el) {
    var center;
    var hCenter;
    var vCenter;

    if (el.offsetTop && el.offsetHeight && el.offsetLeft && el.offsetWidth) {
        hCenter = Math.floor((el.offsetWidth) / 2) + el.offsetLeft;
        vCenter = Math.floor((el.offsetHeight) / 2) + el.offsetTop;
        center = new goog.math.Vec2(hCenter, vCenter);
    }

    return center;
};

/**
 * Get the angle in degrees between the two given vectors. The angle returned
 * will be between -180 and 180 degrees.
 *
 * @param {!goog.math.Vec2} v1 The first vector.
 * @param {!goog.math.Vec2} v2 The second vector.
 * @return {number} The angle between the two vectors, in degrees.
 */
hllwtml5.animation.getAngleBetween = function(v1, v2) {
    var angle1;
    var angle2;
    var angleBetween;

    angle1 = Math.atan2(v1.y, v1.x);
    angle2 = Math.atan2(v2.y, v2.x);
    angleBetween = angle1 - angle2;

    return hllwtml5.animation.radToDeg(angleBetween);
};

/**
 * Rotate the given element toward the current mouse position.
 *
 * @param {!Element} el The element to rotate toward the mouse.
 * @param {number=} opt_angleOffset An amount to offset the rotation by.
 *     This can be used to offset rotation from north by a given amount.
 */
hllwtml5.animation.rotateTowardMouse = function(el, opt_angleOffset) {
    var adjustRotationCount;
    var angleOffset = opt_angleOffset || 0;
    var elCenter = hllwtml5.animation.getOffsetCenter(el);
    var north = new goog.math.Vec2(0, 1);
    var previousAngle = 0;
    var rotateEl;
    var rotationCount = 0;

    /**
     * Increment or decrement the rotation count based on the difference
     * between the current and previous angle of rotation.  A large difference
     * greater than degrees indicates that the element has just completed a
     * full rotation.
     *
     * @param {!number} angle The current angle of rotation.
     * @param {!number} previousAngle The previous angle of rotation.
     */
    adjustRotationCount = function(angle, previousAngle) {
        /**
         * The amount of difference in degrees that indicates a rotation has
         * occurred.
         *
         * @const
         * @type {number}
         */
        var ROTATION_DIFF = 180;
        var diff = angle - previousAngle;

        if (diff > ROTATION_DIFF) {
            rotationCount -= 1;
        } else if (diff < -ROTATION_DIFF) {
            rotationCount += 1;
        }
    };

    /**
     * Perform the rotation of the element.
     *
     * Maintain a rotation count which is multiplied by 360 degrees and added
     * to the angle between north and the current mouse position.  The
     * rotation count is necessary to ensure that when the element completes a
     * rotation the angle does not reset to 0, as
     * {@see hllwtml5.animation.getAngleBetween} only returns values between 0
     * and 360 degrees. This would cause the element to spin all the way back
     * around to its initial angle.
     *
     * @param {!goog.events.BrowserEvent} e A browser event.
     */
    rotateEl = function(e) {
        var angle;
        var elCenterToMousePos;
        var mousePos;

        mousePos = new goog.math.Vec2(e.clientX, e.clientY);
        elCenterToMousePos = goog.math.Vec2.difference(elCenter, mousePos);
        angle = hllwtml5.animation.getAngleBetween(elCenterToMousePos, north);
        adjustRotationCount(angle, previousAngle);
        previousAngle = angle;
        angle += (360 * rotationCount) + angleOffset;

        move(el)
            .rotate(angle)
            .duration(0)
            .end();
    };

    goog.events.listen(document, goog.events.EventType.MOUSEMOVE, rotateEl);
};

/**
 * Transform an angle in radians to an angle in degrees.
 *
 * @param {!number} rad An angle in radians.
 * @return {!number} The angle in degrees.
 */
hllwtml5.animation.radToDeg = function(rad) {
    return rad * (180 / Math.PI);
};

/**
 * Translate the element's center to be directly under the mouse location.
 *
 * @param {!Element} el An element.
 */
hllwtml5.animation.translateToUnderMouse = function(el) {
    var translateEl;

    /**
     * Perform the translation.
     *
     * @param {goog.events.BrowserEvent} e A browser event.
     */
    translateEl = function(e) {
        move(el)
            .to((e.clientX - (el.clientWidth / 2)),
                (e.clientY - (el.clientWidth / 2)))
            .duration(0)
            .end();
    };

    goog.events.listen(document, goog.events.EventType.MOUSEMOVE,
            translateEl);
};
