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
            transclude: true,
            controller: ['$q', '$scope', '$element', function ($q, $scope, $element) {
                var bar = this;

                bar.progressObj = (function () {
                    var barContainer = angular.element($element.find('div')[1]); //todo fix
                    var value = 0;

                    var setBar = function (val) {
                        checkAnimation();
                        value = val;
                        barContainer.css('width', val + '%');
                    };

                    var clearAnimation = function () {
                        barContainer.css('transition', 'none');
                    };

                    var setAnimation = function () {
                        barContainer.css('transition', 'width 0.6s ease 0s');
                    };

                    var checkAnimation = function () {
                        console.log(bar.control.isAnimated());
                        (bar.control.isAnimated()) ? setAnimation() : clearAnimation();
                    };

                    return {
                        get: function () {
                            return value;
                        },
                        set: function (newVal) {
                            setBar(newVal);
                        },
                        reset: function () {
                            setBar(0);
                        },
                        done: function () {
                            this.set(100)
                        },
                        updateAnimation: function () {
                            checkAnimation();
                        }
                    };
                }());

                bar.init = function () {
                    if (bar.control) {
                        bar.control.__getDefer().resolve(bar.progressObj);
                    } else {
                        $scope.$watch('bar.value', function (newVal) {
                            setBar(newVal);
                        });
                    }
                };
                bar.init();

                $scope.$on('$destroy', function () {
                    bar.control.__updateDefer(bar.value);
                });
            }],
            controllerAs: "bar",
            template: "<div class='progress {{::bar.containerClass}}'><div class='progress-bar {{::bar.barClass}}' ng-transclude></div></div>",
            bindToController: true
        }
    });
}());