(function ($) {
    "use strict";

    var currentURL;

    var Navigation = function () {

        function load() {
            currentURL = location.href;
            $(window).on("hashchange", function () {
                APP.messaging.publish("appStateChange", location.hash);
            });
        }

        return {
            load: load
        };
    };

    APP.navigation = new Navigation();
}(APP.DOM));