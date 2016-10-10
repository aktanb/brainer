var Brainer;
(function (Brainer) {
    var InnerGame = (function () {
        function InnerGame(parent, rawGameData) {
            this.parent = parent;
            this.currentFrameIndex = 0;
            this._sequenceReady = false; // Флаг, указывающий на то, что уже можно приступать к отгадыванию в игре про последовательность.
            this._backspaceSuppressed = false;
            var _this = this;
            _this.settings = JSON.parse(rawGameData.settings);
            _this.sessionId = UUID.generate();
            _this.answers = new Array();
            _this.frames = new Array();
            _this.frames = JSON.parse(rawGameData.frames);
            _this.thinkingPerframeTimes = new Array();
            _this.mod = rawGameData.mod;
            _this.object = $('<div />', {
                'id': this.settings.name,
                'class': 'game-container',
                'html': _this.frames[_this.currentFrameIndex]
            });
            _this.object.find('.active-section, .wannabe-active-section, .answer-screen').click(function () {
                _site.sounds.click.play();
            });
        }
        Object.defineProperty(InnerGame.prototype, "name", {
            get: function () {
                return this.settings.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InnerGame.prototype, "playScene", {
            get: function () {
                return _site.playground.playScene;
            },
            enumerable: true,
            configurable: true
        });
        InnerGame.prototype.initialize = function () {
            var _this = this, veryFirstFrame = _this.parent.currentInnerGameIndex === 0 && _this.currentFrameIndex === 0;
            _this._sequence = new Array();
            _site.playground.playScene.find('.active-section, .wannabe-active-section')
                .hover(function () {
                if (!$(this).hasClass('task-section')) {
                    $(this).addClass('active-section-hovered');
                }
            }, function () {
                if (!$(this).hasClass('task-section')) {
                    $(this).removeClass('active-section-hovered');
                }
            })
                .click(function () {
                var sectionClicked = $(this);
                if (_this.name !== 'sequence' && !(_this.name === 'say_my_name' && _this.playScene('type-b'))) {
                    if (sectionClicked.hasClass('section-selected')) {
                        sectionClicked.removeClass('section-selected');
                    }
                    else {
                        sectionClicked.addClass('section-selected');
                    }
                }
                // Игры, задача в которых заключается в том, чтобы нажать на один правильный ответ.
                if (_this.playScene.hasClass('one-click-answer')) {
                }
                else {
                    if (_this.name === "find_the_corresponding_figure") {
                        var rightAnswers = _this.playScene.find('.task-section'), selectedSections = _this.playScene.find('.section-selected');
                        if (rightAnswers.length === selectedSections.length) {
                            var matched = 0;
                            rightAnswers.each(function () {
                                var imageSource = $(this).find('img').attr('src');
                                selectedSections.each(function () {
                                    if ($(this).find('img').attr('src') === imageSource) {
                                        matched++;
                                        return false;
                                    }
                                });
                            });
                            _this.nextFrame(matched === rightAnswers.length);
                        }
                    }
                    if (_this.name === "say_my_name") {
                        if (_this.playScene.hasClass('type-a')) {
                        }
                        else if (_this.playScene.hasClass('type-b')) {
                            $('.letter-cell').first().removeClass('letter-cell').addClass('filled-letter-cell').append($(this).find('.operand') /*.html()*/);
                            var emptyLetterCells = $('.letter-cell');
                            if (emptyLetterCells.length == 0) {
                                var answer = '';
                                $('.filled-letter-cell').each(function () { answer += $.trim($(this).html()); });
                                var rightAnswer = $.trim($('.right-answer-section').find('.letters').html());
                            }
                        }
                        else if (_this.playScene.hasClass('letter-table')) {
                            if ($('.section-selected').length === 2) {
                                var targetLetter = sectionClicked.html(), sourceLetter = $('.source-letter').html();
                                $('.section-selected').html(targetLetter).removeClass('section-selected').removeClass('source-letter');
                                sectionClicked.html(sourceLetter);
                                var answer = $.trim($('.right-answer-section').find('.section').html()), word = '';
                                _this.playScene.find('.active-section').each(function () {
                                    word += $(this).html();
                                });
                                if (word === answer) {
                                }
                                console.log(word + ' ' + answer);
                            }
                            else if ($('.section-selected').length === 1) {
                                $('.section-selected').addClass('source-letter');
                            }
                            else {
                                $('.source-letter').removeClass('source-letter');
                            }
                        }
                    }
                    if (_this.name === "sequence" && _this._sequenceReady === true) {
                        if (!sectionClicked.hasClass('section-selected')) {
                            sectionClicked.addClass('section-selected');
                            _this._sequence.push(parseInt(sectionClicked.find('.hidden-operand').html()));
                        }
                        else if ($('.section-selected').length == 1) {
                            sectionClicked.removeClass('section-selected');
                            _this._sequence = [];
                        }
                        var activeSections = _this.playScene.find('.active-section'), selectedSections = _this.playScene.find('.section-selected');
                        if (activeSections.length === selectedSections.length) {
                            var max = -1, sequenceFailed = false;
                            _this._sequence.forEach(function (value) {
                                if (value > max) {
                                    max = value;
                                }
                                else {
                                    sequenceFailed = true;
                                }
                            });
                        }
                    }
                }
            });
            // В игре про фигуры отметить правильные ответы.
            if (_this.name === "find_the_corresponding_figure") {
                _this.playScene.find('.task-section').each(function () {
                    var taskSource = $(this).find('img').attr('src');
                    $('.active-section').each(function () {
                        var thisSource = $(this).find('img').attr('src');
                        if (taskSource === thisSource) {
                            $(this).addClass('right-answer-section');
                        }
                    });
                });
            }
            // В игре про написание очищать поле ввода.
            if (_this.name === "say_my_name") {
                var answerScreen = $('.answer-screen');
                if (answerScreen.length > 0) {
                    answerScreen.click(function () {
                        _this.removeLastCharacter();
                    });
                    if (_this._backspaceSuppressed === false) {
                        // Удалять последнюю введенную букву если нажат «Backspace».
                        document.onkeydown = Marginal.Utilities.UI.suppressBackspace;
                        document.onkeypress = Marginal.Utilities.UI.suppressBackspace;
                        $(document).keyup(function (event) {
                            if (event.keyCode === 8) {
                                _this.removeLastCharacter();
                            }
                        });
                        _this._backspaceSuppressed = true;
                    }
                }
            }
            // В игре про последовательность чисел добавить обратный отсчет.
            if (_this.name === "sequence") {
                setTimeout(function () {
                    var confusedButton = $('.confused-button');
                    confusedButton.prop('disabled', true);
                    setTimeout(function () {
                        var activeSections = _this.playScene.find('.wannabe-active-section');
                        activeSections.addClass('active-section').find('div').addClass('hidden-operand');
                        confusedButton.prop('disabled', false);
                    }, 2000);
                    var taskSectionContainer = $('.task-section-container'), bar = _this.playScene.find('.meter'), progress = _this.playScene.find('.progress');
                    function decrementProgress(progressValue) {
                        if (progressValue >= 0) {
                            progressValue -= 10;
                            bar.css('width', progressValue + '%');
                            setTimeout(function () { decrementProgress(progressValue); }, 200);
                        }
                        else {
                            _this._sequenceReady = true;
                        }
                    }
                    decrementProgress(100);
                }, veryFirstFrame ? 2500 : 0);
            }
            // Инициировать мод. Для самого первого кадра, мод инициируется с задержкой,
            // чтобы игра успела отобразиться.
            if (_this.name != "sequence") {
                setTimeout(function () { eval(_this.mod); }, veryFirstFrame ? 2500 : 0);
            }
            if (_this.name === 'blur') {
                var image = _this.playScene.find('img');
                image.addClass('blurred-30');
                _this.playScene.find('.deblur-button').click(function () {
                    image.deblur();
                });
            }
            // Выровнять секцию с заданием и знак «равно» по вертикали.
            _this.playScene.css('opacity', '0');
            setTimeout(function () {
                var objectsToCenterVertically = $('.task-section-container, .equals-sign, .playground-body');
                objectsToCenterVertically.flexVerticalCenter();
                _this.playScene.transition({ 'opacity': 1 });
                _site.playground.footer.transition({ 'opacity': 1 });
                //$('.playground-footer').transition({ 'opacity': 1 });
            }, 500);
        };
        InnerGame.prototype.nextFrame = function (answeredRight, skipped) {
            if (skipped === void 0) { skipped = false; }
            var _this = this;
        };
        InnerGame.prototype.removeLastCharacter = function () {
            $('.filled-letter-cell').last().empty().removeClass('filled-letter-cell').addClass('letter-cell');
        };
        return InnerGame;
    })();
    Brainer.InnerGame = InnerGame;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.InnerGame.js.map