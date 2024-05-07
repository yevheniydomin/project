const { insertQuizzResult, getIsOptionCorrect } = require("../db/queries");

const submitAnswers = async (req, res) => {
  console.log(req.body);
  //const { quizId, questionId, name, answeredOption } = req.body;

  try {
    for (let i = 0; i < req.body.length; i++) {
      const { quizId, questionId, name, answeredOption } = req.body[i];
      const { isCorrect } = await getIsOptionCorrect(answeredOption);

      await insertQuizzResult(
        quizId,
        questionId,
        name,
        answeredOption,
        isCorrect,
      );
    }
  } catch (err) {
    console.error("ERROR ON SUBMITTING RESPONSE\n", err);
  }

  res.redirect("http://localhost:3000/");
};

module.exports = {
  submitAnswers,
};
