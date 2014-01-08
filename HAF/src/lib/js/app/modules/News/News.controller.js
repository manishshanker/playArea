(function (HAF) {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {[HAF.View]=} views
     * @param {[HAF.Template]=} templates
     * @param {[HAF.Service]=} services
     * @param {[HAF.Controller]=} controls
     */
    HAF.controller.News = HAF.Controller.extend({
        getControls: function () {
            return {
                newsList: new HAF.controller.NewsList(),
                newsDetail: new HAF.controller.NewsDetail()
            };
        },
        getServices: function () {
            return {
                newsList: new HAF.service.NewsList(),
                newsDetail: new HAF.service.NewsDetail()
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