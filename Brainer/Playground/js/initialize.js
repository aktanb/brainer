var BACKSPACE_SUPPRESSED = false;

function initialize(gameName, modInitializer) {
    var PLAYGROUND = $('.playground'),
        SCENE = PLAYGROUND.find('.play-scene'),
        SEQUENCE = [], // Массив для хранения нажатых чисел в игре про последовательность.
        SEQUENCE_READY = false, // Флаг, указывающий на то, что уже можно приступать к отгадыванию в игре про последовательность.
        //VERY_FIRST_FRAME = CURRENT_GAME_INDEX == 0 && CURRENT_FRAME_INDEX == 0; // Флаг, указывающий на то, что текущий кадр — первый.
        VERY_FIRST_FRAME = false;

    PLAYGROUND.find('.active-section, .wannabe-active-section')
        .hover(function () {
            if (!$(this).hasClass('task-section')) {
                $(this).addClass('active-section-hovered');
            }
        }, function () {
            if (!$(this).hasClass('task-section')) {
                $(this).removeClass('active-section-hovered');
            }
        }).click(function () {
            var sectionClicked = $(this);
            if (gameName !== 'sequence' && !(gameName === 'say_my_name' && SCENE.hasClass('type-b'))) {
                if (sectionClicked.hasClass('section-selected')) {
                    sectionClicked.removeClass('section-selected');
                } else {
                    sectionClicked.addClass('section-selected');
                }
            }

            // Игры, задача в которых заключается в том, чтобы нажать на один правильный ответ.
            if (SCENE.hasClass('one-click-answer')) {
                PLAYGROUND.playground('nextFrame', sectionClicked.hasClass('right-answer-section'));
            } else {
                if (gameName === "find_the_corresponding_figure") {
                    var rightAnswers = SCENE.find('.task-section'),
                        selectedSections = SCENE.find('.section-selected');
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
                        PLAYGROUND.playground('nextFrame', matched === rightAnswers.length);
                    }
                }

                if (gameName === "say_my_name") {
                    if (SCENE.hasClass('type-a')) {
                        PLAYGROUND.playground('nextFrame',
                            $.trim(SCENE.find('.task-section').find('.operand').html()) === $.trim(sectionClicked.find('img').attr('desc')));
                    } else if (SCENE.hasClass('type-b')) {
                        $('.letter-cell').first().removeClass('letter-cell').addClass('filled-letter-cell').append($(this).find('.operand').html());
                        var emptyLetterCells = $('.letter-cell');
                        if (emptyLetterCells.length == 0) {
                            var answer = '';
                            $('.filled-letter-cell').each(function () { answer += $.trim($(this).html()); });
                            var rightAnswer = $.trim($('.right-answer-section').find('.letters').html());
                            PLAYGROUND.playground('nextFrame', answer == rightAnswer);
                        }
                    } else if (SCENE.hasClass('letter-table')) {
                        if ($('.section-selected').length === 2) {
                            var targetLetter = sectionClicked.html(), sourceLetter = $('.source-letter').html();
                            $('.section-selected').html(targetLetter).removeClass('section-selected').removeClass('source-letter');
                            sectionClicked.html(sourceLetter);
                            var answer = $.trim($('.right-answer-section').find('.section').html()),
                                word = '';
                            SCENE.find('.active-section').each(function () {
                                word += $(this).html();
                            });
                            if (word === answer) {
                                PLAYGROUND.playground('nextFrame', true);
                            }
                            console.log(word + ' ' + answer);
                        } else if ($('.section-selected').length === 1) {
                            $('.section-selected').addClass('source-letter');
                        } else {
                            $('.source-letter').removeClass('source-letter');
                        }
                    }
                }

                if (gameName === "sequence" && SEQUENCE_READY === true) {
                    if (!sectionClicked.hasClass('section-selected')) {
                        sectionClicked.addClass('section-selected');
                        SEQUENCE.push(parseInt(sectionClicked.find('.hidden-operand').html()));
                    } else if ($('.section-selected').length == 1) {
                        sectionClicked.removeClass('section-selected');
                        SEQUENCE = [];
                    }
                    var activeSections = SCENE.find('.active-section'),
                        selectedSections = SCENE.find('.section-selected');
                    if (activeSections.length === selectedSections.length) {
                        var max = -1,
                            sequenceFailed = false;
                        SEQUENCE.forEach(function (value) {
                            if (value > max) {
                                max = value;
                            } else {
                                sequenceFailed = true;
                            }
                        });
                        PLAYGROUND.playground('nextFrame', !sequenceFailed);
                    }
                }
            }
        });

    // В игре про фигуры отметить правильные ответы.
    if (gameName === "find_the_corresponding_figure") {
        SCENE.find('.task-section').each(function () {
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
    if (gameName === "say_my_name") {
        var answerScreen = $('.answer-screen');
        if (answerScreen.length > 0) {
            answerScreen.click(function () {
                removeLastCharacter();
            });
            if (BACKSPACE_SUPPRESSED === false) {
                // Удалять последнюю введенную букву если нажат «Backspace».
                document.onkeydown = suppressBackspace;
                document.onkeypress = suppressBackspace;
                $(document).keyup(function (e) {
                    if (e.keyCode === 8) {
                        removeLastCharacter();
                    }
                });
                BACKSPACE_SUPPRESSED = true;
            }
        }
    }

    // В игре про последовательность чисел добавить обратный отсчет.
    if (gameName === "sequence") {
        setTimeout(function () {
            var confusedButton = $('.confused-button');
            confusedButton.prop('disabled', true);
            setTimeout(function () {
                var activeSections = SCENE.find('.wannabe-active-section');
                activeSections.addClass('active-section').find('div').addClass('hidden-operand');
                confusedButton.prop('disabled', false);
            }, 2000);

            var taskSectionContainer = $('.task-section-container'), bar = SCENE.find('.meter'), progress = SCENE.find('.progress');
            function decrementProgress(progressValue) {
                if (progressValue >= 0) {
                    progressValue -= 10;
                    bar.css('width', progressValue + '%');
                    setTimeout(function () { decrementProgress(progressValue) }, 200);
                } else {
                    SEQUENCE_READY = true;
                }
            }
            decrementProgress(100);
        }, VERY_FIRST_FRAME ? 2500 : 0);
    }

    // Инициировать мод. Для самого первого кадра, мод инициируется с задержкой,
    // чтобы игра успела отобразиться.
    if (gameName != "sequence") {
        setTimeout(function () { eval(modInitializer) }, VERY_FIRST_FRAME ? 2500 : 0);
    }

    if (gameName === 'blur') {
        var image = SCENE.find('img');
        image.addClass('blurred-30');
        SCENE.find('.deblur-button').click(function () {
            image.deblur();
        });
    }

    // Выровнять секцию с заданием и знак «равно» по вертикали.
    SCENE.css('opacity', '0');
    setTimeout(function () {
        $('.task-section-container, .equals-sign, .playground-body').flexVerticalCenter();
        SCENE.transition({ 'opacity': 1 });
        $('.playground-footer').transition({ 'opacity': 1 });
    }, 500);
}
function removeLastCharacter() {
    $('.filled-letter-cell').last().empty().removeClass('filled-letter-cell').addClass('letter-cell');
}

function suppressBackspace(evt) {
    evt = evt || window.event;
    var target = evt.target || evt.srcElement;

    if (evt.keyCode == 8 && !/input|textarea/i.test(target.nodeName)) {
        return false;
    }
} // Вспомогательные функции для игры про написание.

(function ($) {
    $.fn.deblur = function () {
        switch (this.attr('class')) {
            case 'blurred-30':
                this.removeClass('blurred-30').addClass('blurred-20');
                break;

            case 'blurred-20':
                this.removeClass('blurred-20').addClass('blurred-15');
                break;

            case 'blurred-15':
                this.removeClass('blurred-15').addClass('blurred-10');
                break;

            case 'blurred-10':
                this.removeClass('blurred-10').addClass('blurred-5');
                break;

            case 'blurred-5':
                this.removeClass('blurred-5');
                break;
        }
        return this;
    };
})(jQuery); // Вспомогательные функции для игры «Блур».