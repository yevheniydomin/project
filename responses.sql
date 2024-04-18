-- SQLite
CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY,
    quizId INTEGER,
    questionId INTEGER,
    studentName TEXT,
    optionId INTEGER,
    isCorrect INTEGER,
    FOREIGN KEY(quizId) REFERENCES quizzes(id),
    FOREIGN KEY(questionId) REFERENCES questions(id),
    FOREIGN KEY(optionId) REFERENCES options(id)
)