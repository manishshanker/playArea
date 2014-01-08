(function (HAF) {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {HAF.view.NewsDetail=} view
     * @param {HAF.Template=} template
     */
    HAF.controller.NewsDetail = HAF.Controller.extend({
        getTemplates: function () {
            return {
                newsDetail: new HAF.Template("newsDetailTemplate")
            };
        },
        getViews: function () {
            return {
                newsDetail: new HAF.view.NewsDetail()
            };
        }
    });

}(HAF));