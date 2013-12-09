(function () {
    "use strict";

    APP.template.NewsList = function () {

        function load(onSuccess) {
            APP.templateEngine.getById("newsListTemplate", function (template) {
                onSuccess(template);
            });
        }

        return {
            load: load
        }
    };

}());