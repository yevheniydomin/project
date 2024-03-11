//NOTE: to test this file, make sure you have npm sqlite3 and npm express initialized in terminal
//To initialize npm: npm init
//To initialize sqlite: npm i sqlite3
//To intialize express: npm i express

//initialize express and sqlite
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
//const bcrypt = require('bcrypt');
const multer = require("multer");

//transfer express to the variable app and create a port
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const port = 3000;

//connect sqlite3 with the database - it automatically will create a file called myDatabase.db
const db = new sqlite3.Database("myDatabase.db", (err) => {
  if (err) {
    //print a message if error occured
    console.error("Database connection error:", err.message);
  } else {
    //otherwise notify that file is connected to myDatabase.db
    console.log("Connected to the database");
  }
});

//parsing incoming requests with url
app.use(express.urlencoded({ extended: true }));

app.use(upload.single("images"));
//serve static files from the current directory
app.use(express.static(__dirname));

//handle file upload
//handle form submission
app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //inserting input email and password into myDatabase.db table
  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    (err) => {
      if (err) {
        //notify in console if error occured
        console.error("Error inserting data:", err.message);
        //after clicking button sign up, the message will appear saying about error
        return res.send("Error: failed to sign up");
      }
      //notify if input data is in database table, sign up is successfull
      console.log("Data inserted successfully");
      res.redirect("/createQuestion.html");
    }
  );
});

//basically same logic as for sign up, but adding row to compare from already existing data
app.post("/login", (req, res) => {
  const email = req.body.email;
  // // generate salt
  // const salt = await bcrypt.genSalt();
  // // hash password using salt
  // const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const password = req.body.password;
  // const validPassword = await bcrypt.compare(row.password, hashedPassword);
  // console.log(validPassword);

  // Retrieve user from the database based on email and password
  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        console.error("Error querying database", err.message);
        return res.send("Error: failed to log in");
      }

      // Check if the row is not undefined and if the password and email matches
      if (row && row.password === password && row.email === email) {
        console.log("Log in successful!", row);
        return res.redirect("/createQuestion.html");
      } else {
        console.error("Invalid email or password");
        return res.send("Invalid email or password");
      }
    }
  );
});

app.post("/createQuestion", (req, res) => {
  try {
    const { questionText, option1, option2, option3, option4 } = { ...req.body }
  
    // const options = req.body.options
    //   .map((option) => option.trim())
    //   .filter((option) => option !== "");
    // const image = req.file;
    // Handle file upload (if present)
    // Process 'image' as needed
    //const image = req.files && req.files.image ? req.files.image : null;
    console.log("req.body:", req.body);
    console.log("req.image:", req.image);
    db.run(
      "INSERT INTO questions (questionText) VALUES(?)",
      [questionText],
      function (err) {
        if (err) {
          console.log("Error inserting question", err.message);
          return res.send("Error: failed to create a question");
        }

        const questionID = this.lastID;

        options.forEach((option, index) => {
          db.run(
            "INSERT INTO options (questionId, optionText, isCorrect) VALUES (?, ?, ?)",
            [questionID, option, index === 0 ? 1 : 0]
          ); //assuming the first option is correct
        });

        return res.send("Question created successfully!");
      }
    );
  } catch (err) {
    res.sendStatus(400).send("Error", err);
  }
});

app.post("/start", (req, res) => {
  const name = req.body.name;
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
