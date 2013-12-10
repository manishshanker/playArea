(function () {
    "use strict";

    var cachedTemplate;

    APP.template.NewsList = (function () {

        function load(onSuccess) {
            onSuccess(cachedTemplate);
        }

        (function init() {
            if (!cachedTemplate) {
                APP.templateEngine.getById("newsListTemplate", function (template) {
                    cachedTemplate = template;
                });
            }
        }());

        return {
            load: load
        };
    }());

}());