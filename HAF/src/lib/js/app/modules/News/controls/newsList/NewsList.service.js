(function (HAF) {
    "use strict";

    HAF.service.NewsList = HAF.Service.extend({
        dataURL: HAF.serviceURL.newsList.fetch
    });

}(HAF));

