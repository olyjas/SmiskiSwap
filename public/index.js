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
        let originalNames = nameOfSmiski;
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
        console.log("HELLO");
        card.addEventListener("click", () => {
          //qs("#search-results").innerHTML = "";
          smiskiAdditionalInfo(data, originalNames, username);
        });
        // card.addEventListener("click", );
        parentContainer.appendChild(card);
      }
    } else {
      let h1Tag = gen('h1');
      h1Tag.innerHTML = "No Results Found. Please Search Again.";
      qs("#search-individual-results").appendChild(h1Tag);
    }
  }

  //this is supposed to be the view of the specifc listing of a smiski from a user
  function smiskiAdditionalInfo(data, originalNames, username) {
    console.log("this is supposed to be the view for the specfic listing");
    console.log(data);
    console.log(originalNames);
    console.log(username);
    qs("#search-results").innerHTML = "";
    qs("#search-individual-results").innerHTML = "";

    //getting the specific listing of the user out of the list of all users
    let found = false;
    //let listingInfo =[];
    let index = 0;
    while(!found) {
      let dataUsername = data[index].username;
      if(dataUsername === username) {
        found = true;
        data = data[index];
      } else {
        index++;
      }
    }
    console.log(data);

    //generating the page view with the info
    let parentContainer = qs("#smiski-listing-info");

    //the left (50%) side of the page will be a photo of the smiski
    let leftSideImg = gen('img');
    let listingName = data['name of listing'];
    if((/\s/.test(listingName)) || listingName.includes("-")) {
      let allNames = "";
      if(/\s/.test(listingName)) {
        allNames = listingName.split(" ");
      } else {
        allNames = listingName.split("-");
      }
      listingName = "";
      for(let i = 0; i < allNames.length; i++) {
        listingName += allNames[i];
      }
      listingName = listingName.toLowerCase();
    }
    let seriesName = data['series of listing'];
    leftSideImg.src = "/img/series/" + seriesName + "/" + listingName + ".png";
    leftSideImg.alt = seriesName + " " + listingName;
    leftSideImg.id = seriesName + " " + listingName;
    // leftSideImg.classList.add('left-side-smiski-listing-photo');
    // parentContainer.appendChild(leftSideImg);

    //the right side will house all of the information about the smiskii
    let card = gen('article');
    let h1NameTag = gen('h1');
    let h2Username = gen('h2');
    let h2PossibleTrade = gen('h2');
    let h3AdditionalInfo = gen('h3');
    let swapBtn = gen('button');
    swapBtn.id = "swap-button";

    h1NameTag.textContent = "smiski name: " + data['name of listing'];
    h2Username.textContent = "username of seller: " + username;
    h2PossibleTrade.textContent = "list of possible trades: " + data['possible trade'];
    h3AdditionalInfo.textContent = "any additional information: " + data['trade info'];
    swapBtn.innerHTML = "REQUEST SWAP";
    card.appendChild(h1NameTag);
    card.appendChild(h2Username);
    card.appendChild(h2PossibleTrade);
    card.appendChild(h3AdditionalInfo);
    card.appendChild(swapBtn);
    swapBtn.addEventListener("click", () => initateSwap(data, card, leftSideImg));
    card.classList.add('specfic-listing-info-box');
    leftSideImg.classList.add('left-side-smiski-listing-photo');
    parentContainer.appendChild(leftSideImg);
    parentContainer.appendChild(card);
  }

  //marks the beginning of the swap functionality
  function initateSwap(data, otherCard, otherPic) {
    console.log("initate swap");
    console.log(data);
    console.log(otherCard);
    console.log(otherPic);
    qs("#smiski-listing-info").innerHTMl = "";
    let parentContainer = qs("#swap-views");
    id('swap-button').classList.add('hidden');
    otherCard.classList.remove('specfic-listing-info-box');

    //create the card on the left side
    let leftSideCard = gen('article');
    otherPic.classList.add("circle-logo");
    otherCard.classList.add("swap-left-card");
    leftSideCard.appendChild(otherPic);
    leftSideCard.appendChild(otherCard);
    leftSideCard.classList.add('swap-left-side-card');

    //create the buttons in the middle
    let btnContainer = gen('article');
    let swapBtn = gen('button');
    swapBtn.innerHTML = "SWAP!";
    swapBtn.classList.add("actually-swapping-btn");
    btnContainer.appendChild(swapBtn);
    swapBtn.id = "actually-swapping"
    swapBtn.disabled = true;

    //create the swap you are suggesting on the right side
    let rightSideCard = gen('article');
    let rightSideImg = gen('img');
    rightSideImg.src = "/img/logo.png"
    rightSideImg.alt = "default logo";
    rightSideImg.id = "right-side-img-default"
    rightSideImg.classList.add("circle-logo");
    rightSideCard.appendChild(rightSideImg);

    let searchInput = gen('input');
    searchInput.id = "search-input";
    searchInput.type = 'text';
    searchInput.placeholder = 'enter the name of the smiski you choose to swap!';
    let submitBtn = gen('button');
    submitBtn.classList.add("sexy-enter-btn");
    submitBtn.innerHTML = "Enter Name!"
    searchInput.classList.add("sexy-name-input-btn");
    rightSideCard.appendChild(searchInput);
    rightSideCard.appendChild(submitBtn);
    rightSideCard.classList.add('swap-right-side-card');

    //append everything to the parent node
    parentContainer.appendChild(leftSideCard);
    parentContainer.appendChild(btnContainer);
    parentContainer.appendChild(rightSideCard);

    submitBtn.addEventListener("click", function() {
      //checkAndGetSmiski(searchInput.innerHTML);
      let input = searchInput.value;
      filterSearchPartTwo(input, '/search/:searchInput', leftSideCard)
      swapBtn.disabled = false;
    });
  }

  //fetch data about the inputed smiski
  function checkAndGetSmiski(data, search, otherCard) {
    console.log("ello");
    console.log(data);
    console.log(otherCard);
    // let nameAndSeries = otherCard.img.id;
    let nameAndSeries = otherCard.querySelector('img').id;
    console.log(nameAndSeries);
    console.log(search);
    if(data.length !== 0) {
      //change the img
      let rightImg = qs("#right-side-img-default");
      rightImg.src = "/img/series/" + data[0]['series of listing'] + "/" + data[0]['name of listing'] + ".png";
      rightImg.alt = data['series of listing'] + "/" + data['name of listing'];

      // qs('#actually-swapping').addEventListener("click", () => confirmSwapPage(data));
      qs('#actually-swapping').addEventListener("click", function() {
        confirmSwapPage(data, nameAndSeries, data[0]['series of listing'],  data[0]['name of listing']);
        //addSwapHistory(nameAndSeries, data[0]['series of listing'],  data[0]['name of listing']);
      });
    }
  }

  function addSwapHistory(nameAndSeries, mySeries, myListing) {
    nameAndSeries = nameAndSeries.split(" ");
    let gettingThisSeries = nameAndSeries[0];
    let gettingThisName = nameAndSeries[1];
    for(let i = 2; i < nameAndSeries.length; i++) {
      gettingThisName += nameAndSeries[i];
    }
    console.log(gettingName);
  }

  function confirmSwapPage(data, nameAndSeries, mySeries, mySmiski) {
    console.log("okay lets go");
    qs('#transaction').classList.remove('hidden');
    qs('#swap-views').innerHTML = "";
    nameAndSeries = nameAndSeries.split(" ");
    let gettingThisSeries = nameAndSeries[0];
    let gettingThisName = nameAndSeries[1];
    for(let i = 2; i < nameAndSeries.length; i++) {
      gettingThisName += nameAndSeries[i];
    }

    //display the transaction details
    let transactionDetails = gen('article');
    //let pTag = gen('p');
    let pTag = qs("#transaction-details");
    pTag.innerHTML = "You are swapping your " + mySmiski + " of the series " +
    mySeries + " for the smiski " + gettingThisName + " from " + gettingThisSeries;
    transactionDetails.appendChild(pTag);
    transactionDetails.classList.add('transaction-swap');
    qs('#transaction').appendChild(transactionDetails);

    let submitButton = document.querySelector('#transaction-form button[type="submit"]');
    submitButton.addEventListener('click', function() {
      storeSwap(gettingThisSeries, gettingThisName, mySeries, mySmiski);
    });
  }

  function storeSwap(otherSeries, otherName, mySeries, myName) {
    const baseURL = '/storeSwap';

    const url = new URL(baseURL);
    url.searchParams.append('otherSeries', otherSeries);
    url.searchParams.append('otherName', otherName);
    url.searchParams.append('mySeries', mySeries);
    url.searchParams.append('myName', myName);

    fetch(url)
      .then(response => response.json())
      // .then(data => {
      //   // Handle the response data
      // })
      .catch(error => {
        // Handle any errors
      });
  }

  function filterSearchPartTwo(search, url, otherCard) {
    const params = new FormData();
    params.append('searchInput', search);

    fetch(url, {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(data => checkAndGetSmiski(data, search, otherCard))
      .catch(handleError);
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
    console.log("buildSearchViewCards");
    console.log(data);
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
      // seriesArticle.addEventListener("click", function() {
      //   loadSmiskiiSearchView(data, originalNames);
      // });

      console.log("COME HERE");
      qs("#search-results").appendChild(seriesArticle);
    }
  }

  function loadSmiskiiSearchView(data, names) {
    //document.querySelector("#search-results").innerHTML = "";
    console.log("hey");
    console.log(data);
    console.log(this);
    console.log(names); //i have the indiviudal names
    qs("#search-results").innerHTML = "";
    qs("#search-individual-results").innerHTML = "";
    filterSearchPartOne(names, '/search/:searchInput')
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

