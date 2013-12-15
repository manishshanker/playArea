(function ($) {
    "use strict";

    APP.service.News = APP.Service.$extend({
        fetch: function (onSuccess) {
            $.get(APP.serviceURL.news.fetch, onSuccess);
        }
    });

}(APP.DOM));