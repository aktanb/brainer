<?php
include 'TaskCollection.php';
include 'games/find_the_corresponding_figure/FigureTaskCollection.php';
include 'games/basic_math/MathTaskCollection.php';
include 'games/say_my_name/VerbalTaskCollection.php';
include 'games/sequence/SequenceTaskCollection.php';
include 'games/blur/BlurTaskCollection.php';
include 'games/sections/SectionsTaskCollection.php';

class Game {
    private $game;
    public $level = 1;
    public $modType = ModType::NONE;
    
    public function __construct($name, $certainLevel) {
        $this->game = db_game::getGame($name);
        
        if ($certainLevel == null) {
            # Узнать на каком уровне остановился текущий пользователь
            # (либо загружать конкретный уровень, если он указан в
            # параметре $certainLevel).
            if (isset($_SESSION['user_id'])) {
                $currentLevel = 1;
                $levelRecord = db_game::getLevel($_SESSION['user_id'], $this->game->id);
                if ($levelRecord) {
                    $currentLevel = intval($levelRecord->value);
                    # Каждый четвертый уровень — уровень с исчезновением задания.
                    if ($currentLevel % 4 == 0 && !db_game::bonusBeenPlayed($levelRecord)) {
                        $currentLevel -= 1;
                        $this->modType = ModType::FADING;
                    }
                }
                $this->level = $currentLevel;
            }
        } else {
            $this->level = $certainLevel;
        }
    }
    
    public function load() {
        if ($this->game) {
            # Путь к папке игры.
            $gameFolder = $_SESSION['site_url'] . "/playground/games/" . $this->game->name;
            
            # Файл настроек игры.
            $settings = $gameFolder . '/' . rawurlencode('settings') . '.php';
            
            # Задачи игры.
            $tasks;
            switch($this->game->name) {
                # Зрительно-пространственные
                case "find_the_corresponding_figure":
                    $tasks = new FigureTaskCollection($this->level);
                    break;
                   
                # Математические
                case "basic_math":
                    $tasks = new MathTaskCollection($this->level);
                    break;
                    
                # Вербальные
                case "say_my_name":
                    $tasks = new VerbalTaskCollection($this->level);
                    break;
                    
                # На память
                case "sequence":
                    $tasks = new SequenceTaskCollection($this->level);
                    break;
                    
                # Блур
                case "blur":
                    $tasks = new BlurTaskCollection($this->level);
                    break;
                    
                # Секции
                case "sections":
                    $tasks = new SectionsTaskCollection($this->level);
                    break;
            }
            return array("settings" => file_get_contents($settings),
                "frames" => $tasks->getFrames(),
                "level" => $this->level,
                "mod" => ModType::getModAction($this->modType));
        }
    }
}

class ModType {
    const NONE = 0;
    const FADING = 1;
    
    public static function getModAction($modType) {
        switch($modType) {
            case self::NONE:
                return '';
            case self::FADING: 
                return "var taskSectionContainer = $('.task-section-container'),
                            bar = $('<div />', {
                                'class': 'meter',
                                'style': '100%'
                            }),
                            progress = $('<div />', {
                                'class': 'progress progress-striped progress-danger fadable'
                            }).append(bar).appendTo(taskSectionContainer);
                            
                        decrementProgress(100);
                        function decrementProgress(progressValue) {
                            if (progressValue >= 10) {
                                progressValue -= 10;
                                bar.css('width', progressValue + '%');
                                setTimeout(function () { decrementProgress(progressValue) }, 200);
                            } else {
                                taskSectionContainer.find('.fadable').each(function () {
                                    $(this).css('opacity', '0');
                                });
                            }
                        }";
        }
    }
}
?>