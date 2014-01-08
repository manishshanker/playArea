(function (HAF) {
    "use strict";

    var templateCache = {};

    HAF.Template = Class.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || HAF.Template.LOAD.BY_ID;
            if (this.loadBy === HAF.Template.LOAD.BY_ID) {
                templateCache[path] = templateCache[path] || HAF.templateEngine.getById(path);
            }
        },
        process: function (data) {
            if (!templateCache[this.path]) {
                throw new Error("Template not in cache!!");
            }
            return HAF.templateEngine.process(templateCache[this.path], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (that.loadBy === HAF.Template.LOAD.BY_URL) {
                if (templateCache[that.path]) {
                    onSuccess();
                }
                HAF.templateEngine.getByURL(that.path, function (template) {
                    templateCache[that.path] = template;
                    onSuccess();
                });
            } else {
                onSuccess();
            }
        }
    });

    HAF.Template.LOAD = {
        BY_ID: "APP_TEMPLATE_BY_ID",
        BY_URL: "APP_TEMPLATE_BY_URL"
    };

}(HAF));