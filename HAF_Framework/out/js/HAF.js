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
(function (HAF, $) {
    "use strict";

    var noop = function () {
    };

    var privateVar = {};

    HAF.Service = Class.extend({
        dataURL: null,
        fetch: function () {
            $.get(this.dataURL, function (data) {
                this.updated(data);
            });
        },
        update: noop,
        get: noop,
        lastResult: function () {
            return privateVar[this._id_].lastResult;
        },
        onUpdate: function (callback) {
            privateVar[this._id_].updateCallBack.push(callback);
        },
        init: function () {
            this._id_ = (new Date()).getTime() + Math.floor(Math.random() * 1000000);
            privateVar[this._id_] = {};
            privateVar[this._id_].updateCallBack = [];
        },
        updated: function (data) {
            var n, l;
            var privateVar2 = privateVar[this._id_];
            privateVar2.lastResult = data;
            if (privateVar2) {
                for (n = 0, l = privateVar2.updateCallBack.length; n < l; n++) {
                    privateVar2.updateCallBack[n](data);
                }
            }
        },
        destroy: function () {
            delete privateVar[this._id_];
        },
        stop: noop,
        start: noop
    });

}(HAF, HAF.DOM));
(function (HAF) {
    "use strict";

    var templateCache = {};

    HAF.Template = Class.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || HAF.Template.LOAD.DEFAULT;
            if (this.loadBy === HAF.Template.LOAD.BY_ID) {
                templateCache[path] = templateCache[path] || HAF.templateEngine.getById(path);
            }
        },
        process: function (data) {
            if (!templateCache[this.path]) {
                throw new Error("Template not in cache!!");
            }
            return HAF.templateEngine.process(templateCache[this.path], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (that.loadBy === HAF.Template.LOAD.BY_URL) {
                if (templateCache[that.path]) {
                    onSuccess();
                }
                HAF.templateEngine.getByURL(that.path, function (template) {
                    templateCache[that.path] = template;
                    onSuccess();
                });
            } else {
                onSuccess();
            }
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

    HAF.View = Class.extend({
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
        bind: noop,
        hide: function () {
            this.$el.hide();
        },
        show: function () {
            this.$el.show();
        }
    });

    function noop() {
    }

}(HAF, HAF.DOM));
(function () {
    "use strict";

    Handlebars.registerHelper('list', function (items, options) {
        var out = "<ul>", i, l;
        for (i = 0, l = items.length; i < l; i++) {
            out = out + "<li>" + options.fn(items[i]) + "</li>";
        }
        return out + "</ul>";
    });

}());
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
        var messageBus = $(document);

        function publish(subject, message) {
            messageBus.trigger(subject, [message]);
        }

        function subscribe(scope, subject, callback) {
            messageBus.on(subject, function (e, message) {
                callback.call(scope, message);
            });
        }

        function unsubscribe(subject) {
            messageBus.off(subject);
        }

        return {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    };

    HAF.messaging = new Messaging();
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

        function route(pattern, callback) {
            var items = new RegExp(pattern.replace("?", ".").replace(/:[a-zA-Z0-9]+/g, function (a) {
                return "([a-zA-Z0-9]+)";
            })).exec(currentPath)
            if (items) {
                items.splice(0, 1);
                callback.apply(null, items);
            }
        }

        return {
            load: load,
            route: route
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
        process: process
    };

    function getByURL(url, onSuccess) {
        $.get(url, function (templateHTML) {
            onSuccess(getCompiledTemplate(templateHTML));
        });
    }

    function getCompiledTemplate(template) {
        return Handlebars.compile(template);
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
