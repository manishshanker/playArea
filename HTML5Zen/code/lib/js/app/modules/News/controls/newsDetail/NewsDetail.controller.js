(function () {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {APP.view.NewsDetail=} view
     * @param {APP.Template=} template
     */
    APP.controller.NewsDetail = APP.Controller.extend({
        getTemplates: function () {
            return {
                newsDetail: new APP.Template("newsDetailTemplate")
            };
        },
        getViews: function () {
            return {
                newsDetail: new APP.view.NewsDetail()
            };
        }
    });

}());