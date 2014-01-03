(function () {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {[APP.View]=} views
     * @param {[APP.Template]=} templates
     * @param {[APP.Service]=} services
     * @param {[APP.Controller]=} controls
     */
    APP.controller.News = APP.Controller.extend({
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
        messages: {
            show: "appStateChange-view-changedTo:example",
            hide: "appStateChange-view-changedFrom:example",
            stateChange: "appStateChange-view-stateChange:example"
//            ,"message-name": function () {
//
//            }
        }
    });

}());