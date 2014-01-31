(function (HAF) {
    "use strict";

    var templateCache = {};

    HAF.TemplateByString = function (string) {
        return new HAF.Template(string, HAF.Template.LOAD.BY_STRING);
    };

    HAF.TemplateByID = function (string) {
        return new HAF.Template(string, HAF.Template.LOAD.BY_ID);
    };

    HAF.TemplateByURL = function (string) {
        return new HAF.Template(string, HAF.Template.LOAD.BY_URL);
    };

    HAF.TemplateSafeString = function (template) {
        return new HAF.templateEngine.safeString(template);
    };

    HAF.Template = HAF.Base.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || HAF.Template.LOAD.DEFAULT;
        },
        process: function (data) {
            if (this.path === undefined) {
                return "";
            }
            if (!templateCache[this.guid()]) {
                console.log("Template param: ", this.path, this.loadBy);
                throw new Error("Template not in cache!!");
            }
            return HAF.templateEngine.process(templateCache[this.guid()], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (this.path === undefined || templateCache[this.guid()]) {
                onSuccess();
            } else {
                if (that.loadBy === HAF.Template.LOAD.BY_URL) {
                    HAF.templateEngine.getByURL(that.path, function (template) {
                        templateCache[that.guid()] = template;
                        onSuccess.call(that);
                    });
                } else if (this.loadBy === HAF.Template.LOAD.BY_ID) {
                    templateCache[this.guid()] = HAF.templateEngine.getById(this.path);
                    HAF.templateEngine.remove(this.path);
                    setTimeout(function () {
                        onSuccess.call(that);
                    }, 5);
                } else {
                    templateCache[this.guid()] = HAF.templateEngine.getByString(this.path);
                    setTimeout(function () {
                        onSuccess.call(that);
                    }, 5);
                }
            }
        },
        destroy: function () {
            delete templateCache[this.guid()];
        }
    });

    HAF.Template.LOAD = {
        BY_ID: "APP_TEMPLATE_BY_ID",
        BY_URL: "APP_TEMPLATE_BY_URL",
        BY_STRING: "APP_TEMPLATE_BY_STRING",
        DEFAULT: "APP_TEMPLATE_BY_ID"
    };

}(HAF));