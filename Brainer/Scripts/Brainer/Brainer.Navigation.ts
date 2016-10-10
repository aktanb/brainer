module Brainer {
    export class Navigation {
        public languageSelector: JQuery;
        public isShowed: boolean;

        constructor(public object: JQuery) {
            var _this = this;
            _this.languageSelector = $('.language-selector');
            _this.languageSelector.click(function () {
                $.post('Home/ChangeCulture', {
                    'culture': $(this).attr('culture')
                },
                    function () {
                        window.location.reload();
                    }
                );
            });
        }

        public reset() {
            var _this = this,
                currentPage = Marginal.Utilities.URL.getCurrentPageName();
            _this.object.find('.left').find('a').each(function () {
                $(this).parent().removeClass('active');
                if ($.trim($(this).attr('href').slice(1)) === currentPage) {
                    $(this).parent().addClass('active');
                }
            })
        }

        public show(state: boolean = true) {
            var _this = this;
            if (state) {
                _this.object.slideDown('slow');
                _this.isShowed = true;
            } else {
                _this.object.slideUp('slow');
                _this.isShowed = false;
            }
        }
    }
}