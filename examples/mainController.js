/**
 * Created by DaniL on 06.08.2015.
 */
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
            main.bar1 = progressBarParams();
        }
    ]);
}());