(function($) {
    "use strict";

    APP.service.News = function() {

        function getData(onSuccess) {
            $.get(APP.serviceURL.news.getData, onSuccess);
        }

        return {
            getData: getData
        }
    }

}(HTML5ZenDOM));