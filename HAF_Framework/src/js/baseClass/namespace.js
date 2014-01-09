(function (HAF, window) {
    "use strict";

    window.HAF = HAF = HAF || {};

    HAF.init = function (locale) {
        HAF.i18nT = locale;
    };

}(window.HAF, window));