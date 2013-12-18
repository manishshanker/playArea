(function () {
    "use strict";

    APP.controller.NewsList = APP.Controller.extend({
        getTemplates: function () {
            return {
                newsList: new APP.Template("newsListTemplate")
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

}());