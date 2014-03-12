mqApp.service("tradeService", function($q) {
    var deferred = $q.defer();
    deferred.resolve( ["A", "List", "Of", "Items"]);
    return deferred.promise;
});