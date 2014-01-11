(function (HAF) {
    "use strict";

    /**
     *
     * @param {Object=} options
     * @param {HAF.View=} views
     * @param {HAF.Template=} templates
     * @param {HAF.Service=} services
     * @param {Function=} controls
     */
    HAF.Controller = Class.extend({
        autoWire: false,
        autoDestroy: false,
        autoShowHide: false,
        init: function (options) {
            this.options = options;
        },
        views: null,
        templates: null,
        controls: null,
        services: null,
        render: function (data, viewName) {
            this.views[viewName].render(this.templates[viewName].process(data));
        },
        _render: function (data) {
            var templates = this.templates, template;
            for (template in templates) {
                if (templates.hasOwnProperty(template)) {
                    this.render(data, template);
                }
            }
        },
        inject: function (dependencies) {
            this.views = dependencies.views || this.views;
            this.templates = dependencies.templates || this.templates;
            this.services = dependencies.services || this.services;
            this.controls = dependencies.controls || this.controls;
        },
        load: function (data) {
            var that = this;
            if (!that._loaded) {
                var templates = this.templates;
                if (templates && this.autoWire) {
                    loadTemplateAndRender(that, data, templates);
                }

                if (that.messages || that.controlMessages) {
                    subscribeToMessages(that);
                }
                that._loaded = true;
            } else {
                if (this.autoWire) {
                    this._render(data);
                }
            }
        },
        onStateChange: function () {
        },
        onUpdateReceive: function (data, item) {
            var that = this;
            that.controls[item].load(data);
            if (that.lastStateData && that.onStateChange()[item]) {
                that.onStateChange()[item].call(that, that.controls[item], that.lastStateData);
            }
        },
        destroy: function () {
            if (this.controlMessages) {
                var controlMessages = this.controlMessages;
                HAF.messaging.unsubscribe(controlMessages.show);
                HAF.messaging.unsubscribe(controlMessages.hide);
                HAF.messaging.unsubscribe(controlMessages.stateChange);
            }
            if (this.messages) {
                var message;
                for (message in this.messages) {
                    if (this.messages.hasOwnProperty(message)) {
                        HAF.messaging.unsubscribe(this.messages[message]);
                    }
                }
            }
            if (this.views) {
                loop(this.views, "destroy");
            }
            if (this.controls) {
                loop(this.controls, "destroy");
            }
            if (this.services) {
                loop(this.services, "destroy");
            }
            this.services = null;
            this.views = null;
            this.lastStateData = null;
            this.templates = null;
            this.options = null;
            this.controls = null;
            this._loaded = false;
            this._exist = false;
        },
        onShow: function () {
            autoShowHide(this, true);
            if (!this._exist && this.autoWire) {
                initServices(this.services, this);
            }
            this._exist = true;
        },
        hide: function () {
            autoShowHide(this, false);
            if (this.autoWire) {
                loop(this.services, "stop");
            }
        },
        show: function () {
            autoShowHide(this, true);
            if (this.autoWire) {
                loop(this.services, "start");
            }
        },
        onHide: function () {
            if (this.autoWire) {
                loop(this.services, "stop");
            }
            autoShowHide(this, false);
            if (this.autoDestroy) {
                this.destroy();
            }
        }
    });

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
        for (service in services) {
            if (services.hasOwnProperty(service)) {
                services[service].onUpdate(getFunction(that, service));
                services[service].fetch();
            }
        }
    }

    function getFunction(scope, service) {
        return function (data) {
            scope.onUpdateReceive(data, service);
        };
    }

    function subscribeToMessages(that) {
        var messages = that.controlMessages;
        HAF.messaging.subscribe(that, messages.show, that.onShow);
        HAF.messaging.subscribe(that, messages.hide, that.onHide);
        HAF.messaging.subscribe(that, messages.stateChange, function (stateData) {
            that.lastStateData = stateData;
            var stateChanges = that.onStateChange(), stateChange;
            for (stateChange in stateChanges) {
                if (stateChanges.hasOwnProperty(stateChange)) {
                    stateChanges[stateChange].call(that, that.controls[stateChange], stateData);
                }
            }
        });
        messages = that.messages;
        var message;
        for (message in messages) {
            if (messages.hasOwnProperty(message)) {
                HAF.messaging.subscribe(that, message, messages[message]);
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