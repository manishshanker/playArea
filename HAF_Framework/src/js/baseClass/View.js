(function (HAF, $) {
    "use strict";

    HAF.View = HAF.Base.extend({
        autoManageEventBind: false,
        autoLayout: false,
        init: function (dependencies) {
            this.injectDependencies(dependencies);
            this.$container = $(this.container);
            this.$el = this.$container.$item;
            if (!this.autoManageEventBind) {
                this.bind();
            }
            addAutoLayoutHandler(this);
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
            var that = this;
            removeAutoLayoutHandler(that);
            that.unbind();
            that.$container.empty();
        },
        hide: function () {
            var that = this;
            that.$el.removeClass("show").addClass("hide");
            autoUnbindEvents(that);
            removeAutoLayoutHandler(that);
        },
        show: function () {
            var that = this;
            that.$el.removeClass("hide").addClass("show");
            autoBindEvents(that);
            addAutoLayoutHandler(that);
        }
    });

    function unbindEvents(ctx) {
        HAF.each(ctx.bindings, function (fn, key) {
            var parts = /([a-z]+)\s([a-zA-Z0-9\-\.\(\)>]+)/.exec(key);
            ctx.$container.off(parts[1], parts[2]);
        });
    }

    function bindEvents(ctx) {
        var bindings = typeof ctx.bindings === "function" ? ctx.bindings() : ctx.bindings;
        HAF.each(bindings, function (fn, key) {
            var parts = /([a-z]+)\s([a-zA-Z0-9\-\.\(\)>]+)/.exec(key);
            ctx.$container.on(parts[1], parts[2], function (e) {
                fn.call(ctx, e, this);
            });
        });
    }

    function addAutoLayoutHandler(that) {
        if (that.autoLayout) {
            $(window).off("resize." + that.guid()).on(("resize." + that.guid()), function () {
                that.layoutChange();
            });
        }
    }

    function removeAutoLayoutHandler(that) {
        if (that.autoLayout) {
            $(window).off("resize." + that.guid());
        }
    }

    function autoUnbindEvents(that) {
        if (that.autoManageEventBind) {
            that.unbind();
        }
    }

    function autoBindEvents(that) {
        if (that.autoManageEventBind) {
            that.bind();
        }
    }

}(HAF, HAF.DOM));