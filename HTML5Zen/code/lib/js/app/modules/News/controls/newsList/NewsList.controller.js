(function () {
    "use strict";

    APP.controller.NewsList = function (options) {

        var view, controlData;

        function load(data) {
            controlData = data;
            APP.template.NewsList.getNewsListTemplate(onTemplateLoad);
        }

        function onTemplateLoad(templateData) {
            view.render(controlData, templateData);
        }

        function selectItem(itemId) {
            view.selectItem(itemId);
        }

        function destroy() {
            view.destroy();
            view = null;
        }

        (function init() {
            APP.template.NewsList.load();
            view = new APP.view.NewsList();
        }());

        return {
            load: load,
            selectItem: selectItem,
            destroy: destroy
        };
    };

}());