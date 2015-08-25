"use strict";
describe('progressBar directive', function () {
    var progressBar, progressBarWithModel, scope, compile, progressBarManager,
        verticalProgressBar,progressBarWithModelAndManager;

    var bar = '<tek-progress-bar manager="bar"></tek-progress-bar>';
    var verticalBar = '<tek-progress-bar mode="vertical" manager="verticalBar"></tek-progress-bar>';
    var barWithModel = '<tek-progress-bar ng-model="model"></tek-progress-bar>';
    var barWithModelAndManager = '<tek-progress-bar ng-model="model2" manager="bar2"></tek-progress-bar>';

    beforeEach(function () {
        module('Tek.progressBar');

        inject(function ($compile, $rootScope, $injector) {
            progressBarManager = $injector.get('progressBarManager');
            compile = $compile;
            scope = $rootScope.$new();
            scope.bar = progressBarManager();
            scope.bar2 = progressBarManager();
            scope.verticalBar = progressBarManager();
            scope.model = 0;
            scope.model2 = 0;
        });

        progressBar = getCompiledElement(bar);
        verticalProgressBar = getCompiledElement(verticalBar);
        progressBarWithModel = getCompiledElement(barWithModel);
        progressBarWithModelAndManager = getCompiledElement(barWithModelAndManager);
    });

    function getCompiledElement(Html) {
        var element = angular.element(Html);
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return {
            element: compiledElement,
            progressElement: angular.element(compiledElement.find('div')[0]),
            barElement: angular.element(compiledElement.find('div')[1])
        };
    }

    describe('Testing get method', function () {
        it('Value should be 0', function () {
            scope.bar.getPromise().then(function (obj) {
                expect(obj.get()).toEqual(0);
                expect(obj.get()).toEqual(scope.bar.get());
            });
        });

        it('Value should be 70', function () {
            scope.bar.set(70).getPromise().then(function (obj) {
                expect(obj.get()).toEqual(70);
                expect(obj.get()).toEqual(scope.bar.get());
            });
        });
    });

    describe('Testing bar width', function () {
        it('Width should be 0', function () {
            expect(progressBar.barElement.css('width')).toEqual('0%');
        });

        it('Width should be 100', function () {
            scope.bar.done();
            expect(progressBar.barElement.css('width')).toEqual('100%');
        });

        it('Width should be 0', function () {
            scope.bar.done().clear();
            expect(progressBar.barElement.css('width')).toEqual('0%');
        });
    });

    describe('Testing animation', function () { // todo rewrite
        //it('It should has transition none', function () {
        //    scope.bar.setAnimation(false);
        //    expect(progressBar.barElement.css('transition')).toEqual('none');
        //});

        it('It should has transition none', function () {
            scope.bar.setAnimation(false).setAnimation(true);
            expect(progressBar.barElement.css('transition')).toEqual('');
        });
    });

    describe('Testing class', function () {
        it('It should has empty class', function () {
            expect(progressBar.progressElement.hasClass('empty-bar')).toBeTruthy();
        });

        it('It should has empty class', function () {
            scope.bar.done();
            expect(progressBar.progressElement.hasClass('full-bar')).toBeTruthy();
        });

        it('It should has not full-bar and empty-bar class', function () {
            scope.bar.set(50);
            expect(progressBar.progressElement.hasClass('full-bar')).toBeFalsy();
            expect(progressBar.progressElement.hasClass('empty-bar')).toBeFalsy();
        });
    });


    describe('Testing vertical mode', function () {
        it('Height should be 0', function () {
            expect(verticalProgressBar.barElement.css('height')).toEqual('0%');
        });

        it('Height should be 100', function () {
            scope.verticalBar.done();
            expect(verticalProgressBar.barElement.css('height')).toEqual('100%');
        });

        it('Height should be 0', function () {
            scope.verticalBar .done().clear();
            expect(verticalProgressBar.barElement.css('height')).toEqual('0%');
        });
    });

    describe('Testing progressBar with ngModel', function () {
        beforeEach(function () {
            scope.model = 0;
            scope.$digest();
        });

        it('Width should be 100', function () {
            scope.model = 100;
            scope.$digest();
            expect(progressBarWithModel.barElement.css('width')).toEqual('100%');

            scope.model = 40;
            scope.$digest();
            expect(progressBarWithModel.barElement.css('width')).toEqual('40%');
        });

        it('Should be 100 if model value bigger then 100', function () {
            scope.model = 100000;
            scope.$digest();
            expect(progressBarWithModel.barElement.css('width')).toEqual('100%');
        });

        it('Should be 0 if model value less then 0', function () {
            scope.model = -1000;
            scope.$digest();
            expect(progressBarWithModel.barElement.css('width')).toEqual('0%');
        });
    });


    describe('Testing progressBar with ngModel and manager', function () {
        beforeEach(function () {
            scope.model2 = 0;
            scope.$digest();
        });

        it('Width should be 100', function () {
            scope.model2 = 100;
            scope.$digest();

            expect(scope.bar2.get()).toEqual(100);
            expect(progressBarWithModelAndManager.barElement.css('width')).toEqual('100%');
        });

        it('Width should be 100', function () {
            scope.bar2.set(100);
            scope.$digest();
            expect(scope.model2).toEqual(100);
            expect(progressBarWithModelAndManager.barElement.css('width')).toEqual('100%');
        });
    });
});