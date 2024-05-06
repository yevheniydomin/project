const { insertQuizzResult } = require("../db/queries");

const submitAnswers = async (req, res) => {
  console.log(req.body);
  const { quizId, questionId, name, answeredOption } = req.body;

  for (let i = 0; i < req.body.length; i++) {
    const { quizId, questionId, name, answeredOption } = req.body[i];
    await insertQuizzResult(
      quizId,
      questionId,
      name,
      answeredOption,
      answeredOption,
    );
  }

  res.status(200);
};

module.exports = {
  submitAnswers,
};
