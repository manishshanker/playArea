(function (HAF) {
    "use strict";

    APP.controller.NewsList = HAF.Controller.extend({
        init: function () {
            this.inject({
                templates: {
                    newsList: new HAF.Template("newsListTemplate")
                },
                views: {
                    newsList: new APP.view.NewsList()
                }
            });
        },
        selectItem: function (id) {
            this.views.newsList.selectItem(id);
        }
    });

}(HAF));