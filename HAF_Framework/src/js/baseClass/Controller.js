(function (HAF) {
    "use strict";

    HAF.Controller = HAF.Base.extend({
        autoWire: false,
        autoDestroy: false,
        autoShowHide: false,
        autoLoadControls: false,
        autoLayout: false,
        messages: null,
        inject: null,
        routes: {},
        serviceUpdate: {},
        init: function (dependecies) {
            this.injectDependencies(dependecies);
        },
        views: null,
        templates: null,
        controls: null,
        services: null,
        layoutChange: function () {
            if (this.autoLayout) {
                loopMethods(this.controls, "layoutChange");
                loopMethods(this.views, "layoutChange");
            }
        },
        load: function () {
            subscribeToMessages(this);
            autoLoadControls(this);
        },
        unload: function () {
            destroyMessages(this);
            unloadControls(this);
        },
        update: function (data) {
            autoRenderTemplates(this, data);
        },
        onUpdateReceive: function (data, item) {
            onUpdateReceive(this, data, item);
        },
        destroy: function () {
            destroy(this);
        },
        onRouteChange: function () {
            return this.routes;
        },
        onServiceUpdate: function () {
            return this.serviceUpdate;
        },
        onShow: function () {
            autoShowHide(this, true);
            autoInitServices(this);
        },
        onHide: function () {
            autoStopServices(this);
            autoShowHide(this, false);
            autoDestroy(this);
        },
        hide: function () {
            autoShowHide(this, false);
            autoStopServices(this);
        },
        show: function () {
            autoShowHide(this, true);
            autoStartServices(this);
        }
    });

    function unloadControls(ctx) {
        loopMethods(ctx.controls, "unload");
    }

    function autoLoadControls(ctx) {
        if (ctx.autoLoadControls) {
            loopMethods(ctx.controls, "load");
        }
    }

    function autoInitServices(ctx) {
        if (!ctx._exist && ctx.autoWire) {
            initServices(ctx.services, ctx);
        }
        ctx._exist = true;
    }

    function autoDestroy(ctx) {
        if (ctx.autoDestroy) {
            ctx.destroy();
        }
    }

    function autoStartServices(ctx) {
        if (ctx.autoWire) {
            loopMethods(ctx.services, "start");
        }
    }

    function autoStopServices(ctx) {
        if (ctx.autoWire) {
            loopMethods(ctx.services, "stop");
        }
    }

    function onUpdateReceive(ctx, data, item) {
        ctx.controls[item].update(data);
        if (ctx.lastStateData && ctx.onServiceUpdate()[item]) {
            ctx.onServiceUpdate()[item].call(ctx, ctx.controls[item], ctx.lastStateData);
        }
    }

    function autoRenderTemplates(ctx, data) {
        if (ctx.autoWire) {
            renderTemplates(ctx, data);
        }
    }

    function destroy(ctx) {
        destroyControlMessages(ctx);
        destroyMessages(ctx);
        loopMethods(ctx.views, "destroy");
        loopMethods(ctx.controls, "destroy");
        loopMethods(ctx.services, "destroy");
        ctx.services = null;
        ctx.views = null;
        ctx.lastStateData = null;
        ctx.templates = null;
        ctx.options = null;
        ctx.controls = null;
        ctx._exist = false;
    }

    function destroyControlMessages(ctx) {
        if (ctx.controlMessages) {
            var controlMessages = ctx.controlMessages;
            HAF.messaging.unsubscribe(controlMessages.show);
            HAF.messaging.unsubscribe(controlMessages.hide);
            HAF.messaging.unsubscribe(controlMessages.stateChange);
        }
    }

    function destroyMessages(ctx) {
        HAF.each(ctx.messages, function (item) {
            HAF.messaging.unsubscribe(item);
        });
    }

    function renderTemplates(ctx, data) {
        HAF.each(ctx.templates, function (template, key) {
            ctx.views[key].render(template.process(data));
        });
    }

    function loopMethods(collection, method, data) {
        HAF.each(collection, function (item) {
            item[method](data);
        });
    }

    function initServices(services, that) {
        HAF.each(services, function (service, key) {
            service.onUpdate(getFunction(that, key));
            service.fetch();
        });
    }

    function getFunction(scope, service) {
        return function (data) {
            scope.onUpdateReceive(data, service);
        };
    }

    function subscribeToMessages(ctx) {
        if (!(ctx.messages || ctx.controlMessages)) {
            return;
        }
        destroyControlMessages(ctx);
        var messages = ctx.controlMessages;
        HAF.messaging.subscribe(ctx, messages.show, ctx.onShow);
        HAF.messaging.subscribe(ctx, messages.hide, ctx.onHide);
        HAF.messaging.subscribe(ctx, messages.stateChange, function (stateData) {
            ctx.lastStateData = stateData;
            HAF.each(ctx.onRouteChange(stateData), function (item, key) {
                HAF.navigation.route(ctx, key, item);
            });
        });
        HAF.each(ctx.messages, function (message, key) {
            HAF.messaging.subscribe(ctx, key, message);
        });
    }

    function autoShowHide(that, isShow) {
        if (that.autoShowHide) {
            loopMethods(that.views, isShow ? "show" : "hide");
            loopMethods(that.controls, isShow ? "show" : "hide");
        }
    }

}(HAF));