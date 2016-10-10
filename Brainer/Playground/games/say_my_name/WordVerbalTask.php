<?php

class WordVerbalTask extends VerbalTask  {
    public $category;
    public $taskWord;
    public $letters = array();

    public function build() {
        $this->letters = mb_str_split($this->taskWord);
        $this->shuffleLetters();
        $marginLeft = (count($this->letters) - 6) * 60;
        foreach($this->letters as $letter) {
            $taskSection .= "<div class='section active-section'>$letter</div>";
        }        
        return "
            
            <div class='play-scene letter-table'>
                <div class='word-category'>$this->category:</div>
                <div class='word-container' style='margin-left: -" . $marginLeft . "px'>$taskSection</div>
                <div class='right-answer-section' style='background: none; margin-top: 100px' hidden>
                    <div class='section'>
                        $this->taskWord
                    </div>
                </div>
            </div>";
    }
    
    private function shuffleLetters() {
        shuffle($this->letters);
        if (implode($this->letters) == $this->taskWord) {
            $this->shuffleLetters();
        }
    }
}
?>