(function () {
    "use strict";
    angular.module('Tek.progressBar').directive('progressBar', function () {
        return {
            scope: {
                control: "=",
                containerClass: "@class",
                barClass: "@",
                successClass: "@",
                value: "="
            },
            restrict: "E",
            transclude: true,
            controllerAs: "bar",
            template: "<div class='progress {{::bar.containerClass}}'><div class='progress-bar {{::bar.barClass}}' ng-transclude></div></div>",
            bindToController: true,
            controller: ['$q', '$scope', '$element', function ($q, $scope, $element) {
                var bar = this;
                var barElement = angular.element($element.find('div')[1]);
                var settings = {
                    fullClass: 'full-bar',
                    emptyClass: 'empty-bar'
                };

                function ProgressObj(barContainer) {
                    this.barContainer = barContainer;
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
                    if(this.value === 0){
                        this.barContainer.removeClass(settings.fullClass);
                        return this.barContainer.addClass(settings.emptyClass);
                    }

                    if(this.value === 100){
                        this.barContainer.removeClass(settings.emptyClass);
                        return this.barContainer.addClass(settings.fullClass);
                    }

                    this.barContainer.removeClass(settings.fullClass);
                    this.barContainer.removeClass(settings.emptyClass);
                };

                ProgressObj.prototype.setAnimation = function (val) {
                    (val) ? this.barContainer.css('transition', 'width 0.6s ease 0s') : this.barContainer.css('transition', 'none');
                };

                bar.init = function () {
                    bar.progressObj = new ProgressObj(barElement);

                    var facade  = {
                        get: function () {
                            return bar.progressObj.get();
                        },
                        set: function (newVal) {
                            bar.progressObj.set(newVal);
                        },
                        updateAnimation: function (val) {
                            bar.progressObj.setAnimation(val);
                        }
                    };

                    if (bar.control) {
                        bar.control._getDefer().resolve(facade);

                        $scope.$on('$destroy', function () {
                            bar.control._updateDefer();
                        });
                    }else{
                        $scope.$watch('bar.value', function (newVal) {
                            bar.progressObj.set(newVal);
                        });
                    }
                };
                bar.init();
            }]
        }
    });
}());