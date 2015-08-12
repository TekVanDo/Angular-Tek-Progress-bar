(function () {
    "use strict";
    angular.module('Tek.progressBar').factory('progressBarParams',['$q',function ($q) {
        return function (defaultSettings){
            var deferred = $q.defer();
            var instance = null;
            var lastVal = 0;
            var animation = true;
            var methods = ['reset','done'];

            var intervalCont = (function(){
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
                        if (instance) {
                            console.log(progressIncrementation(lastVal));
                            obj.set(progressIncrementation(lastVal));
                        }
                    },
                    setInterval: function () {
                        var self = this;
                        if(!interval) {
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

            var makeAsyncCall = function (name) {
                return function () {
                    var arg = arguments;
                    if(!instance){
                        deferred.promise.then(function (data) {
                            return data[name].apply(data, arg);
                        });
                    }else{
                        return instance[name].apply(instance, arg);
                    }
                }
            };

            function defferedCall(name) {
                var arg = arguments;
                if(!instance){
                    deferred.promise.then(function (data) {
                        return data[name].apply(data, arg);
                    });
                }else{
                    return instance[name].apply(instance, arg);
                }
            }

            var obj = {
                _getDefer: function () {
                    return deferred;
                },
                _updateDefer: function () {
                    deferred = $q.defer();
                    instance = null;
                    deferred.promise.then(function (data) {
                        instance = data;
                        if(lastVal){
                            instance.set(lastVal);
                        }
                    });
                },
                set: function (val) {
                    lastVal = val;
                    deferred.promise.then(function (data) {
                        data.set(lastVal);
                    });
                    return obj;
                },
                increase: function () {
                    intervalCont.increment();
                    return obj;
                },
                get: function () {
                    return lastVal;
                },
                start: function () {
                    intervalCont.setInterval();
                    return obj;
                },
                stop: function () {
                    intervalCont.clearInterval();
                    return obj;
                },
                isInProgress: function () {
                    return intervalCont.isInProgress();
                },
                clear: function () {
                    var anim = this.isAnimated();
                    this.stop();
                    this.setAnimation(false);
                    var self = this;
                    this.reset();
                    requestAnimationFrame(function () {
                        self.setAnimation(anim);
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

            methods.forEach(function (one) {
                obj[one] = makeAsyncCall(one);
            });

            obj._updateDefer(0);

            return obj;
        }
    }]);
}());