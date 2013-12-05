(function() {

    APP.service.News = function() {
        function getData(callback) {
            callback(

                (function() {
                    var items = [];
                    var n = 0;
                    while(n<20) {
                        items.push({
                            id: n,
                            title: "News " + n,
                            description: "Description " + n +" lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                        })
                        n++;
                    }
                    return items;
                }())
            );
        }

        return {
            getData: getData
        }
    }

}());