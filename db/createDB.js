const { db } = require("./index.js");

const initDataBase = async () => {
  try {
    await db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS quizzes(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, accessCode UNIQUE)",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT, quizID INTEGER, questionText TEXT, imageName STRING(1000), FOREIGN KEY (quizID) REFERENCES quizzes(id))",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, questionId INTEGER, min REAL, max REAL, isCorrect BOOLEAN, FOREIGN KEY(questionId) REFERENCES questions(id))",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, url TEXT)",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email STRING(300), password STRING(30))",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, quizId STRING(16), questionId INTEGER, studentName STRING(250), answeredOptionId INTEGER, isCorrect BOOLEAN, timestamp DATE DEFAULT CURRENT_TIMESTAMP)",
      );
    });
  } catch (err) {
    console.error("ERROR ON DB INIT\n", err);
  }
};

module.exports = {
  initDataBase,
};
