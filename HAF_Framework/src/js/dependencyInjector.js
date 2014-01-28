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