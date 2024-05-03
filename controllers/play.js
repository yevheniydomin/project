const { insertToDb, getByWhere, getQuizIdByCode } = require("../db/queries");
const { mapOptionsToQuestions } = require("../helpers/index");
const { getPlayHTML } = require("../views/play");
const { db } = require("../db/index");

const playQuizz = async (req, res) => {
  const { code, name } = req.body;
  insertToDb("responses", ["studentName"], [name]);

  const quizId = await getQuizIdByCode(code);
  if (!quizId) {
    res.send("Access code is not valid. Please enter a valid code.");
  }
  const questions = await getByWhere("questions", "quizID", quizId);

  const options = await Promise.all(
    questions.map(async (question) => {
      return await getByWhere("options", "questionId", question.id);
    }),
  );

  const mappedQuestions = mapOptionsToQuestions(questions, options);
  const html = getPlayHTML(questions, options);
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(html));
};

module.exports = { playQuizz };