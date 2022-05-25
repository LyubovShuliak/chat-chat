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
  socketConnected(socket, io);
});
io.use((socket, next) => {
  const email = socket.handshake.auth.email;
  console.log(email);

  if (!email) {
    return next(new Error("invalid username"));
  }
  socket.email = email;
  next();
});

function startServer() {
  mongoConnect(io);
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    // open(`http://localhost:${PORT}/`);
  });
}

startServer();
