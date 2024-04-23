const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("myDatabase.db", (err) => {
  if (err) {
    //print a message if error occured
    console.error("Database connection error:", err.message);
  } else {
    //otherwise notify that file is connected to myDatabase.db
    console.log("Connected to the database");
  }
});

module.exports = {
  db,
};
