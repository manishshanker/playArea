(function (HAF) {
    "use strict";

    HAF.Base = Class.extend({
        _guid: null,
        messageBus: {
            publish: noop,
            subscribe: noop,
            unsubscribe: noop
        },
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

    HAF.Base.noop = noop;

    function injectDependencies(ctx, dependencies) {
        var dependency;
        if (HAF.Messaging && (dependencies instanceof HAF.Messaging)) {
            ctx.messageBus = dependencies;
        }
        var injectedDependencies = (dependencies && dependencies.inject && dependencies.inject) || (ctx.inject && ctx.inject());
        if (injectedDependencies) {
            for (dependency in injectedDependencies) {
                if (injectedDependencies.hasOwnProperty(dependency)) {
                    ctx[dependency] = injectedDependencies[dependency];
                }
            }
        }
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