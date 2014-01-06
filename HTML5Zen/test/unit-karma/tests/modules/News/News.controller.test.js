describe("News.controller", function () {
    "use strict";

    describe(".init", function () {
        it("should load template", function () {
            var flag = false;
            var $fragments = $("<div id='fragments'></div>");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            $("body").append($fragments);
            var newsListTemplate = new APP.Template("newsListTemplate");
            spyOn(newsListTemplate, "process");
            var newsDetailTemplate = new APP.Template("newsDetailTemplate");
            spyOn(newsDetailTemplate, "process");
            var controller = new APP.controller.News(null, null, null, null, {
                newsList: new APP.controller.NewsList(null, null, {
                    newsList: newsListTemplate
                }),
                newsDetail: new APP.controller.NewsDetail(null, null, {
                    newsDetail: newsDetailTemplate
                })
            });
            controller.load();
            APP.messaging.publish("navigationChangedTo:example", {});
            runs(function () {
                setTimeout(function () {
                    expect(newsListTemplate.process).toHaveBeenCalled();
                    expect(newsDetailTemplate.process).toHaveBeenCalled();
                    $fragments.remove();
                    flag = true;
                }, 500);
            });
            waitsFor(function () {
                return flag;
            }, "Should have processed news list and detail template", 600);
        });
    });

    describe(".load", function () {
        it("should subscribe to events", function () {
            spyOn(APP.messaging, "subscribe");
            var controller = new APP.controller.News();
            controller.load();
            expect(APP.messaging.subscribe).toHaveBeenCalledWith(jasmine.any(Object), "navigationChangedTo:example", jasmine.any(Function));
            expect(APP.messaging.subscribe).toHaveBeenCalledWith(jasmine.any(Object), "navigationStateChange:example", jasmine.any(Function));
            expect(APP.messaging.subscribe).toHaveBeenCalledWith(jasmine.any(Object), "navigationChangedFrom:example", jasmine.any(Function));
        });

        it("should call newsList select and load news detail", function () {
            var flag;
            var newsList = new APP.controller.NewsList();
            var newsDetail = new APP.controller.NewsDetail();
            spyOn(newsList, "selectItem");
            spyOn(newsDetail, "load");
            var controller = new APP.controller.News(null, null, null, null, {
                newsList: newsList,
                newsDetail: newsDetail
            });
            controller.load();
            APP.messaging.publish("navigationChangedTo:example");
            runs(function () {
                setTimeout(function () {
                    APP.messaging.publish("navigationStateChange:example", {moduleItem: 1});
                    expect(newsList.selectItem).toHaveBeenCalled();
                    expect(newsDetail.load).toHaveBeenCalled();
                    flag = true;
                }, 500);
            });
            waitsFor(function () {
                return flag;
            }, "Should have called list and detail methods", 600);
        });

        it("should call destroy", function () {
            var flag;
            var newsList = new APP.controller.NewsList();
            var newsDetail = new APP.controller.NewsDetail();
            spyOn(newsList, "destroy");
            spyOn(newsDetail, "destroy");
            var controller = new APP.controller.News(null, null, null, null, {
                newsList: newsList,
                newsDetail: newsDetail
            });
            controller.load();
            APP.messaging.publish("navigationChangedTo:example");
            runs(function () {
                setTimeout(function () {
                    controller.destroy();
                    expect(newsList.destroy).toHaveBeenCalled();
                    expect(newsDetail.destroy).toHaveBeenCalled();
                    flag = true;
                }, 500);
            });
            waitsFor(function () {
                return flag;
            }, "Should have called list and detail destroy methods", 600);
        });
    });

    describe(".destroy", function () {
        it("should call destroy without failure", function () {
            var flag;
            var $fragments = $("<div id='fragments'></div>");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            $("body").append($fragments);
            var controller = new APP.controller.News();
            controller.load();
            APP.messaging.publish("navigationChangedTo:example", {});
            runs(function () {
                setTimeout(function () {
                    controller.destroy();
                    $fragments.remove();
                    flag = true;
                }, 500);
            });
            waitsFor(function () {
                return flag;
            }, "Should have called template methods", 600);
        });
    });
});
