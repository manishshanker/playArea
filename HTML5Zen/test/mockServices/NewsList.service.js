(function () {
    "use strict";

    APP.service.NewsList = APP.service.NewsList.$extend({
        fetch: function () {
            this.updated(getMockData());
        },
        init: function () {
            var that = this;
            that.$super();
            setInterval(function () {
                that.fetch();
            }, 5000);
        }
    });

    function getMockData() {
        return (function () {
            var items = [];
            var n = 0;
            while (n < 20) {
                items.push({
                    id: n,
                    title: "News " + n + new Date().getSeconds(),
                    description: "Description " + n + ": " + new Date().toLocaleTimeString() + " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                });
                n++;
            }
            return items;
        }());
    }
}());

