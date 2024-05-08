//import necessary packages and files
const express = require("express");
const { initDataBase } = require("./db/createDB");
const { db } = require("./db/index");
const quizController = require("./controllers/quizController");
const playQuizz = require("./controllers/play");
const submitAnswers = require("./controllers/submitAnswers");
const responses = require("./controllers/responses");
const { getQuizIdByCode } = require("./db/queries");

const app = express();
const port = 3000;

initDataBase();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/responses"));
app.use(express.json());

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
    },
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

  //retrieve user from the database based on email and password
  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        console.error("Error querying database", err.message);
        return res.send("Error: failed to log in");
      }

      //check if the row is not undefined and if the password and email matches
      if (row && row.password === password && row.email === email) {
        console.log("Log in successful!", row);
        return res.redirect("/createQuestion.html");
      } else {
        console.error("Invalid email or password");
        return res.send("Invalid email or password");
      }
    },
  );
});

app.post("/createQuestion", quizController.createQuiz);

app.post("/play", playQuizz.playQuizz);

app.post("/submit", submitAnswers.submitAnswers);

app.post("/uploads", (req, res) => {
  // Retrieve the URL of the uploaded image from req.file.location
  const imageUrl = req.file.location;

  // Store the image URL in the 'images' table
  db.run("INSERT INTO images (url) VALUES (?)", [imageUrl], (err) => {
    if (err) {
      console.error("Error inserting image URL:", err.message);
      return res.status(500).send("Error inserting image URL");
    }

    return res.send("Image uploaded and URL stored successfully!");
  });
});

app.get("/quizzes", quizController.getQuizzesList);

app.get("/responses", responses.getResponsesByQuizId);

//start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
