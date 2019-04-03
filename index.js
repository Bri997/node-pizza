const server = require("./lib/server");

let app = {};

app.init = () => {
  server.init();
};

app.init();

module.exports = app;
