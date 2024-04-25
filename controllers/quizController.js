const { getRandomString } = require("../helpers/index");
const {
  createNewQuiz,
  createNewQuestion,
  createNewOption,
} = require("../db/queries");

const createQuiz = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const accessCode = await getRandomString();
  const quizId = await createNewQuiz(accessCode);

  for (question of req.body.questions) {
    const { title, description, options } = question;
    const questionId = await createNewQuestion(title, description, quizId);
    console.log(questionId, " QuestionId before creating new options", "idx ");
    await Promise.all(
      options.map(async (option) => {
        const { min, max, correct } = option;
        console.log(questionId, " during creating options ");
        return await createNewOption(min, max, questionId, correct === "on");
      }),
    );
  }
  return res.send(`Question created successfully! Access code: ${accessCode}`);
};

module.exports = {
  createQuiz,
};
