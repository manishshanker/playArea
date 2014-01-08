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
        boolOnHideDestroy: false,
        init: function (options, views, templates, services, controls) {
            this.views = views;
            this.templates = templates;
            this.options = options;
            this.services = services;
            this.controls = controls;
        },
        getViews: function () {
            return this.views;
        },
        getTemplates: function () {
            return this.templates;
        },
        getControls: function () {
            return this.controls;
        },
        getServices: function () {
            return this.service;
        },
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
        load: function (data) {
            var that = this;
            that.views = that.views || that.getViews();
            that.templates = that.templates || that.getTemplates();
            that.controls = that.controls || that.getControls();
            that.services = that.services || that.getServices();

            if (!that._loaded) {
                var templates = this.templates;
                if (templates) {
                    loadTemplateAndRender(that, data, templates);
                }

                if (that.messages || that.controlMessages) {
                    subscribeToMessages(that);
                }
                that._loaded = true;
            } else {
                this._render(data);
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
            if (!this._exist) {
                initServices(this.services, this);
                this._exist = true;
            }
        },
        onHide: function () {
            loop(this.services, "stop");
            if (this.boolOnHideDestroy) {
                this.destroy();
            }
        }
    });

    function loop(collection, method, data) {
        var item;
        for (item in collection) {
            if (collection.hasOwnProperty(item)) {
                collection[item][method](data);
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

}(HAF));