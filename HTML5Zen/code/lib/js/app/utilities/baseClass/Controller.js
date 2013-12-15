(function () {
    "use strict";

    var Controller = Classy.$extend({
        init: function (options, view, template) {
            this.view = view;
            this.template = template;
            this.options = options;
        },
        render: function (data) {
            this.view.render(this.template.process(data));
        },
        load: function (data) {
            var that = this;
            that.template.load(function () {
                that.render(data);
            });
        },
        destroy: function () {
            if (this.view) {
                this.view.destroy();
            }
        }
    });

    APP.Controller = Controller;

}());