module Brainer {
    export class Sounds {
        public get folder(): string {
            if (this.isLocal) {
                return 'http://localhost:9084/Playground/Sounds/';
            }
            return 'http://brainer.kz/playground/sounds/';
        }

        public click: Marginal.Sound;
        public right: Marginal.Sound;
        public wrong: Marginal.Sound;
        public levelUp: Marginal.Sound;
         
        constructor(public isLocal: boolean) {
            var _this = this;
            _this.click = new Marginal.Sound(_this.folder, 'click.mp3');
            _this.right = new Marginal.Sound(_this.folder, 'right.mp3');
            _this.wrong = new Marginal.Sound(_this.folder, 'wrong.mp3');
            _this.levelUp = new Marginal.Sound(_this.folder, 'levelup.mp3');
        }
    }
}