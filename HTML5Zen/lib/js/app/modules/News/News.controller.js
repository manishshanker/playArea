(function () {
    "use strict";

    APP.controller.News = function () {

        var loaded = false;

        var service;
        var newsData;
        var newsList, newsDetail;

        function loadNewsDetails(selectedItemId) {
            newsDetail.load(APP.DOM.grep(newsData, function (item) {
                return String(item.id) === String(selectedItemId);
            })[0]);
        }

        function loadModule() {
            newsList = new APP.controller.NewsList({
                onNewsItemSelected: loadNewsDetails
            });
            newsDetail = new APP.controller.NewsDetail();
            service = new APP.service.News();
            service.getData(function (data) {
                newsData = data;
                newsList.load(data);
            });
            return true;
        }

        function load() {
            APP.messaging.subscribe("appStateChange-selected-page-example", function (pageData) {
                loaded = !loaded ? loadModule() : true;
                if (pageData.moduleItem) {
                    newsList.selectItem(pageData.moduleItem);
                    loadNewsDetails(pageData.moduleItem);
                }
            });

            /*this destroy is for keeping performance when there are multiple complex modules and you want to make the dom tree less heavy*/
            APP.messaging.subscribe("appStateChange-unselected-page-example", function () {
                destroy();
            });
        }

        /*Needs to be present to gracefully destroy dom elements not required anymore*/
        function destroy() {
            newsList.destroy();
            newsDetail.destroy();
            service = null;
            loaded = false;
            newsList = null;
            newsDetail = null;
        }

        return {
            load: load,
            destroy: destroy
        };
    };

}());