(function() {
    "use strict";

    APP.controller.NewsDetail = function() {

        var view;
        var template;
        var controlData;

        function load(data) {
            controlData = data;
            template.load(onTemplateLoad);
//            view.loading();
        }

        function onTemplateLoad(template) {
            view.render(controlData, template);
        }

        (function init() {
            view = new APP.view.NewsDetail();
            template = new APP.template.NewsDetail();
        }());

        return {
            load: load
        }
    }

}());