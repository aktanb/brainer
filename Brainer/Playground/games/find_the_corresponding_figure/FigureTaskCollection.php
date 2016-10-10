<?php
include 'FigureTask.php';

class FigureTaskCollection extends TaskCollection {
    const GAMEFOLDER = 'games/find_the_corresponding_figure/';
    public $images = array();

    public function __construct($level) {
        $levelFolder = $level % 4;
        if ($levelFolder == 0) {
            $levelFolder = 4;
        }
        
        $filePath = self::GAMEFOLDER . 'img/' . $levelFolder;
        try {
            $dir = opendir($filePath);
            while ($file = readdir($dir)) {
                if (preg_match("/.png/", $file) || preg_match("/.jpg/", $file) || preg_match("/.gif/", $file)) {
                    $this->images[] = $file;
                }
            }
            shuffle($this->images);
            $this->images = array_slice($this->images, 0, 9);
            $i = 0;
            foreach ($this->images as $imageToFind) {
                if ($i > 4) {
                    break;
                }
                $task = new FigureTask($this->images, $filePath, $imageToFind, $i == 0, $level);
                array_push($this->result, $task->build());
                $i++;
            }
        } catch(Exception $e) {
            array_push($this->result, 'ОШИБКА: ' . $e);
        }
    }
}
?>