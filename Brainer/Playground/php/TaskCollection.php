<?php

/**
 * Общий абстрактный класс для всех классов коллекций задач.
 *
 * @version 1.0
 * @author ab
 */
abstract class TaskCollection
{
    # Массив кадров игры.
    public $result = array();
    
    public function getFrames() {
        return json_encode($this->result);
    }
}
