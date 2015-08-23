(function () {
    "use strict";
    angular.module('Tek.progressBar', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('Tek.progressBarDirective.html', "<div class='progress' ng-class='bar.containerClass'><div class='progress-bar' ng-class='bar.barClass' ng-transclude></div></div>");
    }]);
}());
(function () {
    "use strict";
    angular.module('Tek.progressBar').directive('tekProgressBar', function () {
        return {
            scope: {
                manager: "=",
                containerClass: "@class",
                barClass: "@",
                ngModel: "=",
                mode: '@'
            },
            restrict: "E",
            transclude: true,
            controllerAs: "bar",
            templateUrl: "Tek.progressBarDirective.html",
            bindToController: true,
            controller: ['$scope', '$element', function ($scope, $element) {
                var bar = this;

                var settings = {
                    fullClass: 'full-bar',
                    emptyClass: 'empty-bar',
                    verticalClass: 'vertical',
                    horizontalClass: ''
                };

                function ProgressObj(element, mode) {
                    var divElements = element.find('div');
                    this.mode = mode;
                    this.containerElement = angular.element(divElements[0]);
                    this.containerElement.addClass(settings[mode + 'Class']);
                    this.barContainer = angular.element(divElements[1]);
                    this.value = 0;
                }

                ProgressObj.prototype.get = function () {
                    return this.value;
                };

                ProgressObj.prototype.set = function (val) {
                    this.value = val;
                    if(this.mode === 'horizontal'){
                        this.barContainer.css('width', val + '%');
                    }
                    if(this.mode === 'vertical'){
                        this.barContainer.css('height', val + '%');
                    }
                    this.updateClasses();
                };

                ProgressObj.prototype.updateClasses = function () {
                    console.log(this.value);
                    if (this.value <= 0) {
                        this.containerElement.removeClass(settings.fullClass);
                        return this.containerElement.addClass(settings.emptyClass);
                    }

                    if (this.value >= 100) {
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
                    bar.mode = (bar.mode === 'vertical') ? bar.mode : 'horizontal';
                    bar.progressObj = new ProgressObj($element, bar.mode);
                    var facade = {
                        get: function () {
                            return bar.progressObj.get();
                        },
                        set: function (newVal) {
                            if (bar.ngModel !== undefined) { // todo setInterval problem
                                $scope.$evalAsync(function () {
                                    bar.ngModel = newVal;
                                });
                            } else {
                                bar.progressObj.set(newVal);
                            }
                        },
                        setAnimation: function (val) {
                            bar.progressObj.setAnimation(val);
                        }
                    };

                    if (bar.manager) {
                        bar.manager._getDefer().resolve(facade);
                        $scope.$on('$destroy', function () {
                            bar.manager._updateDefer();
                        });
                    }

                    if (bar.ngModel !== undefined) {
                        $scope.$watch('bar.ngModel', function (newVal) {
                            if(typeof newVal !== 'number' || newVal < 0 || newVal !== newVal){
                                newVal = 0;
                            }

                            if(newVal > 100){
                                newVal = 100;
                            }

                            if (bar.manager) {
                                bar.manager._updateValue(newVal);
                            }
                            bar.progressObj.set(newVal);
                        });
                    }
                };
                bar.init();
            }]
        }
    });
}());
(function () {
    "use strict";
    var requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    angular.module('Tek.progressBar').factory('progressBarManager', ['$q', function ($q) {
        return function (defaultSettings) {
            var deferred = $q.defer();
            var instance = null;
            var lastVal = 0;
            var animation = true;
            var requiredClear = false;

            var intervalCont = (function () {
                var incrementStrategy = function (stat) {
                    var rnd;
                    if (stat >= 0 && stat < 25) {
                        // Start out between 3 - 6% increments
                        rnd = (Math.random() * (5 - 3 + 1) + 3);
                    } else if (stat >= 25 && stat < 65) {
                        // increment between 0 - 3%
                        rnd = (Math.random() * 3);
                    } else if (stat >= 65 && stat < 90) {
                        // increment between 0 - 2%
                        rnd = (Math.random() * 2);
                    } else if (stat >= 90 && stat < 99) {
                        // finally, increment it .5 %
                        rnd = 0.5;
                    } else {
                        // after 99%, don't increment:
                        rnd = 0;
                    }
                    return Math.round((stat + rnd) * 100) / 100;
                };

                var interval = null;
                return {
                    increment: function () {
                        obj.set(incrementStrategy(lastVal));
                    },
                    setInterval: function () {
                        var self = this;
                        if (requiredClear) {
                            requiredClear = false;
                            obj.clear();
                        }

                        if (!interval) {
                            interval = setInterval(function () {
                                self.increment();
                            }, 300);
                        }
                    },
                    clearInterval: function () {
                        clearInterval(interval);
                        interval = null;
                    },
                    isInProgress: function () {
                        return !!interval;
                    }
                };
            }());

            var obj = {
                _getDefer: function () {
                    return deferred;
                },
                _updateDefer: function () {
                    deferred = $q.defer();
                    instance = null;
                    deferred.promise.then(function (data) {
                        instance = data;
                        instance.set(lastVal);
                    });
                },
                _updateValue: function (val) {
                    lastVal = val;
                },
                getPromise: function () {
                    return deferred.promise;
                },
                set: function (val) {
                    //Checking value is number and not NaN
                    if (typeof val !== 'number' || val !== val) {
                        throw new Error("Wrong value");
                    }
                    if (val < 0) {
                        val = 0;
                    }
                    if (val > 100) {
                        val = 100;
                    }
                    lastVal = val;

                    //todo rewrite
                    if (requiredClear) {
                        requiredClear = false;
                        this.clear(val);
                        return this;
                    } else {
                        if (instance) {
                            instance.set(lastVal);
                        }
                    }
                    return this;
                },
                get: function () {
                    return lastVal;
                },
                isInProgress: function () {
                    return intervalCont.isInProgress();
                },
                increase: function (value) {
                    (value) ? this.set(lastVal + value) : intervalCont.increment();
                    return this;
                },
                start: function () {
                    intervalCont.setInterval();
                    return this;
                },
                stop: function () {
                    intervalCont.clearInterval();
                    return this;
                },
                done: function () {
                    this.stop();
                    this.set(100);
                    requiredClear = true;
                    return this;
                },
                reset: function () {
                    this.stop();
                    this.set(0);
                    return this;
                },
                clear: function (val) {
                    var animationVal = this.isAnimated();
                    var self = this;
                    this.stop();
                    this.setAnimation(false);
                    this.reset();

                    var deferred = $q.defer();
                    requestAnimationFrame(function () {
                        self.setAnimation(animationVal);
                        deferred.resolve();
                    });

                    deferred.promise.then(function () {
                        if(val !== undefined) {
                            self.set(val);
                        }
                    });

                    return this;
                },
                setAnimation: function (val) {
                    animation = !!val;
                    deferred.promise.then(function (data) {
                        data.setAnimation(animation);
                    });
                    return this;
                },
                isAnimated: function () {
                    return animation;
                }
            };

            obj._updateDefer(0);

            return obj;
        }
    }]);
}());