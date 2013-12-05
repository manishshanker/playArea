(function($) {
    "use strict";

    var currentURL;

    function Navigation() {

        function load() {
            currentURL = location.href;
            $.on("anchorChanfe")
        }

        return {
            load: load
        }
    }

    APP.navigation = new Navigation();
}(HTML5ZenDOM));