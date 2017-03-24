/// <reference path="Brainer.Site.ts" />
module Brainer {
    export class Playground {
        public currentGame: Game;
        public container: JQuery;
        public resultScreen: JQuery;
        public playScene: any;
        public footer: any;
        public playerAge: number;
        public isThinking: boolean = false;
        public currentThinkingTime: number = 0.0;

        constructor() {
            var _this = this;
        }

        public init(container: JQuery, gameName: string) {
            var _this = this;
            _this.container = container;
            _this.container.empty();
            _this.askForAge(function () {
                _this.appendResultScreen();
                _this.appendPlayScene;
                _this.appendFooter();

                if (gameName === 'main') {
                    _this.currentGame = new MainGame();
                }

                setTimeout(function () {
                    // _this.site.slide(1, 2, 0);
                    $('.top-bar').slideUp();
                    _this.footer.fadeIn('fast');
                    var verticallyCenteredContent: any = $('.task-section-container, .equals-sign');
                    verticallyCenteredContent.flexVerticalCenter();
                }, 500);
                $('.page-screen-bottom-back-button').hide();
            });
        }

        public refreshFooter(options) {
            var _this = this,
                settings = $.extend({ state: '', custom: {} }, options),
                left = _this.footer.find('.columns[left]').empty(),
                right = _this.footer.find('.columns[right]').empty();
            if (settings.state.length > 0) {
                $('<button />', {
                    'class': 'left',
                    'html': _resources.stopPlaying
                })
                    .appendTo(left)
                    .click(function () {
                        _this.footer.fadeOut();
                        _this.destroy();
                    });
                if (settings.state === 'playing') {
                    $('<button />', {
                        'class': 'confused-button right',
                        'html': _resources.iDontKnow
                    })
                        .appendTo(right).click(function () {
                            // $('.playground').playground('nextFrame', false, true);
                        });
                } else if (settings.state === 'showing results') {
                    $('<button />', {
                        'class': 'right',
                        'html': _resources.continue
                    })
                        .appendTo(right)
                        .click(function () {
                            if (settings.custom.proceedAction != undefined) {
                                settings.custom.proceedAction();
                            } else {
                                _this.currentGame.play();
                            }
                        });
                }
            }
        }

        public thinking(state: string = null) {
            var _this = this;
            if (state !== null) {
                if (state === 'start' || state === 'resume') {
                    _this.isThinking = true;
                    if (state === 'start') {
                        _this.currentThinkingTime = 0.0;
                    }
                    _this.thinking();
                }
                if (state === 'stop') {
                    _this.isThinking = false;
                }
            } else if (_this.isThinking) {
                setTimeout(function () {
                    _this.currentThinkingTime += 0.1;
                    _this.thinking();
                }, 100);
            }
        }

        private askForAge(callback: any) {
            var _this = this;
            if (!_site.isAuthorized) {
                var dialog: any = $('#AskForAgeDialog');
                dialog.foundation('reveal', 'open').find('.ok-button').off().click(function () {
                    _this.playerAge = parseInt($('.playground-age-selector').val());
                    dialog.foundation('reveal', 'close');
                    callback();
                });
                dialog.find('.close-reveal-modal').off().click(function () {
                    _this.destroy();
                });
            } else {
                callback();
            }
        }

        private appendResultScreen() {
            var _this = this;
            _this.resultScreen = $('<div />', { 'class': 'answer-result', 'html': '<div class="value-string"></div>' }).appendTo(_this.container);
        }

        private appendPlayScene() {
            var _this = this;
            _this.playScene = $('<div />', { 'class': 'playground-body' }).appendTo(_this.container);
        }

        private appendFooter() {
            var _this = this;
            _this.footer = $('<div />', {
                'class': 'playground-footer',
                'html': '<div class="row"><div class="small-6 columns" left></div><div class="small-6 columns" right></div></div>'
            }).appendTo($('body'));
        }

        private destroy() {
            var _this = this;
            _this.footer.remove();
            _site.reveal.slide(1, 0, 0);
            $('.top-bar').slideDown('fast');
        }
    }
}