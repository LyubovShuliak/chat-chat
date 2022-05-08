const http = require("http");

const open = require("open");

const { mongoConnect } = require("./services/mongo");
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3050;
const server = http.createServer(app);

async function startServer() {
  mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    // open(`http://localhost:${PORT}/`);
  });
}

startServer();
