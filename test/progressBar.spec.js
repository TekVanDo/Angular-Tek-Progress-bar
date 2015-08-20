"use strict";
describe('progressBar directive', function () {
    var progressBar, progressBarWithModel, scope, compile, progressBarManager, $progressElement,
        $barElement, $progressElementWithModel, $barElementWithModel;

    var bar = '<tek-progress-bar manager="bar"></tek-progress-bar>';
    var barWithModel = '<tek-progress-bar ng-model="model"></tek-progress-bar>';
    beforeEach(function () {
        module('Tek.progressBar');

        inject(function ($compile, $rootScope, $injector) {
            progressBarManager = $injector.get('progressBarManager')();
            compile = $compile;
            scope = $rootScope.$new();
            scope.bar = progressBarManager;
            scope.model = 0;
        });

        progressBar = getCompiledElement(bar);
        $progressElement = angular.element(progressBar.find('div')[0]);
        $barElement = angular.element(progressBar.find('div')[1]);

        progressBarWithModel = getCompiledElement(barWithModel);
        $progressElementWithModel = angular.element(progressBarWithModel.find('div')[0]);
        $barElementWithModel = angular.element(progressBarWithModel.find('div')[1]);
    });

    function getCompiledElement() {
        var element = angular.element('<tek-progress-bar manager="bar"></tek-progress-bar>');
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    describe('Testing bar width', function () {
        it('Width should be 0', function () {
            expect($barElement.css('width')).toEqual(0 + '%');
        });

        it('Width should be 100', function () {
            scope.bar.done();
            expect($barElement.css('width')).toEqual(100 + '%');
        });

        it('Width should be 0', function () {
            scope.bar.done().clear();
            expect($barElement.css('width')).toEqual(0 + '%');
        });
    });
    //
    //describe('Testing animation', function () { // todo rewrite
    //    it('It should has transition none', function () {
    //        scope.bar.setAnimation(false);
    //        expect($barElement.css('transition')).toEqual('none');
    //    });
    //});

    describe('Testing class', function () {
        it('It should has empty class', function () {
            expect($progressElement.hasClass('empty-bar')).toBeTruthy();
        });

        it('It should has empty class', function () {
            scope.bar.done();
            expect($progressElement.hasClass('full-bar')).toBeTruthy();
        });

        it('It should has not full-bar and empty-bar class', function () {
            scope.bar.set(50);
            expect($progressElement.hasClass('full-bar')).toBeFalsy();
            expect($progressElement.hasClass('empty-bar')).toBeFalsy();
        });
    });

    //describe('Testing progressBar with ngModel', function () { //todo
    //    beforeEach(function () {
    //        scope.model = 100;
    //        scope.$digest();
    //    });
    //
    //    it('Width should be 100', function () {
    //        console.log($barElementWithModel);
    //        expect($barElementWithModel.css('width')).toEqual(100 + '%');
    //    });
    //});
});