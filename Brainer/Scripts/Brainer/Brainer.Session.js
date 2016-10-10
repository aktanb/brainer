var Brainer;
(function (Brainer) {
    var Session = (function () {
        function Session() {
            this.getData();
        }
        Session.prototype.getData = function (callback) {
            if (callback === void 0) { callback = function () { }; }
            var _this = this;
            $.post('controllers/session_data.php', {}, function (rawData) {
                if (rawData !== undefined) {
                    var data = JSON.parse(rawData);
                    _this.login = data.login;
                    _this.firstName = data.firstname;
                    _this.lastName = data.secondname;
                    _this.age = data.age;
                    _this.dayOfBirth = data.dayOfBirth;
                    _this.monthOfBirth = data.monthOfBirth;
                    _this.yearOfBirth = data.yearOfBirth;
                    _this.sex = data.sex;
                    _this.imageSource = data.image;
                    callback();
                }
            });
        };
        return Session;
    })();
    Brainer.Session = Session;
})(Brainer || (Brainer = {}));
//# sourceMappingURL=Brainer.Session.js.map