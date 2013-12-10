(function ($) {
    "use strict";

    APP.view.NewsDetail = function () {

        var $container;

        function destroy() {
            $container.empty();
            $container = null;
        }

        function setStateNoNewsSelected(template) {
            $container.html(template());
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
            setStateNoNewsSelected: setStateNoNewsSelected
        };
    };

}(APP.DOM));