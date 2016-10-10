<?php
class BlurTask {
    public $variants;
    public $image;
    public $rightAnswer;
    
    public function __construct($image, $variants) {
        $this->image = $image;
        $this->rightAnswer = util::readImageDescriptionFile($this->image);
        $this->variants = new BlurTaskVariants($variants, $this->rightAnswer);
    }
    
    public function __toString() {
        return "<div class='row'>
                    <div class='small-7 columns'>
                        <img style='max-width: 1000px; max-height: 1000px' src='playground/$this->image'>
                    </div>
                    <div class='small-5 columns'>
                        $this->variants
                    </div>
                </div>";
    }
}

class BlurTaskVariants {
    public $values = array();
    public $rightAnswer;
    
    public function __construct($rawData, $rightAnswer) {
        $this->values = $rawData;
        array_push($this->values, $rightAnswer);
        $this->rightAnswer = $rightAnswer;
    }
    
    public function __toString() {
        $i = 0;
        $result = "<div class='row'>";
        foreach ($this->values as $variant) {
            if ($i != 0 && $i % 3 == 0) {
                $result .= "</div><div class='row'>";
            }
            $result .= "<div class='small-4 columns section active-section'>$variant</div>";
            $i++;
        }
        return $result;
    }
}
?>