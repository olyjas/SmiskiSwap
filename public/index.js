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

    /** checks if the button exists and if it does, takes ths user to the
     * login and sign up page
     */
    if(id("signup") !== null && id("login") !== null) {
      id("signup").addEventListener("click", function() {
            changePage("signup", "login.html");
      });

      id("login").addEventListener("click", function() {
        changePage("login", "login.html");
      });
    };

  }

  function changePage(id, url) {
    window.location.href = url;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

})();