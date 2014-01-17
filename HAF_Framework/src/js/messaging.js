(function (HAF, $) {
    "use strict";

    var Messaging = function () {
        var messageBus = $({});

        function publish(subject, message) {
            messageBus.trigger(subject, [message]);
        }

        function subscribe(scope, subject, callback) {
            var unsubscribeMethod = function (e, message) {
                callback.call(scope, message);
            };
            messageBus.on(subject, unsubscribeMethod);
            return unsubscribeMethod;
        }

        function unsubscribe(subject, fn) {
            messageBus.off(subject, fn);
        }

        return {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    };

    HAF.messaging = new Messaging();
    HAF.Messaging = Messaging;

}(HAF, HAF.DOM));