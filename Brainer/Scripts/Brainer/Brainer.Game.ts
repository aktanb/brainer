module Brainer {
    export class Game {
        public onLoad: any = function (data) { }
        public play: any = function () { };

        constructor(public name: string) {
            var _this = this;
            _this.load();
        }

        private load() {
            var _this = this;
            $.post('playground/load_game.php', {
                'name': _this.name,
                'age': _site.playground.playerAge
            }, function (data) {
                _this.onLoad(data);
                _this.play();
            });
        }
    }
} 