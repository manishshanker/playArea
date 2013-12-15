describe("News.controller", function () {
    "use strict";

    describe(".init", function () {
        it("should load template", function () {
            var flag = false;
            var $fragments = $("<div id='fragments'></div>");
            $fragments.html("<div id='newsListTemplate'>{{title}}</div><div id='newsDetailTemplate'>{{title}}</div>");
            $("body").append($fragments);
            var template = new APP.Template("newsListTemplate");
            spyOn(template, "process");
            var newsList = new APP.controller.NewsList(null, null, template);
            var controller = new APP.controller.News(null, null, newsList, null);
            controller.load();
            APP.messaging.publish("appStateChange-view-changedTo-example", {});
            runs(function () {
                setTimeout(function () {
                    expect(template.process).toHaveBeenCalled();
                    $fragments.remove();
                    flag = true;
                }, 500);
            });

            waitsFor(function () {
                return flag;
            }, "Should have called template methods", 600);
        });
    });

    describe(".load", function () {
        it("should subscribe to events", function () {
            spyOn(APP.messaging, "subscribe");
            var controller = new APP.controller.News();
            controller.load();
            expect(APP.messaging.subscribe).toHaveBeenCalledWith("appStateChange-view-changedTo-example", jasmine.any(Function));
            expect(APP.messaging.subscribe).toHaveBeenCalledWith("appStateChange-view-stateChange-example", jasmine.any(Function));
            expect(APP.messaging.subscribe).toHaveBeenCalledWith("appStateChange-view-changedFrom-example", jasmine.any(Function));
        });

        it("should call newsList select and load news detail", function () {
            var flag;
            var newsList = new APP.controller.NewsList();
            var newsDetail = new APP.controller.NewsDetail();
            spyOn(newsList, "selectItem");
            spyOn(newsDetail, "load");
            var controller = new APP.controller.News(null, null, newsList, newsDetail);
            controller.load();
            APP.messaging.publish("appStateChange-view-changedTo-example");
            runs(function () {
                setTimeout(function () {
                    APP.messaging.publish("appStateChange-view-stateChange-example", {moduleItem: 1});
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
            var controller = new APP.controller.News(null, null, newsList, newsDetail);
            controller.load();
            APP.messaging.publish("appStateChange-view-changedTo-example");
            runs(function () {
                setTimeout(function () {
                    APP.messaging.publish("appStateChange-view-changedFrom-example", {moduleItem: 1});
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
            APP.messaging.publish("appStateChange-view-changedTo-example", {});
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
