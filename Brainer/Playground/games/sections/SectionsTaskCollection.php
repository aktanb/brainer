<?php
include 'SectionsTask.php';

class SectionsTaskCollection extends TaskCollection {
    private $framesCount = 27;
    
    public function __construct($level) {
        $tasks = array();
        $counting = $this->framesCount;
        while ($counting) {
	        array_push($tasks, new SectionsTask($level));
            $counting--;
        }
        
        foreach ($tasks as $task) {
            $frame = "<div class='play-scene'><div class='row'><div class='small-8 small-offset-2 columns'><div class='row'>";	                    
            $elements = $task->elements;
            $j = 0;
            foreach ($elements as $element)
            {
                $frame .= "<h1>HUI</h1>";
                $j++;
            }
            $frame .= "</div></div></div><div class='progress'><div class='meter'></div></div></div>";
            array_push($this->result, $frame);
        }
    }
}

?>