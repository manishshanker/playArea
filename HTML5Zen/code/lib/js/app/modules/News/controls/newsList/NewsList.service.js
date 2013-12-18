(function () {
    "use strict";

    APP.service.NewsList = APP.Service.$extend({
        dataURL: APP.serviceURL.newsList.fetch
    });

}());

