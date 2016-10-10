<?php
# Уравнение.
class EquationMathTask extends MathTask {
    private $equationResult;
    
    public function create() {
        SimpleMathTask::createSimpleMathTask($this);
        $this->equationResult = $this->rightAnswer;
        $this->rightAnswer = $this->b;
        $this->equalsSign = "";
    }
    
    public function build() {
        return $this->a . '&nbsp;&nbsp;&nbsp;&nbsp;' . MathAction::getActionSign($this->action) . '&nbsp;&nbsp;&nbsp;&nbsp;?&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;' . $this->equationResult;
    }
}
?>