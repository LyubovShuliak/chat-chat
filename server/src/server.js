const http = require("http");

const { Server } = require("socket.io");

const open = require("open");

const { mongoConnect } = require("./services/mongo");
const { socketConnected } = require("./services/socket.service");

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3050;
const server = http.createServer(app);

const io = new Server(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socketConnected(socket, io);
});

function startServer() {
  mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    // open(`http://localhost:${PORT}/`);
  });
}

startServer();
