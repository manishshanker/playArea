require("js/vendor/handlebars-v1.1.2.js");
require("js/app/utilities/DOM.js");
require("js/app/utilities/messaging.js");
require("js/app/utilities/template.js");
require("../../test/mockServices/News.service.js");
require("js/app/modules/News/News.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.template.js");
require("js/app/modules/News/controls/newsList/NewsList.view.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.controller.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.template.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.view.js");
describe("News.controller", function () {
    describe(".init", function () {
        it("should load template", function () {
            var $fragments = $("#fragments");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            var mockListTemplate = sinon.mock(APP.template.NewsList);
            var mockListTemplateExpectation = mockListTemplate.expects("getNewsListTemplate").once().returns("");
            var mockDetailTemplate = sinon.mock(APP.template.NewsDetail);
            var mockDetailTemplateExpectation = mockDetailTemplate.expects("getNewsDetailTemplate").once().returns("");
            var controller = new APP.controller.News();
            controller.load();
            APP.messaging.publish("appStateChange-selected-page-example", {});
            mockListTemplateExpectation.verify();
            mockListTemplate.restore();
            mockDetailTemplateExpectation.verify();
            mockDetailTemplate.restore();
            $fragments.empty();
        });
    });

    describe(".load", function () {
        it("should subscribe to events", function () {
            var mockNavView = sinon.mock(APP.messaging);
            var expectation = mockNavView.expects("subscribe").twice();
            var controller = new APP.controller.News();
            controller.load();
            expectation.verify();
            mockNavView.restore();
        });
    });

    describe(".destroy", function () {
        it("should call destroy without failure", function () {
            var controller = new APP.controller.News();
            controller.load();
            APP.messaging.publish("appStateChange-selected-page-example", {});
            controller.destroy();
        });
    });
});
