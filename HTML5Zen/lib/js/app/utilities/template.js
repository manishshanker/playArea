(function ($) {
    "use strict";

    function Template() {

        function getByURL(url, onSuccess) {
            $.get(url, function (templateHTML) {
                onSuccess(Handlebars.compile(templateHTML));
            });
        }

        function getById(id, onSuccess) {
            onSuccess(Handlebars.compile($("#" + id).html()));
        }

        function getByCSSSelector(cssSelector, onSuccess) {
            onSuccess(Handlebars.compile($(cssSelector).html()));
        }

        return {
            getById: getById,
            getByCSSSelector: getByCSSSelector,
            getByURL: getByURL
        };

    }

    APP.templateEngine = new Template();

}(jQuery));