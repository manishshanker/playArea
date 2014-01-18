(function () {
    "use strict";

    Handlebars.registerHelper('list', function (items, options) {
        var out = "<ul>", i, l;
        if (items && items.length) {
            for (i = 0, l = items.length; i < l; i++) {
                out += "<li>" + options.fn(items[i]) + "</li>";
            }
        }
        return out + "</ul>";
    });

}());