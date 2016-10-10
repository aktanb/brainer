<?php
include 'BlurTask.php';

class BlurTaskCollection extends TaskCollection {
    const GAMEFOLDER = 'games/blur/';
    public $images = array();
    public $variants = array();
    
    public function __construct($level) {
        $tasks = array();
        $languageFolder = $_SESSION["language"] == 0 ? "ru" : "kz";
        $imageFolder = self::GAMEFOLDER . "img/$languageFolder";
        $allFiles = util::getFiles($imageFolder, 'png');
        shuffle($allFiles);
        $files = array_slice($allFiles, 0, 5);
        foreach ($files as $imageToRecognize) {
            array_push($tasks, new BlurTask("$imageFolder/$imageToRecognize", $this->fillVariants($allFiles, $imageFolder, $imageToRecognize)));
        }
        foreach ($tasks as $task) {
            $frame = "<div class='play-scene'>
                        <div class='row'>
                            <div class='small-12 columns'>
                                $task
                            </div>
                        </div>
                        <div class='row'>
                            <div class='small-12 columns'>
                                <button class='deblur-button'>Дальше</button>
                            </div>
                        </div>
                      </div>";
        }
        array_push($this->result, $frame);
    }
    
    private function fillVariants($fileNames, $filesFolder, $rightAnswerImage) {
        $variants = array();
        $rightAnswer = util::readImageDescriptionFile("$filesFolder/$rightAnswerImage");
        $variantsCount = 8;
        $i = 0;
        while($variantsCount > 0) {
            $currentVariantImage = $fileNames[$i];
            $variant = util::readImageDescriptionFile("$filesFolder/$currentVariantImage");
            if ($variant != $rightAnswer) {
                array_push($variants, $variant);
                $variantsCount--;
            }
            $i++;
        }
        return $variants;
    }
}
?>