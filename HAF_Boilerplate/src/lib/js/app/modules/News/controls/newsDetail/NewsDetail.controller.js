(function (HAF) {
    "use strict";

    APP.controller.NewsDetail = HAF.Controller.extend({
        autoWire: true,
        injector: "NewsDetail",
        inject: {
            templates: {newsDetail: "hbs!lib/templates/newsDetail"},
            views: ["newsDetail"]
        }
    });

}(HAF));