(function () {
    "use strict";

    var noop = function () {
    };

    var Service = Classy.$extend({
        fetch: noop,
        update: noop,
        get: noop,
        on: noop
    });

    APP.Service = Service;
}());