/// <reference path="Brainer.Site.ts" />
var Brainer;
(function (Brainer) {
    var Playground = (function () {
        function Playground() {
            this.isThinking = false;
            this.currentThinkingTime = 0.0;
            var _this = this;
        }
        Playground.prototype.init = function (container, gameName) {
            var _this = this;
            _this.container = container;
            _this.container.empty();
            _this.askForAge(function () {
                _this.appendResultScreen();
                _this.appendPlayScene;
                _this.appendFooter();
                if (gameName === 'main') {
                    _this.currentGame = new Brainer.MainGame();
                }
                setTimeout(function () {
                    // _this.site.slide(1, 2, 0);
                    $('.top-bar').slideUp();
                    _this.footer.fadeIn('fast');
                    var verticallyCenteredContent = $('.task-section-container, .equals-sign');
                    verticallyCenteredContent.flexVerticalCenter();
                }, 500);
                $('.page-screen-bottom-back-button').hide();
            });
        };
        Playground.prototype.refreshFooter = function (options) {
            var _this = this, settings = $.extend({ state: '', custom: {} }, options), left = _this.footer.find('.columns[left]').empty(), right = _this.footer.find('.columns[right]').empty();
            if (settings.state.length > 0) {
                $('<button />', {
                    'class': 'left',
                    'html': Marginal.Strings.stopPlaying
                })
                    .appendTo(left)
                    .click(function () {
                    _this.footer.fadeOut();
                    _this.destroy();
                });
                if (settings.state === 'playing') {
                    $('<button />', {
                        'class': 'confused-button right',
                        'html': Marginal.Strings.iDontKnow
                    })
                        .appendTo(right).click(function () {
                        // $('.playground').playground('nextFrame', false, true);
                    });
                }
                else if (settings.state === 'showing results') {
                    $('<button />', {
                        'class': 'right',
                        'html': Marginal.Strings.continue
                    })
                        .appendTo(right)
                        .click(function () {
                        if (settings.custom.proceedAction != undefined) {
                            settings.custom.proceedAction();
                        }
                        else {
                            _this.currentGame.play();
                        }
                    });
                }
            }
        };
        Playground.prototype.thinking = function (state) {
            if (state === void 0) { state = null; }
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
            }
            else if (_this.isThinking) {
                setTimeout(function () {
                    _this.currentThinkingTime += 0.1;
                    _this.thinking();
                }, 100);
            }
        };
        Playground.prototype.askForAge = function (callback) {
            var _this = this;
            if (!_site.isAuthorized) {
                var dialog = $('#AskForAgeDialog');
                dialog.foundation('reveal', 'open').find('.ok-button').off().click(function () {
                    _this.playerAge = parseInt($('.playground-age-selector').val());
                    dialog.foundation('reveal', 'close');
                    callback();
                });
                dialog.find('.close-reveal-modal').off().click(function () {
                    _this.destroy();
                });
            }
            else {
                callback();
            }
        };
        Playground.prototype.appendResultScreen = function () {
            var _this = this;
            _this.resultScreen = $('<div />', { 'class': 'answer-result', 'html': '<div class="value-string"></div>' }).appendTo(_this.container);
        };
        Playground.prototype.appendPlayScene = function () {
            var _this = this;
            _this.playScene = $('<div />', { 'class': 'playground-body' }).appendTo(_this.container);
        };
        Playground.prototype.appendFooter = function () {
            var _this = this;
            _this.footer = $('<div />', {
                'class': 'playground-footer',
                'html': '<div class="row"><div class="small-6 columns" left></div><div class="small-6 columns" right></div></div>'
            }).appendTo($('body'));
        };
        Playground.prototype.destroy = function () {
            var _this = this;
            _this.footer.remove();
            _site.reveal.slide(1, 0, 0);
            $('.top-bar').slideDown('fast');
        };
        return Playground;
    })();
    Brainer.Playground = Playground;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Playground.js.map