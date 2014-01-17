(function (window) {
    "use strict";
    if (window.addEventListener && window.applicationCache) {

        window.addEventListener('load', function () {
            window.applicationCache.addEventListener('updateready', function (e) {
                if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                    // Browser downloaded a new app cache.
                    if (confirm('A new version of this application is available. Load it?')) {
                        window.location.reload();
                    }
                } else {
                    // Manifest didn't changed. Nothing new to server.
                }
            }, false);
        }, false);

    }
})(window);

