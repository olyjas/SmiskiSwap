/**
 * JASMINE ZHANG & STHITI PATNAIK
 * 5/7/2023
 * SECTION AG & AF
 * TA: TARA WUEGER & ALLISON HO
 * This is the index.js page of our project, Sonny Swap. It contains the different
 * behaviors of our website and directs the users to different pages.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * this initializes the event listeners on the buttons on both pages
   */
  function init() {
    id("signup").addEventListener("click", () => {
      changePage();
    });
  }

  /**
   * Makes a new element and returns it
   * @param {string} tagName - the element to be created.
   * @returns {object} - the new element
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that has the qs attribute with the specified value.
   * @param {string} selector - selector we are looking for.
   * @returns {object} - DOM objects associated with selectors.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns all of the elements that has the qs attribute with the specified value.
   * @param {string} selector - selector we are looking for.
   * @returns {object} - DOM objects associated with selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

})();