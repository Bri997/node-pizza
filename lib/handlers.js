const config = require("./config");

let handlers = {};

handlers.notFound = (data, callback) => {
  console.log(data);
  callback(404);
};

module.exports = handlers;
