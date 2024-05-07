const getResultsTableHTML = (data) => {
  const headHTML = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="style.css" rel="stylesheet" type="text/css"/>
    <title>Quizz results</title>
  </head>
  <body>
    <table id="result-table">
    `;

  const middleHTML = [];

  for (const key in data) {
    const middleRow = [];
    middleRow.push(`<tr scope="row"><td>${key}</td>`);
    for (let i = 0; i < data[key].responses.length; i++) {
      middleRow.push(
        `<td>${i + 1}</td><td>${data[key].responses[i].answeredOptionId}</td><td>${data[key].responses[i].isCorrect}</td>`,
      );
    }
    middleRow.push("</td>");
    middleHTML.push(middleRow.join(""));
  }

  const bottomHTML = `
            </table>
        <script src="resultsTable.js"></script>
    </body>
</html>;`;

  return headHTML.concat(middleHTML.join(""), bottomHTML);
};

module.exports = {
  getResultsTableHTML,
};
