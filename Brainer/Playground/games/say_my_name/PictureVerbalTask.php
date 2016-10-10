<?php

class PictureVerbalTask extends VerbalTask  {
    public $images = array();
    public $folderPath;
    public $taskImage;
    public $active;
    
    public function build() {
        $active =  $this->active ? 'active' : '';
        $type = '';
        switch($this->level) {
            case 1:
            case 2:
            case 3:
            case 4:
                $type = 'type-a';
                $taskSection = new PictureTaskSection(PictureTaskType::A, $this->folderPath . '/' . $this->taskImage, true);
                $variants = new PictureTaskVariants(PictureTaskType::A, $this->images, $this->folderPath . '/', $this->taskImage);
                break;
            
            default:
                $type = 'type-b';
                $taskSection = new PictureTaskSection(PictureTaskType::B, $this->folderPath . '/' . $this->taskImage, true);
                $variants = new PictureTaskVariants(PictureTaskType::B, $this->images, $this->folderPath . '/', $this->taskImage);
                break;
        }
        
        return "<div class='play-scene $type $active row'>
	                <div class=' small-2 columns task-section-container'>
                        " . $taskSection->build() . "
                    </div>
                        <div class='equals-sign small-1 columns'>
                            =
                        </div>
                        <div class='variant-sections-container small-9 columns'>
                            " . $variants->build() . "
                       </div>
                </div>";
    }
}
class PictureTaskSection {
    private $type;
    private $path;
    private $description;
    private $isTaskSection;
    private $isRightAnswer;
    public $letter = '';
    public function __construct($taskType, $imageFilePath, $isTaskSection, $isRightAnswer = false) {
        $this->type = $taskType;
        $this->isTaskSection = $isTaskSection;
        $this->isRightAnswer = $isRightAnswer;
        
        if ($imageFilePath) {
            $this->path = $imageFilePath; 
            $this->description = self::getImageDescription($this->path);
        }
    }
    public function build() {
        $currentTime = microtime(true);
        if ($this->isTaskSection) {
            switch($this->type) {
                case PictureTaskType::A:
                    return "<div class='section picture-section task-section rounded fadable text-task-action'>
		                        <div class='operand rounded' style='font-size: 1.7em'>
                                    $this->description $letterCells
		                        </div>
		                    </div>"; // Задачи типа «А» — слева слово, справа картинки.
                
                case PictureTaskType::B:
                    $letters = mb_str_split($this->description);
                    $letterCells = "<div>";
                    foreach($letters as $letter) {                        
                        $letterCells .= "<span class='letter-cell'></span>";
                    }
                    $letterCells .= "</div>";
                    $pictureSection = "<div class='section picture-section fadable'><img src='playground/" . $this->path . "?$currentTime' class='img-responsive' /></div>";
                    return "<div class='section task-section'>
                                <div>
                                    $pictureSection
		                            <div class='letters answer-screen' title='Нажмите, чтобы очистить.'>
                                        $letterCells
		                            </div>
                                </div>
                                <div class='right-answer-section' hidden>
                                    <div class='text-task-action'>
		                                <div class='letters'>
                                            $this->description
                                        </div>
                                    </div>
                                </div>
		                    </div>"; // Задачи типа «B» — слева картинка, справа буквы. Нужно из букв cоставить название изображенного на картинке.
            }
        } else {
            $rightAnswerSection = $this->isRightAnswer ? 'right-answer-section' : '';
            switch($this->type) {
                case PictureTaskType::A:
                    return "<div class='section picture-section active-section $rightAnswerSection'>
		                        <img src='playground/" . $this->path . "?$currentTime' class='img-responsive' desc='$this->description'/>
		                    </div>";
                            
                case PictureTaskType::B:
                    return "<div class='section picture-section active-section text-task-action'>
                                <div class='operand'>
		                            $this->letter
                                </div>
		                    </div>";
            }
        }
    }
    public static function getImageDescription($imagePath) {
        $imageDesritpionFileName = "playground/" . preg_replace("/\\.[^.\\s]{3,4}$/", "", $imagePath) . '.txt';
        $siteUrl = $_SESSION['site_url'];
        return file_get_contents("$siteUrl/$imageDesritpionFileName");
    }
}
class PictureTaskVariants {
    private $type;
    private $images = array();
    private $folderPath;
    private $taskImage;
    public function __construct($taskType, $images, $imagesFolderPath, $taskImage) {
        $this->type = $taskType;
        $this->images = $images;
        $this->folderPath = $imagesFolderPath;
        $this->taskImage = $taskImage;
    }
    public function build() {
        $result = "<div class='row'>";
        
        switch ($this->type) {
            case PictureTaskType::A:
                $shuffledImages = $this->images;
                shuffle($shuffledImages);
                $j = 0;
                foreach ($shuffledImages as $image)
                {
                    if ($j != 0 && $j % 3 == 0) {
                        $result .= "</div><div class='row'>";
                    }
                    $activeSection = new PictureTaskSection($this->type, $this->folderPath . $image, false, $this->taskImage == $image);
                    $result .= "<div class='small-4 columns'>" . $activeSection->build() . "</div>";
                    $j++;
                }
                break;
                
            case PictureTaskType::B:
                $alphabet = new Alphabet(Language::RUSSIAN);
                $description = PictureTaskSection::getImageDescription($this->folderPath . $this->taskImage);
                $descriptionLetters = mb_str_split($description);
                $descriptionLetters = array_unique($descriptionLetters);
                addRandomLetters($descriptionLetters, 8, $alphabet);
                shuffle($descriptionLetters);
                $j = 0;
                foreach ($descriptionLetters as $letter) {
                    if ($j != 0 && $j % 3 == 0) {
                        $result .= "</div><div class='row'>";
                    }
                    $activeSection = new PictureTaskSection($this->type, null, false, false);
                    $activeSection->letter = $letter;
                    $result .= "<div class='small-4 columns'>" . $activeSection->build() . "</div>";
                    $j++;
                }
                break;
        }

	    $result .= "</div>";
        return $result;
    }
}
class PictureTaskType
{
    const A = 0; # Слева слово, справа картинки;
    const B = 1; # Слева картинка с клетками для заполнения, справа — буквы;
}
?>