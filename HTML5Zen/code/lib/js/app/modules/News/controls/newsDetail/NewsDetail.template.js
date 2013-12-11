(function () {
    "use strict";

    var cachedNewsDetailTemplate;

    APP.template.NewsDetail = (function () {

        function getNewsDetailTemplate(onSuccess) {
            onSuccess(cachedNewsDetailTemplate);
        }

        (function init() {
            APP.templateEngine.getById("newsDetailTemplate", function (template) {
                cachedNewsDetailTemplate = template;
            });
        }());

        return {
            getNewsDetailTemplate: getNewsDetailTemplate
        };
    }());

}());