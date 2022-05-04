const http = require("http");
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3050;
const server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
  });
}

startServer();
