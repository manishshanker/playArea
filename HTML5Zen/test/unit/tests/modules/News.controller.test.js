require("js/vendor/handlebars-v1.1.2.js");
require("js/app/utilities/DOM.js");
require("js/app/utilities/classExtend.js");
require("js/app/utilities/messaging.js");
require("js/app/utilities/template.js");
require("js/app/utilities/baseClass/Controller.js");
require("js/app/utilities/baseClass/Service.js");
require("js/app/utilities/baseClass/Template.js");
require("js/app/utilities/baseClass/View.js");
require("js/app/modules/News/News.controller.js");
require("js/app/modules/News/News.service.js");
require("js/app/modules/News/controls/newsList/NewsList.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.view.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.controller.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.view.js");
require("../../test/mockServices/News.service.js");
describe("News.controller", function () {
    describe(".init", function () {
        it("should call service fetch", function () {
            var $fragments = $("#fragments");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            var service = new APP.service.News();
            var mockService = sinon.mock(service);
            var mockServiceExpectation = mockService.expects("fetch").once();
            var controller = new APP.controller.News(null, service, null, null);
            controller.load();
            APP.messaging.publish("appStateChange-view-changedTo-example", {});
            mockServiceExpectation.verify();
            mockService.restore();
            $fragments.empty();
        });
    });

    describe(".load", function () {
        it("should subscribe to events", function () {
            var mockNavView = sinon.mock(APP.messaging);
            var expectation = mockNavView.expects("subscribe").thrice();
            var controller = new APP.controller.News();
            controller.load();
            expectation.verify();
            mockNavView.restore();
        });
    });

    describe(".destroy", function () {
        it("should call destroy without failure", function () {
            var $fragments = $("#fragments");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            var controller = new APP.controller.News();
            controller.load();
            APP.messaging.publish("appStateChange-view-changedTo-example", {});
            controller.destroy();
            $fragments.empty();
        });
    });
});
