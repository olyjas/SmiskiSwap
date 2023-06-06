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

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const isCredentialsValid = await checkCredentials(username, password);

  if (isCredentialsValid) {
    res.status(200).json({message: 'Login successful'});
  } else {
    res.status(401).json({message: 'Invalid credentials'});
  }
});

async function checkCredentials(username, password) {
  const db = await getDBConnection();

  try {
    const query = `SELECT * FROM userinfostorage WHERE username=? AND password=?`;
    const result = await db.get(query, [username, password]);

    if (result) {
      return true;
    }
    return false;
  } finally {
    await db.close();
  }
}

app.post('/signup', async (req, res) => {
  const {username, password, email} = req.body;
  const isUserCreated = await createUser(username, password, email);

  if (isUserCreated) {
    res.status(201).json({message: 'User created successfully'});
  } else {
    res.status(409).json({message: 'Username already exists'});
  }
});

async function createUser(username, password, email) {
  const db = await getDBConnection();

  try {
    const query = `SELECT COUNT(*) as count FROM userinfostorage WHERE username = ?`;
    const existingUser = await db.get(query, [username]);

    if (existingUser.count > 0) {
      return false;
    }
    const insertQuery = `INSERT INTO userinfostorage (username, password, name, email,' +
    ' swappedhistory, [swapped for history]) VALUES (?, ?, '', ?, '', '')`;
    await db.run(insertQuery, [username, password, email]);
    return true;
  } finally {
    await db.close();
  }
}

app.post('/listing/:username', async (req, res) => {
  const username = req.body.username;

  try {
    const db = await getDBConnection();

    let query = `SELECT * FROM userinfostorage WHERE username = ?`;
    let results = await db.all(query, [username]);
    results = checkData(results);

    db.close();

    res.json(results);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('An error occurred while fetching listings');
  }
});

function checkData(data) {
  let names = data[0]['swapped for history'];
  return names;

}

app.post('/listing', async (req, res) => {
  const seller = req.body.seller;
  const listedSmiski = req.body['listed-smiski'];
  const seriesListed = req.body['series-of-listing'];
  const seekingSmiski = req.body['sought-smiski'];
  const additionalInfo = req.body['added-info'];

  const db = await getDBConnection();

  try {
    const insertQuery = `INSERT INTO singlesmiskilistings (name, username, [name of listing], ` +
    `[series of listing], [possible trade], [trade info]) VALUES ('', ?, ?, ?, ?, ?)`;
    await db.run(insertQuery, [seller, listedSmiski, seriesListed, seekingSmiski, additionalInfo]);
    await db.close();

    res.status(200).send('Listing created successfully');
  } catch (err) {
    res.status(500).send('An error occurred while creating the listing');
  }
});

app.get('/allsmiskii', async function(req, res) {
  try {
    res.type('JSON');
    let db = await getDBConnection();
    let query = 'SELECT Names FROM smiskiinamesdata';
    let results = await db.all(query);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

app.get('/allsmiskiis', async function(req, res) {
  try {
    let search = req.query.search;
    res.type('JSON');
    let query;
    let db = await getDBConnection();
    let results = "";
    if (search) {
      query = 'SELECT names FROM smiskiinamesdata WHERE series = ?';
      results = await db.all(query, search);
    } else {
      query = 'SELECT names FROM smiskiinamesdata';
      results = await db.all(query);
    }
    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

app.post('/smiskilisting/:smiskiName', async function(req, res) {
  let smiski = req.body.smiskiName;
  try {
    res.type('JSON');
    let db = await getDBConnection();

    let query = 'SELECT * FROM singlesmiskilistings WHERE REPLACE(`name of listing`, " ", "")' +
    ' LIKE ?';
    let results = await db.all(query, `%${smiski}%`);

    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

app.get('/smiskilistings', async function(req, res) {
  try {
    res.type('JSON');
    let db = await getDBConnection();
    let query = 'SELECT username, [name of listing], [series of listing] from singlesmiskilistings';
    let results = await db.all(query);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

app.get('/smiskiiseries', async function(req, res) {
  try {
    res.type('JSON');
    let db = await getDBConnection();
    let query = 'SELECT series FROM smiskiinamesdata';
    let results = await db.all(query);
    let finalResults = [];
    let index = 0;
    for (let i = 0; i < results.length; i++) {
      if (!(finalResults.includes(results[i].Series))) {
        finalResults[index] = results[i].Series;
        index++;
      }
    }
    db.close();
    res.json(finalResults);
  } catch (err) {
    res.status(500);
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

      finalFormat.push({series: seriesName, names: names});
    }

    db.close();
    res.json(finalFormat);
  } catch (err) {
    res.status(500);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});

app.post('/validateTransaction', async function(req, res) {
  let checkUsername = req.body.username;
  let cardNumber = req.body.cardNumber;
  let db = await getDBConnection();
  let result = true;
  let query = 'SELECT username from userinfostorage WHERE username = ?';
  let usernameCheck = await db.all(query, checkUsername);
  if (usernameCheck.length === 0 || cardNumber.length !== 16) {
    result = false;
  }
  res.json(result);
});

app.post('/addTransactionNum', async function(req, res) {
  let transNum = req.body.transactionNumber;
  let username = req.body.username;
  transNum += " " + transNum;
  transNum += " " + transNum;
  let db = await getDBConnection();
  let query = 'UPDATE userinfostorage SET [transaction number] = [transaction number] || ?' +
  ' WHERE username = ?';
  await db.all(query, transNum, username);
  res.json();
});

app.get('/filters', async (req, res) => {
  try {
    let db = await getDBConnection();
    let query = 'SELECT * FROM singlesmiskilistings';
    let results = await db.all(query);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(500).send('An error occurred while fetching the listings.');
  }
});

app.post('/storeSwap', async (req, res) => {
  const otherSeries = req.body.otherSeries;
  const otherName = req.body.otherName;
  const mySeries = req.body.mySeries;
  const myName = req.body.myName;
  const username = req.body.username;

  try {
    res.type('JSON');
    let user = username.trim();
    let db = await getDBConnection();

    let getQueryForSwappedHistory = 'SELECT [swappedhistory] FROM userinfostorage WHERE username=?';
    let swappedHistory = await db.get(getQueryForSwappedHistory, user);
    swappedHistory = swappedHistory['swappedhistory'];

    let getQueryForRecivedSmiski = 'SELECT [swapped for history] from userinfostorage WHERE username=?';
    let swappedForHistory = await db.get(getQueryForRecivedSmiski, user);
    swappedForHistory = swappedForHistory['swapped for history'];

    let swapped =  swappedHistory + " " + myName + " ";
    let swappedFor = swappedForHistory + " " + otherName + " ";

    let insertQuery = `UPDATE userinfostorage
    SET swappedhistory = ?, [swapped for history] = ?
    WHERE username = ?`;
    let insertParams = [swapped, swappedFor, user];
    await db.run(insertQuery, insertParams);

    db.close();
    res.json({ success: true });
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
 });

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
      res.json(seriesResults);
    } else {
      console.log(2);
      console.log(searchInput);
      query = 'SELECT * FROM smiskiinamesdata WHERE Names=?';
      let listingsResults = await db.all(query, searchInput + "");

      if (listingsResults.length > 0) {
        query = 'SELECT * FROM singlesmiskilistings WHERE `name of listing`=?';
        let specficListingsResults = await db.all(query, searchInput);
        res.json(specficListingsResults);
      } else if(searchInput === "all") {
        let query = 'SELECT * FROM singlesmiskilistings';
        let seriesResults = await db.all(query);
        res.json(seriesResults);
      } else {
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

app.get('/swap-history/:username', async (req, res) => {
  try {
    const username = req.params.username;
    let db = await getDBConnection();
    const query = 'SELECT swappedhistory, [swapped for history], [transaction number]' +
    ' FROM userinfostorage WHERE username = ?';
    let userRow = await db.all(query, [username]);
    const swappedHistory = [];
    const swappedForHistory = [];
    const transactionHistory = [];
    for (let i = 0; i < userRow.length; i++) {
      const swappedSmiskis = userRow[i].swappedhistory.split(' ');
      const swappedForSmiskis = userRow[i]['swapped for history'].split(' ');
      const allTransactionNumbers = userRow[i]['transaction number'].split(' ');
      for (let j = 0; j < swappedSmiskis.length; j++) {
        swappedHistory.push(swappedSmiskis[j]);
      }
      for (let j = 0; j < swappedForSmiskis.length; j++) {
        swappedForHistory.push(swappedForSmiskis[j]);
      }
      for (let j = 0; j < allTransactionNumbers.length; j++) {
        transactionHistory.push(allTransactionNumbers[j]);
      }
    }
    res.json({swappedHistory, swappedForHistory, transactionHistory});
    db.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching swap history');
  }
});

app.get('/account-details/:username', async (req, res) => {
  try {
    const username = req.params.username;

    let db = await getDBConnection();

    const query = 'SELECT email FROM userinfostorage WHERE username = ?';
    let userRow = await db.all(query, [username]);
    const email = userRow[0].email;
    res.json({email});

    db.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching account information');
  }
});

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
