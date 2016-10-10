<?php
include 'MathTask.php';
include 'SimpleMathTask.php';
include 'SequentialMathTask.php';
include 'LessOrGreaterMathTask.php';
include 'EquationMathTask.php';

class MathTaskCollection extends TaskCollection {
    private $framesCount = 5;
    
    public function __construct($level) {
        # Сначала генерируем математические задачи.
        $counting = $this->framesCount;
        while ($counting) {
            if ($level < 4) {
                $type = MathTaskType::A;
            } else if ($level < 10) {
                if ($level == 4) {
                    $type = MathTaskType::C;
                } else if ($level > 4 && $level < 7) {
                    $type = $counting % 2 == 0 ? MathTaskType::A : MathTaskType::C;
                } else {
                    $type = MathTaskType::A;
                }
            } else if ($level == 10) {
                $type = MathTaskType::B;
            } else if ($level == 11) {
                $type = MathTaskType::D;
            } else {
                $type = rand(MathTaskType::A, MathTaskType::D);
            }
            switch($type) {
                case MathTaskType::A: 
                    $task = new SimpleMathTask($level);
                    break;
                   
                case MathTaskType::B:
                    $task = new EquationMathTask($level);
                    break;
                    
                case MathTaskType::C:
                    $task = new LessOrGreaterMathTask($level);
                    break;
                    
                case MathTaskType::D:
                    $task = new SequentialMathTask($level);
                    break;
            }
            if ($type == MathTaskType::C) {
                $taskSection = $task->build();
                $lessButton = "<div class='section active-section operand small-4 columns" . ($task->a < $task->b ? ' right-answer-section' : '') . "'><</div>";
                $equalButton = "<div class='section active-section operand small-4 columns" . ($task->a == $task->b ? ' right-answer-section' : '') . "'>=</div>";
                $greaterButton = "<div class='section active-section operand small-4 columns" . ($task->a > $task->b ? ' right-answer-section' : '') . "'>></div>";
                $frame = "<div class='play-scene one-click-answer'>
                                <div class='row'>
                                    <div class='small-3 columns'>&nbsp;</div>
                                    <div class='small-6 columns'>    
                                        <div>$taskSection</div>
                                        <div class='row'>
                                            $lessButton
                                            $equalButton
                                            $greaterButton
                                        </div>
                                    </div>
                                    <div class='small-3 columns'>&nbsp;</div>
                                </div>
                            </div>";
            } else {
                $variantSections = self::buildVariants($task);
                $frame = "
		            <div class='play-scene one-click-answer'>
	                    <div class='row'>
	                        <div class='task-section-container small-4 columns'>
		                        <div class='section task-section operand fadable'>
                                    " . $task->build() . "
		                        </div> 
	                        </div>
                            <div class='equals-sign small-1 columns'>
                                $task->equalsSign
                            </div>
	                        <div class='small-7 columns'>
                                $variantSections
                            </div>
                        </div>
                    </div>";
            }
            array_push($this->result, $frame);
            $counting--;
        }
    }
    
    private static function buildVariants($task) {
        $j = 0;
        $variants = $task->variants;
        $variantSections = "<div class='row variant-sections-container'>";
        foreach ($variants as $variant)
        {
            $theRightAnswer = '';
            if($variant == $task->rightAnswer) {
                $theRightAnswer = 'right-answer-section';
            }
            # Перенос строки.
            if ($j != 0 && $j % 3 == 0) {
                $variantSections .= "</div><div class='row'>";
            }
            $variantSections .= 
                "<div class='section active-section $theRightAnswer operand small-4 columns'>
                    " . $variant . "
                </div>";
            $j++;
        }
        return $variantSections . "</div>";
    }
}
?>