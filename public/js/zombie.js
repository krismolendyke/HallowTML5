goog.provide('hllwtml5.zombie');

goog.require('hllwtml5.common');

/**
 * Wobble!
 *
 * @param {!Element} zombie BRAINS!!!
 */
hllwtml5.zombie.wobble = function(zombie) {
    move(zombie)
        .duration('.5s')
        .ease('snap')
        .skew(hllwtml5.common.randomInteger(5, true))
        .end(function() { hllwtml5.zombie.unwobble(zombie); });
};

/**
 * Unwobble!
 *
 * @param {!Element} zombie BRAINS!!!
 */
hllwtml5.zombie.unwobble = function(zombie) {
    move(zombie)
        .duration('.1s')
        .ease('snap')
        .skew(0)
        .then(function() { hllwtml5.zombie.wobble(zombie); })
        .end();
};

/**
 * Initialize a ZOMBIE!!!
 *
 * @param {!Element} zombie BRAINS!!!
 */
hllwtml5.zombie.init = function(zombie) {
    console.group('zombie.init');

    hllwtml5.zombie.wobble(zombie);

    console.groupEnd();
};
