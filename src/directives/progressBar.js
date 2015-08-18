(function () {
    "use strict";
    angular.module('Tek.progressBar').directive('progressBar', function () {
        return {
            scope: {
                control: "=",
                containerClass: "@class",
                ngModel: "="
            },
            restrict: "E",
            transclude: true,
            controllerAs: "bar",
            templateUrl: "Tek.progressBarDirective.html",
            bindToController: true,
            controller: ['$q', '$scope', '$element', function ($q, $scope, $element) {
                var bar = this;


                var settings = {
                    fullClass: 'full-bar',
                    emptyClass: 'empty-bar'
                };

                function ProgressObj(element) {
                    var divElements = element.find('div');
                    this.containerElement = angular.element(divElements[0]);
                    this.barContainer = angular.element(divElements[1]);
                    this.value = 0;
                }

                ProgressObj.prototype.get = function () {
                    return this.value;
                };

                ProgressObj.prototype.set = function (val) {
                    this.value = val;
                    this.barContainer.css('width', val + '%');
                    this.updateClasses();
                };

                ProgressObj.prototype.updateClasses = function () {
                    if (this.value === 0) {
                        this.containerElement.removeClass(settings.fullClass);
                        return this.containerElement.addClass(settings.emptyClass);
                    }

                    if (this.value === 100) {
                        this.containerElement.removeClass(settings.emptyClass);
                        return this.containerElement.addClass(settings.fullClass);
                    }

                    this.containerElement.removeClass(settings.fullClass);
                    this.containerElement.removeClass(settings.emptyClass);
                };

                ProgressObj.prototype.setAnimation = function (val) {
                    (val) ? this.barContainer.css('transition', '') : this.barContainer.css('transition', 'none');
                };

                bar.init = function () {
                    bar.progressObj = new ProgressObj($element);

                    var facade = {
                        get: function () {
                            return bar.progressObj.get();
                        },
                        set: function (newVal) {
                            if (bar.ngModel !== undefined) { // todo setInterval problem
                                //$scope.$apply(function () {
                                    bar.ngModel = newVal;
                                //});
                                $scope.$apply();
                            }else{
                                bar.progressObj.set(newVal);
                            }
                        },
                        setAnimation: function (val) {
                            bar.progressObj.setAnimation(val);
                        }
                    };

                    if (bar.control) {
                        bar.control._getDefer().resolve(facade);

                        $scope.$on('$destroy', function () {
                            bar.control._updateDefer();
                        });
                    }

                    if (bar.ngModel !== undefined) {
                        $scope.$watch('bar.ngModel', function (newVal, oldVal) {
                            bar.control._updateValue(newVal);
                            bar.progressObj.set(newVal);
                        });
                    }
                };
                bar.init();
            }]
        }
    });
}());