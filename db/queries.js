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

const createNewQuestion = async (title, description, quizId, imageName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await db.prepare(
        `INSERT INTO questions (title, quizID, questionText, imageName) VALUES (?, ?, ?, ?)`,
      );
      await query.run(title, quizId, description, imageName);
      query.finalize();
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
      const result = await query.run(questionId, min, max, isCorrect);
      query.finalize();
      resolve(result);
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

const insertQuizzResult = async (
  quizId,
  questionId,
  user,
  answeredOption,
  isCorrect,
) => {
  const query = `INSERT INTO responses (quizId, questionId, studentName, answeredOptionId, isCorrect) VALUES(?, ?, ?, ?, ?)`;
  try {
    await db.run(query, [quizId, questionId, user, answeredOption, isCorrect]);
  } catch (err) {
    console.error("ERROR ON INSERTING QUIZ ANSWER TO DB\n", err);
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
          console.log(rows);
          resolve(rows);
        } else {
          reject(false);
        }
      },
    );
  });
};

const getAll = async (tableName) => {
  return new Promise(async (resolve, reject) => {
    await db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        console.error("Error querying database:", err.message);
        reject(err);
      }

      if (rows) {
        resolve(rows);
      } else {
        reject(false);
      }
    });
  });
};

const getResponsesByAccessCode = async (accessCode) => {
  return new Promise(async (resolve, reject) => {
    await db.all(
      `SELECT * FROM responses WHERE quizId = ?`,
      [accessCode],
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

const getIsOptionCorrect = async (optionId) => {
  return new Promise(async (resolve, reject) => {
    await db.get(
      `SELECT isCorrect FROM options WHERE id = ?`,
      [optionId],
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

const getCountOfQuestions = async (quizId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = db.prepare(
        `SELECT COUNT(quizID) as questionCount FROM questions WHERE quizID = ?`,
      );
      query.get(quizId, (err, row) => {
        if (err) {
          console.error("ERROR ON DB QUERY COUNT OF QUESTIONS\n", err);
          reject(err);
        } else {
          query.finalize();
          resolve(row);
        }
      });
    } catch (err) {
      console.error("ERROR ON DB QUERY COUNT OF QUESTIONS\n", err);
      reject(err);
    }
  });
};

const getImgNameByQuestionId = async (questionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = db.prepare(
        `SELECT id as questionId, imageName FROM questions WHERE id = ?`,
      );
      query.get(questionId, (err, row) => {
        if (err) {
          console.error("ERROR ON DB QUERY IMG NAME\n", err);
          reject(err);
        } else {
          query.finalize();
          resolve(row);
        }
      });
    } catch (err) {
      console.error("ERROR ON DB QUERY IMG NAME\n", err);
      reject(err);
    }
  });
};

module.exports = {
  createNewQuiz,
  createNewQuestion,
  createNewOption,
  getQuizIdByCode,
  insertToDb,
  getByWhere,
  insertQuizzResult,
  getAll,
  getResponsesByAccessCode,
  getIsOptionCorrect,
  getCountOfQuestions,
  getImgNameByQuestionId,
};
