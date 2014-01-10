(function (HAF) {
    "use strict";

    APP.service.NewsList = HAF.Service.extend({
        dataURL: APP.serviceURL.newsList.fetch
    });

}(HAF));

