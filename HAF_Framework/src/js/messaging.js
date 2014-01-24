(function (HAF, $) {
    "use strict";

    var Messaging = function () {
        this.messageBus = $({});
    };

    Messaging.prototype = {
        publish: function (subject, message) {
            this.messageBus.trigger(subject, [message]);
        },
        subscribe: function (scope, subjects, fn) {
            var that = this;
            if (typeof subjects === "string") {
                return getSubsricber(that, fn, scope, subjects);
            }
            var subscriberFNs = {};
            HAF.each(subjects, function (fn, subject) {
                subscriberFNs[subject] = getSubsricber(that, fn, scope, subject);
            });
            return subscriberFNs;
        },
        unsubscribe: function (subjects, fn) {
            var that = this;
            if (typeof subjects === "string") {
                that.messageBus.off(subjects, fn);
            } else {
                HAF.each(subjects, function (fn, subject) {
                    that.messageBus.off(subject, fn);
                });
            }
        }
    };

    function getSubsricber(ctx, fn, scope, subject) {
        var unsubscribeMethod = function (e, message) {
            fn.call(scope, message);
        };
        ctx.messageBus.on(subject, unsubscribeMethod);
        return unsubscribeMethod;
    }

    HAF.messaging = new Messaging();
    HAF.Messaging = Messaging;

}(HAF, HAF.DOM));