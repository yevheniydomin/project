//initialize all necessary packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

//connect sqlite3 with the database
const db = new sqlite3.Database('myDatabase.db');
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/'); // Save uploaded files to the 'uploads' folder
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename files to avoid conflicts
	},
});

const upload = multer({ storage: storage });

//serializing to create table for database(could be done just from sql files, but having a separate js file for db is also good)
db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS quizzes(id INTEGER PRIMARY KEY, title TEXT, accessCode UNIQUE)');
	db.run(
		'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, title TEXT, quizID INTEGER, questionText TEXT, FOREIGN KEY (quizID) REFERENCES quizzes(id))'
	);
	db.run(
		'CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, questionId INTEGER, min REAL, max REAL, answer TEXT, isCorrect INTEGER, FOREIGN KEY(questionId) REFERENCES questions(id))'
	);
	db.run('CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY, url TEXT)');
});

//serve the HTML login file
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/teacher.html');
	res.sendFile(__dirname + '/student.html');
});

//handle form submission
app.post('/signup', async (req, res) => {
	const email = req.body.email;
	// const password = req.body.password;
	// generate salt
	const salt = await bcrypt.genSalt();
	// hash password using salt
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
		if (err) {
			return res.send('Error: failed to sign');
		}
		res.send('Sign up is successful!');
	});
});

app.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	//this is a syntax of SQL, it means that it will be getting info from the existed table users
	db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err) => {
		if (err) {
			//if error occured, then something does not match
			console.error('Data do not coincide', err.message);
			return res.send('Error: failed to log in');
		}
		console.log('Login successful!');
		return res.send('Log in is successful!');
	});
});

//createQuestion route for createQuestion.html
app.post('/createQuestion', upload.single('image'), (req, res) => {
	const { title, questionText, options } = req.body;
	// Insert the input questions into the database
	db.run('INSERT INTO questions (title, questionText) VALUES (?, ?)', [title, questionText], function (err) {
		if (err) {
			console.error('Error inserting question:', err.message);
			res.status(400).send('Error inserting question: ' + err.message);
		}

		const questionId = this.lastID;

		// Insert the input options into the database
		options.forEach((option) => {
			const { min, max, answer } = option;
			//const correctIndex = parseInt(isCorrect);
			db.run('INSERT INTO options (questionId, min, max, answer) VALUES (?, ?, ?, ?)', [questionId, min, max, answer]);
		});
		return res.send('Question created successfully!');
	});
	const imageUrl = req.file.location;

	//store the image URL in the 'images' table(not used for now)
	db.run('INSERT INTO images (url) VALUES (?)', [imageUrl], (err) => {
		if (err) {
			console.error('Error inserting image URL:', err.message);
			return res.status(500).send('Error inserting image URL');
		}

		return res.send('Image uploaded and URL stored successfully!');
	});
});

// SQL JOIN query to retrieve question details
// app.get('/questions/:questionId', (req, res) => {
//   const { questionId } = req.params;

//   // Perform a SQL JOIN query to retrieve question details along with associated options
//   const sql = `
//     SELECT questions.id, questions.title, questions.questionText, options.id AS optionId, options.min, options.max, options.answer, options.isCorrect
//     FROM questions
//     INNER JOIN options ON questions.id = options.questionId
//     WHERE questions.id = ?
//   `;

//   db.all(sql, [questionId], (err, rows) => {
//     if (err) {
//       console.error('Error retrieving question details:', err.message);
//       return res.status(500).send('Error retrieving question details');
//     }

//     // Format the result as needed
//     const question = {
//       id: rows[0].id,
//       title: rows[0].title,
//       questionText: rows[0].questionText,
//       options: rows.map(row => ({
//         id: row.optionId,
//         min: row.min,
//         max: row.max,
//         answer: row.answer,
//         isCorrect: row.isCorrect
//       }))
//     };

//     res.json(question);
//   });
// });

//start the server
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
