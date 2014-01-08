(function (HAF) {
    "use strict";

    HAF.controller.NewsList = HAF.Controller.extend({
        getTemplates: function () {
            return {
                newsList: new HAF.Template("newsListTemplate")
            };
        },
        getViews: function () {
            return {
                newsList: new HAF.view.NewsList()
            };
        },
        selectItem: function (id) {
            this.views.newsList.selectItem(id);
        }
    });

}(HAF));