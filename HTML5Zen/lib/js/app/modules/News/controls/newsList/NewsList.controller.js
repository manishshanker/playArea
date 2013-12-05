(function() {
    "use strict";

    APP.controller.NewsList = function(options) {

        var view, template, controlData;

        function load(data) {
            controlData = data;
            template.load(onTemplateLoad);
        }

        function onTemplateLoad(templateData) {
            view.render(controlData, templateData);
        }

        (function init() {
            view = new APP.view.NewsList({onNewsItemSelected: options.onNewsItemSelected});
            template = new APP.template.NewsList();
        }());

        return {
            load: load
        }
    }

}());