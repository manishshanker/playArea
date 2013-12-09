(function ($) {
    "use strict";

    APP.view.NewsList = function (options) {

        var $container;

        function update(data) {
        }

        function destroy() {
            $container.off("click", "li");
            $container.empty();
        }

        function render(data, template) {
            var n = data.length;
            var html = [];
            while (n--) {
                html[n] = template(data[n]);
            }
            $container.html(html.join(""));
            bindEvents();
        }

        function bindEvents() {
            $container.on("click", "li", onItemClick);
        }

        function onItemClick() {
            options.onNewsItemSelected($(this).attr("id").split("_")[1]);
        }

        (function init() {
            $container = $("#newsList");
        }());

        return {
            render: render,
            update: update,
            destroy: destroy
        }
    }

}(APP.DOM));