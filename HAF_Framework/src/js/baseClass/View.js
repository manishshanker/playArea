(function (HAF, $) {
    "use strict";

    HAF.View = Class.extend({
        init: function () {
            this.$container = $(this.container);
            this.$el = this.$container.$item;
        },
        container: null,
        $container: null,
        $el: null,
        render: function (html) {
            this.$container.html(html);
        },
        destroy: function () {
            this.$container.empty();
        },
        bind: function () {
        },
        show: function () {
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        }

    });

}(HAF, HAF.DOM));