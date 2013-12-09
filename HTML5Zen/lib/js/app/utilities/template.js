(function ($) {
    "use strict";

    var cache = false;
    var templateCache = {};

    var Template = function () {

        function getByURL(url, onSuccess) {
            if (cache && templateCache[url]) {
                onSuccess(getCompiledTemplate(templateCache[url]));
            } else {
                $.get(url, function (templateHTML) {
                    if (cache) {
                        templateCache[url] = templateHTML;
                    }
                    onSuccess(getCompiledTemplate(templateCache[url]));
                });
            }
        }

        function getCompiledTemplate(template) {
            return Handlebars.compile(template);
        }

        function getById(id, onSuccess) {
            var template = templateCache[id] || $("#" + id).html();
            if (cache) {
                templateCache[id] = template;
            }
            onSuccess(getCompiledTemplate(template));
        }

        function getByCSSSelector(cssSelector, onSuccess) {
            var template = templateCache[cssSelector] || $(cssSelector).html();
            if (cache) {
                templateCache[cssSelector] = template;
            }
            onSuccess(getCompiledTemplate(template));
        }

        return {
            getById: getById,
            getByCSSSelector: getByCSSSelector,
            getByURL: getByURL
        };

    };

    APP.templateEngine = new Template();

}(APP.DOM));