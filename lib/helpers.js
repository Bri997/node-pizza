const config = require("./config");
const crypto = require("crypto");

const helpers = {};

helpers.parseJSONToObject = function(str) {
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.hash = function(str) {
  if (typeof str == "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

helpers.createRandomString = function(strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    var possibleCharacter = "abcdefghijklmnopqurstuvwxyz0123456789";

    let str = "";
    for (let i = 1; i <= strLength; i++) {
      let randomCharacter = possibleCharacter.charAt(
        Math.floor(Math.random() * possibleCharacter.length)
      );

      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};
module.exports = helpers;
