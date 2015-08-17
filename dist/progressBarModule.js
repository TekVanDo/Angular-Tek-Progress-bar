(function () {
    "use strict";
    angular.module('Tek.progressBar', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('Tek.progressBarDirective.html', "<div class='progress'><div class='progress-bar' ng-transclude></div></div>");
    }]);
}());
(function () {
    "use strict";
    angular.module('Tek.progressBar').directive('progressBar', function () {
        return {
            scope: {
                control: "=",
                containerClass: "@class",
                //barClass: "@",
                //successClass: "@",
                value: "="
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
                    if(this.value === 0){
                        this.containerElement.removeClass(settings.fullClass);
                        return this.containerElement.addClass(settings.emptyClass);
                    }

                    if(this.value === 100){
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

                    var facade  = {
                        get: function () {
                            return bar.progressObj.get();
                        },
                        set: function (newVal) {
                            bar.progressObj.set(newVal);
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

    angular.module('Tek.progressBar').factory('progressBarParams', ['$q', function ($q) {
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
                set: function (val) {
                    //todo rewrite
                    if (requiredClear) {
                        requiredClear = false;
                        this.clear();
                    }

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
                    if (instance) {
                        instance.set(lastVal);
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
                    (value)? this.set(lastVal + value) : intervalCont.increment();
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
                clear: function () {
                    var self = this;
                    var animationVal = this.isAnimated();
                    this.stop();
                    this.setAnimation(false);
                    this.reset();
                    requestAnimationFrame(function () {
                        self.setAnimation(animationVal);
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