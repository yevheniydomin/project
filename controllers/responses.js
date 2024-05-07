const { getResponsesByAccessCode } = require("../db/queries");

const getResponsesByQuizId = async (req, res) => {
  const accessCode = req.query.code;
  try {
    const responses = await getResponsesByAccessCode(accessCode);
    res.send(responses);
  } catch (err) {
    console.error("ERROR ON GETTING RESPONSES\n", err);
  }
};

module.exports = {
  getResponsesByQuizId,
};
