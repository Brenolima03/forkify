import * as model from "./model.js"
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { DEFAULT_PAGE, MODAL_CLOSE_SECONDS } from "./config.js";

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
	
		if (!id) return;
		recipeView.renderSpinner();
	
		// 0) Update results view to mark selected search result.
		resultsView.update(model.getSearchResultsPage());
		
		// 1) Updating bookmarks view.
		bookmarksView.update(model.state.bookmarks);

		// 2) Loading recipe.
		await model.loadRecipe(id);

		// 3) Rendering recipe.
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
		console.error(err);
	};
};

const controlSearchResults = async function() {
	try {
		resultsView.renderSpinner();

		// Get search query.
		const query = searchView.getQuery();
		
		if (!query) return;

		// Load search results.
		await model.loadSearchResults(query);

		// Render results.
		resultsView.render(model.getSearchResultsPage(DEFAULT_PAGE));

		// Render pagination buttons.
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	};
};

const controlPagination = function(goToPage) {
	// Render new results.
	resultsView.render(model.getSearchResultsPage(goToPage));

	// Render new pagination buttons.
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings (in state).
	model.updateServings(newServings);
  
	// Update the recipe view.
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
	// Add or remove bookmark.
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe); 
	else model.deleteBookmark(model.state.recipe.id);

	// Update the recipe view.
	recipeView.update(model.state.recipe);

	// Render bookmarks.
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
	bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function(newRecipe) {
	try {
		// Render spinner.
		addRecipeView.renderSpinner();

		// Upload the new recipe data.
		await model.uploadRecipe(newRecipe);

		// Render recipe.
		recipeView.render(model.state.recipe);

		// Success message.
		addRecipeView.renderMessage();

		// Render bookmark view.
		bookmarksView.render(model.state.bookmarks);

		// Change ID in the URL.
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		// Close form window.
		setTimeout(() => {
			addRecipeView.toggleWindow()
		}, MODAL_CLOSE_SECONDS * 1000);
	} catch (error) {
		// console.log(`Error: ${error}`);
		addRecipeView.renderError(error.message);
	};

};

const init = function() {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
