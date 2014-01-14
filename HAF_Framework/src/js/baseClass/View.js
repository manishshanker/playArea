(function (HAF, $) {
    "use strict";

    HAF.View = HAF.Base.extend({
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
        bind: HAF.Base.noop,
        hide: function () {
            this.$el.hide();
        },
        show: function () {
            this.$el.show();
        }
    });

}(HAF, HAF.DOM));