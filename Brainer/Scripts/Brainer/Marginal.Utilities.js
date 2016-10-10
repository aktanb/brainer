var Marginal;
(function (Marginal) {
    var Utilities;
    (function (Utilities) {
        var URL = (function () {
            function URL() {
            }
            URL.getCurrentPageName = function (pageUrl) {
                if (pageUrl === void 0) { pageUrl = null; }
                var url = (pageUrl === null ? window.location.href : pageUrl);
                var pageIndex = $.trim(url.slice(url.indexOf('#')));
                if (pageIndex.length > 1) {
                    return pageIndex.slice(1);
                }
                else {
                    return 'Main';
                }
            };
            return URL;
        })();
        Utilities.URL = URL;
        var UI = (function () {
            function UI() {
            }
            UI.suppressBackspace = function (event) {
                event = event || window.event;
                var target = event.target || event.srcElement;
                if (event.keyCode == 8 && !/input|textarea/i.test(target.nodeName)) {
                    return false;
                }
            };
            return UI;
        })();
        Utilities.UI = UI;
    })(Utilities = Marginal.Utilities || (Marginal.Utilities = {}));
})(Marginal || (Marginal = {}));
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
}
//# sourceMappingURL=Marginal.Utilities.js.map