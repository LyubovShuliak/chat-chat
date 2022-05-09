const http = require("http");
const { Server } = require("socket.io");

const open = require("open");

const { mongoConnect } = require("./services/mongo");
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3050;
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

async function startServer() {
  mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    // open(`http://localhost:${PORT}/`);
  });
}

startServer();
