(function (HAF, $) {
    "use strict";

    var Messaging = function () {
        this.messageBus = $({});
    };

    Messaging.prototype = {
        publish: function (subject, message) {
            this.messageBus.trigger(subject, [message]);
        },
        subscribe: function (scope, subject, callback) {
            var unsubscribeMethod = function (e, message) {
                callback.call(scope, message);
            };
            this.messageBus.on(subject, unsubscribeMethod);
            return unsubscribeMethod;
        },
        unsubscribe: function (subject, fn) {
            this.messageBus.off(subject, fn);
        }
    };

    HAF.messaging = new Messaging();
    HAF.Messaging = Messaging;

}(HAF, HAF.DOM));