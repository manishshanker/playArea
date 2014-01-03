(function ($) {
    "use strict";

    APP.View = Class.extend({
        init: function () {
            this.$container = $(this.container);
        },
        container: null,
        $container: null,
        render: function (html) {
            this.$container.html(html);
        },
        destroy: function () {
            this.$container.empty();
        },
        bind: function () {
        }
    });

}(APP.DOM));