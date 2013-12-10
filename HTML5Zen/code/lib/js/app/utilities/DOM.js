(function ($) {
    "use strict";

    function HTML5ZenDOM(selector) {
        return new HTML5ZenDOMElement($(selector));
    }

    HTML5ZenDOM.get = function () {
        return $.get.apply(this, arguments);
    };

    HTML5ZenDOM.grep = function () {
        return $.grep.apply(this, arguments);
    };

    var HTML5ZenDOMElement = function ($item) {
        this.$item = $item;
    };

    HTML5ZenDOMElement.prototype = {
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
        }
    };

    APP.DOM = HTML5ZenDOM;

}(jQuery));