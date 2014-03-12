mqApp.config(function($stateProvider) {
    $stateProvider
        .state('trades', {
            url: "/trades",
            templateUrl: "lib/partials/trades/trades.html"
        })
        .state('trades.list', {
            url: "/list",
            templateUrl: "lib/partials/trades/trades.list.html",
            controller: mqApp.controllers.Trades
        })
});