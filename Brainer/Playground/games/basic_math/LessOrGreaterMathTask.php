<?php
# Задание, в котором в выражение нужно подставить знаки «больше», «меньше» или «равно».
class LessOrGreaterMathTask extends MathTask {
    public function create() {
        if($this->level < 6) {
            $ulimit = $this->level * 2;
        } else {
            $ulimit = $this->level * 10;
        }
        try {
            $this->a = rand(1, $this->level * 2);
            $this->b = rand(1, $this->level * 2);
        } catch (Exception $e) {
            log::error($e->getMessage());
        }
    }
    
    public function build() {
        return "<div class='row'>
                    <div class='small-5 columns operand'>
                        $this->a
                    </div>
                    <div class='operand small-2 columns'>
                        ?
                    </div>
                    <div class='small-5 columns operand'>
                        $this->b
                    </div>
                </div>";
    }
}
?>