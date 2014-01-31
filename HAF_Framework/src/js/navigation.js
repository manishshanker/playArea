(function (HAF, $) {
    "use strict";

    var currentView;
    var currentPath;
    var viewState = {};
    var restoringState = false;
    var dView = "#/home";
    var KPS = true;

    var Navigation = function () {

        function load(defaultView, keepPreviousState) {
            KPS = keepPreviousState === undefined ? KPS : keepPreviousState;
            dView = defaultView;
            $(window).on("hashchange", onLocationChange);
            if (location.hash) {
                onLocationChange();
            } else {
                location.href = "#/" + dView;
            }
        }

        function onLocationChange() {
            currentPath = location.hash;
            var appStateData = parseLocationData(currentPath);
            if (!appStateData) {
                location.href = "#/" + dView;
                return;
            }
            if (appStateData.page !== currentView) {
                hidePage(currentView, appStateData);
                currentView = appStateData.page;
                showPage(currentView, appStateData);
            }
            var newAppStateData = parseLocationData(location.hash);
            if (!restoringState && (!viewState[currentView] || (newAppStateData.pageData !== viewState[newAppStateData.page].pageData))) {
                publishStateUpdate(newAppStateData);
            }
            viewState[currentView] = appStateData;
            window.setTimeout(function () {
                restoringState = false;
            }, 200);
        }

        function publishStateUpdate(appStateData) {
            HAF.messaging.publish("navigationStateChange:" + currentView, appStateData);
            HAF.messaging.publish("navigationStateChange", appStateData);
        }

        function hidePage(page, appStateData) {
            if (page) {
                $("a[href$='#/" + page + "']").removeClass("selected");
                $("#" + page).removeClass("page-visible");
                HAF.messaging.publish("navigationChangedFrom:" + page, appStateData);
            }
        }

        function showPage(page, appStateData) {
            $("#" + page).addClass("page-visible");
            $("a[href$='#/" + page + "']").addClass("selected");
            var cachedViewState = viewState[page];
            if (cachedViewState) {
                if (cachedViewState.pageData) {
                    location.replace("#/" + page + "/" + cachedViewState.pageData);
                    if (KPS) {
                        restoringState = true;
                    }
                }
            }
            HAF.messaging.publish("navigationChangedTo:" + currentView, appStateData);
        }

        function parseLocationData(locationData) {
            var a = /#\/([a-zA-Z_\-0-9\$]+)(\/(.+))?/.exec(locationData);
            if (!a) {
                return null;
            }
            return {
                path: locationData,
                page: a[1],
                pageData: a[3],
                keepPreviousState: KPS
            };
        }

        function setRoute(route) {
            currentPath = route;
            location.hash = route;
            if (window.hasOwnProperty("onhashchange")) {
                onLocationChange();
            }
        }

        function route(context, pattern, callback, callbackFailure) {
            var items = new RegExp(("^" + pattern + "$").replace("?", ".").replace(/:[a-zA-Z0-9-_]+/g, function (a) {
                return "([a-zA-Z0-9-_]+)";
            })).exec(currentPath.substring(1).replace(/[\/]?$/, ""));
            if (items) {
                items.splice(0, 1);
                callback.apply(context, items);
            } else {
                if (callbackFailure) {
                    callbackFailure.call(context);
                }
            }
        }

        return {
            load: load,
            route: route,
            setRoute: setRoute
        };
    };

    HAF.navigation = new Navigation();
}(HAF, HAF.DOM));