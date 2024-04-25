const express = require("express");
const { initDataBase } = require("./db/createDB");
const { db } = require("./db/index");
const quizController = require("./controllers/quizController");

const app = express();
const port = 3000;

initDataBase();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

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

//will not be used in the future
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

// app.post('/quizzes', async (req, res) => {
//   const { title } = req.body;
//   const accessCode = generateAccessCode(); // Implement your access code generation logic

//   try {
//     const stmt = db.prepare('INSERT INTO quizzes (title, accessCode) VALUES (?, ?)');
//     const result = await stmt.run(title, accessCode);
//     stmt.finalize();
//     res.json({ id: result.lastID, accessCode });
//   } catch (error) {
//     console.error('Error creating quiz:', error);
//     res.status(500).send('Error creating quiz');
//   }
// });

// app.post('/quizzes/:quizId/questions', async (req, res) => {
//   const { quizId } = req.params;
//   const { text, options } = req.body;

//   try {
//     const stmt = db.prepare('INSERT INTO questions (quizId, text) VALUES (?, ?)');
//     const result = await stmt.run(quizId, text);
//     const questionId = result.lastID;
//     stmt.finalize();

//     const optionsStmt = db.prepare('INSERT INTO options (questionId, text, isCorrect) VALUES (?, ?, ?)');
//     options.forEach(async (option) => {
//       await optionsStmt.run(questionId, option.text, option.isCorrect ? 1 : 0);
//     });
//     optionsStmt.finalize();

//     res.json({ questionId });
//   } catch (error) {
//     console.error('Error adding question:', error);
//     res.status(500).send('Error adding question');
//   }
// });
app.post("/quizzes", async (req, res) => {
  const { title } = req.body;
  const accessCode = generateAccessCode();

  try {
    const stmt = db.prepare(
      "INSERT INTO quizzes (title, accessCode) VALUES (?, ?)",
    );
    const result = await stmt.run(title, accessCode);
    stmt.finalize();
    res.json({ id: result.lastID, accessCode });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).send("Error creating quiz");
  }
});

//add a question to a quiz
app.post("/quizzes/:quizId/questions", async (req, res) => {
  const { quizId } = req.params;
  const { questionText, options } = req.body;

  try {
    const stmt = db.prepare(
      "INSERT INTO questions (quizId, questionText) VALUES (?, ?)",
    );
    const result = await stmt.run(quizId, questionText);
    const questionId = result.lastID;
    stmt.finalize();

    const optionsStmt = db.prepare(
      "INSERT INTO options (questionId, optionText, isCorrect) VALUES (?, ?, ?)",
    );
    options.forEach(async (option) => {
      await optionsStmt.run(questionId, option.text, option.isCorrect ? 1 : 0);
    });
    optionsStmt.finalize();

    res.json({ questionId });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).send("Error adding question");
  }
});

//access route for play.html(meant for students)
app.post("/play", (req, res) => {
  const { code, name } = req.body;

  db.run("INSERT INTO responses(studentName) VALUES(?)", [name], (err) => {
    if (err) {
      console.log("Error: failed to insert students name", err.message);
      return res.send("Error: failed to register student");
    }
  });
  //verify the access code against the database
  db.get("SELECT * FROM quizzes WHERE accessCode = ?", [code], (err, row) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.send("Error: failed to verify access code");
    }

    //check if the access code exists
    if (row) {
      //access code exists, proceed to the quiz
      console.log("Access code verified:", row);
      //redirecting to another webpage to access questions
      res.redirect("/viewQuestion.html"); // Replace "/quiz" with the actual URL of the quiz page
    } else {
      //if code does not exist in database, send an error
      console.error("Invalid access code");
      return res.send("Invalid access code");
    }
  });
});

// app.get("/getResponses", (req, res) => {
//   let sql = "SELECT * FROM responses(questionId, studentName, isCorrect) VALUES(?, ?, ?)";
//   let query = connection.query(sql, (err, rows) => {
//     if(err) throw err;
//     res.render()
//   });

// });

app.post("/seeResponses", (req, res) => {
  let sql = "SELECT * FROM responses(questionId, studentName, isCorrect) VALUES(?, ?, ?)";
  let seeResponses = {questionId: req.body.questionId, studentName: req.body.studentName, isCorrect: req.body.isCorrect};

  seeResponses = connection.query(sql, (err, row) => {
    if(err) {
      console.error("Error posting responses", err.message);
      return res.send("Error: failed to post responses");
    }
  });
});

//start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
