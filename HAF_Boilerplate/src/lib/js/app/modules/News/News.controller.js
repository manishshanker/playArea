(function (HAF) {
    "use strict";

    APP.controller.News = HAF.Controller.extend({
        autoWire: true,
        init: function (dependency) {
            this.inject(dependency || {
                services: {
                    newsList: new APP.service.NewsList(),
                    newsDetail: new APP.service.NewsDetail()
                },
                controls: {
                    newsList: new APP.controller.NewsList(),
                    newsDetail: new APP.controller.NewsDetail()
                }
            });
        },
        onStateChange: function () {
            return {
                newsList: function (newsList, stateData) {
                    if (stateData.moduleItem) {
                        newsList.selectItem(stateData.moduleItem);
                    }
                    this.services.newsDetail.fetch(this.services.newsList.lastResult(), stateData.moduleItem);
                }
            };
        },
        controlMessages: {
            show: "navigationChangedTo:example",
            hide: "navigationChangedFrom:example",
            stateChange: "navigationStateChange:example"
        }
    });

}(HAF));