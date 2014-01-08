(function (HAF, $) {
    "use strict";

    HAF.view.NewsList = HAF.View.extend({
        container: "#newsList",
        selectItem: function (itemId) {
            if (this._$selectedItem) {
                this._$selectedItem.removeClass("selected");
            }
            this._$selectedItem = $("#newsItem_" + itemId);
            this._$selectedItem.addClass("selected");
        }
    });

}(HAF, HAF.DOM));