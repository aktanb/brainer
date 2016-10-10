var Brainer;
(function (Brainer) {
    var Game = (function () {
        function Game(name) {
            this.name = name;
            this.onLoad = function (data) { };
            this.play = function () { };
            var _this = this;
            _this.load();
        }
        Game.prototype.load = function () {
            var _this = this;
            $.post('playground/load_game.php', {
                'name': _this.name,
                'age': _site.playground.playerAge
            }, function (data) {
                _this.onLoad(data);
                _this.play();
            });
        };
        return Game;
    })();
    Brainer.Game = Game;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Game.js.map