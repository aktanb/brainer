<?php
include 'SequenceTask.php';

class SequenceTaskCollection extends TaskCollection {
    private $framesCount = 5;
    
    public function __construct($level) {
        $tasks = array();
        $counting = $this->framesCount;
        while ($counting) {
	        array_push($tasks, new SequenceTask($level));
            $counting--;
        }
        
        foreach ($tasks as $task) {
            $frame = "<div class='play-scene'><div class='row'><div class='small-8 small-offset-2 columns'><div class='row'>";	                    
            $elements = $task->elements;
            $j = 0;
            foreach ($elements as $element)
            {
                $emptyElement = $element < 0;
                $elementValue =  !$emptyElement ? $element : "";
                $activeSection = !$emptyElement ? "wannabe-active-section" : "borderless-section transparent";
                if ($j != 0 && $j % 3 == 0) {
                    $frame .= "</div><div class='row'>";
                }
                $frame .= "<div class='small-4 columns'>
                               <div class='section picture-section $activeSection text-task-action operand'>
                                   <div>
                                       $elementValue
                                   </div>
                               </div>
                           </div>";
                $j++;
            }
            $frame .= "</div></div></div><div class='progress'><div class='meter'></div></div></div>";
            array_push($this->result, $frame);
        }
    }
}

?>