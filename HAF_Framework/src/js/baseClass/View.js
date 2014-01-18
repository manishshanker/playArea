(function (HAF, $) {
    "use strict";

    HAF.View = HAF.Base.extend({
        autoBindManagement: false,
        init: function (dependencies) {
            this.injectDependencies(dependencies);
            this.$container = $(this.container);
            this.$el = this.$container.$item;
            if (!this.autoBindManagement) {
                this.bind();
            }
        },
        container: null,
        $container: null,
        bindings: null,
        bind: function () {
            bindEvents(this);
        },
        unbind: function () {
            unbindEvents(this);
        },
        $el: null,
        render: function (html) {
            this.$container.html(html);
        },
        destroy: function () {
            this.$container.empty();
        },
        hide: function () {
            this.$el.hide();
            if (this.autoBindManagement) {
                this.unbind();
            }
        },
        show: function () {
            this.$el.show();
            if (this.autoBindManagement) {
                this.bind();
            }
        }
    });

    function unbindEvents(ctx) {
        HAF.each(ctx.bindings, function (fn, key) {
            var parts = /([a-z]+)\s([a-zA-Z0-9\-\.\(\)>]+)/.exec(key);
            ctx.$container.off(parts[1], parts[2]);
        });
    }

    function bindEvents(ctx) {
        HAF.each(ctx.bindings, function (fn, key) {
            var parts = /([a-z]+)\s([a-zA-Z0-9\-\.\(\)>]+)/.exec(key);
            ctx.$container.on(parts[1], parts[2], function (e) {
                fn.call(ctx, e, this);
            });
        });
    }

}(HAF, HAF.DOM));