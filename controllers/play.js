const { insertToDb, getByWhere, getQuizIdByCode } = require("../db/queries");
const { mapOptionsToQuestions } = require("../helpers/index");
const { getPlayHTML } = require("../views/play");
const { db } = require("../db/index");

const playQuizz = async (req, res) => {
  const { code, name } = req.body;

  const quizId = await getQuizIdByCode(code);
  //console.log('playQuiz quizId: ', quizId);
  if (!quizId) {
    res.send("Access code is not valid. Please enter a valid code.");
  }
  const questions = await getByWhere("questions", "quizID", quizId);

  //console.log('getByWhere returned questions: \n', questions);

  const options = await Promise.all(
    questions.map(async (question) => {
      return await getByWhere("options", "questionId", question.id);
    }),
  );
  //console.log('after Promise all options: \n', options);

  const mappedQuestions = mapOptionsToQuestions(questions, options);
  //console.log('Mapped: \n', mapOptionsToQuestions);
  //console.log(mappedQuestions);
  const html = getPlayHTML(questions, code, name);
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(html));
};

module.exports = { playQuizz };
