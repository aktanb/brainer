var Brainer;
(function (Brainer) {
    var Navigation = (function () {
        function Navigation(object) {
            this.object = object;
            var _this = this;
            _this.languageSelector = $('.language-selector');
            _this.languageSelector.click(function () {
                $.post('Home/ChangeCulture', {
                    'culture': $(this).attr('culture')
                }, function () {
                    window.location.reload();
                });
            });
        }
        Navigation.prototype.reset = function () {
            var _this = this, currentPage = Marginal.Utilities.URL.getCurrentPageName();
            _this.object.find('.left').find('a').each(function () {
                $(this).parent().removeClass('active');
                if ($.trim($(this).attr('href').slice(1)) === currentPage) {
                    $(this).parent().addClass('active');
                }
            });
        };
        Navigation.prototype.show = function (state) {
            if (state === void 0) { state = true; }
            var _this = this;
            if (state) {
                _this.object.slideDown('slow');
                _this.isShowed = true;
            }
            else {
                _this.object.slideUp('slow');
                _this.isShowed = false;
            }
        };
        return Navigation;
    })();
    Brainer.Navigation = Navigation;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Navigation.js.map