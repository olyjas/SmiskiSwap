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

    let loginButton = id('login-btn');
    let signupButton = id('signup-btn');
    let logo = id ('logo-img');
    loginButton.addEventListener('click', loginView);
    signupButton.addEventListener('click', signupView);
    logo.addEventListener('click', homeView);

    /*---log in and sign up functionalities end----*/

    let search = id('search-term');
    fetchReccomended('/smiskilistings');

    let searchBar = qs("#search-btn");
    searchBar.addEventListener("click", function() {
      qs("#search-results").innerHTML = "";
      qs("#search-individual-results").innerHTML = "";
      filterSearchPartOne(search.value, '/search/:searchInput')
      //startSearchSort(search.value);
      qs("#banner").classList.add("hidden");
      qs("#recommended-boxes").classList.add("hidden");
    });
  }

  function loginView() {
    clearForLoginSignup();
    let signupPage = id('signup-page');
    signupPage.classList.add('hidden');
    let loginPage = id('login-page');
    loginPage.classList.remove('hidden');
    let login = id('signup-from-login');
    login.addEventListener('click',  signupView);
    let backButton = id('home-from-login');
    backButton.addEventListener('click', homeView);
  }

  function signupView() {
    clearForLoginSignup();
    let loginPage = id('login-page');
    loginPage.classList.add('hidden');
    let signupPage = id('signup-page');
    signupPage.classList.remove('hidden');
    let login = id('login-from-signup');
    login.addEventListener('click', loginView);
    let backButton = id('home-from-signup');
    backButton.addEventListener('click', homeView);
  }

  function clearForLoginSignup() {
    let header = qs('header');
    let banner = id('banner');
    header.classList.add('hidden');
    banner.classList.add('hidden');
    let searchResults = id('search-results');
    searchResults.classList.add('hidden');
    let accountDetails = id('account-details');
    accountDetails.classList.add('hidden');
  }

  function homeView() {
    let header = qs('header');
    let banner = id('banner');
    header.classList.remove('hidden');
    banner.classList.remove('hidden');
    let searchResults = id('search-results');
    searchResults.innerHTML = '';
    searchResults.classList.remove('hidden');
    let searchTerm = id('search-term');
    searchTerm.value = '';
    let accountDetails = id('account-details');
    accountDetails.classList.remove('hidden');
    let signupPage = id('signup-page');
    signupPage.classList.add('hidden');
    let loginPage = id('login-page');
    loginPage.classList.add('hidden');
  }

  function fetchReccomended(url) {
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(populateReccomended)
      .catch(handleError);
  }

  function populateReccomended(data) {
    for(let i = 1; i <= 4; i++) {
      const randomIndex = Math.floor(Math.random() * data.length) + 1;

      let username = data[randomIndex].username;
      let listing = data[randomIndex]['name of listing'];
      let series = data[randomIndex]['series of listing'];
      let orginalListing = listing;

      let container = qs("#reccomended" + i);
      container.classList.add("reccomendedboxes");
      let smiskiiImg = gen('img');
      if((/\s/.test(listing)) || listing.includes("-")) {
        let allNames = "";
        if(/\s/.test(listing)) {
          allNames = listing.split(" ");
        } else {
          allNames = listing.split("-");
        }
        listing = "";
        for(let i = 0; i < allNames.length; i++) {
          listing += allNames[i];
        }
        listing = listing.toLowerCase();
      }
      smiskiiImg.src = "/img/series/" + series + "/" + listing + ".png";
      smiskiiImg.alt = series + " " + orginalListing;
      smiskiiImg.id = series + " " + orginalListing;
      console.log(smiskiiImg.id);
      console.log(smiskiiImg.src);
      container.appendChild(smiskiiImg);
      let seriesName = gen('p');
      seriesName.innerHTML = listing;
      console.log(seriesName);
      seriesName.classList.add("reccomended-name-card");
      container.appendChild(seriesName);
      container.addEventListener("click", reccomendedClickAction);
    }
  }

  function reccomendedClickAction() {
    console.log("COME HERE!");
    console.log(this);
    let article = id(this.id);
    let img = article.querySelector("img");
    let imgId = img.id;
    console.log(imgId);
    let chunks = imgId.split(" ");
    let seriesName = chunks[0];
    let name = chunks[1];
    for(let i = 2; i < chunks.length; i++) {
      name += chunks[i];
    }
    let url = "/smiskilisting/:smiskiName";

    fetchListingInfo(url, name);
  }

  /**
   * fetches data for a the likes for a yip and increments it by 1
   * @param {string} url - the endpoint for API
   * @param {string} name - the name of the listing
   */
  function fetchListingInfo(url, name) {
    const params = new FormData();
    params.append('smiskiName', name);

    fetch(url, {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(data => populateIndividualView(data))
      .catch(handleError);
  }

  function populateIndividualView(data, search) {
    // console.log(name);
    // console.log("data");
    // console.log(data);
    // // console.log(data.Series);
    // // console.log(data[0].Series);
    // console.log(data[0].length == 2);
    // console.log(data.isEmpty());
    //if(data !== null && data[0].Series) {
    if(!(data.length === 0) && data[0].Series) {
      console.log("help");
      seriesSearchView(search);
    } else if(data !== null) {
      console.log(data);
      console.log("hello");
        for (let i = 0; i < data.length; i++) {
        let parentContainer = qs("#search-individual-results");

        id("landingpage").classList.add("hidden");
        id("recommended-boxes").classList.add("hidden");
        let nameOfSmiski = data[i]['name of listing'];
        let seriesName = data[i]['series of listing'];
        let username = data[i].username;

        let card = gen('article');
        card.classList.add("individualcard");
        card.classList.add("individualcard");

        let imgLogo = gen('img');
        if((/\s/.test(nameOfSmiski)) || nameOfSmiski.includes("-")) {
          let allNames = "";
          if(/\s/.test(nameOfSmiski)) {
            allNames = nameOfSmiski.split(" ");
          } else {
            allNames = nameOfSmiski.split("-");
          }
          nameOfSmiski = "";
          for(let i = 0; i < allNames.length; i++) {
            nameOfSmiski += allNames[i];
          }
          nameOfSmiski = nameOfSmiski.toLowerCase();
        }
        imgLogo.src = "/img/series/" + seriesName + "/" + nameOfSmiski + ".png";
        imgLogo.classList.add("circlecardlogo");
        card.appendChild(imgLogo);
        let cardContent = gen('div');
        cardContent.classList.add('indi-card-content');

        let nameHeader = gen('h1');
        nameHeader.classList.add('indi-card-header');
        let usernameTag = gen('h2');
        usernameTag.classList.add('indi-card-username');
        nameHeader.innerHTML = "Username: " + username;
        usernameTag.innerHTML = "Name of Smiski: " + nameOfSmiski;
        cardContent.appendChild(nameHeader);
        cardContent.appendChild(usernameTag);
        card.appendChild(cardContent);
        console.log(3);
        parentContainer.appendChild(card);
      }
    } else {
      let h1Tag = gen('h1');
      h1Tag.innerHTML = "No Results Found. Please Search Again.";
      qs("#search-individual-results").appendChild(h1Tag);
    }
  }

  function filterSearchPartOne(search, url) {
    const params = new FormData();
    params.append('searchInput', search);

    fetch(url, {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(data => populateIndividualView(data, search))
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
      let originalNames = names;
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
      //seriesArticle.addEventListener("click", populateIndividualView(data, search));
      seriesArticle.addEventListener("click",() => loadSmiskiiSearchView(data, originalNames));
      qs("#search-results").appendChild(seriesArticle);
    }
  }

  //this is the method that i want to be able to call whenever making cards
  //of some sort. right now, we will test the functionalities with the reccomeended
  //section on the home page or maybe i use this for the other search results actually
  function buildCards(search, data, num, parentContainer) {
    for(let i = 0; i < num; i++) {
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
      //seriesArticle.addEventListener("click", loadSmiskiiSearchView);
      seriesArticle.addEventListener("click", () => {
        document.querySelector("#search-results").innerHTML = "";
        loadSmiskiiSearchView();
      });
      parentContainer.appendChild(seriesArticle);
    }
  }

  //view for the individual smiskii
  function loadSmiskiiSearchView(data, names) {
    //document.querySelector("#search-results").innerHTML = "";
    console.log("hey");
    console.log(data);
    console.log(this);
    console.log(names); //i have the indiviudal names
    qs("#search-results").innerHTML = "";
    qs("#search-individual-results").innerHTML = "";
    filterSearchPartOne(names, '/search/:searchInput')

    // populateIndividualView();
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