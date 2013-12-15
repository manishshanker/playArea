(function () {
    "use strict";

    APP.controller.NewsList = APP.Controller.$extend({
        init: function (options, view, template) {
            this.options = options;
            this.view = view || new APP.view.NewsList();
            this.template = template || new APP.Template("newsListTemplate");
        },
        render: function (data) {
            this.view.render(this.template.process(data));
        },
        selectItem: function (id) {
            this.view.selectItem(id);
        }
    });

}());