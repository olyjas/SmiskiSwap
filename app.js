"use strict";

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const multer = require('multer');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'smiskiinamesdata.db',
    driver: sqlite3.Database
  });
  return db;
}

///**
// * Establishes a database connection to the database and returns the database object.
// * Any errors that occur should be caught in the function that calls this one.
// * @returns {sqlite3.Database} - The database object for the connection.
// */
//async function getUserDBConnection() {
//  const db = await sqlite.open({
//    filename: 'userinfostorage.db',
//    driver: sqlite3.Database
//  });
//  return db;
//}

// LOGGING IN

// Route for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Call the checkCredentials function
  const isCredentialsValid = await checkCredentials(username, password);

  if (isCredentialsValid) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

async function checkCredentials(username, password) {
  // Get the database connection
  const db = await getDBConnection();

  try {
    // Execute a SELECT query to check the credentials
    const query = `SELECT * FROM userinfostorage WHERE username=? AND password=?`;
    const result = await db.get(query, [username, password]);

    // Check if a result is found
    if (result) {
      return true; // Credentials match
    } else {
      return false; // Credentials not found or do not match
    }
  } finally {
    // Close the database connection
    await db.close();
  }
}

// CREATING AN ACCOUNT

// Route for user creation
app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  // Call the createUser function
  const isUserCreated = await createUser(username, password, email);

  if (isUserCreated) {
    res.status(201).json({ message: 'User created successfully' });
  } else {
    res.status(409).json({ message: 'Username already exists' });
  }
});

async function createUser(username, password, email) {
  // Get the database connection
  const db = await getDBConnection();

  try {
    // Check if the username already exists
    const query = `SELECT COUNT(*) as count FROM userinfostorage WHERE username = ?`;
    const existingUser = await db.get(query, [username]);

    if (existingUser.count > 0) {
      return false; // Username already exists, return false
    }

    // Insert a new user entry into the database
    const insertQuery = `INSERT INTO userinfostorage (username, password, name, email, swappedhistory, [swapped for history])
                        VALUES (?, ?, '', ?, '', '')`;
    await db.run(insertQuery, [username, password, email]);

    return true; // User account created successfully
  } finally {
    // Close the database connection
    await db.close();
  }
}

//get list of listings with multiple names

/*app.post('/listing', async (req, res) => {
  const data = req.body.data;

  try {
    // Perform the necessary data processing
    checkData(data)
      .then((listings) => {
        // Send the listings as a response back to the frontend
        res.json(listings);
      })
      .catch((error) => {
        console.error('Error fetching listings:', error);
        res.status(500).send('An error occurred while fetching listings');
      });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).send('An error occurred while processing data');
  }
});

async function checkData(data) {
  let names = data['swap history'];
  if (names == null) {
    names = data['possible trades'];
  }

  try {
    const db = await getDBConnection();

    // Generate the placeholders for the names in the query
    const placeholders = names.map(() => '?').join(',');

    // Create the query dynamically with the generated placeholders
    const query = `SELECT * FROM singlesmiskilistings WHERE \`name of listing\` IN (${placeholders})`;

    // Fetch the listings using the query and names array
    const results = await db.all(query, names);

    db.close();

    return results;
  } catch (error) {
    throw error;
  }
} */

app.post('/listing/:username', async (req, res) => {
  const username = req.body.username;

  try {
    const db = await getDBConnection();

    // Fetch the data for the specified username
    let query = `SELECT * FROM userinfostorage WHERE username = ?`;
    let results = await db.all(query, [username]);
    console.log(results);
    results = checkData(results);

    db.close();

    // Extract the columns 'possible trades' and 'swap history' from the fetched data
    // const listings = results.map((result) => ({
    //   'possible trades': result['possible trades'],
    //   'swap history': result['swap history']
    // }));

    // Send the extracted listings as a response back to the frontend
    res.json(results);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('An error occurred while fetching listings');
  }
});

function checkData(data) {
  let names = data[0]['swapped for history'];
  console.log(names);
  return names;

}

//END HERE


// CREATING A LISTING

// Route for listing creation
app.post('/listing', async (req, res) => {
  const seller = req.body.seller;
  const listedSmiski = req.body['listed-smiski'];
  const seriesListed = req.body['series-of-listing'];
  const seekingSmiski = req.body['sought-smiski'];
  const additionalInfo = req.body['added-info'];

  const db = await getDBConnection();

  try {

    // Insert a new listing entry into the database
    const insertQuery = `INSERT INTO singlesmiskilistings (name, username, [name of listing], ` +
    `[series of listing], [possible trade], [trade info]) VALUES ('', ?, ?, ?, ?, ?)`
    await db.run(insertQuery, [seller, listedSmiski, seriesListed, seekingSmiski, additionalInfo]);
    await db.close();

    // Send a response back to the frontend indicating success
    res.status(200).send('Listing created successfully');
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error creating listing:', error);
    res.status(500).send('An error occurred while creating the listing');
  }
});



//GET THE NAMES OF ALL OF THE SMISKI
app.get('/allsmiskii', async function(req, res) {
  try {
    res.type('JSON');
    let db = await getDBConnection();
    let query = 'SELECT Names FROM smiskiinamesdata';
    let results = await db.all(query);
    db.close();
    console.log(results);
    res.json(results);
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});


//nsearch and get the specfic smiskiis from a series if the search passed in was a series name
app.get('/allsmiskiis', async function(req, res) {
  try {
    let search = req.query.search;
    console.log("search");
    console.log(search);
    res.type('JSON');
    let query;
    let db = await getDBConnection();
    let results = "";
    console.log(1);
    if (search) {
      console.log(2);
      query = 'SELECT names FROM smiskiinamesdata WHERE series = ?';
      //search = '%' + search + '%';
      console.log(search);
      results = await db.all(query, search);
    } else {
      console.log("come here");
      query = 'SELECT names FROM smiskiinamesdata';;
      results = await db.all(query);
      console.log(results);
    }
    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

//GET THE info for a specfic listing
app.post('/smiskilisting/:smiskiName', async function(req, res) {
  let smiski = req.body.smiskiName;
  console.log(smiski);
  try {
    //let search = req.query.search;
    res.type('JSON');
    let db = await getDBConnection();
    //use the distinct keyword instead
    //let query = 'SELECT * FROM singlesmiskilistings WHERE `name of listing` =?';
    //---
    //let query = 'SELECT * FROM singlesmiskilistings WHERE `name of listing`=?';
    //let results = await db.all(query, smiski);

    let query = 'SELECT * FROM singlesmiskilistings WHERE REPLACE(`name of listing`, " ", "") LIKE ?';
    let results = await db.all(query, `%${smiski}%`);

    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

//get all the listings for a specifc smiskii
app.get('/smiskilistings', async function(req, res) {
  try {
    //let search = req.query.search;
    res.type('JSON');
    let db = await getDBConnection();
    //use the distinct keyword instead
    let query = 'SELECT  username, [name of listing], [series of listing] from singlesmiskilistings';
    let results = await db.all(query);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

//GET THE NAME OF ALL OF THE SERIES
app.get('/smiskiiseries', async function(req, res) {
  try {
    //let search = req.query.search;
    res.type('JSON');
    let db = await getDBConnection();
    //use the distinct keyword instead
    let query = 'SELECT series FROM smiskiinamesdata';
    let results = await db.all(query);
    let finalResults = [];
    let index = 0;
    for(let i = 0; i < results.length; i++) {
      if(!(finalResults.includes(results[i].Series))) {
        finalResults[index] = results[i].Series;
        index++;
      }
    }
    db.close();
    res.json(finalResults);
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

app.get('/series', async function(req, res) {
  try {
    res.type('JSON');
    let db = await getDBConnection();
    let seriesQuery = 'SELECT DISTINCT series FROM smiskiinamesdata';
    let seriesResults = await db.all(seriesQuery);

    let finalFormat = [];

    for (let i = 0; i < seriesResults.length; i++) {
      let seriesName = seriesResults[i].Series;
      let namesQuery = 'SELECT names FROM smiskiinamesdata WHERE series = ?';
      let namesResults = await db.all(namesQuery, seriesName);
      let names = namesResults.map(result => result.Names);

      finalFormat.push({ series: seriesName, names: names });
    }
    //ARE WE ABLE TO ACCESS THE INDIVIDUAL NAMES ASSOCIATED WITH EACH SERIES
    console.log("Formatted results:");
    console.log(finalFormat);

    db.close();
    res.json(finalFormat);
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

// Backend code (using Express.js)
app.post('/validateTransaction', async function(req, res) {
  let checkUsername = req.body.username;
  console.log(checkUsername);
  let cardNumber = req.body.cardNumber;
  console.log(cardNumber);
  let db = await getDBConnection();
  let result = true;
  let query = 'SELECT username from userinfostorage WHERE username = ?';
  let usernameCheck = await db.all(query, checkUsername);
  console.log(usernameCheck);
  if(usernameCheck.length === 0 || cardNumber.length !== 16) {
    result = false;
  }
  res.json(result);
});

//add transaction number

app.post('/addTransactionNum', async function(req, res) {
  let transNum = req.body.transactionNumber;
  let username = req.body.username;
  console.log(transNum);
  let db = await getDBConnection();
  let query = 'UPDATE userinfostorage SET [transaction number] = ? WHERE username = ?';
  //let usernameCheck = await db.all(query, transNum + " ", username);
  await db.all(query, transNum + " ", username);
  res.json();
});

// alphabetical filters

app.get('/filters', async (req, res) => {
  const filterOption = req.query.filterOption; // Get the filter option from the query parameter

  try {
    let db = await getDBConnection();

    // Retrieve the listings from the database
    let query = 'SELECT * FROM singlesmiskilistings';

    // // Apply sorting based on the filter option
    // if (filterOption === 'date') {
    //   query += ' ORDER BY date ASC';
    // } else if (filterOption === 'alphabetical') {
    //   query += ' ORDER BY username ASC';
    // }

    console.log(query);
    console.log(filterOption);

    let results = await db.all(query);

    db.close();

    res.json(results);
  } catch (err) {
    res.status(500).send('An error occurred while fetching the listings.');
  }
});

// Endpoint for handling the swap request
app.post('/storeSwap', async (req, res) => {
  const otherSeries = req.body.otherSeries;
  const otherName = req.body.otherName;
  const mySeries = req.body.mySeries;
  const myName = req.body.myName;
  const username = req.body.username;

  try {
    res.type('JSON');
    let user = username.trim();
    console.log(user);
    let db = await getDBConnection();
    //let getQueryForSwappedHistory = 'SELECT swappedhistory from userinfostorage';
    console.log("START");
    console.log(username);
    let getQueryForSwappedHistory = 'SELECT swappedhistory FROM userinfostorage WHERE username=?';
    console.log(1);
    let swappedHistory = await db.get(getQueryForSwappedHistory, user + "");
    swappedHistory = swappedHistory['swappedhistory'];
    console.log(swappedHistory);
    console.log(2);
    let getQueryForRecivedSmiski = 'SELECT [swapped for history] from userinfostorage WHERE username=?';
    let swappedForHistory = await db.get(getQueryForRecivedSmiski, user + "");
    swappedForHistory = swappedForHistory['swapped for history'];
    console.log(3);
    console.log(swappedForHistory);
    let swapped = myName + " " + mySeries;
    console.log(swapped);
    let swappedFor = otherName + " " + otherSeries;
    console.log(swappedFor);

    swapped +=  swappedForHistory + ", " + swapped + ", ";
    console.log("ACTUAL");
    console.log(swapped);
    swappedFor += swappedForHistory + ", " + swappedFor + ", ";
    console.log("ACTUAL 2");
    console.log(swappedFor);

    let insertQuery = `UPDATE userinfostorage
    SET swappedhistory = ?, [swapped for history] = ?
    WHERE username = ?`;
    let insertParams = [swapped, swappedFor, user];
    let results = await db.run(insertQuery, insertParams);
    console.log(results);

    db.close();
    res.json({ success: true });
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

//search results
app.post('/search/:searchInput', async function(req, res) {
  const searchInput = req.body.searchInput;

  try {
    console.log(1);
    let db = await getDBConnection();
    let query = 'SELECT * FROM smiskiinamesdata WHERE Series=?';
    let seriesResults = await db.all(query, searchInput);
    console.log(searchInput);
    console.log(seriesResults);

    if (seriesResults.length > 0) {
      // Handle the matching series functionality
      res.json(seriesResults);
      //res.send(seriesResults);
    } else {
      console.log(2);
      console.log(searchInput);
      query = 'SELECT * FROM smiskiinamesdata WHERE Names=?';
      let listingsResults = await db.all(query, searchInput + "");

      if (listingsResults.length > 0) {
        query = 'SELECT * FROM singlesmiskilistings WHERE `name of listing`=?';
        let specficListingsResults = await db.all(query, searchInput);
        // Handle the matching listings functionality
        res.json(specficListingsResults);
        //res.send(listingsResults);
      } else {
        // No match found
        res.json([]);
      }
    }

    db.close();
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

// Route for fetching trade history
// Route for fetching swap history for a specific user
app.get('/swap-history/:username', async (req, res) => {
  try {
    const username = req.params.username;
    //const username = req.query.username;

    let db = await getDBConnection();

    // SQL query to fetch swap history for the specified username
    const query = 'SELECT swappedhistory, [swapped for history] FROM userinfostorage ' +
                  'WHERE username = ?';

    // Execute the query with the username as a parameter
    let userRow = await db.all(query, [username]);

    // Extract the swapped smiskis and swapped history from the fetched data
    const swappedHistory = [];
    const swappedForHistory = [];

    for (let i = 0; i < userRow.length; i++) {
      // Split the swapped history and swapped for history values into arrays
      const swappedSmiskis = userRow[i].swappedhistory.split(' ');
      const swappedForSmiskis = userRow[i]['swapped for history'].split(' ');

      // Push the individual items into the respective arrays
      for (let j = 0; j < swappedSmiskis.length; j++) {
        swappedHistory.push(swappedSmiskis[j]);
      }

      for (let j = 0; j < swappedForSmiskis.length; j++) {
        swappedForHistory.push(swappedForSmiskis[j]);
      }
    }

    // Send the swap history as the response
    res.json({swappedHistory, swappedForHistory});

    // Close the database connection
    db.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching swap history');
  }
});


// fetching account details, basically just the email
app.get('/account-details/:username', async (req, res) => {
  try {
    const username = req.params.username;

    let db = await getDBConnection();

    // SQL query to fetch swap history for the specified username
    const query = 'SELECT email FROM userinfostorage WHERE username = ?';

    // Execute the query with the username as a parameter
    let userRow = await db.all(query, [username]);

    const email = userRow[0].email;

    res.json({email});

    // Close the database connection
    db.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching account information');
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
