(function ($) {
    "use strict";

    var currentView;
    var viewState = {};

    var Navigation = function () {

        function load(defaultView) {
            $(window).on("hashchange", onLocationChange);
            if (location.hash) {
                onLocationChange();
            } else {
                location.href = "#/" + defaultView;
            }
        }

        function onLocationChange() {
            var appStateData = parseLocationData(location.hash);
            if (appStateData.page !== currentView) {
                hidePage(currentView, appStateData);
                currentView = appStateData.page;
                showPage(currentView, appStateData);
            }
            viewState[currentView] = appStateData;
            APP.messaging.publish("appStateChange-view-stateChange:" + currentView, appStateData);
            APP.messaging.publish("appStateChange", appStateData);
        }

        function hidePage(page, appStateData) {
            if (page) {
                $("a[href$='#/" + page + "']").removeClass("selected");
                $("#" + page).removeClass("page-visible");
                APP.messaging.publish("appStateChange-view-changedFrom:" + page, appStateData);
            }
        }

        function showPage(page, appStateData) {
            $("#" + page).addClass("page-visible");
            $("a[href$='#/" + page + "']").addClass("selected");
            var cachedViewState = viewState[page];
            if (cachedViewState) {
                if (cachedViewState.moduleItem) {
                    location.replace("#/" + page + "/" + cachedViewState.module + "/" + cachedViewState.moduleItem);
                }
            }
            APP.messaging.publish("appStateChange-view-changedTo:" + currentView, appStateData);
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