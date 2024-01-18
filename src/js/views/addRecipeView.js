import View from "./View";

class AddRecipeView extends View {
    
    _parentElement = document.querySelector(".upload");
    _message = "Recipe successfully uploaded!"
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    };

    toggleWindow() {
        this._overlay.classList.toggle("hidden"),
        this._window.classList.toggle("hidden")
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
    };

    _addHandlerHideWindow() {
        this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
        this._overlay.addEventListener("click", this.toggleWindow.bind(this));
    };

    _generateMarkup() {
    };

    addHandlerUpload(handler) {
        // Attach a submit event listener to the parent element.
        this._parentElement.addEventListener("submit", function(e) {
            // Prevent the default form submission behavior.
            e.preventDefault();
            
            // Convert the form data to an array of key-value pairs.
            const dataArr = [...new FormData(this)];
            
            // Convert the array of key-value pairs to an object.
            const data = Object.fromEntries(dataArr);
            
            // Invoke the provided handler with the extracted data.
            handler(data);
        });
    };

};

export default new AddRecipeView();
