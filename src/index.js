// importing the dependencies
const express = require('express');
const morgan = require('morgan');
const writer = require('csv-to-sql-script');
const sqlite3 = require('sqlite3');
const fs = require("fs");

const app = express();
const dfEnd = [];
const fullEnd = [];

// adding morgan to log HTTP requests
app.use(morgan('combined'));

writer.writeMigration('resources/codefoobackend_cfgames.csv', 'resources/dbinfo.sql', 'media');
const commands = fs.readFileSync("resources/dbinfo.sql").toString();
const commandsLine1 = commands.substring(0, commands.indexOf("INSERT") - 1);
const commandsLine2 = commands.substring(commands.indexOf("INSERT"));

const db = new sqlite3.Database('resources/dbinfo.db');
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS media");
  db.run(commandsLine1);
  db.run(commandsLine2);
  db.each("SELECT rowid as id, name FROM media", (err, row) => {
    dfEnd.push({id: row.id, name: row.name});
  });
  db.each("SELECT * FROM media", (err, row) => {
    fullEnd.push({id: row.id, media_type: row.media_type, name: row.name, short_name: row.short_name, long_description: row.long_description, short_description: row.short_description, created_at: row.created_at, updated_at: row.updated_at, review_url: row.review_url, review_score: row.review_score, slug: row.slug, genres: row.genres, created_by: row.created_by, published_by: row.published_by, franchises: row.franchises, regions: row.regions});
  })
})



// defining an endpoint to return all ads
app.get('/', (req, res) => {
    res.send(JSON.stringify(dfEnd));
});

app.get('/full', (req, res) => {
  res.send(JSON.stringify(fullEnd));
});

app.get('/full/:mediaId', (req, res) => {
  res.send(JSON.stringify(fullEnd.find(item => item.id === req.params.mediaId)))
});

// starting the server
app.listen(3000, () => {
  console.log('listening on port 3000');
});
db.close();