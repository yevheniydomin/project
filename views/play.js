const getPlayHTML = (questions) => {
  const headHTML = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="style.css" rel="stylesheet" type="text/css"/>
    <title></title>
  </head>
  <body>
    <form id="questions">`;

  const bottomHTML = `
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        <script src="submitQuiz.js"></script>
    </body>
</html>;`;
  let questionsComponents = questions.map((question) => {
    return `
        <div class="smallBox">
            <h1>${question.title}</h1>
            <p>${question.questionText}</p>
            <input type="radio" name="${question.id}" value="${question.options[0].min} - ${question.options[0].max}" id="option1" />
            <label for="option1">${question.options[0].min} - ${question.options[0].max}</label><br /><br />
            <input type="radio" name="${question.id}" value="${question.options[1].min} - ${question.options[1].max}" id="option2" />
            <label for="option2">${question.options[1].min} - ${question.options[1].max}</label><br /><br />
            <input type="radio" name="${question.id}" value="${question.options[2].min} - ${question.options[2].max}" id="option3" />
            <label for="option3">${question.options[2].min} - ${question.options[2].max}</label><br /><br />
            <input type="radio" name="${question.id}" value="${question.options[3].min} - ${question.options[3].max}" id="option4" />
            <label for="option4">${question.options[3].min} - ${question.options[3].max}</label><br/><br/>
        </div>`;
  });

  return headHTML.concat(questionsComponents.join(""), bottomHTML);
};

module.exports = {
  getPlayHTML,
};
