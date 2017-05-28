var Marginal;
(function (Marginal) {
    var Revealed = (function () {
        function Revealed(options) {
            if (options === void 0) { options = {
                controls: false,
                progress: false,
                keyboard: false,
                touch: false,
                //transition: 'convex',
                //width: '100%',
                //height: '100%',
                margin: 0.0,
                minScale: 0.5,
                maxScale: 3
            }; }
            this.options = options;
            this.reveal = Reveal;
            this.onPageReset = function () { };
            this.onHashChange = function () { };
            this.defaultBackgroundColor = '#9D1309';
            this._slideLoadTimeout = 300;
            var _this = this;
            _this.container = $('.reveal');
            _this.slides = _this.container.find('.slides');
            _this.slide = _this.container.find('.slide');
            _this.backgrounds = _this.container.find('.backgrounds');
            _this.resetPage(true);
            window.onhashchange = function () {
                _this.currentPageName = '';
                _this.currentSlide = _this.addSlide(Marginal.Spinner.windows, function () {
                    setTimeout(function () {
                        _this.appendSpinnerCaption();
                        $('.spinner').fadeIn('fast');
                    }, 2000);
                    _this.onHashChange();
                    _this.resetPage();
                });
            };
            _this.reveal.addEventListener('ready', function (event) {
            });
        }
        // Loads the new page's content into a new slide.
        Revealed.prototype.resetPage = function (initial) {
            if (initial === void 0) { initial = false; }
            var _this = this;
            _this.currentPageName = Marginal.Utilities.URL.getCurrentPageName();
            $.post('Page/' + _this.currentPageName, {}, function (data) {
                _this.currentSlide = _this.addSlide(data);
                _this.reveal.initialize(_this.options);
                _this.onPageReset(initial);
                setTimeout(function () {
                    _this.slides.find('.past').remove();
                    _this.backgrounds.find('.past').remove();
                }, _this._slideLoadTimeout + 100);
            });
        };
        // Adds a new slide to the right.
        Revealed.prototype.addSlide = function (data, onAdded) {
            if (onAdded === void 0) { onAdded = function () { }; }
            var _this = this;
            setTimeout(function () {
                _this.reveal.right();
                onAdded();
            }, _this._slideLoadTimeout);
            var result = new Section(_this, data);
            result.object.appendTo(_this.slides);
            return result;
        };
        // Adds a slide to the bottom of the current slide.
        Revealed.prototype.addSubslide = function (data, onAdded) {
            if (onAdded === void 0) { onAdded = function () { }; }
            var _this = this;
            var subsection = new Section(_this, data).object.appendTo(_this.currentSlide.object);
            onAdded();
        };
        // Loads a certain content to the bottom of the current slide.
        Revealed.prototype.loadToBottom = function (URL, parameters, onLoad) {
            if (onLoad === void 0) { onLoad = function () { }; }
            var _this = this;
            _this.addSubslide(Marginal.Spinner.windows, function () {
                setTimeout(function () {
                    _this.appendSpinnerCaption();
                    $('.spinner').fadeIn('fast');
                }, 2000);
                _this.reveal.slide(1, 1, 0);
                $.post(URL, {}, function (data) {
                    var subsection = new Section(_this, data).object.appendTo(_this.currentSlide.object);
                    _this.reveal.slide(1, 2, 0);
                    onLoad();
                });
            });
        };
        // Navigates to the toppest section in the current slide.
        Revealed.prototype.toTopSlide = function () {
            this.reveal.slide(1, 0, 0);
        };
        // Appends a "loading..." string to the spinner.
        Revealed.prototype.appendSpinnerCaption = function () {
            if ($('.spinner').length > 0) {
                $('<div />', {
                    'class': 'spinner-caption',
                    'style': 'display: none',
                    'html': _resources.loading
                }).insertAfter($('.spinner')).fadeIn('fast');
            }
        };
        return Revealed;
    })();
    Marginal.Revealed = Revealed;
    var Section = (function () {
        function Section(site, data) {
            this.site = site;
            var _this = this;
            _this.object = $('<section />', {
                'data-transition': 'default',
                'data-background': _this.site.currentPageName === 'Main' ?
                    _this.site.defaultBackgroundColor : null,
                'html': data
            });
        }
        return Section;
    })();
    Marginal.Section = Section;
})(Marginal || (Marginal = {}));
//# sourceMappingURL=Marginal.Revealed.js.map