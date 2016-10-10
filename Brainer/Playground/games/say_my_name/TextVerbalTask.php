<?php

class TextVerbalTask extends VerbalTask  {
    public $taskWord;
    public $variants = array();

    public function build() {
        $taskSection = new TextVerbalSection($this->taskWord);
        $taskSection->additionalClasses = "task-section fadable";
        $variants = new TextVerbalTaskVariants($this->variants);
        $variants->rightAnswer = $this->taskWord;
        return "
            <div class='play-scene padding-top one-click-answer row'>
	            <div class='task-section-container small-2 columns'>"
                        . $taskSection->build() .
                "</div>
                <div class='equals-sign small-1 columns'>
                    =
                </div>
                <div class='variant-sections-container small-9 columns'>"
                    . $variants->build() .
                "</div>
            </div>";
    }
    
}

class TextVerbalSection {
    public $value;
    public $additionalClasses;

    public function __construct($value) {
        $this->value = $value;
    }

    public function build() {
        return "<div class='section rounded $this->additionalClasses text-task-action'>
		            <div class='operand'>
                        $this->value
		            </div>
		        </div>";
        }
}

class TextVerbalTaskVariants {
    public $values = array();
    public $rightAnswer;
    
    public function __construct($values) {
        $this->values = $values;
        shuffle($this->values);
    }
    
    public function build() {
        $i = 0;
        $result = "<div class='row'>";
        foreach($this->values as $value) {
            if ($i != 0 && $i % 3 == 0) {
                $result .= "</div><div class='row'>";
            }
            $section = new TextVerbalSection($value[1]);
            $section->additionalClasses = "active-section";
            if ($value[0] == $this->rightAnswer) {
                $section->additionalClasses .= " right-answer-section";
            }            
            $centered = $i == 6 ? 'small-centered' : '';
            $result .= "<div class='small-4 $centered columns'>" . $section->build() . "</div>";
            $i++;
        }
        return $result . "</div>";
    }
}

?>