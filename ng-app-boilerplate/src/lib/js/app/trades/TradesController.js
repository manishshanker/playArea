(function(){
    "use strict";

    mqApp.controllers.Trades = function($scope, tradeService) {
        tradeService.then(function(data) {
            $scope.things = data;
        });
    };

}());