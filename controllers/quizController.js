const { getRandomString } = require('../helpers/index');
const { createNewQuiz, createNewQuestion, createNewOption } = require('../db/queries');

const createQuiz = async (req, res) => {
	const { title, questionText, options } = req.body;
	console.log(options);

	const accessCode = await getRandomString();
	const quizId = await createNewQuiz(title, accessCode);
	const questionId = await createNewQuestion(title, questionText, quizId);

	const optionPromises = options.map(async (option) => {
		const { min, max, answer } = option;
		return createNewOption(min, max, answer, questionId, option.correct === 'on');
	});

	await Promise.all(optionPromises);

	return res.send(`Question created successfully! Access code: ${accessCode}`);
};

module.exports = {
	createQuiz,
};
