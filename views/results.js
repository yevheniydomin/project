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
    middleHTML.push(`<td>`);
    const middleRow = [];
    middleRow.push(`<th>${key}</th>`);
    for (let i = 0; i < data[key].responses.length; i++) {
      middleRow.push(
        `<th>${i + 1}</th><th>${data[key].responses[i].answeredOptionId}</th><th>${data[key].responses[i].isCorrect}</th>`,
      );
    }
    middleRow.push(`<th>${data[key].grade}</th>`);
    middleHTML.push(middleRow.join(""));
    middleHTML.push("</td>");
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
