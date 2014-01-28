(function (HAF) {
    "use strict";

    var defaultMessageBus = {
        publish: HAF.noop,
        subscribe: HAF.noop,
        unsubscribe: HAF.noop
    };

    HAF.Base = Class.extend({
        _guid: null,
        messageBus: defaultMessageBus,
        parentMessageBus: defaultMessageBus,
        injector: null,
        guid: function () {
            if (!this._guid) {
                this._guid = guid();
            }
            return this._guid;
        },
        injectDependencies: function (dependencies) {
            HAF.dependencyInjector(this, dependencies);
        }
    });

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

}(HAF));