"use strict";
describe('progressBarParams.js', function () {
    var progressBarParams;

    beforeEach(module('Tek.progressBar'));
    beforeEach(inject(function ($injector) {
        progressBarParams = $injector.get('progressBarParams');
    }));

    it('Should be a function', function () {
        expect(progressBarParams).toEqual(jasmine.any(Function));
    });

    describe('progressBarParams.js', function () {
        var progressBarParamsInstance;
        beforeEach(function () {
            progressBarParamsInstance = progressBarParams();
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

        //todo check deffer and interval
    });
});