(function () {
    "use strict";

    APP.service.News = APP.service.News.$extend({
        fetch: function (callback) {
            callback(getMockData());
        }
    });

    function getMockData() {
        return (function () {
            var items = [];
            var n = 0;
            while (n < 20) {
                items.push({
                    id: n,
                    title: "News " + n,
                    description: "Description " + n + " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                });
                n++;
            }
            return items;
        }());
    }
}());

