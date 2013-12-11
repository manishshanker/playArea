(function () {
    "use strict";

    var cachedTemplate;

    APP.template.NewsList = (function () {

        function getNewsListTemplate(onSuccess) {
            onSuccess(cachedTemplate);
        }

        function load() {
            if (!cachedTemplate) {
                APP.templateEngine.getById("newsListTemplate", function (template) {
                    cachedTemplate = template;
                });
            }
        }

        return {
            getNewsListTemplate: getNewsListTemplate,
            load: load
        };
    }());

}());