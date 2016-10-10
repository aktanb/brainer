<?php
class Alphabet 
{
    public $language;
    public $letters;
    public $count;
    public function __construct($language) {
        switch ($_SESSION["language"]) {
            case Language::RUSSIAN:
                $this->letters = array("а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я");
                break;
                
            case Language::KAZAKH:
                $this->letters = array("а", "ә", "б", "в", "г", "ғ", "д", "е", "ё", "ж", "з", "и", "й", "к", "қ", "л", "м", "н", "ң", "о", "ө", "п", "р", "с", "т", "у", "ұ", "ү", "ф", "х", "һ", "ц", "ч", "ш", "щ", "ъ", "ы", "і", "ь", "э", "ю", "я");
                break;
        }
        $this->language = $language;
        $this->count = count($this->letters);
    }
}
class Language 
{
    const RUSSIAN = 0;
    const KAZAKH = 1;
}

# Дополняет массив слова-задания буквами, подобранными в случайном порядке.
function addRandomLetters(array &$lettersArray, $neededWordArrayLength, $alphabet) {
    $missingLettersNumber = $neededWordArrayLength - count($lettersArray);
    if ($missingLettersNumber >= 0) {
        $randomLetter = $alphabet->letters[rand(0, $alphabet->count - 1)];
        $alreadyHasThisLetter = false;
        foreach($lettersArray as $existingLetter) {
            if ($randomLetter == $existingLetter) {
                $alreadyHasThisLetter = true;
                break;
            }
        }
        if (!$alreadyHasThisLetter) {
            array_push($lettersArray, $randomLetter);
        }
        addRandomLetters(&$lettersArray, $neededWordArrayLength, $alphabet);
    }
}
function mb_str_split($str)
{
    preg_match_all('#.{1}#uis', $str, $out);
    return $out[0];
}
?>