mqApp.config(function($stateProvider) {
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "lib/partials/home/home.html"
        })
        .state('home.list', {
            url: "/list",
            templateUrl: "lib/partials/home/home.list.html",
            controller: mqApp.controllers.Home
        })
});