(function(){
   "use strict";

    mqApp.controllers.Home = function($scope, homeService) {
        homeService.then(function(data) {
            $scope.items = data;
        });
    };

}());