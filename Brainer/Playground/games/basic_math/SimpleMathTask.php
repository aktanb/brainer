<?php
/**
 * Класс для «простых» математических заданий.
 * В «простых» заданиях используются только простые арифметические действия.
 *
 * @version 1.0
 * @author ab
 */
class SimpleMathTask extends MathTask {
    public function create() {
        self::createSimpleMathTask($this);
    }
    
    public function build() {
        return $this->a . '&nbsp;&nbsp;&nbsp;&nbsp;' . MathAction::getActionSign($this->action) . '&nbsp;&nbsp;&nbsp;&nbsp;' . $this->b;
    }
    
    public static function createSimpleMathTask($task) {
        # Сначала только сложение и вычитание.
        if ($task->level < 7) {
            $task->action = rand(MathAction::ADDITION, MathAction::SUBTRACTION);
        } else {
            $task->action = rand(MathAction::MULTIPLICATION, MathAction::DIVISION);
        }
        
        # Наименьшее возможное значение операнда.
        $llimit = 1;
        
        # Наибольшее возможное значение операнда.
        $ulimit = 30;
        
        if ($task->level == 1) {
            $ulimit = 4;
        } else if ($task->level <= 3) {
            $ulimit = 5;
        } else if ($task->level == 5) {
            $ulimit = 10;
        } else if ($task->level == 6) {
            $ulimit = 50;
        } else if ($task->level == 7) {
            $ulimit = 5;
        } else if ($task->level >= 8) {
            $ulimit = $task->level - 2;
        }
        
        # Сложение.
        if ($task->action == MathAction::ADDITION) {
            $task->a = rand($llimit, $ulimit);
            $task->b = rand($llimit, $ulimit);
            if ($task->level == 3) {
                $task->a *= 10;
                $task->b *= 10;
            }
            $task->rightAnswer =  $task->a + $task->b;
        }
        # Вычитание.
        if ($task->action == MathAction::SUBTRACTION) {
            $task->a = $ulimit * 2 - rand($llimit, $ulimit - 1);
            $task->b = rand($llimit, $ulimit - 1);
            if ($task->level == 3) {
                $task->a *= 10;
                $task->b *= 10;
            }
            $task->rightAnswer = $task->a - $task->b;
        }
        # Деление.
        if ($task->action == MathAction::DIVISION) {
            $task->rightAnswer = rand(2, $ulimit * 2);
            $task->b = rand(2, $ulimit * 2);
            $task->a = $task->rightAnswer * $task->b;
        }
        # Умножение.
        if ($task->action == MathAction::MULTIPLICATION) {
            $task->a = rand(2, $ulimit);
            $task->b = rand(2, $ulimit);
            $task->rightAnswer = $task->a * $task->b;
        }
    }
}
?>