(function () {
    "use strict";

    var cachedNewsDetailTemplate, cachedNoNewsDetailTemplate;

    APP.template.NewsDetail = (function () {

        function getNewsDetailTemplate(onSuccess) {
            onSuccess(cachedNewsDetailTemplate);
        }

        function getNoNewsDetailTemplate(onSuccess) {
            onSuccess(cachedNoNewsDetailTemplate);
        }

        (function init() {
            APP.templateEngine.getById("newsDetailTemplate", function (template) {
                cachedNewsDetailTemplate = template;
            });
            APP.templateEngine.getById("noNewsDetailTemplate", function (template) {
                cachedNoNewsDetailTemplate = template;
            });
        }());

        return {
            getNewsDetailTemplate: getNewsDetailTemplate,
            getNoNewsDetailTemplate: getNoNewsDetailTemplate
        };
    }());

}());