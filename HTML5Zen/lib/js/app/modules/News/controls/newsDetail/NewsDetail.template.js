(function() {
    "use strict";

    var newsDetailTemplate;

    APP.template.NewsDetail = function() {

        function load(onSuccess) {
            if (newsDetailTemplate) {
                onSuccess(newsDetailTemplate);
            } else {
                APP.templateEngine.getById("newsDetailTemplate", function(template) {
                    newsDetailTemplate = template;
                    onSuccess(newsDetailTemplate);
                });
            }
        }

        return {
            load: load
        }
    }

}());