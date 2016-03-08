(function(){
'use strict';

angular.module('recipes', ['ngRoute','recipes.services'])

// Routes
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes', {
    templateUrl: 'recipes/views/list.html',
    controller: 'RecipesListCtrl'
  });

  $routeProvider.when('/recipes/new', {
    templateUrl: 'recipes/views/recipe-form.html',
    controller: 'RecipeFormCtrl'
  });

  $routeProvider.when('/recipes/:id', {
    templateUrl: 'recipes/views/detail.html',
    controller: 'RecipeDetailCtrl'
  });

    $routeProvider.when('/recipes/:id/edit', {
    templateUrl: 'recipes/views/recipe-form.html',
    controller: 'RecipeFormCtrl'
  });

}])

// Controllers
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
	this.increaseRating = function(recipe){
		return increaseRating(recipe, recipesCrudService);
	};
}])

.controller('RecipeDetailCtrl', function(recipesCrudService, $scope, $routeParams) {
	$scope.recipe = recipesCrudService.get($routeParams.id);
	$scope.newComment = {};
	$scope.increaseRating = function(){
		return increaseRating($scope.recipe, recipesCrudService);
	};
	$scope.createComment = function(form){
		$scope.newComment.datetime = new Date();			
		$scope.recipe.comments.push($scope.newComment);
		recipesCrudService.update($scope.recipe);
		$scope.newComment = {};
		form.$setPristine();
	};
	$scope.removeRecipe = function(){
		recipesCrudService.remove($scope.recipe.id);
		$location.path("/recipes");
	};
})

.controller('RecipeFormCtrl', function(recipesCrudService, $scope, $routeParams, $location) {
	$scope.isNew = !$routeParams.id;
	$scope.recipe = $scope.isNew ? {} : recipesCrudService.get($routeParams.id);
	$scope.recipe.ingredients = $scope.recipe.ingredients || [];
	$scope.newIngredient = {};
	$scope.enoughIngredients = function(){return $scope.recipe.ingredients.length > 0};
	$scope.notUniqueName = $scope.isNew && recipesCrudService.checkName($scope.recipe.name);

	$scope.persistRecipe = function(){
		if($scope.isNew){
			$scope.recipe.image = "img/spaghetti.jpg";
			$scope.recipe = createRecipe();
		} else {
			updateRecipe();
		}
		$location.path("/recipes/" + $scope.recipe.id);
	};

	$scope.addIngredient = function(){
		
		$scope.recipe.ingredients.push($scope.newIngredient);
		$scope.newIngredient = {};
	}

	function createRecipe(){
		return recipesCrudService.add($scope.recipe);	
	};

	function updateRecipe(){
		recipesCrudService.update($scope.recipe);	
	};
})



// Directives
.directive('recipeListItem', [function () {
	return {
		restrict: 'E',
		templateUrl: "recipes/views/partials/list-item.html",
		controller: "RecipeCtrl as recipeCtrl"
	};
}])

.directive('recipeIngredient', [function () {
	return {
		restrict: 'E',
		templateUrl: "recipes/views/partials/ingredient.html",
		replace: true
	};
}])

.directive('recipeComment', [function () {
	return {
		restrict: 'E',
		templateUrl: "recipes/views/partials/comment.html",
		replace: true
	};
}])

.directive('commentForm', [function () {
	return {
		restrict: 'E',
		templateUrl: "recipes/views/partials/comment-form.html",
		replace: true
	};
}])
;

// Common private functions
var increaseRating = function(recipe, recipesCrudService){
		recipe.rating++;
		recipesCrudService.update(recipe);
	};
})();
