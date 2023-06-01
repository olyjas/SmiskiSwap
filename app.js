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

//GET THE NAMES OF ALL OF THE SMISKI
app.get('/allsmiskii', async function(req, res) {
  try {
    res.type('JSON');
    let db = await getDBConnection();
    let query = 'SELECT names FROM smiskiinamesdata';
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
    //let search = req.query.search;
    res.type('JSON');
    let db = await getDBConnection();
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
    let finalFormat = [];
    let secondIndex;
    for(let j = 0; j < finalResults.length; j++) {
      let secondQuery = 'SELECT names FROM smiskiinamesdata WHERE series=? ';
      let names = await db.all(secondQuery, finalResults[j]);
      finalFormat[secondIndex] = names;
      secondIndex++;
      //console.log(finalFormat[secondIndex]);
    }
    console.log("out");
    console.log(finalFormat);
    //let secondQuery = 'SELECT names from smiskiinamesdata';
    //let names = await db.all(secondQuery);
    db.close();
    res.json(finalResults);
  } catch (err) {
    res.status(500);
    console.log(err);
    res.type('text').send('An error occurred on the server. Try again later.');
  }
});


// app.post('/yipper/likes', async function(req, res) {
//   try {
//     let id = req.body.id;
//     if(!id) {
//       res.status(400).type('text');
//       res.send('Yikes. ID does not exist.');
//     }
//     res.type('text');
//     let db = await getDBConnection();
//     let likes = 'SELECT likes FROM yips WHERE id = ' + id;
//     let likeNumber = await db.get(likes);

//     let updatedNum = likeNumber.likes + 1;
//     let query = 'UPDATE yips SET likes = ? WHERE id = ?';

//     await db.run(query, updatedNum, id);
//     await db.get('SELECT * FROM yips WHERE id = ' + id);

//     db.close();
//     res.send(updatedNum + "");
//   } catch (err) {
//     res.status(500);
//     res.type('text').send('something went wrong');
//   }

// });

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
