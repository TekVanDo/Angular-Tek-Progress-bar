(function () {
    "use strict";
    angular.module('test', ['Tek.progressBar']).controller('mainController', ['progressBarParams',
        function (progressBarParams) {
            var main = this;

            main.random = function () {
                return Math.floor(Math.random() * 100);
            };

            main.bar = progressBarParams();
            main.valBar = 0;

            main.bar1ProgressVal = 0;
            main.bar1 = progressBarParams();

            main.bar2ProgressVal = 0;
            main.bar2 = progressBarParams();
        }
    ]);
}());