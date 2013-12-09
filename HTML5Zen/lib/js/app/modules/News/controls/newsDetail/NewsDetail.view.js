(function ($) {
    "use strict";

    APP.view.NewsDetail = function () {

        var $container;

        function destroy() {
            $container.empty();
        }

        function loading() {
            $container.html("Loading...");
        }

        function render(data, template) {
            $container.html(template(data));
        }

        (function init() {
            $container = $("#newsDetail");
        }());

        return {
            render: render,
            destroy: destroy,
            loading: loading
        }
    }

}(APP.DOM));