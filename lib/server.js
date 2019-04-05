const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const helpers = require("./helpers");
const handlers = require("./handlers");

let server = {};

server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

server.unifiedServer = (req, res) => {
  let parsedUrl = url.parse(req.url, true);
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");
  let queryStringObject = parsedUrl.query;
  let method = req.method.toLowerCase();
  let headers = req.headers;
  let decoder = new StringDecoder("utf-8");
  const handlers = require("./handlers");

  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();
  });

  let chosenHandler =
    typeof server.router[trimmedPath] !== "undefined"
      ? server.router[trimmedPath]
      : handlers.notFound;

  let data = {
    trimmedPath: trimmedPath,
    queryStringObject: queryStringObject,
    method: method,
    headers: headers,
    payload: helpers.parseJSONToObject(buffer)
  };

  chosenHandler(data, (statusCode, payload) => {
    statusCode = typeof statusCode == "number" ? statusCode : 200;

    payload = typeof payload == "object" ? payload : {};

    let payloadString = JSON.stringify(payload);

    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);

    res.end(payloadString);
    console.log("Return this response ", statusCode, payloadString);
  });
};

server.router = {
  //do this later
  users: handlers.users,
  tokens: handlers.tokens
};

server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      `The server is listening on ${config.httpPort} in ${config.envName}`
    );
  });
};

module.exports = server;
