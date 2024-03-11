const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connect sqlite3 with the database
const db = new sqlite3.Database('myDatabase.db');
app.use(express.urlencoded({ extended: true }));

// Create the "questions" table if it doesn't exist
// Create the "options" table if it doesn't exist
// Create the "options" table if it doesn't exist

db.run('CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, optionText TEXT)'); //later end isCorrect boolean INTEGER
db.run('CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, questionId INTEGER, optionText TEXT, isCorrect INTEGER)'); //later end isCorrect boolean INTEGER

// Serve the HTML login file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/teacher.html');
  res.sendFile(__dirname + '/student.html');
});

// Handle form submission
app.post('/signup', async (req, res) => {
  const email = req.body.email;
  // const password = req.body.password;
  // generate salt
  const salt = await bcrypt.genSalt();
  // hash password using salt
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
    if (err) {
      return res.send('Error: failed to sign');
    }
    res.send('Sign up is successful!');
  });
});

app.post('/login', (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  //this is a syntax of SQL, it means that it will be getting info from the existed table users
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err) => {
    if (err) {
      //if error occured, then something does not match
      console.error('Data do not coincide', err.message);
      return res.send('Error: failed to log in');
    }
    console.log('Login successful!');
    return res.send('Log in is successful!');

  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
