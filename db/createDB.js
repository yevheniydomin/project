const { db } = require("./index.js");

const initDataBase = async () => {
  try {
    await db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS quizzes(id INTEGER PRIMARY KEY, title TEXT, accessCode UNIQUE)",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, title TEXT, quizID INTEGER, questionText TEXT, FOREIGN KEY (quizID) REFERENCES quizzes(id))",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, questionId INTEGER, min REAL, max REAL, answer TEXT, isCorrect BOOLEAN, FOREIGN KEY(questionId) REFERENCES questions(id))",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY, url TEXT)",
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email STRING(300), password STRING(30))",
      );
    });
  } catch (err) {
    console.error("ERROR ON DB INIT\n", err);
  }
};

module.exports = {
  initDataBase,
};