(function ($) {
    "use strict";

    var currentPage;

    var Navigation = function () {

        function load(defaultPage) {
            $(window).on("hashchange", onLocationChange);
            if (location.hash) {
                onLocationChange();
            } else {
                location.href = "#/" + defaultPage;
            }
        }

        function onLocationChange() {
            var locationData = parseLocationData(location.hash);
            APP.messaging.publish("appStateChange-unselected-page-" + currentPage, locationData);
            showPage(locationData.page);
            APP.messaging.publish("appStateChange-selected-page-" + currentPage, locationData);
            APP.messaging.publish("appStateChange", locationData);
        }

        function showPage(page) {
            if (currentPage) {
                $("a[href^='#/" + currentPage + "']").removeClass("selected");
                $("#" + currentPage).removeClass("page-visible");
            }
            $("#" + page).addClass("page-visible");
            $("a[href^='#/" + page + "']").addClass("selected");
            currentPage = page;
        }

        function parseLocationData(locationData) {
            var a = locationData.substr(1).split("/");
            return {
                page: a[1],
                module: a[2],
                moduleItem: a[3]
            };
        }

        return {
            load: load
        };
    };

    APP.navigation = new Navigation();
}(APP.DOM));