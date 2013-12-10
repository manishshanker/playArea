(function ($) {
    "use strict";

    APP.view.NewsList = function () {

        var $container, $selectedItem;

        function selectItem(itemId) {
            if ($selectedItem) {
                $selectedItem.removeClass("selected");
            }
            $selectedItem = $("#newsItem_" + itemId);
            $selectedItem.addClass("selected");
        }

        function destroy() {
            $container.empty();
            $selectedItem = null;
        }

        function render(data, template) {
            var n = data.length;
            var html = [];
            while (n--) {
                html[n] = template(data[n]);
            }
            $container.html(html.join(""));
        }

        (function init() {
            $container = $("#newsList");
        }());

        return {
            render: render,
            destroy: destroy,
            selectItem: selectItem
        };
    };

}(APP.DOM));