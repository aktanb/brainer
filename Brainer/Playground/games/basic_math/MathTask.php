<?php
abstract class MathTask {
    # Уровень.
    public $level;
    
    # Тип.
    public $type;
    
    # Правильный ответ.
    public $rightAnswer;
    
    # Математическое действие.
    public $action;
    
    # Знак «равно».
    public $equalsSign = "=";
    
    # Первый оператор.
    private $a;
    
    # Второй оператор.
    private $b;
    
    # Массив вариантов ответов.
    public $variants = array();
    
    # Количество неправильных ответов.
    const VARIANTS_COUNT = 8;
    
    public function __construct($level) {
        try {
            $this->level = $level;
            
            # Создать задачу, учитывая тип и текущий уровень.
            $this->create();
      
            # Заполнить массив неправильных вариантов ответов,
            # а затем добавить в этот массив правильный ответ.
            $this->fillVariants();
            array_push($this->variants, $this->rightAnswer);
            shuffle($this->variants);
        } catch (Exception $e) {
            log::error($e->getMessage());
        }
    }
   
    # Заполняет массив неправильных вариантов ответов.
    private function fillVariants() {
        # Если правильный ответ меньше, чем $this::VARIANTS_COUNT,
        # то заполнять массив неправильных вариантов ответа числами
        # от ноля, до $this::VARIANTS_COUNT.
        if ($this->rightAnswer > $this::VARIANTS_COUNT) {
            $numbers = range($this->rightAnswer - floor($this->rightAnswer * 0.5), $this->rightAnswer + ceil($this->rightAnswer * 0.5));
        } else {
            $numbers = range(0, $this->rightAnswer + $this::VARIANTS_COUNT);
        }
        
        # Исключить вероятность двух правильных ответов.
        $rightAnswerKey = array_search($this->rightAnswer, $numbers);
        if ($rightAnswerKey != -1) {
            unset($numbers[$rightAnswerKey]);
        }
        
        shuffle($numbers);
        $this->variants = array_slice($numbers, 0, $this::VARIANTS_COUNT);
    }
    
    abstract protected function create();
    abstract protected function build();
}

# Типы заданий по математике.
class MathTaskType
{
    const A = 0; # Простые арифметические действия (сложение, вычитание, умножение и деление);
    const B = 1; # Уравнение;
    const C = 2; # «Больше-меньше»;
    const D = 3; # Арифметические действия со скобками;
}

# Арифметические действия.
class MathAction
{
    const ADDITION = 0;
    const SUBTRACTION = 1;
    const MULTIPLICATION = 2;
    const DIVISION = 3;
    
    public static function getActionSign($action) {
        switch($action) {
            case self::ADDITION:
                return '+';
            case self::SUBTRACTION:
                return '-';
            case self::DIVISION:
                return '/';
            case self::MULTIPLICATION:
                return '*';
        }
    }
}
?>