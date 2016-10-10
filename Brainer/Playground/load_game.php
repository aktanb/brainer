<?php
include '../php/db.php';
include '../php/db_user.php';
include '../php/db_content.php';
include '../php/db_game.php';
include '../php/log.php';
include 'php/Game.php';

session_start();

# Создать подключение к базе данных.
db::connect();

# Очистить таблицу ошибок.
log::clear();

# Возвращаемый массив игр.
$gamesData = array();

# Можно загрузить конкретный уровень.
$certainLevel = null;

// Увеличивать уровень только в тех играх, в которых
// ответили правильно в трех случаях из четырех. Также,
// вести учет игр, в которых нужно наоборот понизить уровень.
if (isset($_SESSION['user_id']) && isset($_POST["sessionIds"]) && isset($_POST['results'])) {
    $sessionIds = array();
    $sessionIds = $_POST["sessionIds"];
    $results = array();
    $results = $_POST["results"];
    $i = 0;
    foreach($results as $json_result) {
        $userId = $_SESSION['user_id'];
        $result = json_decode(stripslashes($json_result));
        $gameName = $result->{'name'};
        $isBonusLevel = $result->{'bonusLevel'};
        $answers = $result->{'answers'};
        $all = count($answers);
        $right = 0;
            
        foreach($answers as $answer) {
            if ($answer->{'value'} == 1) {
                $right++;
            }
        }
            
        // Поднимать уровень только если ответили правильно 4-5 раз
        // (опускать — если меньше двух раз).
        $increment = 0;
        if ($right > $all * 0.7) {
            $increment = 1;
        } else if ($right < $all * 0.3) {
            $increment = -1;
        }
        
        // Записать данные о текущем уровне.
        db_game::incrementLevel($userId, $gameName, $increment);
        
        // Записать данные о раунде (среднее время ответа, дата...).
        $sessionId = $sessionIds[$i];
        try {
            db_game::setSession($sessionId, $gameName, $userId, $result->{'averageThinkingTime'});
            db_game::setStatistics($sessionId, $answers);
            $i++;
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        $game = new Game($gameName, $certainLevel);
        array_push($gamesData, $game->load());
    }
} else if (isset($_POST["name"])) {
    $gameName = $_POST["name"];
    if (isset($_POST["age"]) && !empty($_POST["age"])) {
        $certainLevel = db_game::getLevelByAge(intval($_POST["age"]));
    }
    if ($gameName == 'main') {
        # Массив названий всех основных (не дополнительных) игр.
        $gameRecords = R::findAll('games', ' additional = ?', array(0));
        
    } else {
        # Найти игру по названию.
        $gameRecords = R::findAll('games', ' name = ?', array($gameName));
    }
    foreach ($gameRecords as $gameRecord) {
        $game = new Game($gameRecord->name, $certainLevel);
        array_push($gamesData, $game->load());
    }
}

echo json_encode($gamesData);

# Уничтожить подключение к базе данных.
db::disconnect();
?>