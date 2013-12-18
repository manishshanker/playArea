(function () {
    "use strict";

    APP.i18n = function (actualText, alias_key) {
        if (!APP.i18nT) {
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
//        if (!APP.i18nT[i18n_key]) {
//            console.log("\"" + i18n_key + "\": \"" + actualText + "\",");
//        }
        return APP.i18nT[i18n_key] || "!!!" + actualText + "!!!";
    };

}());