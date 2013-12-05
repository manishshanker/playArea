(function($) {
    "use strict";

    function HTML5ZenDOM(selector) {
        return new HTML5ZenDOMElement($(selector));
    }

    HTML5ZenDOM.get = function() {
        return $.get.apply(this, arguments);
    };

    HTML5ZenDOM.grep = function() {
        return $.grep.apply(this, arguments);
    };

    var HTML5ZenDOMElement = function($item) {
        this.$item = $item;
    };

    HTML5ZenDOMElement.prototype = {
        on: function() {
            this.$item.on.apply(this.$item, arguments);
            return this;
        },
        off: function() {
            this.$item.off.apply(this.$item, arguments);
            return this;
        },
        html: function(text) {
            if (text) {
                this.$item.html.apply(this.$item, arguments);
                return this;
            }
            return this.$item.html.apply(this.$item, arguments);
        },
        attr: function(attribute, value) {
            if (value) {
                this.$item.attr.apply(this.$item, arguments);
                return this;
            }
            return this.$item.attr.apply(this.$item, arguments);
        },
        each: function() {
            this.$item.each.apply(this.$item, arguments);
            return this;
        }
    };

    window.HTML5ZenDOM = HTML5ZenDOM;

}(jQuery));