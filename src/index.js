//Importing needed dependencies
const express = require('express');
const morgan = require('morgan');
const writer = require('csv-to-sql-script');
const sqlite3 = require('sqlite3');
const fs = require("fs");

//Defining Express App
const app = express();

//Defining arrays to hold endpoint info
const dfEnd = [];
const fullEnd = [];
const infoEnd = [];

//Adding Morgan to app to handle HTTP requests
app.use(morgan('combined'));

//Re-writing CSV as SQL
writer.writeMigration('resources/codefoobackend_cfgames.csv', 'resources/dbinfo.sql', 'media');
const commands = fs.readFileSync("resources/dbinfo.sql").toString();
const commandsLine1 = commands.substring(0, commands.indexOf("INSERT") - 1);
const commandsLine2 = commands.substring(commands.indexOf("INSERT"));

//Create and populate internal sqlite database via SQL script
const db = new sqlite3.Database('resources/dbinfo.db');
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS media");
  db.run(commandsLine1);
  db.run(commandsLine2);

  //Retrieving JSON for default (empty) endpoint from database
  db.each("SELECT rowid as id, name FROM media", (err, row) => {
    dfEnd.push({id: row.id, name: row.name});
  });

  //Retrieving JSON for full endpoint from database
  db.each("SELECT * FROM media", (err, row) => {
    fullEnd.push({id: row.id, media_type: row.media_type, name: row.name, short_name: row.short_name, long_description: row.long_description, short_description: row.short_description, created_at: row.created_at, updated_at: row.updated_at, review_url: row.review_url, review_score: row.review_score, slug: row.slug, genres: row.genres, created_by: row.created_by, published_by: row.published_by, franchises: row.franchises, regions: row.regions});
  })

  //Retrieving JSON for info endpoint from database
  db.each("SELECT * FROM media", (err, row) => {
    infoEnd.push({id: row.id, media_type: row.media_type, name: row.name, short_name: row.short_name, long_description: row.long_description, short_description: row.short_description, created_at: row.created_at, updated_at: row.updated_at, slug: row.slug, genres: row.genres, created_by: row.created_by, published_by: row.published_by, franchises: row.franchises, regions: row.regions});
  })
})

//Name and id from every media
app.get('/', (req, res) => {
    res.send(JSON.stringify(dfEnd));
});

//All info from every media
app.get('/full', (req, res) => {
  res.send(JSON.stringify(fullEnd));
});

//One media that matches id
app.get('/full/id/:mediaId', (req, res) => {
  res.send(JSON.stringify(fullEnd.find(item => item.id === req.params.mediaId)))
});

//All media sorted by review score
app.get('/full/score', (req, res) => {
  const scoreSortFull = [...fullEnd];
  scoreSortFull.sort(function(a, b) {
    return parseFloat(a.review_score) - parseFloat(b.review_score);
  })
  res.send(JSON.stringify(scoreSortFull));
});

//All media sorted by media type
app.get('/full/type', (req, res) => {
  const typeSortFull = [...fullEnd];
  typeSortFull.sort(function(a, b) {
    return a.media_type.localeCompare(b.media_type);
  })
  res.send(JSON.stringify(typeSortFull));
});

//All media of a specified genre
app.get('/full/genre/:genreName', (req, res) => {
  res.send(JSON.stringify(fullEnd.filter(item => item.genres.includes(req.params.genreName))));
});

//Non-review info from every media
app.get('/info', (req, res) => {
  res.send(JSON.stringify(infoEnd));
});

//Non-review id search
app.get('/info/id/:mediaId', (req, res) => {
  res.send(JSON.stringify(infoEnd.find(item => item.id === req.params.mediaId)))
});

//Non-review sorted by media type
app.get('/info/type', (req, res) => {
  const typeSortInfo = [...infoEnd];
  typeSortInfo.sort(function(a, b) {
    return a.media_type.localeCompare(b.media_type);
  })
  res.send(JSON.stringify(typeSortInfo));
});

//Non-review of a specified genre
app.get('/info/genre/:genreName', (req, res) => {
  res.send(JSON.stringify(infoEnd.filter(item => item.genres.includes(req.params.genreName))));
});

//Start Server
app.listen(3000, () => {
  console.log('listening on port 3000');
});

//Close database
db.close();