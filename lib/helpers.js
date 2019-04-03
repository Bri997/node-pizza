const config = require("./config");

const helpers = {};

helpers.parseJSONToObject = function(str) {
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

module.exports = helpers;
