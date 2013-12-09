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

        return {
            publish: publish,
            subscribe: subscribe
        };
    };

    APP.messaging = new Messaging();
}(APP.DOM));