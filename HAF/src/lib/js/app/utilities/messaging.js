(function (HAF, $) {
    "use strict";

    var Messaging = function () {
        var messageBus = $(document);

        function publish(subject, message) {
            messageBus.trigger(subject, [message]);
        }

        function subscribe(scope, subject, callback) {
            messageBus.on(subject, function (e, message) {
                callback.call(scope, message);
            });
        }

        function unsubscribe(subject) {
            messageBus.off(subject);
        }

        return {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    };

    HAF.messaging = new Messaging();
}(HAF, HAF.DOM));