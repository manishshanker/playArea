(function (HAF) {
    "use strict";

    HAF.init(APP.i18nT);
    (new APP.controller.News()).load();
    HAF.navigation.load("introduction");

}(HAF));