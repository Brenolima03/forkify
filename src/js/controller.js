import * as model from "./model.js"
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/recipeView.js";
import { DEFAULT_PAGE } from "./config.js";

if (module.hot) {
	module.hot.accept();
};

const controlRecipes = async function () {
	try {
	  const id = window.location.hash.slice(1);
  
	  if (!id) return;
	  recipeView.renderSpinner();
  
	  // 0) Update results view to mark selected search result
	  resultsView.update(model.getSearchResultsPage());
	  bookmarksView.update(model.state.bookmarks);

	  // 2) Loading recipe
	  await model.loadRecipe(id);
  
	  // 3) Rendering recipe
	  recipeView.render(model.state.recipe);
	} catch (err) {
	  recipeView.renderError();
	  console.error(err);
	}
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
}

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
const init = function() {
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};
init();
