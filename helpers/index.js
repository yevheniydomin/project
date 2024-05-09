const path = require("path");
const fs = require("fs");

const getRandomString = function () {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 6;
  let str = "";
  for (let i = 0; i < codeLength; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return str;
};

const mapOptionsToQuestions = (questions, options) => {
  if (questions.length !== options.length) {
    throw new error(
      "Number of options objects to map  does not match with number of questions!",
    );
  }

  questions.forEach((question) => {
    question.options = options.filter((optionObj) =>
      optionObj.every((option) => option.questionId === question.id),
    )[0];
  });
  //console.log(questions);
  return questions;
};

const getGroupedData = (data) => {
  return data.reduce((acc, obj) => {
    const key = obj.studentName;
    if (!acc[key]) {
      acc[key] = { responses: {} };
    }

    // Find or create array for this timestamp
    const timestamp = obj.timestamp;
    if (!acc[key].responses[timestamp]) {
      acc[key].responses[timestamp] = { results: [] };
    }

    // Add the response to the timestamp group
    acc[key].responses[timestamp].results.push(obj);

    return acc;
  }, {});
};

function getMimeType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  switch (extname) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    // Add more cases as needed for other file types
    default:
      return "application/octet-stream"; // Default MIME type
  }
}

const getBase64Img = (imgNameArr) => {
  const base64ImgMap = {};
  imgNameArr.forEach((question) => {
    //console.log(question);
    const imagePath = path.join("uploads", question.imgNames);
    const mimeType = getMimeType(imagePath);
    base64ImgMap[question.questionId] = {
      ["imgBase64"]: fs.readFileSync(imagePath, { encoding: "base64" }),
      mimeType,
    };
  });
  return base64ImgMap;
};

module.exports = {
  getRandomString,
  mapOptionsToQuestions,
  getGroupedData,
  getBase64Img,
};
