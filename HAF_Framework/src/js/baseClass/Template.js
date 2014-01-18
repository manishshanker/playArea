(function (HAF) {
    "use strict";

    var templateCache = {};

    HAF.Template = HAF.Base.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || HAF.Template.LOAD.DEFAULT;
            if (this.loadBy === HAF.Template.LOAD.BY_ID) {
                if (!templateCache[this.guid()]) {
                    templateCache[this.guid()] = HAF.templateEngine.getById(path);
                    HAF.templateEngine.remove(path);
                }
            }
        },
        process: function (data) {
            if (!templateCache[this.guid()]) {
                throw new Error("Template not in cache!!");
            }
            return HAF.templateEngine.process(templateCache[this.guid()], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (that.loadBy === HAF.Template.LOAD.BY_URL) {
                if (templateCache[this.guid()]) {
                    onSuccess();
                }
                HAF.templateEngine.getByURL(that.path, function (template) {
                    templateCache[this.guid()] = template;
                    onSuccess();
                });
            } else {
                onSuccess();
            }
        },
        destroy: function () {
            delete templateCache[this.guid()];
        }
    });

    HAF.Template.LOAD = {
        BY_ID: "APP_TEMPLATE_BY_ID",
        BY_URL: "APP_TEMPLATE_BY_URL",
        DEFAULT: "APP_TEMPLATE_BY_ID"
    };

}(HAF));