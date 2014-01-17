(function (HAF) {
    "use strict";

    APP.controller.NewsList = HAF.Controller.extend({
        autoWire: true,
        init: function (dependency) {
            this.inject(dependency || {
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