/**
 * Created by DaniL on 06.08.2015.
 */
(function () {
    "use strict";
    angular.module('test', ['Tek.progressBar']).controller('mainController', ['progressBarParams',
        function (progressBarParams) {
            var main = this;

            main.isBar = false;
            main.val = 0;

            main.bar = progressBarParams();

            main.upd = function () {
                main.val++;
                return main.bar.set(main.val);
            };

            main.setRand = function () {
                var rand = Math.floor(Math.random() * 100);
                return main.bar.set(rand);
            };

            main.reset = function () {
                main.bar.reset();
            };

            main.done = function () {
                main.bar.done();
            };

            main.start = function () {
                main.bar.start();
            };
            main.stop = function () {
                main.bar.stop();
            };
            //main.instacef = main.bar.getInstance().then(function () {
            //    main.bar.set(20);
            //});

        }
    ]);
}());