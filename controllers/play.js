const {
  getByWhere,
  getQuizIdByCode,
  getImgNameByQuestionId,
} = require("../db/queries");
const { mapOptionsToQuestions, getBase64Img } = require("../helpers/index");
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

  const imgNames = await Promise.all(
    questions.map(async (question) => {
      const dbRes = await getImgNameByQuestionId(question.id);
      return { ["questionId"]: dbRes.questionId, imgNames: dbRes.imageName };
    }),
  );
  const base64ImgMap = await getBase64Img(imgNames);

  console.log(questions);
  const options = await Promise.all(
    questions.map(async (question) => {
      return await getByWhere("options", "questionId", question.id);
    }),
  );
  console.log("after Promise all options: \n", options);

  const mappedQuestions = mapOptionsToQuestions(questions, options);
  //console.log('Mapped: \n', mapOptionsToQuestions);
  console.log(mappedQuestions);
  const html = await getPlayHTML(questions, base64ImgMap, code, name);
  //console.log(html);
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(html));
};

module.exports = { playQuizz };
