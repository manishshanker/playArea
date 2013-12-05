(function($) {
    "use strict";

    APP.controller.News = function() {

        var service;
        var newsData;
        var newsList, newsDetail;

        function loadNewsDetails(selectedItemId) {
            newsDetail.load(HTML5ZenDOM.grep(newsData, function(item) {
                return item.id == selectedItemId;
            })[0]);
        }

        function load() {
            service.getData(function(data) {
                newsData = data;
                newsList.load(data);
            });
        }

        /*Needs to be present to gracefully destroy dom elements not required anymore*/
        function destroy() {
            newsList.destroy();
            newsDetail.destroy();
            service = null;
        }

        (function init() {
            newsList = new APP.controller.NewsList({
                onNewsItemSelected: loadNewsDetails
            });
            newsDetail = new APP.controller.NewsDetail();
            service = new APP.service.News();
        }());

        return {
            load: load,
            destroy: destroy
        }
    }

}(HTML5ZenDOM));