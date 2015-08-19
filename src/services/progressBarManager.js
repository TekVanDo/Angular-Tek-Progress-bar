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