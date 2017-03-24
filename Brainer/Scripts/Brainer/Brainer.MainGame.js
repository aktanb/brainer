var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/uuid/uuid.d.ts" />
var Brainer;
(function (Brainer) {
    var MainGame = (function (_super) {
        __extends(MainGame, _super);
        function MainGame() {
            _super.call(this, 'main');
            this.currentInnerGameIndex = 0;
            var _this = this;
            _this.onLoad = function (data) {
                _this.innerGames = new Array();
                var rawInnerGamesData = JSON.parse(data);
                for (var i = 0; i < rawInnerGamesData.length; i++) {
                    _this.innerGames.push(new Brainer.InnerGame(_this, rawInnerGamesData[i]));
                }
            };
            _this.play = function () {
                var currentInnerGame = _this.innerGames[_this.currentInnerGameIndex];
                currentInnerGame.object.appendTo(_site.playground.playScene.empty());
                currentInnerGame.initialize();
                _site.playground.refreshFooter({
                    state: 'playing',
                    custom: {
                        description: currentInnerGame.settings.description
                    }
                });
                _this.showResults('reset');
                _site.playground.thinking('start');
            };
        }
        MainGame.prototype.showResults = function (state) {
            var _this = this, value = _site.playground.resultScreen.find('.value-string');
            if (state === 'reset') {
                setTimeout(function () {
                    value.html('').transition({ 'opacity': 0 });
                    _site.playground.playScene.transition({ 'opacity': 1 }).removeClass('unclickable').flexVerticalCenter();
                    ;
                }, 500);
            }
            else {
                var currentInnerGame = _this.innerGames[_this.currentInnerGameIndex], lastFrame = _this.currentInnerGameIndex === _this.innerGames.length - 1 &&
                    _this.innerGames[_this.currentInnerGameIndex].currentFrameIndex === currentInnerGame.frames.length - 1;
                if (!lastFrame) {
                    if (_this.currentInnerGameIndex == _this.innerGames.length - 1) {
                        _this.currentInnerGameIndex = 0;
                        currentInnerGame.currentFrameIndex++;
                    }
                    else {
                        _this.currentInnerGameIndex++;
                    }
                }
                currentInnerGame = _this.innerGames[_this.currentInnerGameIndex];
                if (state === false) {
                    $('.fadable').each(function () {
                        var fadableObject = $(this);
                        if (fadableObject.hasClass('section')) {
                            fadableObject.transition({ 'opacity': 1 });
                        }
                    });
                    if (currentInnerGame.name == 'sequence') {
                        $('.value-string').parent().css({ 'vertical-align': 'top' });
                    }
                    if (!currentInnerGame.settings.skipped) {
                        _site.sounds.wrong.play();
                    }
                    _site.playground.playScene.find('.section-selected').removeClass('section-selected');
                    _site.playground.playScene.find('.right-answer-section').addClass('right-answer-section-revealed').removeAttr('hidden');
                    $('.playground-body').addClass('unclickable');
                    $('.hidden-operand').removeClass('hidden-operand');
                    _site.playground.refreshFooter({
                        'state': 'showing results',
                        custom: {
                            proceedAction: function () {
                                if (lastFrame) {
                                    _this.nextLevel();
                                }
                                else {
                                    _this.play();
                                }
                            }
                        }
                    });
                }
                else {
                    value.html(_resources.answeredRight + '!').transition({ 'opacity': 1 }).flexVerticalCenter();
                    _site.playground.playScene.transition({ 'opacity': 0 }).addClass('unclickable');
                    _site.playground.footer.css('opacity', 0);
                    _site.sounds.right.play();
                    setTimeout(function () {
                        if (lastFrame) {
                            _this.nextLevel();
                        }
                        else {
                            _this.play();
                        }
                    }, 1200);
                }
            }
        };
        MainGame.prototype.nextLevel = function () { };
        return MainGame;
    })(Brainer.Game);
    Brainer.MainGame = MainGame;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.MainGame.js.map