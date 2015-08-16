(function () {
    "use strict";
    angular.module('Tek.progressBar',[]);
}());
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
(function () {
    "use strict";
    var requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    angular.module('Tek.progressBar').factory('progressBarParams', ['$q', function ($q) {
        return function (defaultSettings) {
            var deferred = $q.defer();
            var instance = null;
            var lastVal = 0;
            var animation = true;
            var requairedClear = false;

            var intervalCont = (function () {
                var progressIncrementation = function (stat) {
                    var rnd = 0;
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
                        obj.set(progressIncrementation(lastVal));
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
                        if (lastVal) {
                            instance.set(lastVal);
                        }
                    });
                },
                set: function (val) {
                    //todo rewrite
                    if(requairedClear){
                        requairedClear = false;
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
                    return obj;
                },
                get: function () {
                    return lastVal;
                },
                isInProgress: function () {
                    return intervalCont.isInProgress();
                },
                increase: function () {
                    intervalCont.increment();
                    return obj;
                },
                start: function () {
                    intervalCont.setInterval();
                    return obj;
                },
                stop: function () {
                    intervalCont.clearInterval();
                    return obj;
                },
                done: function () {
                    this.stop();
                    this.set(100);
                    requairedClear = true;
                },
                reset: function () {
                    this.stop();
                    this.set(0);
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
                    return obj;
                },
                setAnimation: function (val) {
                    animation = !!val;
                    deferred.promise.then(function (data) {
                        data.updateAnimation(animation);
                    });
                    return obj;
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