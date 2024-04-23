-- SQLite
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY,
    title TEXT,
    accessCode TEXT UNIQUE
);