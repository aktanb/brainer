var Brainer;
(function (Brainer) {
    var Sounds = (function () {
        function Sounds(isLocal) {
            this.isLocal = isLocal;
            var _this = this;
            _this.click = new Marginal.Sound(_this.folder, 'click.mp3');
            _this.right = new Marginal.Sound(_this.folder, 'right.mp3');
            _this.wrong = new Marginal.Sound(_this.folder, 'wrong.mp3');
            _this.levelUp = new Marginal.Sound(_this.folder, 'levelup.mp3');
        }
        Object.defineProperty(Sounds.prototype, "folder", {
            get: function () {
                if (this.isLocal) {
                    return 'http://localhost:9084/Playground/Sounds/';
                }
                return 'http://brainer.kz/playground/sounds/';
            },
            enumerable: true,
            configurable: true
        });
        return Sounds;
    })();
    Brainer.Sounds = Sounds;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Sounds.js.map