var Brainer;
(function (Brainer) {
    var Views;
    (function (Views) {
        var Play = (function () {
            function Play() {
                var _this = this;
            }
            Play.startGame = function (button) {
                _site.loadToBottom('Playground/Index', null, function () {
                    _site.initFoundation();
                    _site.playground.init($('#PlaygroundContainer'), 'main');
                });
            };
            return Play;
        })();
        Views.Play = Play;
    })(Views = Brainer.Views || (Brainer.Views = {}));
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Play.js.map