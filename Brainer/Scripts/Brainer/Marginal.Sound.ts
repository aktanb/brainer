module Marginal {
    export class Sound {
        constructor(public folder: string, public fileName: string) {
            var _this = this;
            _this._element = document.createElement('audio');
            _this._element.setAttribute('src', '{0}{1}'.format(_this.folder, fileName));
            _this._element.load();
        }

        public play() {
            this._element.play();
        }

        private _element: HTMLAudioElement;
    }
} 