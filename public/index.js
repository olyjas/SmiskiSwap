/**
 * JASMINE ZHANG & STHITI PATNAIK
 * 6/6/2023
 * SECTION AG & AF
 * TA: TARA WUEGER & ALLISON HO
 * This is the index.js page of our project, Smiski Swap. It contains the different
 * behaviors of our website and directs the users to different pages.
 */

'use strict';
(function() {
  let signedIn = false;
  window.addEventListener('load', init);

  /**
   * this initializes the event listeners on the buttons on both pages
   */
  function init() {

    updateHeaderView();
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');

    let loginButton = id('login-btn');
    let signupButton = id('signup-btn');
    let logo = id('logo-img');

    loginButton.addEventListener('click', loginView);
    signupButton.addEventListener('click', signupView);
    logo.addEventListener('click', homeView);

    let search = id('search-term');
    fetchReccomended('/smiskilistings');

    let searchBar = qs('#search-btn');
    searchBar.addEventListener('click', function() {

      clearViewsExceptHome();
      filterSearchPartOne(search.value, '/search/:searchInput');
      qs('#banner').classList.add('hidden');
      qs('#recommended-boxes').classList.add('hidden');
    });

    let accountButton = id('account-button');
    accountButton.addEventListener('click', accountView);

    qs('.filterSelect').addEventListener('change', (event) => {
      const selectedOption = event.target.value;
      if (selectedOption === 'alphabetical') {
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

      signedInElements.forEach(element => {
        element.classList.remove('hidden');
      });
      notSignedInElements.forEach(element => {
        element.classList.add('hidden');
      });
    } else {

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

    let loginForm = id('login-form');
    loginForm.addEventListener('submit', loginUser);

    let signupLink = id('signup-from-login');
    signupLink.addEventListener('click', signupView);
    let backButton = id('home-from-login');
    backButton.addEventListener('click', homeView);
  }
  async function loginUser(event) {
    event.preventDefault();

    const username = id('login-username').value;
    const password = id('login-password').value;

    const response = await fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({username, password})
      });

    if (response.ok) {
      let loginError = id('login-error');
      loginError.textContent = '';

      localStorage.setItem('username', username);

      signedIn = true;
      updateHeaderView();
      homeView();
    } else {
      let loginError = id('login-error');
      loginError.textContent = 'Incorrect username or password';
    }
  }

  function signupView() {
    clearForLoginSignup();
    let loginPage = id('login-page');
    loginPage.classList.add('hidden');
    let signupPage = id('signup-page');
    signupPage.classList.remove('hidden');

    updateHeaderView();

    let signupForm = id('signup-form');
    signupForm.addEventListener('submit', signupUser);

    let loginLink = id('login-from-signup');
    loginLink.addEventListener('click', loginView);
    let backButton = id('home-from-signup');
    backButton.addEventListener('click', homeView);
  }

  async function signupUser(event) {
    event.preventDefault();

    const username = id('signup-username').value;
    const password = id('signup-password').value;
    const email = id('signup-email').value;

    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password, email})
    });

    if (response.ok) {
      let signupError = id('signup-error');
      signupError.textContent = '';
      location.reload();
    } else {
      let signupError = id('signup-error');
      signupError.textContent = 'Username unavailable';
    }
  }

  function clearForLoginSignup() {
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.add('hidden');
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
  }

  function homeView() {
    hideCreateListingPage();
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
    let accountViewHome = id('account-view');
    accountViewHome.classList.add('hidden');

    id('reccomended1').innerHTML = '';
    id('reccomended2').innerHTML = '';
    id('reccomended3').innerHTML = '';
    id('reccomended4').innerHTML = '';
    fetchReccomended('/smiskilistings');

    clearViewsExceptHome();
  }

  function clearViewsExceptHome() {
    hideCreateListingPage()
    hideAccountDetails();
    hideSignOutUser();
    hideViewTradeHistory();
    id('search-results').innerHTML = ''
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');
    qs('#cardformatting').innerHTML = '';
    id('smiski-listing-info').innerHTML = '';
    id('swap-views').innerHTML = '';
    id('transaction').classList.add('hidden');
    let creatingListing = id('creating-listing');
    creatingListing.classList.add('hidden');
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.remove('hidden');
  }

  function accountView() {
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.add('hidden');
    displayAccountDetails();
    hideListings();
    let accountView = id('account-view');
    accountView.classList.remove('hidden');
    let recommended = id('recommended-boxes');
    let banner = id('banner');
    banner.classList.add('hidden');
    recommended.classList.add('hidden');
    let searchResults = id('search-results');
    searchResults.classList.add('hidden');
    let createListing = id('create-listing');
    createListing.addEventListener('click', createListingPage);
    let signOut = id('sign-out');
    signOut.addEventListener('click', signOutUser);
    let viewTradeHistory = id('view-trade-history');
    viewTradeHistory.addEventListener('click', viewTradeHistoryPage);
    let accountDetails = id('account-details');
    accountDetails.addEventListener('click', displayAccountDetails);
  }

  function hideListings() {
    id('search-results').innerHTML = ''
   qs('.filterSelect').classList.add('hidden');
   qs('.toggle').classList.add('hidden');
   qs('#cardformatting').innerHTML = '';
   id('smiski-listing-info').innerHTML = '';
   id('swap-views').innerHTML = '';
  }

   function displayAccountDetails() {
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.add('hidden');
    hideListings();
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
    hideListings()
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
    const transactionHistory = data.transactionHistory
    populateSwapHistory(swappedHistory, swappedForHistory, transactionHistory);
  }

  function populateSwapHistory(swappedHistory, swappedForHistory, transactionHistory) {
    let allSwapsContainer = id('view-history-div');
    allSwapsContainer.innerHTML = '';
    if (swappedHistory.length > 1) {
      for (let i = 0; i < swappedHistory.length; i++) {
        if(swappedHistory[i] != '') {
          let swapContainer = gen('div');
          let swapText = gen('p');
          let transactionNum = gen('p');
          swapText.textContent = 'Swapped ' + swappedHistory[i] + ' for ' + swappedForHistory[i]
          transactionNum.textContent = 'Transaction Number: ' + transactionHistory[i];
          swapContainer.appendChild(swapText);
          swapContainer.appendChild(transactionNum);
          allSwapsContainer.appendChild(swapContainer);
        }
      }
    } else {
      let noSwapsContainer = gen('div');
      let noSwapsText = gen('p');
      noSwapsText.textContent = 'No swaps yet!';
      noSwapsContainer.appendChild(noSwapsText);
      allSwapsContainer.appendChild(noSwapsContainer);
    }
  }

  function signOutUser() {
    hideListings()
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
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.add('hidden');
    hideListings();
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

    let listingForm = id('listing-form');
    listingForm.addEventListener('submit', function(event) {
    event.preventDefault();

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

  fetch('/listing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {

      successfulListingMessage.textContent ='Listing created!';
      id('creating-additional-info').value ='';


    } else {
      console.error('Error creating listing');
      unsuccessfulListingMessage.textContent ='There was an error creating the listing';
      id('creating-additional-info').value ='';

    }
  })
  .catch(handleError);
});
}

async function fetchSmiskiNamesForSeek() {
  const response = await fetch('/allsmiskii');
  if (response.ok) {
    const smiskiNames = await response.json();
    const selectSmiskisToSeek = id('smiski-sought');

    selectSmiskisToSeek.innerHTML = '';

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

  async function fetchSmiskiNamesForList() {
    const response = await fetch('/allsmiskii');
    if (response.ok) {
      const smiskiNames = await response.json();
      const selectSmiskisToList = id('smiski-listed');

      selectSmiskisToList.innerHTML = '';

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

  function populateReccomended(data) {

    if(signedIn === false) {
      let uniqueCards = [];
      for(let i = 1; i <= 4; i++) {
        let randomIndex = Math.floor(Math.random() * data.length) + 1;
        while(randomIndex === data.length) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
        }
        let listing = data[randomIndex]['name of listing'];
        let originalName = listing;
        while(uniqueCards.includes(originalName)) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
          listing = data[randomIndex]['name of listing'];
          originalName = listing;
        }
        uniqueCards[i] = originalName;
        let series = data[randomIndex]['series of listing'];
        let orginalListing = listing;

        let container = qs('#reccomended' + i);
        container.classList.add('reccomendedboxes');
        let smiskiiImg = gen('img');
        listing = breakUpName(listing);

        smiskiiImg.src = 'img/series/' + series + '/' + listing + '.png';
        smiskiiImg.alt = series + ' ' + orginalListing;
        smiskiiImg.id = series + ' ' + orginalListing;
        container.appendChild(smiskiiImg);
        let seriesName = gen('p');
        seriesName.innerHTML = orginalListing;
        seriesName.classList.add('reccomended-name-card');
        container.appendChild(seriesName);
        container.addEventListener('click', reccomendedClickAction);
      }
    } else {
      let user = localStorage.getItem('username');
      fetchSingularHistory('/listing/:username', user);
    }
  }

  function handleFilterSelection(filterOption) {
    const url = '/filters';

    fetch(`${url}?filter=${filterOption}`)
      .then(response => response.json())
      .then(data => {
        filterDataForName(data, filterOption);
      })
      .catch(handleError);
  }

  function sortByUsername(data) {
    return data.sort((a, b) => {
      const usernameA = a.username.toLowerCase();
      const usernameB = b.username.toLowerCase();

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
    let content = qs('.indi-card-username').textContent;
    let colonIndex = content.indexOf(':');
    let name = content.substring(colonIndex + 1).trim();

    let newData = data.filter(item => {
       return item['name of listing'] === name;
    });

    if(filterOption === 'alphabetical') {
      newData = sortByUsername(newData);
    }

      qs('#cardformatting').innerHTML = '';
      populateIndividualView(newData);
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
    data = data[0];
    filterSearchPartThree('/smiskilisting/:smiskiName', data);
  }

  function createRandomCards(data) {
    let uniqueCards = [];

      for(let i = 1; i <= 4; i++) {
        let randomIndex = Math.floor(Math.random() * data.length) + 1;
        while(randomIndex === data.length) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
        }

        let listing = data[randomIndex]['name of listing'];
        let originalName = listing;
        while(uniqueCards.includes(originalName)) {
          randomIndex = Math.floor(Math.random() * data.length) + 1;
          listing = data[randomIndex]['name of listing'];
          originalName = listing;
        }
        uniqueCards[i] = originalName;
        let series = data[randomIndex]['series of listing'];
        let orginalListing = listing;

        let container = qs('#reccomended' + i);
        container.classList.add('reccomendedboxes');
        let smiskiiImg = gen('img');
        listing = breakUpName(listing);

        smiskiiImg.src = 'img/series/' + series + '/' + listing + '.png';
        smiskiiImg.alt = series + ' ' + orginalListing;
        smiskiiImg.id = series + ' ' + orginalListing;
        container.appendChild(smiskiiImg);
        let seriesName = gen('p');
        seriesName.innerHTML = orginalListing;
        seriesName.classList.add('reccomended-name-card');
        container.appendChild(seriesName);
        container.addEventListener('click', reccomendedClickAction);
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
    if(data.length === 0) {
      fetchReccomendedRandom('/smiskilistings');
    } else {
      let amountLeft = 0;
      let length = data.length;
      if(data.length < 4) {
        amountLeft = 4 - data.length;
      } else if (data.length > 4) {
        length = 4;
      }

      for(let i = 0; i < length; i++) {
        let listing = data[i]['name of listing'];
        let series = data[i]['series of listing'];
        let orginalListing = listing;

        let container = qs('#reccomended' + (i + 1));
        container.classList.add('reccomendedboxes');
        let smiskiiImg = gen('img');
        listing = breakUpName(listing);

        smiskiiImg.src = 'img/series/' + series + '/' + listing + '.png';
        smiskiiImg.alt = series + ' ' + orginalListing;
        smiskiiImg.id = series + ' ' + orginalListing;
        container.appendChild(smiskiiImg);
        let seriesName = gen('p');
        seriesName.innerHTML = 'smiski name: ' + orginalListing;
        seriesName.classList.add('reccomended-name-card');
        let user = gen('p');
        user.innerHTML = 'username of seller: ' + data[i]['username'];
        user.classList.add('reccomended-name-card');
        container.appendChild(seriesName);
        container.appendChild(user);
        container.addEventListener('click', reccomendedClickAction);
      }
      let index = data.length;
      while(amountLeft < 4) {
        qs('#reccomended' + index).classList.add('hidden');
        amountLeft++;
        index++;
      }
    }
  }

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
    let article = id(this.id);
    let img = article.querySelector('img');
    let imgId = img.id;
    let chunks = imgId.split(' ');
    let name = chunks[1];
    for(let i = 2; i < chunks.length; i++) {
      name += chunks[i];
    }
    let url = '/smiskilisting/:smiskiName';

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
    if((/\s/.test(nameOfSmiski)) || nameOfSmiski.includes('-')) {
      let allNames = '';
      if(/\s/.test(nameOfSmiski)) {
        allNames = nameOfSmiski.split(' ');
      } else {
        allNames = nameOfSmiski.split('-');
      }
      nameOfSmiski = '';
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
    id('landingpage').classList.add('hidden');
    id('recommended-boxes').classList.add('hidden');
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.add('hidden');
  }

  function populateIndividualView(data, search) {

    let toggleView;

    if(!(data.length === 0) && data[0].Series) {
      seriesSearchView(search);
    } else if(data !== null) {
        qs('.filterSelect').classList.remove('hidden');
        qs('.toggle').classList.remove('hidden');
        for (let i = 0; i < data.length; i++) {
        let parentContainer = qs('#cardformatting');

        hideHome();

        let nameOfSmiski = data[i]['name of listing'];
        let originalNames = nameOfSmiski;
        let seriesName = data[i]['series of listing'];
        let username = data[i].username;
        let possibleTrades = data[i]['possible trade'];

        let card = gen('article');


        let imgLogo = gen('img');
        nameOfSmiski = breakUpName(nameOfSmiski);

        imgLogo.src = 'img/series/' + seriesName + '/' + nameOfSmiski + '.png';

        if(qs('.toggle').value === 'grid') {
          card.classList.add('individualcard');
          imgLogo.classList.add('circlecardlogo');
        } else {
          card.classList.add('individualcard2');
          imgLogo.classList.add('circlecardlogo2');
        }


        qs('.toggle').addEventListener('change', (event) => {
          toggleView = event.target.value;
          if(toggleView === 'list') {
            card.classList.remove('individualcard');
            card.classList.add('individualcard2');
            imgLogo.classList.remove('circlecardlogo');
            imgLogo.classList.add('circlecardlogo2');
          } else {
            card.classList.remove('individualcard2');
            card.classList.add('individualcard');
            imgLogo.classList.remove('circlecardlogo2');
            imgLogo.classList.add('circlecardlogo');
          }
        });

        card.appendChild(imgLogo);

        let cardContent = generateListingDetails(username, originalNames, possibleTrades, seriesName);

        card.appendChild(cardContent);

        card.addEventListener('click', () => {
          smiskiAdditionalInfo(data, originalNames, username);
        });

        parentContainer.appendChild(card);

      }
    } else {
      let h1Tag = gen('h1');
      h1Tag.innerHTML = 'No Results Found. Please Search Again.';
      qs('#search-individual-results').appendChild(h1Tag);
    }
  }

  function generateListingDetails(username, nameOfSmiski, possibleTrades, seriesName) {
    let cardContent = gen('div');
    cardContent.classList.add('indi-card-content');

    let nameHeader = gen('h1');
    nameHeader.classList.add('indi-card-header');
    let usernameTag = gen('h2');
    usernameTag.classList.add('indi-card-username');
    nameHeader.innerHTML = 'Username: ' + username;
    usernameTag.innerHTML = 'Name of Smiski: ' + nameOfSmiski;
    let trades = gen('h2');
    trades.innerHTML = 'Willing to swap for: ' + possibleTrades;
    trades.classList.add('indi-card-username');
    let series = gen('h2');
    series.innerHTML = 'Series name: ' + seriesName;
    series.classList.add('indi-card-username');
    cardContent.appendChild(nameHeader);
    cardContent.appendChild(usernameTag);
    cardContent.appendChild(trades);
    cardContent.appendChild(series);
    return cardContent;
  }

  function hideSearch() {
    qs('#search-results').innerHTML = '';
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');
    qs('#cardformatting').innerHTML = '';
  }

  function addTextContent(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, data, username)  {
    h1NameTag.textContent = 'smiski name: ' + data['name of listing'];
    h2Username.textContent = 'username of seller: ' + username;
    h2PossibleTrade.textContent = 'list of possible trades: ' + data['possible trade'];
    let tradeInfo = data['trade info'];
    if(!(tradeInfo === null)) {
      h3AdditionalInfo.textContent = 'any additional information: ' + data['trade info'];
    }

    swapBtn.innerHTML = 'REQUEST SWAP';
  }

  function smiskiAdditionalInfo(data, originalNames, username) {
    hideSearch();
    let found = false;
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

    let parentContainer = qs('#smiski-listing-info');

    let leftSideImg = gen('img');
    let listingName = data['name of listing'];
    listingName = breakUpName(listingName);

    let seriesName = data['series of listing'];
    leftSideImg.src = 'img/series/' + seriesName + '/' + listingName + '.png';
    leftSideImg.alt = seriesName + ' ' + listingName;
    leftSideImg.id = seriesName + ' ' + listingName;
    let card = gen('article');
    let h1NameTag = gen('h1');
    let h2Username = gen('h2');
    let h2PossibleTrade = gen('h2');
    let h3AdditionalInfo = gen('h3');
    let swapBtn = gen('button');
    swapBtn.id = 'swap-button';

    addTextContent(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, data, username);
    additionalInfoAppending(h1NameTag, h2Username, h2PossibleTrade, h3AdditionalInfo, swapBtn, card);

    swapBtn.addEventListener('click', () => initateSwap(data, card, leftSideImg));
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

  function initateSwap(data, otherCard, otherPic) {

    qs('#smiski-listing-info').innerHTMl = '';
    let parentContainer = qs('#swap-views');
    id('swap-button').classList.add('hidden');
    otherCard.classList.remove('specfic-listing-info-box');

    let leftSideCard = gen('article');
    otherPic.classList.add('circle-logo');
    otherCard.classList.add('swap-left-card');
    leftSideCard.appendChild(otherPic);
    leftSideCard.appendChild(otherCard);
    leftSideCard.classList.add('swap-left-side-card');

    let btnContainer = gen('article');
    let swapBtn = gen('button');
    swapBtn.innerHTML = 'SWAP!';
    swapBtn.classList.add('actually-swapping-btn');
    btnContainer.appendChild(swapBtn);
    swapBtn.id = 'actually-swapping'
    swapBtn.disabled = true;

    let rightSideCard = gen('article');
    let rightSideImg = gen('img');
    rightSideImg.src = 'img/logo.png';
    rightSideImg.alt = 'default logo';
    rightSideImg.id = 'right-side-img-default'
    rightSideImg.classList.add('circle-logo');
    rightSideCard.appendChild(rightSideImg);

    let searchInput = gen('input');
    searchInput.id = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'enter smiski name';
    let submitBtn = gen('button');
    submitBtn.classList.add('sexy-enter-btn');
    submitBtn.innerHTML = 'Enter Name!'
    searchInput.classList.add('sexy-name-input-btn');
    rightSideCard.appendChild(searchInput);
    rightSideCard.appendChild(submitBtn);
    rightSideCard.classList.add('swap-right-side-card');

    parentContainer.appendChild(leftSideCard);
    parentContainer.appendChild(btnContainer);
    parentContainer.appendChild(rightSideCard);

    submitBtn.addEventListener('click', function() {
      let input = searchInput.value;
      filterSearchPartTwo(input, '/search/:searchInput', leftSideCard)
      swapBtn.disabled = false;
    });
  }

  function checkAndGetSmiski(data, search, otherCard) {
    let nameAndSeries = otherCard.querySelector('img').id;
    search = breakUpName(search);
    if(data.length !== 0) {
      let rightImg = qs('#right-side-img-default');
      rightImg.src = 'img/series/' + data[0]['series of listing'] + '/' + search + '.png';
      rightImg.alt = data['series of listing'] + '/' + data['name of listing'];
      if(signedIn === true) {
        qs('#actually-swapping').addEventListener('click', function() {
          confirmSwapPage(nameAndSeries, data[0]['series of listing'],  data[0]['name of listing']);
        });
      }
    }
  }

  function confirmSwapPage(nameAndSeries, mySeries, mySmiski) {
    qs('#transaction').classList.remove('hidden');
    qs('#swap-views').innerHTML = '';
    nameAndSeries = nameAndSeries.split(' ');
    let gettingThisSeries = nameAndSeries[0];
    let gettingThisName = nameAndSeries[1];
    for(let i = 2; i < nameAndSeries.length; i++) {
      gettingThisName += nameAndSeries[i];
    }

    let transactionDetails = gen('article');
    let pTag = qs('#transaction-details');
    pTag.innerHTML = 'You are swapping your ' + mySmiski + ' of the series ' +
    mySeries + ' for the smiski ' + gettingThisName + ' from ' + gettingThisSeries;
    transactionDetails.appendChild(pTag);
    transactionDetails.classList.add('transaction-swap');
    qs('#transaction').appendChild(transactionDetails);
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
          if (data === true) {
            storeSwap(gettingThisSeries, gettingThisName, mySeries, mySmiski);
            createUniqueNumber();
            id('name').value = '';
            id('address').value = '';
            id('phone').value = '';
            id('email').value = '';
            id('card-number').value = '';
            id('cvv').value = '';
            id('expiry').value = '';
            qs('#banner').classList.remove('hidden');
            qs('#recommended-boxes').classList.remove('hidden');
            qs('#landingpage').classList.remove('hidden');
            clearViewsExceptHome();
          } else {
            let swapError = gen('p');
            swapError.textContent = 'Please check your username and credit card number';
            let transactionDiv = id('transaction');
            transactionDiv.appendChild(swapError);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  function createUniqueNumber() {
    let timestamp = Date.now();
    let random = Math.floor(Math.random() * 10000);
    let transactionNumber = timestamp + random;
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
      .catch(handleError);

  }

  function storeSwap(otherSeries, otherName, mySeries, myName) {
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
    let recommendedText = id('recommended-for-you');
    recommendedText.classList.add('hidden');
    let url = '';
    if (/\s/.test(search)) {
      let allNames = data.name.split(' ');
      for(let i = 0; i < allNames.length; i++) {
           search += allNames.toLowerCase();
      }
      url = '/allsmiskiis/?search=' + search();
    } else {
      url = '/allsmiskiis/?search=' + search.toLowerCase();
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
    for(let i = 0; i < 6; i++) {
      let seriesArticle = gen('article');
      seriesArticle.classList.add('series-card');
      let smiskiiImg = gen('img');
      let names = data[i].Names;
      let originalNames = names;
      names = breakUpName(names);

      smiskiiImg.src = 'img/series/' + search + '/' + names + '.png';
      smiskiiImg.alt = search + ' picture';
      seriesArticle.appendChild(smiskiiImg);
      let seriesName = gen('p');
      seriesName.innerHTML = data[i].Names;
      seriesName.classList.add('series-name-card');
      seriesArticle.appendChild(seriesName);
      seriesArticle.addEventListener('click',() => loadSmiskiiSearchView(data, originalNames));
      qs('#search-results').appendChild(seriesArticle);
    }
  }

  function loadSmiskiiSearchView(data, names) {
    qs('#search-results').innerHTML = '';
    qs('.filterSelect').classList.add('hidden');
    qs('.toggle').classList.add('hidden');
    qs('#cardformatting').innerHTML = '';
    filterSearchPartOne(names, '/search/:searchInput')
  }


  /**
   * this deals with errors being thrown
   * @param {string} err - the error that is thrown
   */
  function handleError(err) {
    console.log(err);
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
