goog.provide('hllwtml5.hud');

goog.require('goog.dom');
goog.require('goog.dom.query');

/**
 * The heads up display.
 *
 * @type {Element}
 */
hllwtml5.hud.hud;

/**
 * The initial enemy count.
 *
 * @type {number}
 */
hllwtml5.hud.initialEnemyCount = 0;

/**
 * The rounds display.
 *
 * @type {Element}
 */
hllwtml5.hud.rounds;

/**
 * The enemies killed display.
 *
 * @type {Element}
 */
hllwtml5.hud.enemiesKilled;

/**
 * The enemies remaining display.
 *
 * @type {Element}
 */
hllwtml5.hud.enemiesRemaining;

/**
 * The shooting accuracy based on rounds and enemies killed.
 *
 * @type {Element}
 */
hllwtml5.hud.accuracy;

/**
 * Update the rounds count with the given amount.
 *
 * @param {number} rounds The rounds count.
 */
hllwtml5.hud.updateRounds = function(rounds) {
    goog.dom.setTextContent(hllwtml5.hud.rounds, rounds);
    hllwtml5.pubsub.publish('accuracyChange');
};

/**
 * Update the count of enemies killed.
 *
 * @param {!number} count The number of enemies killed.
 */
hllwtml5.hud.updateEnemiesKilled = function(count) {
    goog.dom.setTextContent(hllwtml5.hud.enemiesKilled, count);
    goog.dom.setTextContent(hllwtml5.hud.enemiesRemaining,
            (hllwtml5.hud.initialEnemyCount - count) + '');
    hllwtml5.pubsub.publish('accuracyChange');
};

/**
 * Update the accuracy of the shooting based on rounds and enemies killed.
 */
hllwtml5.hud.updateAccuracy = function() {
    var accuracy = 0;
    var enemiesKilled = 0;
    var rounds = 0;

    enemiesKilled =
            parseInt(goog.dom.getTextContent(hllwtml5.hud.enemiesKilled), 10);
    rounds = parseInt(goog.dom.getTextContent(hllwtml5.hud.rounds), 10);

    if (!isNaN(enemiesKilled) && !isNaN(rounds) && rounds !== 0) {
        accuracy = (enemiesKilled / rounds) * 100;
    }

    goog.dom.setTextContent(hllwtml5.hud.accuracy, accuracy.toFixed(1) + '%');
};

/**
 * Initialize the heads up display.
 */
hllwtml5.hud.init = function() {
    hllwtml5.hud.initialEnemyCount = goog.dom.query('.enemy').length;
    hllwtml5.hud.hud = goog.dom.query('#hud')[0];
    hllwtml5.hud.rounds = goog.dom.query('#rounds')[0];
    hllwtml5.hud.enemiesKilled = goog.dom.query('#enemies_killed')[0];
    hllwtml5.hud.enemiesRemaining = goog.dom.query('#enemies_remaining')[0];
    hllwtml5.hud.accuracy = goog.dom.query('#accuracy')[0];

    hllwtml5.pubsub.subscribe('roundsChange', hllwtml5.hud.updateRounds);
    hllwtml5.pubsub.subscribe('enemiesKilledChange',
            hllwtml5.hud.updateEnemiesKilled);
    hllwtml5.pubsub.subscribe('accuracyChange', hllwtml5.hud.updateAccuracy);

    hllwtml5.hud.updateRounds(0);
    hllwtml5.hud.updateEnemiesKilled(0);
};
