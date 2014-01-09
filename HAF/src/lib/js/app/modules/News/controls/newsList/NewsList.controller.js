(function (HAF) {
    "use strict";

    APP.controller.NewsList = HAF.Controller.extend({
        getTemplates: function () {
            return {
                newsList: new HAF.Template("newsListTemplate")
            };
        },
        getViews: function () {
            return {
                newsList: new APP.view.NewsList()
            };
        },
        selectItem: function (id) {
            this.views.newsList.selectItem(id);
        }
    });

}(HAF));