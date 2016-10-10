module Brainer {
    export class Session {
        public login: string;
        public firstName: string;
        public lastName: string;
        public age: number;
        public dayOfBirth: number;
        public monthOfBirth: number;
        public yearOfBirth: number;
        public sex: string;
        public imageSource: string;

        constructor() {
            this.getData();
        }

        public getData(callback: any = function () { }) {
            var _this = this;
            $.post('controllers/session_data.php', {},
                function (rawData) {
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
        }
    }
}