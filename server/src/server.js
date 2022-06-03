const http = require("http");

const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const open = require("open");

const { mongoConnect } = require("./services/mongo");
const { socketConnected } = require("./services/socket.service");
const userDatabase = require("./models/user.mongo");

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3050;
const server = http.createServer(app);

const io = new Server(server, {
  cors: "*",
});

io.on("connection", async (socket) => {
  await socketConnected(socket, io);
});
io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  if (!userID) {
    return next(new Error("invalid username"));
  }
  socket.userID = userID;
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
