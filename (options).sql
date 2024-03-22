-- SQLite
CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, questionId INTEGER, optionText TEXT, isCorrect INTEGER, FOREIGN KEY(questionId) REFERENCES questions(id));