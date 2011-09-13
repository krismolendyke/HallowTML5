(function (window, undefined) {
    var hllwtml5 = function () {
        var guy = $('#guy');
        var ghostGuy = $('#ghost-guy');

        var wobbleGhostGuy = function () {
            var skewX =  -1 * (Math.random() * 5 | 0);
            console.log('skewX: ', skewX);
            move('#ghost-guy')
                .duration('.5s')
                .ease('snap')
                .skew(skewX)
                .then(wobbleGhostGuy)
                .end();
        };

        return {
            init: function () {
                wobbleGhostGuy();
            }
        };
    };

    window.hllwtml5 = new hllwtml5();
} (window));
