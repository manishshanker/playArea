(function (HAF) {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {APP.view.NewsDetail=} view
     * @param {HAF.Template=} template
     */
    APP.controller.NewsDetail = HAF.Controller.extend({
        autoWire: true,
        init: function () {
            this.inject({
                templates: {
                    newsDetail: new HAF.Template("newsDetailTemplate")
                },
                views: {
                    newsDetail: new APP.view.NewsDetail()
                }
            });
        }
    });

}(HAF));