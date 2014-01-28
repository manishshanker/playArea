(function (HAF, window) {
    "use strict";

    window.HAF = HAF = HAF || {};

    HAF.init = function (appNameSpace, locale) {
        HAF.i18nT = locale;
        HAF.Module = appNameSpace || {};
    };

}(window.HAF, window));