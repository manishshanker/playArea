(function (HAF, $) {
    "use strict";

    HAF.templateEngine = {
        getById: getById,
        getByCSSSelector: getByCSSSelector,
        getByURL: getByURL,
        process: process,
        remove: remove
    };

    function getByURL(url, onSuccess) {
        $.get(url, function (templateHTML) {
            onSuccess(getCompiledTemplate(templateHTML));
        });
    }

    function getCompiledTemplate(template) {
        return Handlebars.compile(template);
    }

    function remove(id) {
        var $el = $("#" + id);
        $el.remove();
    }

    function getById(id) {
        var $el = $("#" + id);
        var template = $el.html();
        $el.remove();
        if (!template) {
            throw new Error("Template id: " + id + ", not found!!");
        } else {
            return getCompiledTemplate(template);
        }
    }

    function getByCSSSelector(cssSelector) {
        var template = $(cssSelector).html();
        if (!template) {
            throw new Error("Template selector: " + cssSelector + ", not matched any!!");
        } else {
            return getCompiledTemplate(template);
        }
    }

    function process(template, templateData) {
        return template(templateData);
    }

}(HAF, HAF.DOM));