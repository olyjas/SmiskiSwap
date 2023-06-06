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
  // Signed-In initial value is false, not signed in
  let signedIn = false;

  window.addEventListener("load", init);

  /**
   * this initializes the event listeners on the buttons on both pages
   */
  function init() {

    updateHeaderView();
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');

    let loginButton = id('login-btn');
    let signupButton = id('signup-btn');
    let logo = id ('logo-img');

    loginButton.addEventListener('click', loginView);
    signupButton.addEventListener('click', signupView);
    logo.addEventListener('click', homeView);

    /*---log in and sign up functionalities end----*/

    let search = id('search-term');
    console.log(search.value);
    fetchReccomended('/smiskilistings');

    let searchBar = qs("#search-btn");
    searchBar.addEventListener("click", function() {

      clearViewsExceptHome();
      console.log(search.value);
      filterSearchPartOne(search.value, '/search/:searchInput');
      qs("#banner").classList.add("hidden");
      qs("#recommended-boxes").classList.add("hidden");
    });

    let accountButton = id('account-button');
    accountButton.addEventListener('click', accountView);

    qs('.filterSelect').addEventListener('change', (event) => {
      const selectedOption = event.target.value;
      console.log("pleae work");
      console.log(selectedOption);
      console.log(event);
      if(selectedOption === 'alphabetical') {
        handleFilterSelection(selectedOption);
      } else {
        handleFilterSelection(selectedOption);
      }
    });
  }

  function updateHeaderView() {
    const signedInElements = qsa('#signed-in .signed-in-icons');
    const notSignedInElements = qsa('#not-signed-in button');

    if (signedIn) {
      // User is signed in
      signedInElements.forEach(element => {
        element.classList.remove('hidden');
      });
      notSignedInElements.forEach(element => {
        element.classList.add('hidden');
      });
    } else {
      // User is not signed in
      signedInElements.forEach(element => {
        element.classList.add('hidden');
      });
      notSignedInElements.forEach(element => {
        element.classList.remove('hidden');
      });
    }
  }

  function loginView() {
    clearForLoginSignup();
    let signupPage = id('signup-page');
    signupPage.classList.add('hidden');
    let loginPage = id('login-page');
    loginPage.classList.remove('hidden');

    updateHeaderView();

    // Handle login form submission
    let loginForm = id('login-form');
    loginForm.addEventListener('submit', loginUser);

    let signupLink = id('signup-from-login');
    signupLink.addEventListener('click',  signupView);
    let backButton = id('home-from-login');
    backButton.addEventListener('click', homeView);
  }

  // Function to handle login form submission
  async function loginUser(event) {
    event.preventDefault();

    // Get the login form input values
    const username = id('login-username').value;
    const password = id('login-password').value;

    // Send a POST request to the login route
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        // Login successful
        const data = await response.json();
        console.log(data.message);
        let loginError = id('login-error');
        loginError.textContent = '';

        // STORE LOGGED IN USER'S USERNAME IN LOCAL STORAGE
        localStorage.setItem('username', username);

        signedIn = true;
        updateHeaderView();
        homeView();
      } else {
        // Login unsuccesful
        const errorData = await response.json();
        console.log(errorData.message);
        let loginError = id('login-error');
        loginError.textContent = 'Incorrect username or password';
      }
  }
////////


  function signupView() {
    clearForLoginSignup();
    let loginPage = id('login-page');
    loginPage.classList.add('hidden');
    let signupPage = id('signup-page');
    signupPage.classList.remove('hidden');

    clearViewsExceptHome();
    updateHeaderView();

    // Handle login form submission
    let signupForm = id('signup-form');
    signupForm.addEventListener('submit', signupUser);

    let loginLink = id('login-from-signup');
    loginLink.addEventListener('click', loginView);
    let backButton = id('home-from-signup');
    backButton.addEventListener('click', homeView);
  }

  async function signupUser(event) {
    event.preventDefault();

    // Get the signup form input values
    const username = id('signup-username').value;
    const password = id('signup-password').value;
    const email = id('signup-email').value;

    // Send a POST request to the signup API endpoint
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email })
    });

    if (response.ok) {
      // Signup successful
      const data = await response.json();
      console.log(data.message);
      let signupError = id('signup-error');
      signupError.textContent = '';
      location.reload();
    // Perform any necessary actions after successful signup
    } else {
      // Signup unsuccessful
      const errorData = await response.json();
      console.log(errorData.message);
      // Handle the error or display an error message to the user
      let signupError = id('signup-error');
      signupError.textContent = "Username unavailable";
    }
  }

  function clearForLoginSignup() {
    let recommended = id('recommended-boxes');
    let header = qs('header');
    let banner = id('banner');
    header.classList.add('hidden');
    banner.classList.add('hidden');
    recommended.classList.add('hidden');
    let searchResults = id('search-results');
    searchResults.classList.add('hidden');
    let accountDetails = id('account-details');
    accountDetails.classList.add('hidden');

    clearViewsExceptHome();
  }


  function homeView() {
    hideCreateListingPage()
    hideAccountDetails();
    hideSignOutUser();
    hideViewTradeHistory();
    let header = qs('header');
    let banner = id('banner');
    header.classList.remove('hidden');
    banner.classList.remove('hidden');
    id('landingpage').classList.remove('hidden');
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
    let recommended = id('recommended-boxes');
    recommended.classList.remove('hidden');
    let accountView = id('account-view');
    accountView.classList.add('hidden');

    id('reccomended1').innerHTML = "";
    id('reccomended2').innerHTML = "";
    id('reccomended3').innerHTML = "";
    id('reccomended4').innerHTML = "";
    fetchReccomended('/smiskilistings');

    clearViewsExceptHome();

  }

  function clearViewsExceptHome() {
    hideCreateListingPage()
    hideAccountDetails();
    hideSignOutUser();
    hideViewTradeHistory();
    id('search-results').innerHTML = ""
    //id('search-individual-results').innerHTML = "";
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');
    qs("#cardformatting").innerHTML = "";
    // qs('.individualcard').innerHTML = "";
    // qs('.filterSelect').classList.add("hidden");
    id('smiski-listing-info').innerHTML = "";
    id('swap-views').innerHTML = "";
    id('transaction').classList.add('hidden');
    let creatingListing = id('creating-listing');
    creatingListing.classList.add('hidden');
  }

  function accountView() {
    displayAccountDetails();
    let accountView = id('account-view');
    accountView.classList.remove('hidden');
    let recommended = id('recommended-boxes');
    let banner = id('banner');
    banner.classList.add('hidden');
    recommended.classList.add('hidden');
    let searchResults = id('search-results');
    searchResults.classList.add('hidden');
    // FETCH REQUEST FOR PROFILE, in progress backend wise
    let createListing = id('create-listing');
    createListing.addEventListener('click', createListingPage);
    let signOut = id('sign-out');
    signOut.addEventListener('click', signOutUser);
    let viewTradeHistory = id('view-trade-history');
    viewTradeHistory.addEventListener('click', viewTradeHistoryPage);
    let accountDetails = id('account-details');
    accountDetails.addEventListener('click', displayAccountDetails);
  }

   function displayAccountDetails() {
    hideSignOutUser();
    hideCreateListingPage();
    hideViewTradeHistory();
    let accountDetails = id('account-details-page');
    accountDetails.classList.remove('hidden');
    populateAccountDetails();
   }

   function populateAccountDetails() {
    let username = localStorage.getItem('username');
    let usernameFromDetails = id('account-details-username');
    usernameFromDetails.textContent = username

    fetch('account-details/' + username)
    .then(response => response.json())
    .then(data => {
      const email = data.email;
      let emailFromDetails = id('account-details-email');
      emailFromDetails.textContent = email;
   })
   .catch(handleError);
   }

   function hideAccountDetails() {
    let accountDetails = id('account-details-page');
    accountDetails.classList.add('hidden');
   }

  function viewTradeHistoryPage() {
    let tradeHistoryPage = id('view-history-page');
    tradeHistoryPage.classList.remove('hidden');
    hideAccountDetails()
    hideSignOutUser();
    hideCreateListingPage();
    fetchTradeHistory();
  }

  function fetchTradeHistory() {
    let allSwapsContainer = id('view-history-div');
    allSwapsContainer.innerHTML = '';
    let username = localStorage.getItem('username')
    fetch('/swap-history/' + username)
      .then(response => response.json())
      .then(handleTradeHistory)
      .catch(handleError);
  }

  function handleTradeHistory(data) {
    const swappedHistory = data.swappedHistory;
    const swappedForHistory = data.swappedForHistory;
    populateSwapHistory(swappedHistory, swappedForHistory);
  }

  function populateSwapHistory(swappedHistory, swappedForHistory) {
    console.log(swappedHistory);
    console.log(swappedForHistory);
    let allSwapsContainer = id('view-history-div');
    if (swappedHistory[0] != "") {
      for (let i = 0; i < swappedHistory.length; i++) {
        let swapContainer = gen('div');
        let swapText = gen('p');
        swapText.textContent = "Swapped " + swappedHistory[i] + " for " + swappedForHistory[i]
        swapContainer.appendChild(swapText);
        allSwapsContainer.appendChild(swapContainer);
      }
    } else {
      let noSwapsContainer = gen('div');
      let noSwapsText = gen('p');
      noSwapsText.textContent = "No swaps yet!";
      noSwapsContainer.appendChild(noSwapsText);
      allSwapsContainer.appendChild(noSwapsContainer);
    }
  }

  function signOutUser() {
    hideCreateListingPage();
    hideViewTradeHistory();
    hideAccountDetails();
    let attemptSignOut = id('sign-out-attempt');
    attemptSignOut.classList.remove('hidden');
    let confirmButton = id('confirm-sign-out');
    let cancelButton = id('cancel-sign-out');
    confirmButton.addEventListener('click', confirmSignOut);
    cancelButton.addEventListener('click', cancelSignOut);
  }

  function confirmSignOut() {
    localStorage.removeItem('username');
    signedIn = false;
    location.reload();
  }

  function cancelSignOut() {
    let attemptSignOut = id('sign-out-attempt');
    attemptSignOut.classList.add('hidden');
    displayAccountDetails();
  }

  function hideViewTradeHistory() {
    let createListing = id('view-history-page');
    createListing.classList.add('hidden');
  }

  function hideCreateListingPage() {
    let createListing = id('creating-listing');
    createListing.classList.add('hidden');
  }

  function hideSignOutUser() {
    let attemptSignOut = id('sign-out-attempt');
    attemptSignOut.classList.add('hidden');
  }

  function createListingPage() {

    hideAccountDetails();
    hideSignOutUser();
    hideViewTradeHistory();
    let successfulListingMessage = id('successful-listing-message');
    successfulListingMessage.textContent ='';

    let unsuccessfulListingMessage = id('unsuccessful-listing-message');
    unsuccessfulListingMessage.textContent ='';

    let usernameOfListing = id('creating-listing-seller');
    usernameOfListing.textContent = localStorage.getItem('username');
    fetchSmiskiNamesForList();
    fetchSmiskiNamesForSeek();
    let createListing = id('creating-listing');
    createListing.classList.remove('hidden');

    // Add an event listener to the form submission
    let listingForm = id('listing-form');
    listingForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the form input values
    const seller = localStorage.getItem('username');
    const listedSmiski = id('smiski-listed').value;
    const seriesListed = id('series-listed').value;
    const seekingSmiski = id('smiski-sought').value;
    const additionalInfo = id('creating-additional-info').value;

    const data = {
    seller: seller,
    'listed-smiski': listedSmiski,
    'series-of-listing': seriesListed,
    'sought-smiski': seekingSmiski,
    'added-info': additionalInfo
  };

  // Send the POST request to the backend
  fetch('/listing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      // Listing created successfully
      console.log('Listing created successfully');

      successfulListingMessage.textContent ='Listing created!';
      id('creating-additional-info').value ='';


    } else {
      // Error creating the listing
      console.error('Error creating listing');
      unsuccessfulListingMessage.textContent ='There was an error creating the listing';
      id('creating-additional-info').value ='';

    }
  })
  .catch(handleError);
});
}

  // Function to fetch and populate the smiski names for seeking
async function fetchSmiskiNamesForSeek() {
  const response = await fetch('/allsmiskii');
  if (response.ok) {
    const smiskiNames = await response.json();
    const selectSmiskisToSeek = id('smiski-sought');

    // Clear existing options
    selectSmiskisToSeek.innerHTML = '';

    // Create and append new options
    smiskiNames.forEach((data) => {
      const option = gen('option');
      option.value = data.Names;
      option.text = data.Names;
      selectSmiskisToSeek.appendChild(option);
    });
  } else {
    console.log('Failed to fetch smiski names');
  }
}

  // Function to fetch and populate the smiski names for listing
  async function fetchSmiskiNamesForList() {
    const response = await fetch('/allsmiskii');
    if (response.ok) {
      const smiskiNames = await response.json();
      const selectSmiskisToList = id('smiski-listed');

      // Clear existing options
      selectSmiskisToList.innerHTML = '';

      // Create and append new options
      smiskiNames.forEach((data) => {
        const option = gen('option');
        option.value = data.Names;
        option.text = data.Names;
        selectSmiskisToList.appendChild(option);
      });
    } else {
      console.log('Failed to fetch smiski names');
    }
  }


  function fetchReccomended(url) {
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(populateReccomended)
      .catch(handleError);
  }

  function signedInPopulateReccomended() {

    fetchSwapHistory();

  }

  function populateReccomended(data) {

    if(signedIn === false) {
      let uniqueCards = [];
      for(let i = 1; i <= 4; i++) {
        let randomIndex = Math.floor(Math.random() * data.length) + 1;
        while(randomIndex === data.length) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
        }

        //let username = data[randomIndex].username;
        console.log(randomIndex);
        let listing = data[randomIndex]['name of listing'];
        let originalName = listing;
        console.log(originalName);
        console.log(uniqueCards);
        while(uniqueCards.includes(originalName)) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
          listing = data[randomIndex]['name of listing'];
          originalName = listing;
        }
        uniqueCards[i] = originalName;
        let series = data[randomIndex]['series of listing'];
        let orginalListing = listing;

        let container = qs("#reccomended" + i);
        container.classList.add("reccomendedboxes");
        let smiskiiImg = gen('img');
        listing = breakUpName(listing);

        //smiskiiImg.src = "/img/series/" + series + "/" + listing + ".png";
        smiskiiImg.src = "img/series/" + series + "/" + listing + ".png";
        smiskiiImg.alt = series + " " + orginalListing;
        smiskiiImg.id = series + " " + orginalListing;
        console.log(smiskiiImg.id);
        console.log(smiskiiImg.src);
        container.appendChild(smiskiiImg);
        let seriesName = gen('p');
        //seriesName.innerHTML = listing;
        seriesName.innerHTML = orginalListing;
        console.log(seriesName);
        seriesName.classList.add("reccomended-name-card");
        container.appendChild(seriesName);
        container.addEventListener("click", reccomendedClickAction);
      }
    } else {
      //fetch the data of the listing from a singular user
      let user = localStorage.getItem('username');
      fetchSingularHistory("/listing/:username", user);
    }
  }

  // WORKING ON THIS

  function handleFilterSelection(filterOption) {
    const url = '/filters'; // Replace with your backend endpoint

    fetch(`${url}?filter=${filterOption}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        filterDataForName(data, filterOption);
        //populateIndividualView(data);
        //filterDataForName(data);
        // Update the frontend display with the sorted listings
      })
      .catch(error => {
        // Handle any errors
      });
  }

  function sortByUsername(data) {
    return data.sort((a, b) => {
      const usernameA = a.username.toLowerCase();
      const usernameB = b.username.toLowerCase();
      console.log(1);

      if (usernameA < usernameB) {
        return -1;
      } else if (usernameA > usernameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  function filterDataForName(data, filterOption) {
    console.log(data);
    let content = qs('.indi-card-username').textContent;
    console.log(content);
    let colonIndex = content.indexOf(":");
    let name = content.substring(colonIndex + 1).trim();
    console.log(name);
    console.log(data[0]['name of listing']);

    let newData = data.filter(item => {
      console.log(item, item['name of listing'], name);
       return item['name of listing'] === name;
    });

    // let filterView = qs('.filterSelect').value;
    // if(filterView !== "select") {
    //   populateIndividualView(newData);
    // } else {
      console.log(newData);
    if(filterOption === 'alphabetical') {
      newData = sortByUsername(newData);
    }


      console.log(newData);

      qs('#cardformatting').innerHTML = "";
      console.log(length);
      // qsa('.indvidualcard').innerHTML = "";
      // console.log( qsa('.indvidualcard'));
      populateIndividualView(newData);
      // return newData;
    //}


  }

  function fetchSingularHistory(url, username) {
    const params = new FormData();
    params.append('username', username);

    fetch(url, {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(checkNames)
      .catch(handleError);
  }

  function checkNames(data) {
    console.log(data);
    //data = breakUpName(data);
    data = data[0];
    filterSearchPartThree('/smiskilisting/:smiskiName', data);
  }

  //this same code is repeated three times
  function createRandomCards(data) {
    let uniqueCards = [];

      for(let i = 1; i <= 4; i++) {
        let randomIndex = Math.floor(Math.random() * data.length) + 1;
        while(randomIndex === data.length) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
        }

        //let username = data[randomIndex].username;
        console.log(randomIndex);
        let listing = data[randomIndex]['name of listing'];
        let originalName = listing;
        console.log(originalName);
        console.log(uniqueCards);
        while(uniqueCards.includes(originalName)) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
          listing = data[randomIndex]['name of listing'];
          originalName = listing;
        }
        uniqueCards[i] = originalName;
        let series = data[randomIndex]['series of listing'];
        let orginalListing = listing;

        let container = qs("#reccomended" + i);
        container.classList.add("reccomendedboxes");
        let smiskiiImg = gen('img');
        listing = breakUpName(listing);

        //smiskiiImg.src = "/img/series/" + series + "/" + listing + ".png";
        smiskiiImg.src = "img/series/" + series + "/" + listing + ".png";
        smiskiiImg.alt = series + " " + orginalListing;
        smiskiiImg.id = series + " " + orginalListing;
        console.log(smiskiiImg.id);
        console.log(smiskiiImg.src);
        container.appendChild(smiskiiImg);
        let seriesName = gen('p');
        //seriesName.innerHTML = listing;
        seriesName.innerHTML = orginalListing;
        console.log(seriesName);
        seriesName.classList.add("reccomended-name-card");
        container.appendChild(seriesName);
        container.addEventListener("click", reccomendedClickAction);
      }
  }

  function fetchReccomendedRandom(url) {
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(createRandomCards)
      .catch(handleError);
  }

  function populateCateredReccomendedCards(data) {
    console.log(data);
    //BREAK
    if(data.length === 0) {
      fetchReccomendedRandom('/smiskilistings');
      // let uniqueCards = [];

      // for(let i = 1; i <= 4; i++) {
      //   let randomIndex = Math.floor(Math.random() * data.length) + 1;
      //   while(randomIndex === data.length) {
      //     randomIndex = Math.floor(Math.random() * data.length) + 1;
      //   }

      //   //let username = data[randomIndex].username;
      //   console.log(randomIndex);
      //   let listing = data[randomIndex]['name of listing'];
      //   let originalName = listing;
      //   console.log(originalName);
      //   console.log(uniqueCards);
      //   while(uniqueCards.includes(originalName)) {
      //     randomIndex = Math.floor(Math.random() * data.length) + 1;
      //     listing = data[randomIndex]['name of listing'];
      //     originalName = listing;
      //   }
      //   uniqueCards[i] = originalName;
      //   let series = data[randomIndex]['series of listing'];
      //   let orginalListing = listing;

      //   let container = qs("#reccomended" + i);
      //   container.classList.add("reccomendedboxes");
      //   let smiskiiImg = gen('img');
      //   listing = breakUpName(listing);

      //   //smiskiiImg.src = "/img/series/" + series + "/" + listing + ".png";
      //   smiskiiImg.src = "img/series/" + series + "/" + listing + ".png";
      //   smiskiiImg.alt = series + " " + orginalListing;
      //   smiskiiImg.id = series + " " + orginalListing;
      //   console.log(smiskiiImg.id);
      //   console.log(smiskiiImg.src);
      //   container.appendChild(smiskiiImg);
      //   let seriesName = gen('p');
      //   //seriesName.innerHTML = listing;
      //   seriesName.innerHTML = orginalListing;
      //   console.log(seriesName);
      //   seriesName.classList.add("reccomended-name-card");
      //   container.appendChild(seriesName);
      //   container.addEventListener("click", reccomendedClickAction);
      // }
    } else {
      let amountLeft = 0;
      let length = data.length;
      if(data.length < 4) {
        amountLeft = 4 - data.length;
      } else if (data.length > 4) {
        length = 4;
      }

      for(let i = 0; i < length; i++) {

        //let username = data[randomIndex].username;
        let listing = data[i]['name of listing'];
        let originalName = listing;
        console.log(originalName);

        let series = data[i]['series of listing'];
        let orginalListing = listing;
        //BREAKPOINT
        let container = qs("#reccomended" + (i + 1));
        console.log(container);
        container.classList.add("reccomendedboxes");
        let smiskiiImg = gen('img');
        listing = breakUpName(listing);

        //smiskiiImg.src = "/img/series/" + series + "/" + listing + ".png";
        smiskiiImg.src = "img/series/" + series + "/" + listing + ".png";
        smiskiiImg.alt = series + " " + orginalListing;
        smiskiiImg.id = series + " " + orginalListing;
        console.log(smiskiiImg.id);
        console.log(smiskiiImg.src);
        container.appendChild(smiskiiImg);
        let seriesName = gen('p');
        //seriesName.innerHTML = listing;
        seriesName.innerHTML = "smiski name: " + orginalListing;
        console.log(seriesName);
        seriesName.classList.add("reccomended-name-card");
        let user = gen('p');
        user.innerHTML = "username of seller: " + data[i]['username'];
        user.classList.add("reccomended-name-card");
        container.appendChild(seriesName);
        container.appendChild(user);
        container.addEventListener("click", reccomendedClickAction);
      }
      let index = data.length;
      while(amountLeft < 4) {
        qs("#reccomended" + index).classList.add('hidden');
        amountLeft++;
        index++;
      }
    }
    // //generate random card
    // for(let j = amountLeft; j < 4; j++){

    // }
  }

  //get all the listings for the reccomended
  function filterSearchPartThree(url, search) {
    const params = new FormData();
    params.append('smiskiName', search);

    fetch(url, {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(populateCateredReccomendedCards)
      .catch(handleError);
  }

  function reccomendedClickAction() {
    console.log("COME HERE!");
    console.log(this);
    let article = id(this.id);
    let img = article.querySelector("img");
    let imgId = img.id;
    console.log(imgId);
    let chunks = imgId.split(" ");
    // let seriesName = chunks[0];
    let name = chunks[1];
    for(let i = 2; i < chunks.length; i++) {
      name += chunks[i];
    }
    console.log(name);
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

  /**
   * this takes a name of a smiski and checks how many words there are
   * and makes the name one word and lowercase if it consists of more that
   * one word
   * @param {string} nameOfSmiski - the name of smiski
   */
  function breakUpName(nameOfSmiski)  {
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
    return nameOfSmiski;
  }

  /**
   * this hides certain views that are found in the landing page
   */
  function hideHome() {
    id("landingpage").classList.add("hidden");
    id("recommended-boxes").classList.add("hidden");
  }

  function populateIndividualView(data, search) {

    let toggleView;

    if(!(data.length === 0) && data[0].Series) {
      seriesSearchView(search);
    } else if(data !== null) {
        // qs('.filterSelect').classList.remove("hidden");
        qs('.filterSelect').classList.remove('hidden');
        qs('.toggle').classList.remove('hidden');
        for (let i = 0; i < data.length; i++) {
        //let parentContainer = qs("#search-individual-results");
        let parentContainer = qs("#cardformatting");
        console.log(parentContainer);

        hideHome();
        console.log(data);

        let nameOfSmiski = data[i]['name of listing'];
        let originalNames = nameOfSmiski;
        let seriesName = data[i]['series of listing'];
        let username = data[i].username;
        let possibleTrades = data[i]['possible trade'];

        console.log(possibleTrades);

        let card = gen('article');


        let imgLogo = gen('img');
        nameOfSmiski = breakUpName(nameOfSmiski);

        //imgLogo.src = "/img/series/" + seriesName + "/" + nameOfSmiski + ".png";
        imgLogo.src = "img/series/" + seriesName + "/" + nameOfSmiski + ".png";
        //imgLogo.classList.add("circlecardlogo");

        if(qs('.toggle').value === 'grid') {
          card.classList.add("individualcard");
          imgLogo.classList.add("circlecardlogo");
        } else {
          card.classList.add("individualcard2");
          imgLogo.classList.add("circlecardlogo2");
        }


        qs('.toggle').addEventListener('change', (event) => {
          toggleView = event.target.value;
          if(toggleView === 'list') {
            card.classList.remove("individualcard");
            card.classList.add('individualcard2');
            imgLogo.classList.remove("circlecardlogo");
            imgLogo.classList.add("circlecardlogo2");
          } else {
            card.classList.remove('individualcard2');
            card.classList.add("individualcard");
            imgLogo.classList.remove("circlecardlogo2");
            imgLogo.classList.add("circlecardlogo");
          }
        });

        card.appendChild(imgLogo);

        //let cardContent = generateListingDetails(username, nameOfSmiski, possibleTrades);
        let cardContent = generateListingDetails(username, originalNames, possibleTrades, seriesName);

        card.appendChild(cardContent);

        card.addEventListener("click", () => {
          smiskiAdditionalInfo(data, originalNames, username);
        });

        parentContainer.appendChild(card);

      }
    } else {
      let h1Tag = gen('h1');
      h1Tag.innerHTML = "No Results Found. Please Search Again.";
      qs("#search-individual-results").appendChild(h1Tag);
    }
  }

  function generateListingDetails(username, nameOfSmiski, possibleTrades, seriesName) {
    let cardContent = gen('div');
    cardContent.classList.add('indi-card-content');

    let nameHeader = gen('h1');
    nameHeader.classList.add('indi-card-header');
    let usernameTag = gen('h2');
    usernameTag.classList.add('indi-card-username');
    nameHeader.innerHTML = "Username: " + username;
    usernameTag.innerHTML = "Name of Smiski: " + nameOfSmiski;
    let trades = gen('h2');
    trades.innerHTML = "Willing to swap for: " + possibleTrades;
    let series = gen('h2');
    series.innerHTML = "Series name: " + seriesName;
    cardContent.appendChild(nameHeader);
    cardContent.appendChild(usernameTag);
    cardContent.appendChild(trades);

    console.log("SERIES");
    console.log(series);
    cardContent.appendChild(series);
    console.log(cardContent);
    return cardContent;
  }

  function hideSearch() {
    qs("#search-results").innerHTML = "";
    //qs("#search-individual-results").innerHTML = "";
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');
    qs("#cardformatting").innerHTML = "";
  }

  function addTextContent(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, data, username)  {
    h1NameTag.textContent = "smiski name: " + data['name of listing'];
    h2Username.textContent = "username of seller: " + username;
    h2PossibleTrade.textContent = "list of possible trades: " + data['possible trade'];
    let tradeInfo = data['trade info'];
    if(!(tradeInfo === null)) {
      h3AdditionalInfo.textContent = "any additional information: " + data['trade info'];
    }

    swapBtn.innerHTML = "REQUEST SWAP";
  }

  //this is supposed to be the view of the specifc listing of a smiski from a user
  function smiskiAdditionalInfo(data, originalNames, username) {
    console.log("this is supposed to be the view for the specfic listing");
    console.log(data);
    console.log(originalNames);
    console.log(username);
    hideSearch();
    // qs("#search-results").innerHTML = "";
    // qs("#search-individual-results").innerHTML = "";

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
    listingName = breakUpName(listingName);

    let seriesName = data['series of listing'];
    //leftSideImg.src = "/img/series/" + seriesName + "/" + listingName + ".png";
    leftSideImg.src = "img/series/" + seriesName + "/" + listingName + ".png";
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

    addTextContent(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, data, username);
    additionalInfoAppending(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, card);

    swapBtn.addEventListener("click", () => initateSwap(data, card, leftSideImg));
    card.classList.add('specfic-listing-info-box');
    leftSideImg.classList.add('left-side-smiski-listing-photo');
    parentContainer.appendChild(leftSideImg);
    parentContainer.appendChild(card);
  }

  function additionalInfoAppending(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, card) {
    card.appendChild(h1NameTag);
    card.appendChild(h2Username);
    card.appendChild(h2PossibleTrade);
    card.appendChild(h3AdditionalInfo);
    card.appendChild(swapBtn);
  }

  //marks the beginning of the swap functionality
  function initateSwap(data, otherCard, otherPic) {

    qs("#smiski-listing-info").innerHTMl = "";
    let parentContainer = qs("#swap-views");
    id('swap-button').classList.add('hidden');
    otherCard.classList.remove('specfic-listing-info-box');

    console.log(otherCard);
    console.log("OTHER");

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
    //rightSideImg.src = "/img/logo.png";
    rightSideImg.src = "img/logo.png";
    rightSideImg.alt = "default logo";
    rightSideImg.id = "right-side-img-default"
    rightSideImg.classList.add("circle-logo");
    rightSideCard.appendChild(rightSideImg);

    let searchInput = gen('input');
    searchInput.id = "search-input";
    searchInput.type = 'text';
    searchInput.placeholder = 'enter smiski name';
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
    search = breakUpName(search);
    if(data.length !== 0) {
      //change the img
      let rightImg = qs("#right-side-img-default");
      //rightImg.src = "/img/series/" + data[0]['series of listing'] + "/" + data[0]['name of listing'] + ".png";
      //rightImg.src = "/img/series/" + data[0]['series of listing'] + "/" + search + ".png";
      rightImg.src = "img/series/" + data[0]['series of listing'] + "/" + search + ".png";
      rightImg.alt = data['series of listing'] + "/" + data['name of listing'];

      // qs('#actually-swapping').addEventListener("click", () => confirmSwapPage(data));
      console.log(signedIn);
      if(signedIn === true) {
        qs('#actually-swapping').addEventListener("click", function() {
          confirmSwapPage(data, nameAndSeries, data[0]['series of listing'],  data[0]['name of listing']);
          //addSwapHistory(nameAndSeries, data[0]['series of listing'],  data[0]['name of listing']);
        });
      }
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

  //need to find a way to keep track of username so i can send it to the database
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
    // submitButton.addEventListener('click', function() {
    //   storeSwap(gettingThisSeries, gettingThisName, mySeries, mySmiski);
    // });

    authenticateTransaction(gettingThisSeries, gettingThisName, mySeries, mySmiski);
  }

  function authenticateTransaction(gettingThisSeries, gettingThisName, mySeries, mySmiski) {
    const form = id('transaction-form');

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const cardNumber = id('card-number').value;
      const user =  localStorage.getItem('username');

      const formData = new FormData();
      formData.append('cardNumber', cardNumber);
      formData.append('username', user);

      fetch('/validateTransaction', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data === true) {
            console.log("here");
            storeSwap(gettingThisSeries, gettingThisName, mySeries, mySmiski);
            createUniqueNumber();
            id('name').value = "";
            id('address').value = "";
            id('phone').value = "";
            id('email').value = "";
            id('card-number').value = "";
            id('cvv').value = "";
            id('expiry').value = "";
            qs("#banner").classList.remove("hidden");
            qs("#recommended-boxes").classList.remove("hidden");
            qs('#landingpage').classList.remove("hidden");
            clearViewsExceptHome();
          } else {
            // If is not valid
            console.log('Please check your username and credit card number');
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  function createUniqueNumber() {
    //i need to create a unique transaction number
    //then i need to append it to the database for the specfic user
    //localStorage.get('username') to get the logged in user
    let timestamp = Date.now(); // Get the current timestamp
    let random = Math.floor(Math.random() * 10000); // Generate a random number
    let transactionNumber = timestamp + random;
    console.log(transactionNumber);
    let username = localStorage.getItem('username');

    const params = new FormData();
    params.append('transactionNumber', transactionNumber);
    params.append('username', username);

    fetch('/addTransactionNum', {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then((resp) => resp.json())
      //.then(data => checkAndGetSmiski(data, search, otherCard))
      .catch(handleError);

  }

  function storeSwap(otherSeries, otherName, mySeries, myName) {
    //onst baseURL = '/storeSwap';
    let url = '/storeSwap';
    const params = new FormData()
    params.append('otherSeries', otherSeries);
    params.append('otherName', otherName);
    params.append('mySeries', mySeries);
    params.append('myName', myName);
    params.append('username', localStorage.getItem('username'));

    fetch(url, {
      method: 'POST',
      body: params
    })
      .then(statusCheck)
      .then(response => response.json())
      .catch(handleError);
        // Handle any errors

  }

  //gets the search for the swap view
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

  //gets the first search for the individual view of all the smiskis of one name
  function filterSearchPartOne(search, url) {
    const params = new FormData();
    params.append('searchInput', search);

    // if(qs('.filterSelect').value !== null) {
    //   console.log("WHY");
    //   let value = qs('.filterSelect').value;
    //   params.append('filter', value);
    // }

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

    console.log("buildSearchViewCards");
    console.log(data);
    for(let i = 0; i < 6; i++) {
      let seriesArticle = gen('article');
      seriesArticle.classList.add("series-card");
      let smiskiiImg = gen('img');
      let names = data[i].Names;
      let originalNames = names;
      names = breakUpName(names);

      //smiskiiImg.src = "/img/series/" + search + "/" + names + ".png";
      smiskiiImg.src = "img/series/" + search + "/" + names + ".png";
      smiskiiImg.alt = search + " picture";
      seriesArticle.appendChild(smiskiiImg);
      let seriesName = gen('p');
      seriesName.innerHTML = data[i].Names;
      seriesName.classList.add("series-name-card");
      seriesArticle.appendChild(seriesName);
      seriesArticle.addEventListener("click",() => loadSmiskiiSearchView(data, originalNames));

      console.log("COME HERE");
      qs("#search-results").appendChild(seriesArticle);
    }
  }

  function loadSmiskiiSearchView(data, names) {
    qs("#search-results").innerHTML = "";
    //qs("#search-individual-results").innerHTML = "";
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');
    qs("#cardformatting").innerHTML = "";
    filterSearchPartOne(names, '/search/:searchInput')
  }


  /**
   * this deals with errors being thrown
   * @param {string} err - the error that is thrown
   */
  function handleError(err) {
    console.log(err);
  }

///////////////////



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
   * Shortcut function for query selecting all items of a sort.
   * @param {string} selector - The CSS selector to match.
   * @returns {NodeList} A static NodeList containing all elements matching the specified selector.
   */
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }

  /**
   * Makes a new element and returns it
   * @param {string} tagName - the element to be created.
   * @returns {object} - the new element
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})()
