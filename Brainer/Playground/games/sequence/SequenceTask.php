<?php
class SequenceTask {
    public $elements = array();
    private $level;
    
    public function __construct($level) {
        $this->level = $level;
        $this->fillElements($level + 2);
    }
    
    private function fillElements($numberOfElementsToFillWith) {
        if ($numberOfElementsToFillWith > 0) {
            $element = rand(1, 10);
            if (in_array($element, $this->elements)) {
                $this->fillElements($numberOfElementsToFillWith);
            } else {
                array_push($this->elements, $element);
                $this->fillElements(--$numberOfElementsToFillWith);
            }
        } else {
            $additionalEmptyElementsNumber = 9 - count($this->elements);
            while($additionalEmptyElementsNumber > 0) {
                array_push($this->elements, -1);
                $additionalEmptyElementsNumber--;
            }
            shuffle($this->elements);
        }
    }
}
?>