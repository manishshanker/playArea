(function () {
    "use strict";

    APP.dependency.NewsDetail = {
        templates: {
            newsDetail: function () {
                return new HAF.Template("tmplNewsDetail");
            }
        },
        views: {
            newsDetail: function () {
                return new APP.view.NewsDetail();
            }
        }
    };

}());