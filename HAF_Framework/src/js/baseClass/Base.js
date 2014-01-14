(function (HAF) {
    "use strict";

    HAF.Base = Class.extend({
        _guid: null,
        guid: function () {
            if (!this._guid) {
                this._guid = guid();
            }
            return this._guid;
        }
    });

    HAF.Base.noop = noop;

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function noop() {
    }

}(HAF));