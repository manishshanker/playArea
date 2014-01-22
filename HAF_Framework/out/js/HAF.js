/*!
 * Copyright 2011-2014 Manish Shanker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*!
 * @author Manish Shanker
 */
(function (HAF, window) {
    "use strict";

    window.HAF = HAF = HAF || {};

    HAF.init = function (locale) {
        HAF.i18nT = locale;
    };

}(window.HAF, window));
(function (HAF, $) {
    "use strict";

    function HAFDOM(selector) {
        return new HAFDOMElement($(selector));
    }

    HAFDOM.get = function () {
        return $.get.apply(this, arguments);
    };

    HAFDOM.grep = function () {
        return $.grep.apply(this, arguments);
    };

    var HAFDOMElement = function ($item) {
        this.$item = $item;
    };

    HAFDOMElement.prototype = {
        on: function () {
            this.$item.on.apply(this.$item, arguments);
            return this;
        },
        trigger: function () {
            this.$item.trigger.apply(this.$item, arguments);
            return this;
        },
        off: function () {
            this.$item.off.apply(this.$item, arguments);
            return this;
        },
        html: function (text) {
            if (text) {
                this.$item.html(text);
                return this;
            }
            return this.$item.html();
        },
        attr: function (attribute, value) {
            if (value) {
                this.$item.attr(attribute, value);
                return this;
            }
            return this.$item.attr(attribute);
        },
        each: function () {
            this.$item.each.apply(this.$item, arguments);
            return this;
        },
        addClass: function (className) {
            this.$item.addClass(className);
            return this;
        },
        removeClass: function (className) {
            this.$item.removeClass(className);
            return this;
        },
        empty: function () {
            this.$item.empty();
            return this;
        },
        remove: function () {
            this.$item.remove();
        }
    };

    HAF.DOM = HAFDOM;

}(HAF,  (window.Zepto || window.jQuery)));
(function () {
    "use strict";

    var Class = function () {
    };
    var isFn = function (fn) {
        return typeof fn === "function";
    };
    Class.extend = function (proto) {
        var k = function (param) {
            if (param !== isFn && isFn(this.init)) {
                this.init.apply(this, arguments);
            }
        };
        k.prototype = new this(isFn);
        var makeSuper = function (fn, sfn) {
            return function () {
                this._super = sfn;
                return fn.apply(this, arguments);
            };
        };
        var key;
        for (key in proto) {
            if (proto.hasOwnProperty(key)) {
                var fn = proto[key], sfn = k.prototype[key];
                k.prototype[key] = !isFn(fn) || !isFn(sfn) ? fn : makeSuper(fn, sfn); // add _super method
            }
        }
        k.prototype.constructor = k;
        k.extend = this.extend;
        return k;
    };

    window.Class = Class;
}());
(function (HAF) {
    "use strict";

    HAF.Base = Class.extend({
        _guid: null,
        messageBus: {
            publish: noop,
            subscribe: noop,
            unsubscribe: noop
        },
        guid: function () {
            if (!this._guid) {
                this._guid = guid();
            }
            return this._guid;
        },
        injectDependencies: function (dependencies) {
            injectDependencies(this, dependencies);
        }
    });

    HAF.noop = noop;
    HAF.each = function (data, callback) {
        if (data) {
            if (data instanceof Array) {
                loopArray(data, callback);
            } else {
                loopObject(data, callback);
            }
        }
    };

    function loopObject(data, callback) {
        var d;
        if (data) {
            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    callback(data[d], d);
                }
            }
        }
    }

    function loopArray(data, callback) {
        var i, l;
        if (data) {
            for (i = 0, l = data.length; i < l; i++) {
                callback(data[i], i);
            }
        }
    }

    function injectDependencies(ctx, dependencies) {
        if (HAF.Messaging && (dependencies instanceof HAF.Messaging)) {
            ctx.messageBus = dependencies;
        }
        var injectedDependencies = (dependencies && dependencies.inject && dependencies.inject) || (ctx.inject && ctx.inject());
        HAF.each(injectedDependencies, function (dependency, key) {
            ctx[key] = dependency;
        });
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function noop() {
    }

}(HAF));
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
(function (HAF, $) {
    "use strict";

    var privateVar = {};

    HAF.Service = HAF.Base.extend({
        dataURL: null,
        init: function () {
            privateVar[this.guid()] = {};
            privateVar[this.guid()].updateCallBack = [];
        },
        fetch: function () {
            $.get(this.dataURL, function (data) {
                this.updated(data);
            });
        },
        update: HAF.noop,
        get: HAF.noop,
        lastResult: function () {
            return privateVar[this.guid()].lastResult;
        },
        onUpdate: function (callback) {
            privateVar[this.guid()].updateCallBack.push(callback);
        },
        updated: function (data) {
            var n, l;
            var localPrivateVar = privateVar[this.guid()];
            localPrivateVar.lastResult = data;
            if (localPrivateVar) {
                for (n = 0, l = localPrivateVar.updateCallBack.length; n < l; n++) {
                    localPrivateVar.updateCallBack[n](data);
                }
            }
        },
        destroy: function () {
            delete privateVar[this.guid()];
        },
        stop: HAF.noop,
        start: HAF.noop
    });

}(HAF, HAF.DOM));
(function (HAF) {
    "use strict";

    var templateCache = {};

    HAF.Template = HAF.Base.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || HAF.Template.LOAD.DEFAULT;
            if (this.loadBy === HAF.Template.LOAD.BY_ID) {
                if (!templateCache[this.guid()]) {
                    templateCache[this.guid()] = HAF.templateEngine.getById(path);
                    HAF.templateEngine.remove(path);
                }
            }
        },
        process: function (data) {
            if (!templateCache[this.guid()]) {
                throw new Error("Template not in cache!!");
            }
            return HAF.templateEngine.process(templateCache[this.guid()], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (that.loadBy === HAF.Template.LOAD.BY_URL) {
                if (templateCache[this.guid()]) {
                    onSuccess();
                }
                HAF.templateEngine.getByURL(that.path, function (template) {
                    templateCache[this.guid()] = template;
                    onSuccess();
                });
            } else {
                onSuccess();
            }
        },
        destroy: function () {
            delete templateCache[this.guid()];
        }
    });

    HAF.Template.LOAD = {
        BY_ID: "APP_TEMPLATE_BY_ID",
        BY_URL: "APP_TEMPLATE_BY_URL",
        DEFAULT: "APP_TEMPLATE_BY_ID"
    };

}(HAF));
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
                $(window).off("resize." + that.guid()).on(("resize." + that.guid()), function () {
                    that.layoutChange();
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
        var bindings = typeof ctx.bindings === "function" ? ctx.bindings() : ctx.bindings;
        HAF.each(bindings, function (fn, key) {
            var parts = /([a-z]+)\s([a-zA-Z0-9\-\.\(\)>]+)/.exec(key);
            ctx.$container.on(parts[1], parts[2], function (e) {
                fn.call(ctx, e, this);
            });
        });
    }

}(HAF, HAF.DOM));
(function (HB) {
    "use strict";

    HB.registerHelper('list', function (items, className, options) {
        var out, i, l, listCSSClass = "", listItemCSSClass = "";
        if (typeof className === "string") {
            listCSSClass = " class='" + className + "' ";
            listItemCSSClass = " class='" + className + "-item' ";
        } else {
            options = className;
        }
        out = "<ul" + listCSSClass + ">";
        if (items && items.length) {
            for (i = 0, l = items.length; i < l; i++) {
                out += "<li" + listItemCSSClass + ">" + options.fn(items[i]) + "</li>";
            }
        }
        return out + "</ul>";
    });

}(Handlebars));
/*i18n Handlebar helper*/
(function (HAF) {
    "use strict";

    Handlebars.registerHelper('i18n', function (i18n_key, alias_key) {
        alias_key = typeof alias_key === "object" ? null : alias_key;
        return new Handlebars.SafeString(HAF.i18n(i18n_key, alias_key));
    });
}(HAF));
(function (HAF) {
    "use strict";

    HAF.i18n = function (actualText, alias_key) {
        if (!HAF.i18nT) {
            throw new Error("No resource bundle included for i18n!!");
        }
        if (actualText === null) {
            return "";
        }
        var i18n_key;
        if (alias_key) {
            i18n_key = alias_key;
        } else {
            i18n_key = actualText.toLowerCase().replace(/ ([a-z])/g, function (m, w) {
                return w.toUpperCase();
            }).replace(/ /g, "");
            i18n_key = i18n_key.charAt(0).toLowerCase() + i18n_key.substring(1);
        }
//        console.log("\"" + i18n_key + "\": \"" + actualText + "\",");
//        if (!HAF.i18nT[i18n_key]) {
//            console.log("\"" + i18n_key + "\": \"" + actualText + "\",");
//        }
        return HAF.i18nT[i18n_key] || "!!!" + actualText + "!!!";
    };

}(HAF));
(function (HAF, $) {
    "use strict";

    var Messaging = function () {
        this.messageBus = $({});
    };

    Messaging.prototype = {
        publish: function (subject, message) {
            this.messageBus.trigger(subject, [message]);
        },
        subscribe: function (scope, subject, callback) {
            var unsubscribeMethod = function (e, message) {
                callback.call(scope, message);
            };
            this.messageBus.on(subject, unsubscribeMethod);
            return unsubscribeMethod;
        },
        unsubscribe: function (subject, fn) {
            this.messageBus.off(subject, fn);
        }
    };

    HAF.messaging = new Messaging();
    HAF.Messaging = Messaging;

}(HAF, HAF.DOM));
(function (HAF, $) {
    "use strict";

    var currentView;
    var currentPath;
    var viewState = {};

    var Navigation = function () {

        function load(defaultView) {
            $(window).on("hashchange", onLocationChange);
            if (location.hash) {
                onLocationChange();
            } else {
                location.href = "#/" + defaultView;
            }
        }

        function onLocationChange() {
            currentPath = location.hash;
            var appStateData = parseLocationData(currentPath);
            if (appStateData.page !== currentView) {
                hidePage(currentView, appStateData);
                currentView = appStateData.page;
                showPage(currentView, appStateData);
            }
            viewState[currentView] = appStateData;
            HAF.messaging.publish("navigationStateChange:" + currentView, appStateData);
            HAF.messaging.publish("navigationStateChange", appStateData);
        }

        function hidePage(page, appStateData) {
            if (page) {
                $("a[href$='#/" + page + "']").removeClass("selected");
                $("#" + page).removeClass("page-visible");
                HAF.messaging.publish("navigationChangedFrom:" + page, appStateData);
            }
        }

        function showPage(page, appStateData) {
            $("#" + page).addClass("page-visible");
            $("a[href$='#/" + page + "']").addClass("selected");
            var cachedViewState = viewState[page];
            if (cachedViewState) {
                if (cachedViewState.moduleItem) {
                    location.replace("#/" + page + "/" + cachedViewState.module + "/" + cachedViewState.moduleItem);
                }
            }
            HAF.messaging.publish("navigationChangedTo:" + currentView, appStateData);
        }

        function parseLocationData(locationData) {
            var a = locationData.substr(1).split("/");
            return {
                path: locationData,
                page: a[1],
                module: a[2],
                moduleItem: a[3]
            };
        }

        function setRoute(route) {
            currentPath = route;
            location.hash = route;
            if (window.hasOwnProperty("onhashchange")) {
                onLocationChange();
            }
        }

        function route(context, pattern, callback, callbackFailure) {
            var items = new RegExp(("^" + pattern + "$").replace("?", ".").replace(/:[a-zA-Z0-9-_]+/g, function (a) {
                return "([a-zA-Z0-9-_]+)";
            })).exec(currentPath.substring(1).replace(/[\/]?$/, ""));
            if (items) {
                items.splice(0, 1);
                callback.apply(context, items);
            } else {
                if (callbackFailure) {
                    callbackFailure.call(context);
                }
            }
        }

        return {
            load: load,
            route: route,
            setRoute: setRoute
        };
    };

    HAF.navigation = new Navigation();
}(HAF, HAF.DOM));
(function (HAF, $) {
    "use strict";

    HAF.templateEngine = {
        getById: getById,
        getByCSSSelector: getByCSSSelector,
        getByURL: getByURL,
        process: process,
        remove: remove
    };

    function getByURL(url, onSuccess) {
        $.get(url, function (templateHTML) {
            onSuccess(getCompiledTemplate(templateHTML));
        });
    }

    function getCompiledTemplate(template) {
        return Handlebars.compile(template);
    }

    function remove(id) {
        var $el = $("#" + id);
        $el.remove();
    }

    function getById(id) {
        var $el = $("#" + id);
        var template = $el.html();
        $el.remove();
        if (!template) {
            throw new Error("Template id: " + id + ", not found!!");
        } else {
            return getCompiledTemplate(template);
        }
    }

    function getByCSSSelector(cssSelector) {
        var template = $(cssSelector).html();
        if (!template) {
            throw new Error("Template selector: " + cssSelector + ", not matched any!!");
        } else {
            return getCompiledTemplate(template);
        }
    }

    function process(template, templateData) {
        return template(templateData);
    }

}(HAF, HAF.DOM));
