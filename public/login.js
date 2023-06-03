'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * This function intializes the webpage once it has loaded.
   */
  function init() {
    let loginPage = id('login-page');
    let signupPage = id('signup-page');
    let loginButton = id('login');
    let signupButton = id('signup');
    loginButton.addEventListener('click', function() {
      window.location.href = 'login.html';
    } );
    signupButton.addEventListener('click', function () {
      window.location.href = 'login.html';
    } );
  }

    // if (id("signup") !== null && id("login") !== null) {
    //   id("signup").addEventListener("click", function() {
    //     changePage("signup", "login.html");
    //   });

    //   id("login").addEventListener("click", function() {
    //     changePage("login", "login.html");
    //   });
    //}

  /**
   * when the user clicks the button it will take them to a specfied page
   * @param {string} id - element ID.
   * @param {string} url - url to the different page
   */

  /**
   * Shortcut function for creating an element.
   * @param {string} tagName - The tag name of the element to create.
   * @returns {HTMLElement} The newly created element.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Shortcut function for getting an element by an ID.
   * @param {string} id - The ID of the element to retrieve.
   * @returns {HTMLElement} The element with the specified ID.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Shortcut function for query selecting an item.
   * @param {string} selector - The CSS selector to match.
   * @returns {HTMLElement} The first element that matches the specified selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Shortcut function for query selecting all items of a sort.
   * @param {string} selector - The CSS selector to match.
   * @returns {NodeList} A static NodeList containing all elements matching the specified selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();