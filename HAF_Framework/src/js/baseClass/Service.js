(function (HAF, $) {
    "use strict";

    var noop = function () {
    };

    var privateVar = {};

    HAF.Service = Class.extend({
        dataURL: null,
        fetch: function () {
            $.get(this.dataURL, function (data) {
                this.updated(data);
            });
        },
        update: noop,
        get: noop,
        lastResult: function () {
            return privateVar[this._id_].lastResult;
        },
        onUpdate: function (callback) {
            privateVar[this._id_].updateCallBack.push(callback);
        },
        init: function () {
            this._id_ = (new Date()).getTime() + Math.floor(Math.random() * 1000000);
            privateVar[this._id_] = {};
            privateVar[this._id_].updateCallBack = [];
        },
        updated: function (data) {
            var n, l;
            var privateVar2 = privateVar[this._id_];
            privateVar2.lastResult = data;
            if (privateVar2) {
                for (n = 0, l = privateVar2.updateCallBack.length; n < l; n++) {
                    privateVar2.updateCallBack[n](data);
                }
            }
        },
        destroy: function () {
            delete privateVar[this._id_];
        },
        stop: noop
    });

}(HAF, HAF.DOM));