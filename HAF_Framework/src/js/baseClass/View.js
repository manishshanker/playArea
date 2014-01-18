(function (HAF, $) {
    "use strict";

    HAF.View = HAF.Base.extend({
        autoBindManagement: false,
        autoLayout: false,
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
        layoutChange: HAF.noop,
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
            var that = this;
            that.$el.hide();
            if (that.autoBindManagement) {
                that.unbind();
            }
            if (that.autoLayout) {
                $(window).off("resize." + that.guid());
            }
        },
        show: function () {
            var that = this;
            that.$el.show();
            if (that.autoBindManagement) {
                that.bind();
            }
            if (that.autoLayout) {
                $(window).off("resize." + that.guid()).on(("resize." + that.guid()), function() {
                    that.messageBus.publish("visual-filtering-layout-change");
                });
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