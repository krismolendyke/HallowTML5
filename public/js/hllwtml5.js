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
 * Screwing around with some 3D rendering.
 */
hllwtml5.cubicvr = function() {
    console.group('hllwtml5.cubicvr');

    CubicVR.start('auto', function(gl, canvas) {
        // Add a box to mesh, size 1.0, apply material and UV parameters
        var boxMesh = new CubicVR.Mesh({
            primitive: {
                type: "box",
                size: 1.0,
                material: {
                    textures: {
                    }
                },
                uv: {
                    projectionMode: "cubic",
                    scale: [1, 1, 1]
                }
            },
            compile: true
        });

        // New scene with our canvas dimensions and default camera with FOV 80
        var scene = new CubicVR.Scene(canvas.width, canvas.height, 80);

        // SceneObject container for the mesh
        var boxObject = new CubicVR.SceneObject(boxMesh);

        // Add SceneObject containing the mesh to the scene
        scene.bind(boxObject);

        // set initial camera position and target
        scene.camera.position = [1, 1, 1];
        scene.camera.target = [0, 0, 0];

        // Add our scene to the window resize list
        CubicVR.addResizeable(scene);

        // Start our main drawing loop, it provides a timer and the gl context as parameters
        CubicVR.MainLoop(function(timer, gl) {
            scene.render();
        });

        scene.setSkyBox(new CubicVR.SkyBox({
           texture: "img/space-skybox.jpg"
        }));

        // initialize a mouse view controller
        mvc = new CubicVR.MouseViewController(canvas, scene.camera);
    });

    console.groupEnd();
};

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
        // hllwtml5.gun.init(gun, 61, crosshair);
    }

    // hllwtml5.goBatty();

    hllwtml5.cubicvr();
};
