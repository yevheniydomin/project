const getQuizListHTML = (quizList) => {
  const headHTML = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="style.css" rel="stylesheet" type="text/css"/>
    <title>List of Quizzes</title>
  </head>
  <body>
    <ul class"quiz-list">`;

  const middleHtml = quizList.map((quiz) => {
    return `<li class="list-code" id="${quiz.id}"> <a href="http://localhost:3000/responses/?code=${quiz.accessCode}">${quiz.accessCode}</a></li>`;
  });

  const bottomHTML = `
    </ul>
    </body>
</html>;`;

  return headHTML.concat(middleHtml.join(""), bottomHTML);
};

module.exports = {
  getQuizListHTML,
};
