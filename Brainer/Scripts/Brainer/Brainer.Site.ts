module Brainer {
    export class Site extends Marginal.Revealed {
        public session: Session;
        public navigation: Navigation;
        public playground: Playground;
        public sounds: Sounds;

        constructor(public isAuthorized: boolean = false, public isLocal: boolean = false) {
            super();
            var _this = this;
            if (isAuthorized) {
                _this.session = new Session();
            }
            _this.sounds = new Sounds(isLocal);
            _this.navigation = new Navigation($('.top-bar'));
            _this.playground = new Playground();
            _this.onPageReset = function (initial) {
                var isMainPage = _this.currentPageName === 'Main';
                _this.navigation.show(!isMainPage);
                _this.navigation.reset();
                if (isMainPage && !initial) {
                    _this.reveal.right();
                }
                _this.initFoundation();
            }
            _this.onHashChange = function () { }
        }

        public initFoundation() {
            var doc: any = $(document);
            doc.foundation();
        }

        public loadToDialog(url, parameters) {
            var dialog: any = $('.main-dialog'),
                loading = dialog.find('.main-dialog-loading'),
                content = dialog.find('.main-dialog-content');
            content.hide(0);
            loading.fadeIn('fast');
            dialog.foundation('reveal', 'open');
            $.post(url, parameters, function (data) {
                content.html(data);
                loading.hide();
                content.fadeIn();
            });
        }
    }
}

declare var _site: Brainer.Site;
declare var _resources: any;