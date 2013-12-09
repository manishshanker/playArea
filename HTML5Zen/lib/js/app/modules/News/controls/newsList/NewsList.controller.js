(function () {
    "use strict";

    APP.controller.NewsList = function (options) {

        var view, controlData;

        function load(data) {
            controlData = data;
            APP.template.NewsList.load(onTemplateLoad);
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
            view = new APP.view.NewsList({onNewsItemSelected: options.onNewsItemSelected});
        }());

        return {
            load: load,
            selectItem: selectItem,
            destroy: destroy
        };
    };

}());