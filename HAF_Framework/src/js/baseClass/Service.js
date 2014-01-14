(function (HAF, $) {
    "use strict";

    var privateVar = {};

    HAF.Service = HAF.Base.extend({
        dataURL: null,
        init: function () {
            privateVar[this.guid()] = {};
            privateVar[this.guid()].updateCallBack = [];
        },
        fetch: function () {
            $.get(this.dataURL, function (data) {
                this.updated(data);
            });
        },
        update: HAF.Base.noop,
        get: HAF.Base.noop,
        lastResult: function () {
            return privateVar[this.guid()].lastResult;
        },
        onUpdate: function (callback) {
            privateVar[this.guid()].updateCallBack.push(callback);
        },
        updated: function (data) {
            var n, l;
            var localPrivateVar = privateVar[this.guid()];
            localPrivateVar.lastResult = data;
            if (localPrivateVar) {
                for (n = 0, l = localPrivateVar.updateCallBack.length; n < l; n++) {
                    localPrivateVar.updateCallBack[n](data);
                }
            }
        },
        destroy: function () {
            delete privateVar[this.guid()];
        },
        stop: HAF.Base.noop,
        start: HAF.Base.noop
    });

}(HAF, HAF.DOM));