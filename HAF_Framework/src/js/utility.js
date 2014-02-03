(function (HAF) {
    "use strict";

    HAF.noop = noop;
    HAF.each = each;
    HAF.infoLogger = (window.console && window.console.log && function () {
        console.info.apply(console, arguments);
    }) || HAF.noop;
    HAF.logger = (window.console && window.console.log && function () {
        console.log.apply(console, arguments);
    }) || HAF.noop;
    HAF.errorLogger = (window.console && window.console.log && function () {
        console.error.apply(console, arguments);
    }) || HAF.noop;
    HAF.warningLogger = (window.console && window.console.log && function () {
        console.warn.apply(console, arguments);
    }) || HAF.noop;

    function each(data, callback) {
        if (data) {
            if (data instanceof Array) {
                loopArray(data, callback);
            } else {
                loopObject(data, callback);
            }
        }
    }

    function loopObject(data, callback) {
        var d;
        if (data) {
            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    callback(data[d], d);
                }
            }
        }
    }

    function loopArray(data, callback) {
        var i, l;
        if (data) {
            for (i = 0, l = data.length; i < l; i++) {
                callback(data[i], i);
            }
        }
    }

    function noop() {
    }

}(HAF));