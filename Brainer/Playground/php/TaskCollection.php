<?php

/**
 * ����� ����������� ����� ��� ���� ������� ��������� �����.
 *
 * @version 1.0
 * @author ab
 */
abstract class TaskCollection
{
    # ������ ������ ����.
    public $result = array();
    
    public function getFrames() {
        return json_encode($this->result);
    }
}
