(function ($) {
    "use strict";

    var Messaging = function () {
        var messageBus = $(document);

        function publish(subject, message) {
            messageBus.trigger(subject, [message]);
        }

        function subscribe(subject, callback) {
            messageBus.on(subject, function (e, message) {
                callback(message);
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

    APP.messaging = new Messaging();
}(APP.DOM));