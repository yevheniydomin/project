const { getRandomString } = require("../helpers/index");
const { getQuizListHTML } = require("../views/quizList");
const {
  createNewQuiz,
  createNewQuestion,
  createNewOption,
  getAll,
} = require("../db/queries");

const createQuiz = async (req, res) => {
  const accessCode = await getRandomString();
  const quizId = await createNewQuiz(accessCode);
  console.log(JSON.stringify(req.body));
  //console.log(req.files);

  for (let i = 1; i < req.body.questions.length; i++) {
    //console.log(JSON.stringify(req.body));
    const { title, description, options } = req.body.questions[i];
    const questionId = await createNewQuestion(title, description, quizId);

    for (let i = 0; i < options.length; i++) {
      const { min, max, correct } = options[i];
      await createNewOption(min, max, questionId, correct === "on");
    }
  }
  return res.send(`Question created successfully! Access code: ${accessCode}`);
};

const getQuizzesList = async (req, res) => {
  const quizzes = await getAll("quizzes");
  const quizzListHTML = getQuizListHTML(quizzes);
  res.set("Content-Type", "text/html");
  res.send(quizzListHTML);
};

module.exports = {
  createQuiz,
  getQuizzesList,
};
