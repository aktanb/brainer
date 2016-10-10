var Brainer;
(function (Brainer) {
    var Strings = (function () {
        function Strings() {
        }
        Strings.loading = $('#BrainerStrings').find('.loading-string').text();
        Strings.answeredRight = $('#BrainerStrings').find('.loading-string').text();
        Strings.stopPlaying = $('#BrainerStrings').find('.loading-string').text();
        Strings.iDontKnow = $('#BrainerStrings').find('.loading-string').text();
        Strings.continue = $('#BrainerStrings').find('.loading-string').text();
        return Strings;
    })();
    Brainer.Strings = Strings;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Strings.js.map