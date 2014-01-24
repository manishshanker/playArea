(function (HAF) {
    "use strict";

    var defaultMessageBus = {
        publish: noop,
        subscribe: noop,
        unsubscribe: noop
    };

    HAF.Base = Class.extend({
        _guid: null,
        messageBus: defaultMessageBus,
        parentMessageBus: defaultMessageBus,
        guid: function () {
            if (!this._guid) {
                this._guid = guid();
            }
            return this._guid;
        },
        injectDependencies: function (dependencies) {
            injectDependencies(this, dependencies);
        }
    });

    HAF.noop = noop;
    HAF.each = function (data, callback) {
        if (data) {
            if (data instanceof Array) {
                loopArray(data, callback);
            } else {
                loopObject(data, callback);
            }
        }
    };

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

    function injectDependencies(ctx, dependencies) {
        if (HAF.Messaging && (dependencies instanceof HAF.Messaging)) {
            ctx.parentMessageBus = dependencies;
        }
        if (ctx.injectMessageBus) {
            ctx.messageBus = (dependencies && dependencies.inject && dependencies.inject.messageBus) || new HAF.Messaging();
        }
        var injectedDependencies = (dependencies && dependencies.inject) || (ctx.inject && ctx.inject());
        HAF.each(injectedDependencies, function (dependency, key) {
            ctx[key] = dependency;
        });
    }

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