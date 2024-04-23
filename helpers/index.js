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

module.exports = {
  getRandomString,
};
