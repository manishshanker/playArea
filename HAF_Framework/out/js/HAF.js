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

    HAF.init = function (appNameSpace, locale) {
        HAF.i18nT = locale;
        HAF.Module = appNameSpace || {};
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
                //noinspection JSPotentiallyInvalidUsageOfThis
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

    HAF.noop = noop;
    HAF.each = each;

    function each(data, callback) {
        if (data) {
            if (data instanceof Array) {
                loopArray(data, callback);
            } else {
                loopObject(data, callback);
            }
        }
    }

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

    function noop() {
    }

}(HAF));
(function (HAF) {
    "use strict";

    var defaultMessageBus = {
        publish: HAF.noop,
        subscribe: HAF.noop,
        unsubscribe: HAF.noop
    };

    HAF.Base = Class.extend({
        _guid: null,
        messageBus: defaultMessageBus,
        parentMessageBus: defaultMessageBus,
        injector: null,
        guid: function () {
            if (!this._guid) {
                this._guid = guid();
            }
            return this._guid;
        },
        injectDependencies: function (dependencies) {
            HAF.dependencyInjector(this, dependencies);
        }
    });

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
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
        injectMessageBus: false,
        inject: null,
        routes: {},
        serviceUpdate: {},
        parentMessageBus: null,
        messageBus: null,
        init: function (dependencies) {
            this.injectDependencies(dependencies);
        },
        views: null,
        templates: null,
        controls: null,
        services: null,
        shownAndLoaded: false,
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
        hide: function (data) {
            autoStopServices(this);
            if (!(data && data.keepPreviousState)) {
                autoShowHide(this, false);
                autoDestroy(this);
            }
        },
        show: function (data) {
            if (!this.shownAndLoaded) {
                autoShowAndInitServices(this);
                this.shownAndLoaded = true;
            } else if (data && data.keepPreviousState) {
                autoStartServices(this);
            } else {
                autoShowAndStartServices(this);
            }
        }
    });

    function autoShowAndInitServices(ctx) {
        autoShowHide(ctx, true);
        autoInitServices(ctx);
    }

    function autoShowAndStartServices(ctx) {
        autoShowHide(ctx, true);
        autoStartServices(ctx);
    }

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
        this.shownAndLoaded = false;
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
        HAF.messaging.subscribe(ctx, messages.show, ctx.show);
        HAF.messaging.subscribe(ctx, messages.hide, ctx.hide);
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
                    templateCache[that.guid()] = template;
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
(function (HAF) {
    "use strict";

    HAF.dependencyInjector = injectDependencies;

    var TYPES = {
        "views": "view",
        "templates": "template",
        "services": "service",
        "controls": "controller"
    };

    function injectDependencies(ctx, dependencies) {
        if (HAF.Messaging && (dependencies instanceof HAF.Messaging)) {
            ctx.parentMessageBus = dependencies;
        }
        if (ctx.injectMessageBus) {
            ctx.messageBus = (dependencies && dependencies.inject && dependencies.inject.messageBus) || new HAF.Messaging();
        }
        var injectedDependencies = (dependencies && dependencies.inject) || (ctx.inject && (typeof ctx.inject === "function" ? ctx.inject() : ctx.inject));
        HAF.each(injectedDependencies, function (dependency, key) {
            var depType = /^controls$|^templates$|^views$|^services$/.exec(key);
            if (depType && (dependency instanceof Array)) {
                HAF.each(dependency, function (subDependency) {
                    ctx[key] = ctx[key] || {};
                    if (typeof subDependency === "string") {
                        ctx[key][subDependency] = ctx[subDependency] || {};
                        injectInCtx(ctx[key], subDependency, getDependencyInstance(ctx, key, subDependency));
                    } else {
                        HAF.each(subDependency, function (dep, subSubKey) {
                            injectInCtx(ctx[key], subSubKey, getDep(dep, ctx, key));
                        });
                    }
                });
            } else {
                ctx[key] = getDep(dependency, ctx, key);
            }
        });
    }

    function getDep(dependency, ctx, key) {
        return (typeof dependency === "string") ? getDependencyInstance(ctx, key, dependency) : dependency;
    }

    function injectInCtx(ctx, dependency, depInstance) {
        ctx[dependency] = depInstance;
    }

    function getDependencyInstance(ctx, key, dependency) {
        if (ctx.injector) {
            HAF.Module.dependency = HAF.Module.dependency || {};
            var depInjector = HAF.Module.dependency[ctx.injector];
            if (depInjector) {
                if (depInjector[key][dependency]) {
                    return depInjector[key][dependency](ctx);
                }
            }
        }
        return defaultInjector(ctx, key, dependency);
    }

    function defaultInjector(ctx, type, dependency) {
        if (type === "templates") {
            HAF.Module.template = HAF.Module.template || {};
            if (HAF.Module.template[dependency]) {
                return new HAF.Module.template[dependency]();
            }
            return new HAF.Template("tmpl" + dependency.substr(0, 1).toUpperCase() + dependency.substr(1));
        }
        var moduleNameSpace = TYPES[type];
        HAF.Module[moduleNameSpace] = HAF.Module[moduleNameSpace] || {};
        try {
            return new HAF.Module[moduleNameSpace][dependency.substr(0, 1).toUpperCase() + dependency.substr(1)](ctx.injectMessageBus ? ctx.messageBus : ctx.parentMessageBus);
        } catch (e) {
            console.log(e);
            throw new Error("Dependency instance creation error: (" + type + "," + dependency + " | " + moduleNameSpace + "." + (dependency.substr(0, 1).toUpperCase() + dependency.substr(1)) + ")");
        }
    }

}(HAF));
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
        subscribe: function (scope, subjects, fn) {
            var that = this;
            if (typeof subjects === "string") {
                return getSubsricber(that, fn, scope, subjects);
            }
            var subscriberFNs = {};
            HAF.each(subjects, function (fn, subject) {
                subscriberFNs[subject] = getSubsricber(that, fn, scope, subject);
            });
            return subscriberFNs;
        },
        unsubscribe: function (subjects, fn) {
            var that = this;
            if (typeof subjects === "string") {
                that.messageBus.off(subjects, fn);
            } else {
                HAF.each(subjects, function (fn, subject) {
                    that.messageBus.off(subject, fn);
                });
            }
        }
    };

    function getSubsricber(ctx, fn, scope, subject) {
        var unsubscribeMethod = function (e, message) {
            fn.call(scope, message);
        };
        ctx.messageBus.on(subject, unsubscribeMethod);
        return unsubscribeMethod;
    }

    HAF.messaging = new Messaging();
    HAF.Messaging = Messaging;

}(HAF, HAF.DOM));
(function (HAF, $) {
    "use strict";

    var currentView;
    var currentPath;
    var viewState = {};
    var restoringState = false;
    var dView = "#/home";
    var KPS = true;

    var Navigation = function () {

        function load(defaultView, keepPreviousState) {
            KPS = keepPreviousState === undefined ? KPS : keepPreviousState;
            dView = defaultView;
            $(window).on("hashchange", onLocationChange);
            if (location.hash) {
                onLocationChange();
            } else {
                location.href = "#/" + dView;
            }
        }

        function onLocationChange() {
            currentPath = location.hash;
            var appStateData = parseLocationData(currentPath);
            if (!appStateData) {
                location.href = "#/" + dView;
                return;
            }
            if (appStateData.page !== currentView) {
                hidePage(currentView, appStateData);
                currentView = appStateData.page;
                showPage(currentView, appStateData);
            }
            var newAppStateData = parseLocationData(location.hash);
            if (!restoringState && (!viewState[currentView] || (newAppStateData.pageData !== viewState[newAppStateData.page].pageData))) {
                publishStateUpdate(newAppStateData);
            }
            viewState[currentView] = appStateData;
            window.setTimeout(function () {
                restoringState = false;
            }, 200);
        }

        function publishStateUpdate(appStateData) {
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
                if (cachedViewState.pageData) {
                    location.replace("#/" + page + "/" + cachedViewState.pageData);
                    if (KPS) {
                        restoringState = true;
                    }
                }
            }
            HAF.messaging.publish("navigationChangedTo:" + currentView, appStateData);
        }

        function parseLocationData(locationData) {
            var a = /#\/([a-zA-Z_\-0-9\$]+)(\/(.+))?/.exec(locationData);
            if (!a) {
                return null;
            }
            return {
                path: locationData,
                page: a[1],
                pageData: a[3],
                keepPreviousState: KPS
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
