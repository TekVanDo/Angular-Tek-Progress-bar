"use strict";
describe('progressBarManager.js', function () {
    var progressBarManager;

    beforeEach(module('Tek.progressBar'));
    beforeEach(inject(function ($injector) {
        progressBarManager = $injector.get('progressBarManager');
    }));

    it('Should be a function', function () {
        expect(progressBarManager).toEqual(jasmine.any(Function));
    });

    it('Should be a object', function () {
        expect(progressBarManager()).toEqual(jasmine.any(Object));
    });

    describe('progressBarManager.js', function () {
        var progressBarParamsInstance;
        beforeEach(function () {
            progressBarParamsInstance = progressBarManager();
        });

        it('It should get default value', function () {
            expect(progressBarParamsInstance.get()).toEqual(0);
        });

        it('It should throw error if value not number or NaN', function () {
            expect(function () {
                progressBarParamsInstance.set('test');
            }).toThrowError("Wrong value");

            expect(function () {
                progressBarParamsInstance.set(NaN);
            }).toThrowError("Wrong value");
        });

        it('It should set 100 if value bigger then 100', function () {
            expect(progressBarParamsInstance.set(1000).get()).toEqual(100);
            expect(progressBarParamsInstance.set(100000).get()).toEqual(100);
        });

        it('It should set 0 if value less then 0', function () {
            expect(progressBarParamsInstance.set(-1000).get()).toEqual(0);
            expect(progressBarParamsInstance.set(-100000).get()).toEqual(0);
        });

        it('It should set right value', function () {
            expect(progressBarParamsInstance.set(10).get()).toEqual(10);
            expect(progressBarParamsInstance.set(50).get()).toEqual(50);
            expect(progressBarParamsInstance.set(100).get()).toEqual(100);
        });

        it('It should reset value', function () {
            progressBarParamsInstance.set(50).reset();
            expect(progressBarParamsInstance.get()).toEqual(0);
        });

        it('It should to be 100', function () {
            progressBarParamsInstance.done();
            expect(progressBarParamsInstance.get()).toEqual(100);
        });

        it('It should change animation value', function () {
            expect(progressBarParamsInstance.setAnimation(false).isAnimated()).toEqual(false);
            expect(progressBarParamsInstance.setAnimation(true).isAnimated()).toEqual(true);
        });

        it('It not change animation value', function () {
            progressBarParamsInstance.setAnimation(false).clear();
            expect(progressBarParamsInstance.isAnimated()).toEqual(false);
        });

        it('It should return right progress status', function () {
            expect(progressBarParamsInstance.isInProgress()).toEqual(false);
            expect(progressBarParamsInstance.start().isInProgress()).toEqual(true);
            expect(progressBarParamsInstance.start().stop().isInProgress()).toEqual(false);
        });

        it('Value should be bigger then last value', function () {
            var lastVal = progressBarParamsInstance.get();
            expect(progressBarParamsInstance.increase().get()).toBeGreaterThan(lastVal);
        });

        it('Value should be less then 100', function () {
            expect(progressBarParamsInstance.set(50).increase().get()).toBeLessThan(100);
            expect(progressBarParamsInstance.set(95).increase().get()).toBeLessThan(100);
            expect(progressBarParamsInstance.set(99).increase().get()).toBeLessThan(100);
        });

        it('Value should increase on exact number', function () {
            expect(progressBarParamsInstance.increase(15).get()).toEqual(15);
            expect(progressBarParamsInstance.set(50).increase(15).get()).toEqual(65);
            expect(progressBarParamsInstance.set(5).increase(25).get()).toEqual(30);
        });


        describe('service functions tests', function () {
            it('It should have resolve method', function () {
                expect(progressBarParamsInstance._getDefer().resolve).toEqual(jasmine.any(Function));
            });

            it('It should have resolve method', function () {
                expect(progressBarParamsInstance._getDefer().resolve).toEqual(jasmine.any(Function));
            });

            it('Promise should be resolved', function () {
                expect(progressBarParamsInstance._getDefer().promise.$$state.status).toEqual(0);
                progressBarParamsInstance._getDefer().resolve();
                expect(progressBarParamsInstance._getDefer().promise.$$state.status).toEqual(1);
            });

            it('It should create new unresolved promise', function () {
                progressBarParamsInstance._getDefer().resolve();
                expect(progressBarParamsInstance._getDefer().promise.$$state.status).toEqual(1);
                progressBarParamsInstance._updateDefer();
                expect(progressBarParamsInstance._getDefer().promise.$$state.status).toEqual(0);
            });
        });

        describe('Interval functions', function () {
            beforeEach(function () {
                jasmine.clock().install();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it('It should be more then before start', function () {
                var beforeStart = progressBarParamsInstance.get();
                progressBarParamsInstance.start();
                jasmine.clock().tick(10000);
                var afterStart = progressBarParamsInstance.stop().get();
                expect(afterStart).toBeGreaterThan(beforeStart);
                expect(afterStart).toBeGreaterThan(0);
            });

            it('It should stop increasing after stop', function () {
                progressBarParamsInstance.start();
                jasmine.clock().tick(1000);
                var afterStop = progressBarParamsInstance.stop().get();
                jasmine.clock().tick(10000);
                expect(afterStop).toEqual(progressBarParamsInstance.get());
            });
        });
    });
});