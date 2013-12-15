(function () {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {APP.view.NewsDetail=} view
     * @param {APP.Template=} template
     */
    APP.controller.NewsDetail = APP.Controller.$extend({
        init: function (options, view, template) {
            this.options = options;
            this.template = template || new APP.Template("newsDetailTemplate", APP.Template.LOAD.BY_ID);
            this.view = view || new APP.view.NewsDetail();
            this.load({});
        }
    });

}());