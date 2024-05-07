const {
  getResponsesByAccessCode,
  getCountOfQuestions,
  getQuizIdByCode,
} = require("../db/queries");
const { getGroupedData } = require("../helpers/index");

const getResponsesByQuizId = async (req, res) => {
  const accessCode = req.query.code;
  try {
    const responses = await getResponsesByAccessCode(accessCode);
    const groupedData = getGroupedData(responses);
    const quizId = await getQuizIdByCode(accessCode);
    const { questionCount } = await getCountOfQuestions(quizId);

    for (const key in groupedData) {
      const correctAnswersCount = groupedData[key].responses.reduce(
        (sum, currentQuestion) => {
          if (currentQuestion.isCorrect === 1) {
            return sum + 1;
          } else {
            return sum;
          }
        },
        0,
      );

      groupedData[key].grade = correctAnswersCount
        ? (questionCount / correctAnswersCount) * 100
        : 0;
    }

    // calculate score (query db how many questions in this quiz, how many correct answers in user obj, count grade and add to the user obj)
    // build an array of raws [{username, q1, q2, q3, q4... final grade}]
    res.send(JSON.stringify(groupedData));
  } catch (err) {
    console.error("ERROR ON GETTING RESPONSES\n", err);
  }
};

module.exports = {
  getResponsesByQuizId,
};
