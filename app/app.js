(function(){
	'use strict';

	// Declare app level module which depends on views, and components
	angular.module('app', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.otherwise({redirectTo: '/recipes'});
	}]);
})();
