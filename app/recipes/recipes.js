'use strict';

angular.module('recipes', ['ngRoute','recipes.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes', {
    templateUrl: 'recipes/views/list.html',
    controller: 'RecipesListCtrl'
  });

  $routeProvider.when('/recipes/new', {
    templateUrl: 'recipes/views/new.html',
    controller: 'CreateCtrl'
  });

}])

.controller('RecipesListCtrl', ['recipesCrudService', function(recipesCrudService) {
	console.log("home controller loading");
	
	var self = this;
	this.pagingOptions = {
			currentPage: 1,
			itemsPerPage: 3,
			query: null
		};

	var refreshList = function(){
		self.recipesToShow = recipesCrudService.list(self.pagingOptions);
	};

	refreshList();
	
	function calculatePages(){
		return Math.ceil(recipesCrudService.count(self.pagingOptions) / self.pagingOptions.itemsPerPage);
	};

	this.numberOfPages = calculatePages();
	this.showPagination = function(){ return this.numberOfPages > 1;};

	this.previousPage = function(){
		this.pagingOptions.currentPage = Math.max(1, this.pagingOptions.currentPage - 1);
		refreshList();
	};

	this.nextPage = function(){
		this.pagingOptions.currentPage = Math.min(this.numberOfPages, this.pagingOptions.currentPage + 1);
		refreshList();
	};

	this.searchName = function(query){
		this.pagingOptions.query = query;
		this.pagingOptions.currentPage = 1;
		this.numberOfPages = calculatePages(query);
		refreshList();
	};

	this.setSorting = function(sorting){
		this.pagingOptions.sorting = sorting;
		refreshList();
	};
}])

.controller('RecipeCtrl', ['recipesCrudService', function(recipesCrudService) {
	var self = this;
	this.increaseRating = function(id){
		var old = recipesCrudService.get(id);
		old.rating++;
		recipesCrudService.update(old);
	};
}])
.directive('recipeListItem', [function () {
	console.log("recipe directive loading");
	return {
		restrict: 'E',
		templateUrl: "recipes/views/partials/list-item.html"
	};
}])
;

