(function () {
    "use strict";
    angular.module('Tek.progressBar').directive('progressBar', function () {
        return {
            scope: {
                control: "=",
                containerClass: "@class",
                barClass: "@",
                value: "="
            },
            restrict: "E",
            controller: ['$q', '$scope', '$element', function ($q, $scope, $element) {
                var bar = this;
                var barContainer = angular.element($element.find('div')[1]); //todo fix
                var value = 0;

                var setBar = function (val) {
                    value = val;
                    barContainer.css('width',val +'%');
                    //barContainer.removeClass('no-transition');
                };

                var resetBar = function () {
                    //barContainer.addClass('no-transition');
                    barContainer.css('display','none');
                    setBar(0);
                    barContainer.css('display','block');
                };


                bar.progressObj = (function () {
                    return {
                        get: function () {
                            return value;
                        },
                        set: function (newVal) {
                            setBar(newVal);
                        },
                        reset: function () {
                            resetBar();
                        },
                        done: function () {
                            this.set(100)
                        }
                    };
                }());

                bar.init = function () {
                    if(bar.control){
                        bar.control.getDefer().resolve(bar.progressObj);
                    }else{
                        $scope.$watch('bar.value',function (newVal) {
                            setBar(newVal);
                        });
                    }
                };
                bar.init();

                $scope.$on('$destroy', function() {
                    bar.control.updateDefer(bar.value);
                });
            }],
            controllerAs: "bar",
            template: "<div class='progress {{::bar.containerClass}}'><div class='progress-bar {{::bar.barClass}}'></div>!{{::bar.containerClass}}!</div>",
            bindToController: true
        }
    });
}());