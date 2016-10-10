<?php
# Задание, использующее определяемую скобками
# последовательность арифметических действий.
class SequentialMathTask extends MathTask {
    private $brackets;
    
    public function create() {
        $complexOperand = new SimpleMathTask($this->level < 16 ? 2 : 3);
        $this->action = rand(0, 2);
        $this->brackets = rand(0, 1);
        $this->a = $complexOperand;
        switch($this->action) {
            case MathAction::ADDITION:
                $this->b = rand($this->level, $this->level * 3);
                $this->rightAnswer = $this->a->rightAnswer + $this->b;
                break;
                    
            case MathAction::SUBTRACTION:
                $this->b = rand(0, $this->a->rightAnswer);
                $this->rightAnswer = $this->a->rightAnswer - $this->b;
                break;
                    
            case MathAction::MULTIPLICATION:
                $this->b = rand($this->level - 10, $this->level);
                $this->rightAnswer = $this->a->rightAnswer * $this->b;
                break;
        }
    }
    
    public function build() {
        return '(' . $this->a->build() . ')&nbsp;&nbsp;&nbsp;&nbsp;' . MathAction::getActionSign($this->action) . '&nbsp;&nbsp;&nbsp;&nbsp;' . $this->b . '&nbsp;&nbsp;&nbsp;&nbsp;';
    }
}
?>