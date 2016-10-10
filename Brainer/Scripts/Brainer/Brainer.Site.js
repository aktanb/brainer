var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Brainer;
(function (Brainer) {
    var Site = (function (_super) {
        __extends(Site, _super);
        function Site(isAuthorized, isLocal) {
            if (isAuthorized === void 0) { isAuthorized = false; }
            if (isLocal === void 0) { isLocal = false; }
            _super.call(this);
            this.isAuthorized = isAuthorized;
            this.isLocal = isLocal;
            var _this = this;
            if (isAuthorized) {
                _this.session = new Brainer.Session();
            }
            _this.sounds = new Brainer.Sounds(isLocal);
            _this.navigation = new Brainer.Navigation($('.top-bar'));
            _this.playground = new Brainer.Playground();
            _this.onPageReset = function (initial) {
                var isMainPage = _this.currentPageName === 'Main';
                _this.navigation.show(!isMainPage);
                _this.navigation.reset();
                if (isMainPage && !initial) {
                    _this.reveal.right();
                }
                _this.initFoundation();
            };
            _this.onHashChange = function () { };
        }
        Site.prototype.initFoundation = function () {
            var doc = $(document);
            doc.foundation();
        };
        Site.prototype.loadToDialog = function (url, parameters) {
            var dialog = $('.main-dialog'), loading = dialog.find('.main-dialog-loading'), content = dialog.find('.main-dialog-content');
            content.hide(0);
            loading.fadeIn('fast');
            dialog.foundation('reveal', 'open');
            $.post(url, parameters, function (data) {
                content.html(data);
                loading.hide();
                content.fadeIn();
            });
        };
        return Site;
    })(Marginal.Revealed);
    Brainer.Site = Site;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Site.js.map