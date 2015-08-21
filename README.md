Angular Tek Progress-bar
==========================
angular-tek-progress-bar is an AngularJS module to create and controls progress bar.

## Overview
I began to code this module, because it became problematic to get a necessary behavior from ui.bootstrap.progressbar. 
Then i came across pg.progress-bars - it gave a possibility to reach the necessary behavior, 
but it had a couple of drawbacks - when the directive loaded during the controller processing, 
there was no possibility to gain the control of it.
Also it is sometimes more comfortable for me to simply change the value of progress without additional methods.
That's why i decided to combine the concepts of these two units, having reconsidered their concepts.

## Features

* Has two different control interfaces (simple by ng-model and advanced by manager)  
* Can control css animation
* By default fully comparable with bootstrap
* Fully customizable wia css


## Alternatives
**https://github.com/PSDCoder/progress-bars**

**https://github.com/angular-ui/bootstrap**

## Demo
**http://tekvando.github.io/Angular-Tek-Progress-bar/**
## Installing

Install through bower:
```
bower install --save angular-tek-progress-bar
```

Initialize the plugin by referencing the necessary files:

```htm
<script src="dist/tek.progress-bar.min.js"></script>
```

if tou want you can youse my progress-bar css styles 

Define module in your app:

```js
angular.module('yourModule', ['Tek.progressBar'])
```

## Examples

**Basic**

Javascript
```js
angular.module('yourModule').controller(function($scope){
	$scope.progressVal = 0;
});
```

Html

```html
<tek-progress-bar ng-model="progressVal"></tek-progress-bar>
```

**Advanced**
Through progressBarManager you can reach advanced control on progress bar

Javascript
```js
angular.module('yourModule').controller(function($scope, progressBarManager){
	$scope.progressManager = progressBarManager();
    $scope.progressManager.set(50);
    
    setTimeout(function(){
    	$scope.progressManager.clear(); // it will clear bar
    }, 1000);
});
```
Html
```html
<tek-progress-bar manager="progressManager"></tek-progress-bar>
```

**Combined**

Javascript
```js
angular.module('yourModule').controller(function($scope, progressBarManager){
	$scope.progressManager = progressBarManager(); 
    $scope.progressVal = 0;
    $scope.progressManager.set(50); // it will change progressVal value
    //it works in both directions
    $scope.progressVal = 30; // $scope.progressManager.get() return 30
    
    setTimeout(function(){
    	$scope.progressManager.clear(); // it will clear bar
    }, 1000);
});
```
Html
```html
<tek-progress-bar ng-model="progressVal" manager="progressManager"></tek-progress-bar>
```

## API

## tek-progress-bar directive

Then value of progress-bar equal 0 it will be added class bar-empty
Then value of progress-bar equal 100 it will be added class bar-full
```html
<tek-progress-bar
		manager="{object:progressBarManagerObject}"
		class="{sting:progress-container-element-class}"
		barClass="{sting:progress-bar-element-class}"
		ng-model="{number:model}">
</tek-progress-bar>
```

template structure
```html
<div class='progress' ng-class='bar.containerClass'>
	<div class='progress-bar' ng-class='bar.barClass' ng-transclude></div>
</div>
```
You can change it:
```js
$templateCache.put('Tek.progressBarDirective.html', "Your template");
```

## progressBarManager 

**How it works**

Then tek-progress-bar directive will initialize progressBarManager will set params witch you pass them from the controller.
One of benefit to use progressBarManager its that you can manipulate tek-progress-bar directive even if its not initialized yet.

Method      | Params | Return                   | Description                                                                    | 
------------| -------|--------------------------|--------------------------------------------------------------------------------|
getPromise  |        | {object:promise}    	    | this method return promise witch indicate then tek-progress-bar directive loaded |
get         |        | {number}				  	| this method return current progress value                                      |
set         | number | {this}                   | this method set new progress value                                             |
start       |        | {this}                   | Start progress incrementation                                                  | 
stop        |        | {this}                   | Stop increasing                                                                |
isInProgress|        | {bool}                   | Indicate increasing status                                                     |
increase    | number | {this}                   | Increase value                                                                 |
done        |        | {this}                   | Set progress value to 100 and any set function will animate from 0 (if animation value is true)|
reset       |        | {this}                   | Set progress value to 0                                                        |
clear       |        | {this}                   | Set progress value to 0 without animation                                      |
setAnimation| bool   | {this}                   | Set animation value                                                            |
isAnimated  |        | {bool} 				    | indicate animation status                                                      |


## License

is under MIT license - **http://www.opensource.org/licenses/mit-license.php**

## Development

* ```npm install``` to install development dependencies
* ```gulp build``` to build minified demo in build


