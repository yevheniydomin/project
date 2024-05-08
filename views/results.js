const getResultsTableHTML = (data, questionCount) => {
  let columns = [];
  for (let i = 0; i < questionCount; i++) {
    columns.push(
      `<th scope="col" style="border: 1px solid; border-color: black;">Question #${i + 1}</th>`,
    );
  }
  columns = columns.join("");

  const headHTML = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="style.css" rel="stylesheet" type="text/css"/>
    <title>Quizz results</title>
  </head>
  <body>
    <table id="result-table" style="width: 80%;">
      <thead>
        <tr>
          <th scope="col" style="border: 1px solid; border-color: black;">Student name</th>
          <th scope="col" style="border: 1px solid; border-color: black;">Time</th>
          ${columns}
          <th scope="col" style="border: 1px solid; border-color: black;">Grade</th>
    `;

  const middleHTML = [];

  for (const key in data) {
    const middleRow = [];
    for (const key2 in data[key]) {
      for (const key3 in data[key][key2]) {
        middleRow.push(
          `<tr scope="row"><td style="border: 1px solid; border-color: black;">${key}</td><td style="border: 1px solid; border-color: black;">${key3}</td>`,
        );
        for (let i = 0; i < data[key][key2][key3].results.length; i++) {
          middleRow.push(
            `<td style="border: 1px solid; border-color: black;">${data[key][key2][key3].results[i].isCorrect}</td>`,
          );
        }
        middleRow.push(
          `<td style="border: 1px solid; border-color: black;">${data[key][key2][key3].grade}</td>`,
        );
      }
    }
    middleHTML.push(middleRow.join(""));
  }

  const bottomHTML = `
      </tr>
        </thead>
            </table>
        <script src="resultsTable.js"></script>
    </body>
</html>`;

  const html = headHTML.concat(middleHTML.join(""), bottomHTML);
  return html;
};

module.exports = {
  getResultsTableHTML,
};
