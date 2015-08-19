"use strict";
describe('progressBar directive', function () {
    var progressBar, scope, compile, progressBarManager, $progressElement, $barElement;

    beforeEach(function () {
        module('Tek.progressBar');

        inject(function ($compile, $rootScope, $injector) {
            progressBarManager = $injector.get('progressBarManager')();
            compile = $compile;
            scope = $rootScope.$new();
            scope.bar = progressBarManager;

        });

        progressBar = getCompiledElement();
        $progressElement = angular.element(progressBar.find('div')[0]);
        $barElement = angular.element(progressBar.find('div')[1]);
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
});