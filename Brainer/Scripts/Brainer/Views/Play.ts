module Brainer.Views {
    export class Play {

        constructor() {
            var _this = this;
        }

        public static startGame(button: any) {
            _site.loadToBottom('Playground/Index', null, function () {
                _site.initFoundation();
                _site.playground.init($('#PlaygroundContainer'), 'main');
            });
        }
    }
}