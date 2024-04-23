const { db } = require("./index");

const getLastInsertedId = async (tableName) => {
  return new Promise(async (resolve, reject) => {
    await db.get(
      `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1`,
      async (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row.id);
      },
    );
  });
};

const createNewQuiz = async (title, accessCode) => {
  try {
    const query = await db.prepare(
      `INSERT INTO quizzes (title, accessCode) VALUES (?, ?)`,
    );
    await query.run(title, accessCode);
    return await getLastInsertedId("quizzes");
  } catch (err) {
    console.error("ERROR ON INSERTING A NEW QUIZ\n", err);
  }
};

const createNewQuestion = async (title, description, quizId) => {
  try {
    const query = await db.prepare(
      `INSERT INTO questions (title, quizID, questionText) VALUES (?, ?, ?)`,
    );
    await query.run(title, quizId, description);
    return await getLastInsertedId("questions");
  } catch (err) {
    console.error("ERROR ON INSERTING A QUESTION\n", err);
  }
};

const createNewOption = async (min, max, answer, questionId, isCorrect) => {
  return new Promise((resolve, reject) => {
    try {
      const query = db.prepare(
        "INSERT INTO options (questionId, min, max, answer, isCorrect) VALUES (?, ?, ?, ?, ?)",
      );
      resolve(query.run(questionId, min, max, answer, isCorrect));
    } catch (err) {
      console.error("ERROR ON INSERTING A NEW OPTION\n", err);
      reject(err);
    }
  });
};

module.exports = {
  createNewQuiz,
  createNewQuestion,
  createNewOption,
};
