(function (HAF) {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {[APP.View]=} views
     * @param {[HAF.Template]=} templates
     * @param {[HAF.Service]=} services
     * @param {[HAF.Controller]=} controls
     */
    APP.controller.News = HAF.Controller.extend({
        getControls: function () {
            return {
                newsList: new APP.controller.NewsList(),
                newsDetail: new APP.controller.NewsDetail()
            };
        },
        getServices: function () {
            return {
                newsList: new APP.service.NewsList(),
                newsDetail: new APP.service.NewsDetail()
            };
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
//        messages: {
//            "message-name": function () {
//
//            }
//        },
        controlMessages: {
            show: "navigationChangedTo:example",
            hide: "navigationChangedFrom:example",
            stateChange: "navigationStateChange:example"
        }
    });

}(HAF));