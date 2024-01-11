const http = require("http");
const routes = require("./routes");
// const fs = require("fs");

// function rqListener(req, res) {
//   console.log("Server Created!");
// }

// const server = http.createServer((req, res) => {
//   //   console.log(req.url, req.method, req.headers);
//   //   process.exit();

// });

const server = http.createServer(routes.handler);
console.log(routes.someText);

server.listen(3000);
