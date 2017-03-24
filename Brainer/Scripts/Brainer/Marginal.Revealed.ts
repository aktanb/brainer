module Marginal {
    export class Revealed {
        public reveal: any = Reveal;
        public container: JQuery;
        public slides: JQuery;
        public slide: JQuery;
        public backgrounds: JQuery;
        public currentPageName: string;
        public currentSlide: Section;
        public onPageReset: any = function () { }
        public onHashChange: any = function () { }
        public defaultBackgroundColor: string = '#9D1309';

        constructor(
            public options =
                {
                    controls: false,
                    progress: false,
                    keyboard: false,
                    touch: false
                }
        ) {
            var _this = this;
            _this.container = $('.reveal');
            _this.slides = _this.container.find('.slides');
            _this.slide = _this.container.find('.slide');
            _this.backgrounds = _this.container.find('.backgrounds');
            _this.resetPage(true);
            window.onhashchange = function () {
                _this.currentPageName = '';
                _this.currentSlide = _this.addSlide(
                    Marginal.Spinner.windows,
                    function () {
                        setTimeout(function () {
                            _this.appendSpinnerCaption();
                            $('.spinner').fadeIn('fast');
                        }, 2000);
                        _this.onHashChange();
                        _this.resetPage();
                    }
                );
            }
        }

        // Loads the new page's content into a new slide.
        public resetPage(initial: boolean = false) {
            var _this = this;
            _this.currentPageName = Utilities.URL.getCurrentPageName();
            $.post('Page/' + _this.currentPageName, {}, function (data) {
                _this.currentSlide = _this.addSlide(data);
                _this.reveal.initialize(_this.options);
                _this.onPageReset(initial);
                setTimeout(function () {
                    _this.slides.find('.past').remove();
                    _this.backgrounds.find('.past').remove();
                }, 300);
            });
        }

        // Adds a new slide to the right.
        public addSlide(data: any, onAdded: any = function () { }) {
            var _this = this;
            setTimeout(function () {
                _this.reveal.right();
                onAdded();
            }, 100);
            var result = new Section(_this, data);
            result.object.appendTo(_this.slides);
            return result;
        }

        // Adds a slide to the bottom of the current slide.
        public addSubslide(data, onAdded: any = function () { }) {
            var _this = this;
            var subsection = new Section(_this, data).object.appendTo(_this.currentSlide.object);
            onAdded();
        }

        // Loads a certain content to the bottom of the current slide.
        public loadToBottom(URL: string, parameters: JSON, onLoad: any = function () { }) {
            var _this = this;
            _this.addSubslide(
                Marginal.Spinner.windows,
                function () {
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
                }
            );
        }

        // Navigates to the toppest section in the current slide.
        public toTopSlide() {
            this.reveal.slide(1, 0, 0);
        }

        // Appends a "loading..." string to the spinner.
        private appendSpinnerCaption() {
            if ($('.spinner').length > 0) {
                $('<div />', {
                    'class': 'spinner-caption',
                    'style': 'display: none',
                    'html': _resources.loading
                }).insertAfter($('.spinner')).fadeIn('fast');
            }
        }
    }

    export class Section {
        public object: JQuery;
        constructor(public site: Revealed, data: any) {
            var _this = this;
            _this.object = $('<section />', {
                'data-transition': 'default',
                'data-background': _this.site.currentPageName === 'Main' ?
                    _this.site.defaultBackgroundColor : null,
                'html': data
            });
        }
    }

    declare var Reveal;
}