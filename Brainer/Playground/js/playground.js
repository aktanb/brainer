var ROUNDS_PLAYED, CURRENT_FRAME_INDEX, CURRENT_GAME_INDEX, THINKING, THINKING_TIME, THINKING_PER_FRAME_TIMES, TRIAL, CERTAIN_AGE,
    // SOUNDS_FOLDER_PATH = 'http://localhost/brainer/playground/sounds/';
    SOUNDS_FOLDER_PATH = 'http://brainer.kz/playground/sounds/';

(function ($) {
    var methods = {
        init: function (options) {
            ROUNDS_PLAYED = 0; CURRENT_FRAME_INDEX = 0; CURRENT_GAME_INDEX = 0; THINKING = false; THINKING_TIME = 0.0;
            THINKING_PER_FRAME_TIMES = []; TRIAL = !_site.isAuthorized; CERTAIN_AGE = null;
            return this.each(function () {
                var settings = $.extend({ gameName: 'main', buttons: [{}] }, options), THIS = $(this),
                    nspace = THIS.attr('id'), data = (nspace !== undefined ? THIS.data(nspace) : null);
                THIS.addClass('playground');
                if (!data) {
                    askForAge(function () {
                        if (nspace === undefined) {
                            nspace = $.Guid.New();
                            THIS.attr({ 'id': nspace });
                            $('<div />', { 'class': 'answer-result', 'html': '<div class="value-string"></div>' }).appendTo(THIS);
                            $('<div />', { 'class': 'playground-body' }).appendTo(THIS);
                            $('<div />', {
                                'class': 'playground-footer',
                                'html': '<div class="row"><div class="small-6 columns" left></div><div class="small-6 columns" right></div></div>'
                            }).appendTo($('body'));

                            // Получает массив из json'ов игр, которые состоят
                            // из настроек игры (settings), массива кадров (frames) и мода (mod).
                            $.post('playground/load_game.php', {
                                'name': settings.gameName,
                                'age': CERTAIN_AGE
                            }, function (data) {
                                var games = JSON.parse(data), // Массив всех игр.
                                    gameSessionIds = [], // Массив идентификаторов игровых сессий.
                                    answers = []; // Массив всех ответов (правильных и неправильных)...

                                // ...(по одному счетчику для каждой игры).
                                for (var i = 0; i < games.length; i++) {
                                    gameSessionIds.push($.Guid.New());
                                    answers.push(new Array());
                                    THINKING_PER_FRAME_TIMES.push(new Array());
                                }

                                THIS.data(nspace, {
                                    gameSetName: settings.gameName, games: games,
                                    gameSessionIds: gameSessionIds, answers: answers,
                                    sound: loadSounds()
                                }).playground('play', true);

                                setTimeout(function () {
                                    Reveal.slide(1, 2, 0);
                                    $('.top-bar').slideUp();
                                    $('.playground-footer').fadeIn();
                                    $('.task-section-container, .equals-sign').flexVerticalCenter();
                                }, 500);
                                $('.page-screen-bottom-back-button').hide();
                            });
                        }
                    });
                }
            });
        },
        play: function () {
            return this.each(function () {
                var THIS = $(this),
                    nspace = THIS.attr('id'),
                    data = (nspace ? THIS.data(nspace) : null);

                if (data) {
                    var game = data.games[CURRENT_GAME_INDEX], gameSettings = JSON.parse(game.settings), SCENE = THIS.find('.playground-body');

                    var container = $('<div />', {
                        'id': gameSettings.name,
                        'class': 'game-container',
                    }).appendTo(THIS.find('.playground-body').empty());

                    refreshFooter({
                        state: 'playing',
                        custom: {
                            description: gameSettings.description
                        }
                    });

                    container
                        .append(JSON.parse(game.frames)[CURRENT_FRAME_INDEX])
                        .find('.active-section, .wannabe-active-section, .answer-screen').click(function () {
                            data.sound.click.play();
                        });

                    initialize(gameSettings.name, game.mod);
                    THIS.playground('results', { state: 'reset' }).playground('thinking', 'start');
                }
            });
        },
        nextFrame: function (answeredRight, skipped) {
            return this.each(function () {
                var THIS = $(this),
                    nspace = THIS.attr('id'),
                    data = (nspace ? THIS.data(nspace) : null);

                if (data) {
                    var game = data.games[CURRENT_GAME_INDEX],
                        frames = JSON.parse(game.frames);

                    THIS.playground('thinking', 'stop');
                    THINKING_PER_FRAME_TIMES[CURRENT_GAME_INDEX].push(THINKING_TIME);

                    var date = new Date(),
                        value = answeredRight ? 1 : 0;

                    data.answers[CURRENT_GAME_INDEX].push({
                        value: value,
                        time: ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2)
                    });
                    THIS.data(nspace, {
                        sound: data.sound,
                        games: data.games,
                        gameSessionIds: data.gameSessionIds,
                        answers: data.answers
                    }).playground('results', {
                        state: answeredRight,
                        skipped: skipped
                    });
                }
            });
        },
        nextLevel: function () {
            return this.each(function () {
                var THIS = $(this),
                    nspace = THIS.attr('id'),
                    data = (nspace ? THIS.data(nspace) : null);

                if (data) {
                    var games = data.games;

                    // Таймаут нужен для того, чтобы успел отобразиться 
                    // результат последнего хода.
                    setTimeout(function () {
                        THIS.playground('thinking', 'stop');
                        var screen = $('.answer-result').find('.value-string');

                        if (TRIAL) {
                            screen.empty();
                            $('.playground-body').remove();
                            $('<div />', {
                                'html': 'Чтобы результаты отображались, пожалуйста, зарегистрируйтесь.',
                                'style': 'padding-bottom: 20px; margin-left: -5px'
                            }).appendTo(screen);
                            $('<button />', {
                                'html': 'Зарегистрироваться'
                            }).click(function () {
                                THIS.playground('destroy');
                                setCurrentPageName('scores');
                            }).appendTo(screen);
                        } else {
                            THIS.playground('loading', true);
                            ROUNDS_PLAYED++;
                            var results = [];
                            for (var i = 0; i < games.length; i++) {
                                results.push(JSON.stringify({
                                    name: JSON.parse(games[i].settings).name,
                                    answers: data.answers[i],
                                    averageThinkingTime: getAverageThinkingTime(i),
                                    bonusLevel: games[i].mod.length > 0
                                }));
                            }

                            $.post('playground/load_game.php',
                                {
                                    results: results,
                                    sessionIds: data.gameSessionIds
                                },
                                function (nextData) {
                                    var newGames = JSON.parse(nextData),
                                        answers = [];

                                    for (var i = 0; i <= newGames.length; i++) {
                                        answers.push(new Array());
                                    }

                                    THIS.data(nspace, {
                                        sound: data.sound, games: newGames, gameSessionIds: data.gameSessionIds, answers: answers
                                    });

                                    CURRENT_FRAME_INDEX = 0;
                                    CURRENT_GAME_INDEX = 0;

                                    $('<div />', {
                                        'id': 'scores'
                                    }).appendTo(screen.empty());

                                    var j = 0, graphs = [];
                                    newGames.forEach(function (game) {
                                        var name = JSON.parse(game.settings).title,
                                            level = parseInt(game.level),
                                            score = [];
                                        score.push(name, level);
                                        graphs.push(score);
                                        j++;
                                    });

                                    setTimeout(function () {
                                        $.jqplot('scores', [graphs], {
                                            height: 600,
                                            title: {
                                                text: PLAYGROUND_STRINGS.currentScrores,
                                                textColor: '#fff'
                                            },
                                            animate: !$.jqplot.use_excanvas,
                                            series: [{
                                                renderer: $.jqplot.BarRenderer,
                                                pointLabels: {
                                                    show: true
                                                },
                                                rendererOptions: {
                                                    varyBarColor: true
                                                }
                                            }],
                                            axesDefaults: {
                                                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                                                tickOptions: {
                                                    angle: -25,
                                                    fontSize: '14pt',
                                                    textColor: '#fff'
                                                },
                                                labelOptions: {
                                                    textColor: '#fff'
                                                }
                                            },
                                            axes: {
                                                xaxis: {
                                                    renderer: $.jqplot.CategoryAxisRenderer
                                                },
                                                yaxis: {
                                                    label: PLAYGROUND_STRINGS.level,
                                                    min: 0,
                                                    max: 100,
                                                    tickInterval: 10
                                                }
                                            },
                                            highlighter: {
                                                show: true,
                                                showMarker: false,
                                                tooltipAxes: 'xy',
                                                yvalues: 4,
                                                formatString: '%s'
                                            }
                                        });
                                        screen.transition({ 'opacity': 1 });
                                        $('.playground-footer').css('opacity', 1);
                                        screen.flexVerticalCenter();
                                    }, 300);

                                    $('.playground-body').css({ 'opacity': 0 }).addClass('unclickable');
                                    THIS.playground('loading', false);
                                    data.sound.levelUp.play();
                                    refreshFooter({
                                        state: 'showing results'
                                    });
                                });
                        }
                    }, 0);
                }
            });
        },
        results: function (options) {
            var settings = $.extend({ state: '', skipped: false }, options);
            return this.each(function () {
                var THIS = $(this), nspace = THIS.attr('id'), data = (nspace ? THIS.data(nspace) : null),
                    scene = $('.play-scene'), value = $('.answer-result').find('.value-string');
                if (data) {
                    if (settings.state === 'reset') {
                        setTimeout(function () {
                            value.html('').transition({ 'opacity': 0 });
                            $('.playground-body').transition({ 'opacity': 1 }).removeClass('unclickable').flexVerticalCenter();;
                        }, 500);
                    } else {
                        var lastFrame = CURRENT_GAME_INDEX == data.games.length - 1 && CURRENT_FRAME_INDEX == JSON.parse(data.games[CURRENT_GAME_INDEX].frames).length - 1;
                        if (!lastFrame)
                            if (CURRENT_GAME_INDEX == data.games.length - 1) { CURRENT_GAME_INDEX = 0; CURRENT_FRAME_INDEX++; } else { CURRENT_GAME_INDEX++; }
                        if (settings.state === false) { // Если ответ неправильный:
                            var gameSettings = JSON.parse(data.games[CURRENT_GAME_INDEX].settings);
                            $('.fadable').each(function () {
                                if ($(this).hasClass('section')) {
                                    $(this).transition({ 'opacity': 1 });
                                }
                            });
                            if (gameSettings.name == 'sequence') { $('.value-string').parent().css('vertical-align', 'top'); }
                            if (!settings.skipped) { data.sound.wrong.play(); }
                            scene.find('.section-selected').removeClass('section-selected');
                            scene.find('.right-answer-section').addClass('right-answer-section-revealed').removeAttr('hidden');
                            $('.playground-body').addClass('unclickable');
                            $('.hidden-operand').removeClass('hidden-operand');
                            refreshFooter({
                                'state': 'showing results',
                                custom: { proceedAction: function () { if (lastFrame) { THIS.playground('nextLevel'); } else { THIS.playground('play'); } } }
                            });
                        } else { // Если ответ правильный:
                            value.html(PLAYGROUND_STRINGS.answeredRight + '!').transition({ 'opacity': 1 }).flexVerticalCenter();
                            $('.playground-body').transition({ 'opacity': 0 }).addClass('unclickable');
                            $('.playground-footer').css('opacity', 0);
                            data.sound.right.play();
                            setTimeout(function () { if (lastFrame) { THIS.playground('nextLevel'); } else { THIS.playground('play'); } }, 1200);
                        }
                    }
                }
            });
        },
        thinking: function (state) {
            return this.each(function () {
                var THIS = $(this);
                if (state != undefined) {
                    if (state === 'start' || state === 'resume') {
                        THINKING = true;
                        if (state === 'start') {
                            THINKING_TIME = 0.0;
                        }
                        THIS.playground('thinking');
                    }
                    if (state === 'stop') {
                        THINKING = false;
                    }
                } else if (THINKING) {
                    setTimeout(function () {
                        THINKING_TIME += 0.1;
                        THIS.playground('thinking');
                    }, 100);
                }
            });
        },
        loading: function (state) {
            return this.each(function () {
                var THIS = $(this),
                    nspace = THIS.attr('id'),
                    data = (nspace ? THIS.data(nspace) : null);

                if (state === false) {
                    Reveal.slide(1, 2, 0);
                } else {
                    Reveal.slide(1, 1, 0);
                }
            });
        },
        destroy: function () {
            return this.each(function () {
                var THIS = $(this), nspace = THIS.attr('id'), data = (nspace ? THIS.data(nspace) : null);
                THIS.playground('thinking', 'stop').removeClass('playground').removeAttr('id').empty();
                $('.page-screen-bottom-back-button').show();
                $('.playground-footer').remove();
                Reveal.slide(1, 0, 0);
                $('.top-bar').slideDown();
                if (data) { delete (data); }
            });
        }
    }

    $.fn.playground = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.playground');
        }
    };

    // Вспомогательные методы.
    function getAverageThinkingTime(gameIndex) {
        var times = THINKING_PER_FRAME_TIMES[gameIndex],
            sum = 0;
        for (var i = 0; i < times.length; i++) {
            sum += times[i];
        }
        return (sum / times.length).toFixed(1);
    }
    function suggestToInterrupt() {
        $('.playground').playground('pause');
        var dlg = $('<div />', {
            'class': 'playground-message'
        }).bootstrapConfirmDialog({
            message: 'Вы не устали играть?',
            buttons: [{
                caption: 'Да, я хочу прерваться',
                cssClass: 'btn-primary',
                action: function () {
                    $('.playground').modal('hide');
                    setCurrentPageName('2');
                }
            }, {
                caption: 'Нет, продолжить играть',
                cssClass: 'btn',
                action: function () {
                    WANTS_TO_PROCEED = true;
                    $('.playground').playground('pause', 'resume');
                }
            }]
        });
        dlg.appendTo($('body'));
    }
    function askForAge(callback) {
        if (TRIAL) {
            var dlg = $('.ask-for-age-dialog');
            dlg.foundation('reveal', 'open').find('.ok-button').off().click(function () {
                CERTAIN_AGE = $('.playground-age-selector').val();
                callback();
                dlg.foundation('reveal', 'close');
            });
            dlg.find('.close-reveal-modal').off().click(function () {
                $('.playground').playground('destroy');
            });
        } else {
            callback();
        }
    }
    function loadSounds() {
        var click = document.createElement('audio'),
            right = document.createElement('audio'),
            wrong = document.createElement('audio'),
            levelUp = document.createElement('audio');
        click.setAttribute('src', SOUNDS_FOLDER_PATH + 'click.mp3');
        click.load();
        right.setAttribute('src', SOUNDS_FOLDER_PATH + 'right.mp3');
        right.load();
        wrong.setAttribute('src', SOUNDS_FOLDER_PATH + 'wrong.mp3');
        wrong.load();
        levelUp.setAttribute('src', SOUNDS_FOLDER_PATH + 'levelup.mp3');
        levelUp.load();
        $.get();
        return { click: click, right: right, wrong: wrong, levelUp: levelUp }
    }
    function refreshFooter(options) {
        var settings = $.extend({ state: '', custom: {} }, options), footer = $('.playground-footer');
        if (footer) {
            var left = footer.find('.columns[left]'),
                right = footer.find('.columns[right]');
            left.empty();
            right.empty();
            if (settings.state.length > 0) {
                $('<button />', {
                    'class': 'left',
                    'html': PLAYGROUND_STRINGS.stopPlaying
                }).appendTo(left).click(function () {
                    footer.fadeOut();
                    $('.playground').playground('destroy');
                });
                if (settings.state === 'playing') {
                    $('<button />', {
                        'class': 'confused-button right',
                        'html': PLAYGROUND_STRINGS.iDontKnow
                    }).appendTo(right).click(function () {
                        $('.playground').playground('nextFrame', false, true);
                    });
                } else if (settings.state === 'showing results') {
                    $('<button />', {
                        'class': 'right',
                        'html': PLAYGROUND_STRINGS.continue
                    }).appendTo(right).click(function () {
                        if (settings.custom.proceedAction != undefined) {
                            settings.custom.proceedAction();
                        } else {
                            $('.playground').playground('play');
                        }
                    });
                }
            }
        }
    }
})(jQuery);