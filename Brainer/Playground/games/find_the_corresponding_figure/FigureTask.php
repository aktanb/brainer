<?php

# Класс, описывающий свойства и методы одной задачи игры, направленной на развитие
# областей мозга, отвечающих за зрительно-пространственные операции. Суть игры
# заключается в том, чтобы найти изображенную фигуру среди предлагаемых вариантов.
# С увеличением уровня сложности игры, увеличивается количество фигур для поиска.
class FigureTask {
    # Массив названий файлов изображений фигур.
    private $images = array();
    
    # Путь к дериктории, хранящей файлы изображений фигур.
    private $folderPath;
    
    # Название файла изображения, которое является заданием в текущей задаче
    # (фигура, которую нужно найти).
    private $taskImage;
    
    # Флаг, указывающий на то, что эта задача будет текущей (первой), когда игра начнется.
    private $active;
    
    # Текущий уровень сложности.
    private $level;
    
    public function __construct($images, $imagesFolderPath, $imageToFindName, $active, $level) {
        $this->images = $images;
        $this->folderPath = $imagesFolderPath;
        $this->taskImage = $imageToFindName;
        $this->active = $active;
        $this->level = $level;
    }
    
    public function build() {
        $active = $this->active ? 'active' : '';
        $taskSection = $this->createTaskSectionLayout(new FigureTaskSection($this->folderPath .'/' . $this->taskImage, true));
        $mainFigureIndex = array_search($this->taskImage, $this->images);
        $additionalFigureSectionIndexes = array($mainFigureIndex);
        self::createRandomFigureIndexes($additionalFigureSectionIndexes, 8, floor($this->level / 8.1));
        array_shift($additionalFigureSectionIndexes);
        $i = 0;
        $additionalTaskSections = "";
        foreach ($additionalFigureSectionIndexes as $index) {
            if($i > 2) {
                break;
            }
            $additionalSection = new FigureTaskSection($this->folderPath . '/' . $this->images[$index], true);
            $additionalSection->isAdditional = true;
            $additionalTaskSections .= $this->createTaskSectionLayout($additionalSection);
            $i++;
        }
        $variants = new FigureTaskVariants($this->images, $this->folderPath . '/');
        $variantSections = $variants->build();
        
        return "
            <div class='play-scene $active'>
                <div class='row'>
                    <div class='task-section-container small-2 columns'>
                        $taskSection
                        $additionalTaskSections
                    </div>
                    <div class='equals-sign small-1 columns'>&nbsp;&nbsp;&nbsp;&nbsp;=</div>
                    <div class='variant-sections-container small-9 columns'>$variantSections</div>
                </div>
            </div>";
    }
    
    private function createTaskSectionLayout(&$section) {
        switch ($this->level) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 9:
            case 10:
            case 11:
            case 12:
                $section->isRotated = false;
                break;
                
           default:
                $section->isRotated = true;
                break;            
        }
        return $section->build();
    }
    private static function createRandomFigureIndexes(array &$result, $numberOfAllPossibleFigures, $numberOfFiguresToAdd) {
        if ($numberOfFiguresToAdd > 0) {
            while(in_array(($n = rand(0, $numberOfAllPossibleFigures)), $result));
            array_push($result, $n);
            self::createRandomFigureIndexes($result, $numberOfAllPossibleFigures, --$numberOfFiguresToAdd);
        }
    }
}
class FigureTaskSection {
    private $path;
    private $isTaskSection;
    public $isAdditional = false;
    public $isRotated = false;
    
    public function __construct($imageFilePath, $isTaskSection = false) {
        $this->path = $imageFilePath;  
        $this->isTaskSection = $isTaskSection;
    }
    public function build() {
        $rotation = '';
        if ($this->isRotated) {
            $angle = rand(1, 7);
            $rotation = "rotated-$angle";
        }
        
        $sectionClass = $this->isTaskSection ? "task-section $rotation" : 'active-section';
        $additionalSection = $this->isAdditional ? 'additional-section' : '';
        //$currentTime = microtime(true);
        return "<div class='section picture-section $sectionClass $additionalSection fadable rounded'>
                    <img src='playground/" . $this->path . "?$currentTime' />
                </div>";
    }
}
class FigureTaskVariants {
    private $images = array();
    private $folderPath;
    public function __construct($images, $imagesFolderPath) {
        $this->images = $images;
        $this->folderPath = $imagesFolderPath;
    }
    
    public function build() {
        $result = "<div class='row'>"; 
        $shuffledImages = $this->images;
        shuffle($shuffledImages);
        $j = 0;
        foreach ($shuffledImages as $image)
        {
            if ($j != 0 && $j % 3 == 0) {
                $result .= "</div><div class='row'>";
            }
            $activeSection = new FigureTaskSection($this->folderPath . $image);
            $result .= "<div class='small-4 columns'>" . $activeSection->build() . "</div>";
            $j++;
        }

        $result .= "</div>";
        return $result;
    }
}
?>