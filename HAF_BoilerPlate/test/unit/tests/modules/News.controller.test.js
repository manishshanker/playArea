require("js/app/modules/News/News.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.service.js");
require("js/app/modules/News/controls/newsList/NewsList.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.view.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.service.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.controller.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.view.js");
require("../../test/mockServices/NewsList.service.js");
describe("News.controller", function () {
    describe(".init", function () {
        it("should call service fetch", function () {
            var $fragments = $("#fragments");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            var newsListService = new APP.service.NewsList();
            var newsDetailService = new APP.service.NewsDetail();
            var mockService = sinon.mock(newsListService);
            var mockServiceExpectation = mockService.expects("fetch").once();
            var controller = new APP.controller.News();
            controller.inject({
                services: {
                    newsList: newsListService,
                    newsDetail: newsDetailService
                }
            });
            controller.load();
            HAF.messaging.publish("navigationChangedTo:example", {});
            mockServiceExpectation.verify();
            mockService.restore();
            $fragments.empty();
        });
    });

    describe(".load", function () {
        it("should subscribe to events", function () {
            var mockNavView = sinon.mock(HAF.messaging);
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
            HAF.messaging.publish("navigationChangedTo:example", {});
            controller.destroy();
            $fragments.empty();
        });
    });
});
