const { insertToDb, getByWhere, getQuizIdByCode } = require("../db/queries");
const { db } = require("../db/index");

const playQuizz = async (req, res) => {
  const { code, name } = req.body;
  insertToDb("responses", ["studentName"], [name]);

  const quizId = await getQuizIdByCode(code);
  if (!quizId) {
    res.send("Access code is not valid. Please enter a valid code.");
  }
  const questions = await getByWhere("questions", "quizID", quizId);
  console.log(questions);
  const response = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="style.css" rel="stylesheet" type="text/css" />
    <!-- TO DO: title should be the name of the quiz -->
    <title></title>
  </head>
  <body>
    <div class="smallBox">
      <h1>${questions.title}</h1>
      <p>${questions.questionText}</p>
      <!-- TO DO: display image from question-->
      <input type="radio" value="Option1" id="option1" />
      <label for="option1">Option 1</label><br /><br />
      <input type="radio" value="Option2" id="option2" />
      <label for="option2">Option 2</label><br /><br />
      <input type="radio" value="Option3" id="option3" />
      <label for="option3">Option 3</label><br /><br />
      <input type="radio" value="Option4" id="option4" />
      <label for="option4">Option 4</label><br /><br />
      <input
        class="bigButton"
        type="submitResponse"
        value="Submit"
        id="submitResponse"
      />
    </div>
  </body>
</html>`;
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(response));
};

module.exports = { playQuizz };
