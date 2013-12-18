(function () {
    "use strict";

    var templateCache = {};

    APP.Template = Class.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || APP.Template.LOAD.BY_ID;
            if (this.loadBy === APP.Template.LOAD.BY_ID) {
                templateCache[path] = templateCache[path] || APP.templateEngine.getById(path);
            }
        },
        process: function (data) {
            if (!templateCache[this.path]) {
                throw new Error("Template not in cache!!");
            }
            return APP.templateEngine.process(templateCache[this.path], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (that.loadBy === APP.Template.LOAD.BY_URL) {
                if (templateCache[that.path]) {
                    onSuccess();
                }
                APP.templateEngine.getByURL(that.path, function (template) {
                    templateCache[that.path] = template;
                    onSuccess();
                });
            } else {
                onSuccess();
            }
        }
    });

    APP.Template.LOAD = {
        BY_ID: "APP_TEMPLATE_BY_ID",
        BY_URL: "APP_TEMPLATE_BY_URL"
    };

}());