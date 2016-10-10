<?php
include 'Alphabet.php';

abstract class VerbalTask {
    # Уровень.
    public $level;
    
    public function __construct($level) {
        try {
            $this->level = $level;
        } catch (Exception $e) {
            log::error($e->getMessage());
        }
    }
    
    abstract protected function build();
}