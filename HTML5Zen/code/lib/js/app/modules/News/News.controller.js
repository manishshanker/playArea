(function () {
    "use strict";

    /**
     *
     * @param {Object} options
     * @param {APP.service.News} service
     * @param {APP.controller.NewsList} newsList
     * @param {APP.controller.NewsDetail} newsDetail
     */
    APP.controller.News = APP.Controller.$extend({
        init: function (options, service, newsList, newsDetail) {
            this.options = options;
            this.service = service;
            this.newsList = newsList;
            this.newsDetail = newsDetail;
        },
        load: function () {
            var that = this;
            var newsData;
            var newsList, newsDetail, service;

            APP.messaging.subscribe("appStateChange-view-changedTo-example", function () {
                if (!that.loaded) {
                    newsList = that.newsList || new APP.controller.NewsList({
                        onNewsItemSelected: loadNewsDetails
                    });
                    newsDetail = that.newsDetail || new APP.controller.NewsDetail();
                    service = that.service || new APP.service.News();
                    service.fetch(function (data) {
                        newsData = data;
                        newsList.load(data);
                    });
                    that.loaded = true;
                }
            });

            APP.messaging.subscribe("appStateChange-view-stateChange-example", function (pageData) {
                if (pageData.moduleItem) {
                    newsList.selectItem(pageData.moduleItem);
                    loadNewsDetails(pageData.moduleItem);
                }
            });

            /*this destroy is for keeping performance when there are multiple complex modules and you want to make the dom tree less heavy*/
            APP.messaging.subscribe("appStateChange-view-changedFrom-example", function () {
                newsList.destroy();
                newsDetail.destroy();
                that.destroy();
            });

            function loadNewsDetails(selectedItemId) {
                newsDetail.load(APP.DOM.grep(newsData, function (item) {
                    return String(item.id) === String(selectedItemId);
                })[0]);
            }
        },
        destroy: function () {
            this.$super();
            this.service = null;
            this.loaded = false;
            this.newsList = null;
            this.newsDetail = null;
        }
    });

}());