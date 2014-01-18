(function (HAF) {
    "use strict";

    HAF.Controller = HAF.Base.extend({
        autoWire: false,
        autoDestroy: false,
        autoShowHide: false,
        autoLoadControls: false,
        messages: null,
        inject: null,
        init: function (dependecies) {
            this.injectDependencies(dependecies);
        },
        views: null,
        templates: null,
        controls: null,
        services: null,
        load: function (data) {
            autoLoadAndRenderTemplates(this, data);
            subscribeToMessages(this);
            autoLoadControls(this);
        },
        unload: function () {
            destroyMessages(this);
            destroyControlMessages(this);
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
        render: function (data, viewName) {
            if (this.autoWire) {
                this.views[viewName].render(this.templates[viewName].process(data));
            }
        },
        onStateChange: HAF.Base.noop,
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
        loop(ctx.controls, "unload");
    }

    function autoLoadControls(ctx) {
        if (ctx.autoLoadControls) {
            loop(ctx.controls, "load");
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
            loop(ctx.services, "start");
        }
    }

    function autoStopServices(ctx) {
        if (ctx.autoWire) {
            loop(ctx.services, "stop");
        }
    }

    function onUpdateReceive(ctx, data, item) {
        ctx.controls[item].update(data);
        if (ctx.lastStateData && ctx.onStateChange()[item]) {
            ctx.onStateChange()[item].call(ctx, ctx.controls[item], ctx.lastStateData);
        }
    }

    function autoLoadAndRenderTemplates(ctx, data) {
        var templates = ctx.templates;
        if (templates && ctx.autoWire) {
            loadTemplateAndRender(ctx, data, templates);
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
        loop(ctx.views, "destroy");
        loop(ctx.controls, "destroy");
        loop(ctx.services, "destroy");
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
        if (ctx.messages) {
            var message;
            for (message in ctx.messages) {
                if (ctx.messages.hasOwnProperty(message)) {
                    HAF.messaging.unsubscribe(ctx.messages[message]);
                }
            }
        }
    }

    function renderTemplates(ctx, data) {
        var templates = ctx.templates, template;
        for (template in templates) {
            if (templates.hasOwnProperty(template)) {
                ctx.render(data, template);
            }
        }
    }

    function loop(collection, method, data) {
        var item;
        if (collection) {
            for (item in collection) {
                if (collection.hasOwnProperty(item)) {
                    collection[item][method](data);
                }
            }
        }
    }

    function initServices(services, that) {
        var service;
        if (services) {
            for (service in services) {
                if (services.hasOwnProperty(service)) {
                    services[service].onUpdate(getFunction(that, service));
                    services[service].fetch();
                }
            }
        }
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
        var messages = ctx.controlMessages;
        HAF.messaging.subscribe(ctx, messages.show, ctx.onShow);
        HAF.messaging.subscribe(ctx, messages.hide, ctx.onHide);
        HAF.messaging.subscribe(ctx, messages.stateChange, function (stateData) {
            ctx.lastStateData = stateData;
            var stateChanges = ctx.onStateChange(), stateChange;
            for (stateChange in stateChanges) {
                if (stateChanges.hasOwnProperty(stateChange)) {
                    stateChanges[stateChange].call(ctx, ctx.controls[stateChange], stateData);
                }
            }
        });
        messages = ctx.messages;
        var message;
        for (message in messages) {
            if (messages.hasOwnProperty(message)) {
                HAF.messaging.subscribe(ctx, message, messages[message]);
            }
        }
    }

    function loadTemplateAndRender(that, data, templates) {
        var template;
        var renderFunction = function (template) {
            return function () {
                that.render(data, template);
            };
        };
        for (template in templates) {
            if (templates.hasOwnProperty(template)) {
                templates[template].load(renderFunction(template));
            }
        }
    }

    function autoShowHide(that, isShow) {
        if (that.autoShowHide) {
            loop(that.views, isShow ? "show" : "hide");
            loop(that.controls, isShow ? "show" : "hide");
        }
    }

}(HAF));