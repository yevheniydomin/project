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

const createNewQuiz = async (accessCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await db.prepare(
        `INSERT INTO quizzes (accessCode) VALUES (?)`,
      );
      await query.run(accessCode);
      resolve(await getLastInsertedId("quizzes"));
    } catch (err) {
      console.error("ERROR ON INSERTING A NEW QUIZ\n", err);
      reject(err);
    }
  });
};

const createNewQuestion = async (title, description, quizId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await db.prepare(
        `INSERT INTO questions (title, quizID, questionText) VALUES (?, ?, ?)`,
      );
      await query.run(title, quizId, description);
      resolve(await getLastInsertedId("questions"));
    } catch (err) {
      console.error("ERROR ON INSERTING A QUESTION\n", err);
      reject(err);
    }
  });
};

const createNewOption = async (min, max, questionId, isCorrect) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await db.prepare(
        "INSERT INTO options (questionId, min, max, isCorrect) VALUES (?, ?, ?, ?)",
      );
      resolve(await query.run(questionId, min, max, isCorrect));
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
