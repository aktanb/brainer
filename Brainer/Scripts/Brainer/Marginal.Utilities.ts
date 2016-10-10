module Marginal.Utilities {
    export class URL {
        public static getCurrentPageName(pageUrl: string = null) {
            var url = (pageUrl === null ? window.location.href : pageUrl);
            var pageIndex = $.trim(url.slice(url.indexOf('#')));
            if (pageIndex.length > 1) {
                return pageIndex.slice(1);
            } else {
                return 'Main';
            }
        }
    }

    export class UI {
        public static suppressBackspace(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (event.keyCode == 8 && !/input|textarea/i.test(target.nodeName)) {
                return false;
            }
        }
    }
} 

// String extensions.
interface String {
    format(...replacements: string[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}