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

    /*----log in and sign up functionalities---*/
    /**
     * checks if the button exists and if it does, takes ths user to the
     * login and sign up page
     */
    // if (id("signup") !== null && id("login") !== null) {
    //   id("signup").addEventListener("click", function() {
    //     changePage("signup", "login.html");
    //   });

    //   id("login").addEventListener("click", function() {
    //     changePage("login", "login.html");
    //   });
    //}

    /*---log in and sign up functionalities end----*/

    let search = id('search-term');

    let searchBar = qs("#search-btn");
    searchBar.addEventListener("click", function() {
      document.querySelector("#search-results").innerHTML = "";
      startSearchSort(search.value);
      qs("#banner").classList.add("hidden");
    });
  }

  function startSearchSort(search) {
    fetchSeriesNames('/smiskiiseries')
      .then((data) => {
        console.log(data);
        for(let i = 0; i < data.length; i++) {
          if(search.toLowerCase() === data[i]){
            seriesSearchView(search);
          }
        }
        // Use the fetched data here or perform additional operations
      })
      .catch(handleError);
  }

  function seriesSearchView(search) {
    let url = "";
    if (/\s/.test(search)) {
      let allNames = data.name.split(" ");
      for(let i = 0; i < allNames.length; i++) {
           search += allNames.toLowerCase();
      }
      url = "/allsmiskiis/?search=" + search();
    } else {
      url = "/allsmiskiis/?search=" + search.toLowerCase();
    }
    fetchNamesinSeries(search, url);

  }

  function fetchNamesinSeries(search, url) {
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(async (data) => {
        await buildSearchViewCards(search, data);
      })
      .catch(handleError);
  }

  function buildSearchViewCards(search, data) {
    //this data should have all of the names
    //data[i].Names
    for(let i = 0; i < 6; i++) {
      let seriesArticle = gen('article');
      seriesArticle.classList.add("series-card");
      let smiskiiImg = gen('img');
      let names = data[i].Names;
      if((/\s/.test(names)) || names.includes("-")) {
        let allNames = "";
        if(/\s/.test(names)) {
          allNames = names.split(" ");
        } else {
          allNames = names.split("-");
        }
        names = "";
        for(let i = 0; i < allNames.length; i++) {
          names += allNames[i];
        }
        names = names.toLowerCase();
      }
      smiskiiImg.src = "/img/series/" + search + "/" + names + ".png";
      smiskiiImg.alt = search + " picture";
      seriesArticle.appendChild(smiskiiImg);
      let seriesName = gen('p');
      seriesName.innerHTML = data[i].Names;
      seriesName.classList.add("series-name-card");
      seriesArticle.appendChild(seriesName);
      seriesArticle.addEventListener("click", loadSmiskiiSearchView);
      qs("#search-results").appendChild(seriesArticle);
    }
  }

  function loadSmiskiiSearchView() {
    document.querySelector("#search-results").innerHTML = "";
    console.log("hey");
  }

  function handleError(err) {
    console.log(err);
  }

  /**
   * gets all the yips for just one user
   * @param {string} url - the endpoint for API
   */
  function fetchSeriesNames(url) {
    return fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .catch(handleError);
  }

  /**
   * checks that the data is valid and what the user was looking for
   * @param {string} result - data fetched from api
   */
  async function statusCheck(result) {
    if (!result.ok) {
      throw new Error(await result.text());
    }
    return result;
  }

  /**
   * when the user clicks the button it will take them to a specfied page
   * @param {string} id - element ID.
   * @param {string} url - url to the different page
   */
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

  /**
   * Returns the element that has the qs attribute with the specified value.
   * @param {string} selector - selector we are looking for.
   * @returns {object} - DOM objects associated with selectors.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Makes a new element and returns it
   * @param {string} tagName - the element to be created.
   * @returns {object} - the new element
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();