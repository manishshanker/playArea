(function () {
    "use strict";

    APP.controller.NewsDetail = function () {

        var loaded = false;
        var view;
        var controlData;

        function load(data) {
            controlData = data;
            APP.template.NewsDetail.getNewsDetailTemplate(onTemplateLoad);
        }

        function onTemplateLoad(template) {
            view.render(controlData, template);
            loaded = true;
        }

        function destroy() {
            view.destroy();
            loaded = false;
        }

        function onNoNewsDetailTemplateLoaded(template) {
            view.setStateNoNewsSelected(template);
        }

        (function init() {
            view = new APP.view.NewsDetail();
            APP.template.NewsDetail.getNoNewsDetailTemplate(onNoNewsDetailTemplateLoaded)
        }());

        return {
            load: load,
            destroy: destroy
        }
    }

}());