// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const writer = require('csv-to-sql-script');
const sqlite3 = require('sqlite3');
const fs = require("fs");

writer.writeMigration('resources/codefoobackend_cfgames.csv', 'resources/dbinfo.sql', 'media');
const commands = fs.readFileSync("resources/dbinfo.sql").toString();
const commandsLine1 = commands.substring(0, commands.indexOf("INSERT") - 1);
const commandsLine2 = commands.substring(commands.indexOf("INSERT"));

const db = new sqlite3.Database('resources/dbinfo.db');
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS media");
  db.run(commandsLine1);
  db.run(commandsLine2);
  db.each("SELECT rowid AS id, name FROM media", (err, row) => {
    console.log(row.id + ": " + row.name);
  });
})

const ads = "Hello";
// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)


// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

// starting the server
app.listen(3000, () => {
  console.log('listening on port 3000');
});
db.close();