-- SQLite
CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  title TEXT,
  quizID INTEGER,
  questionText TEXT,
  FOREIGN KEY (quizID) REFERENCES quizzes(id)
);