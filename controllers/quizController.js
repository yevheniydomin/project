const { getRandomString } = require("../helpers/index");
const {
  createNewQuiz,
  createNewQuestion,
  createNewOption,
} = require("../db/queries");

const createQuiz = async (req, res) => {
  const accessCode = await getRandomString();
  const quizId = await createNewQuiz(accessCode);

  for (let i = 0; i < req.body.questions.length; i++) {
    const { title, description, options } = req.body.questions[i];
    const questionId = await createNewQuestion(title, description, quizId);

    for (const option of options) {
      const { min, max, correct } = option;
      await createNewOption(min, max, questionId, correct === "on");
    }
  }
  return res.send(`Question created successfully! Access code: ${accessCode}`);
};

module.exports = {
  createQuiz,
};
