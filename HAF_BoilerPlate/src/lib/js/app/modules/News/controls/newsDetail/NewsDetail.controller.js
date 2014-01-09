(function (HAF) {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {APP.view.NewsDetail=} view
     * @param {HAF.Template=} template
     */
    APP.controller.NewsDetail = HAF.Controller.extend({
        getTemplates: function () {
            return {
                newsDetail: new HAF.Template("newsDetailTemplate")
            };
        },
        getViews: function () {
            return {
                newsDetail: new APP.view.NewsDetail()
            };
        }
    });

}(HAF));