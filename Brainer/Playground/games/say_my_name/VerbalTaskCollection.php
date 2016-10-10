<?php
include 'VerbalTask.php';
include 'PictureVerbalTask.php';
include 'TextVerbalTask.php';
include 'WordVerbalTask.php';

class VerbalTaskCollection extends TaskCollection {
    const GAMEFOLDER = 'games/say_my_name/';
    public $files = array();

    public function __construct($level) {
        if ($level < 9) { # Вербальные задачи, использующие картинки.
            $levelFolder = $level % 4;
            if ($levelFolder == 0) {
                $levelFolder = 4;
            }
            $languageFolder = $_SESSION["language"] == 0 ? "ru" : "kz";
            $filePath = self::GAMEFOLDER . "img/$languageFolder/$levelFolder";
            $this->files = util::getFiles($filePath, 'png');
            shuffle($this->files);
            $this->files = array_slice($this->files, 0, 9);
            $i = 0;
            foreach ($this->files as $imageToFind) {
                if ($i > 4) {
                    break;
                }
                $task = new PictureVerbalTask($level);
                $task->images = $this->files;
                $task->folderPath = $filePath;
                $task->taskImage = $imageToFind;
                $task->active = $i == 0;

                array_push($this->result, $task->build());
                $i++;
            }
        } else if ($level == 9) { # Вербальные задачи, использующие только текст.
            $pairs = array(
                array("бассейн", "плавать"),
                array("хлеб", "кушать"),
                array("тротуар", "ходить"),
                array("карандаш", "рисовать"),
                array("лимонад", "пить"),
                array("урок", "учить"),
                array("шутка", "смеяться"));
            
            $i = 0;
            foreach($pairs as $pair) {
                if($i > 4) {
                    break;
                }
                $task = new TextVerbalTask($level);
                $task->taskWord = $pair[0];
                $task->variants = $pairs;
                array_push($this->result, $task->build());
                $i++;
            }
        } else {
            if ($level > 20) {
                $level = 20;
            }
            $languageFolder = $_SESSION["language"] == 0 ? "ru" : "kz";
            $filePath = self::GAMEFOLDER . "words/$languageFolder/" . ($level - 9) . ".txt";
            $siteUrl = $_SESSION['site_url'];
            $content = file_get_contents("$siteUrl/playground/$filePath");
            $data = explode("/", $content);
            $category = $data[0];
            $words = explode(" ", $data[1]);
            shuffle($words);
            $words = array_slice($words, 0, 5);
            foreach ($words as $word) {
                $task = new WordVerbalTask($level);
                $task->category = $category;
                $task->taskWord = $word;
                array_push($this->result, $task->build());
            }
        }
    }
}
?>