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

const getQuizBy = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await db.prepare(
        "SELECT FROM questions (questionId, min, max) VALUES (?, ?, ?)",
      );
      resolve(await query.run(questionId, min, max, isCorrect));
    } catch (err) {
      console.error("ERROR ON INSERTING A NEW OPTION\n", err);
      reject(err);
    }
  });
};

const getQuizIdByCode = async (accessCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Prepare the SQL query with placeholder for accessCode
      const query = "SELECT id FROM quizzes WHERE accessCode = ?";

      // Execute the query with parameter binding
      db.get(query, [accessCode], (err, row) => {
        if (err) {
          console.error("ERROR ON GETTING QUIZ ID BY ACCESS CODE\n", err);
          reject(err);
        } else {
          // Resolve with the row containing the quiz id, or undefined if not found
          resolve(row ? row.id : undefined);
        }
      });
    } catch (err) {
      console.error("ERROR ON GETTING QUIZ ID BY ACCESS CODE\n", err);
      reject(err);
    }
  });
};

const insertToDb = async (tableName, columName, value) => {
  const query = `INSERT INTO ${tableName} (${columName}) VALUES(?)`;
  try {
    await db.run(query, value);
  } catch (err) {
    console.error("ERROR ON INSERTING TO DB\n", err);
  }
};

const getByWhere = async (tableName, columName, value) => {
  return new Promise(async (resolve, reject) => {
    await db.all(
      `SELECT * FROM ${tableName} WHERE ${columName} = ?`,
      [value],
      (err, rows) => {
        if (err) {
          console.error("Error querying database:", err.message);
          reject(err);
        }

        if (rows) {
          resolve(rows);
        } else {
          reject(false);
        }
      },
    );
  });
};

module.exports = {
  createNewQuiz,
  createNewQuestion,
  createNewOption,
  getQuizIdByCode,
  insertToDb,
  getByWhere,
};