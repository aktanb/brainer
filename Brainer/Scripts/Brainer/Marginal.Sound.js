var Marginal;
(function (Marginal) {
    var Sound = (function () {
        function Sound(folder, fileName) {
            this.folder = folder;
            this.fileName = fileName;
            var _this = this;
            _this._element = document.createElement('audio');
            _this._element.setAttribute('src', '{0}{1}'.format(_this.folder, fileName));
            _this._element.load();
        }
        Sound.prototype.play = function () {
            this._element.play();
        };
        return Sound;
    })();
    Marginal.Sound = Sound;
})(Marginal || (Marginal = {}));
//# sourceMappingURL=Marginal.Sound.js.map