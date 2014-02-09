(function (HAF) {
    "use strict";

    APP.controller.NewsDetail = HAF.Controller.extend({
        autoWire: true,
        injector: "NewsDetail",
        inject: {
            templates: {newsDetail: "tmpl!newsDetail"},
            views: ["newsDetail"]
        }
    });

}(HAF));