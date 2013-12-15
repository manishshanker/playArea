(function ($) {
    "use strict";

    var View = Classy.$extend({
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

    APP.View = View;

}(APP.DOM));