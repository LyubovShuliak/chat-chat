const http = require("http");
const shell = require("shelljs");

const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const { instrument } = require("@socket.io/admin-ui");

const { Server } = require("socket.io");

const open = require("open");

const { mongoConnect } = require("./services/mongo");
const { socketConnected } = require("./services/socket.service");

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3050;
const server = http.createServer(app);

const io = new Server(server, {
  cors: ["http://localhost:4000/", "https://admin.socket.io"],
  credentials: false,
});
// const pubClient = createClient({ host: "localhost", port: 6379 });
// const subClient = pubClient.duplicate();

// Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
//   io.adapter(createAdapter(pubClient, subClient));
// });

// instrument(io, {
//   auth: false,
// });
io.on("connection", async (socket) => {
  await socketConnected(socket, io);
});

io.use(async (socket, next) => {
  const userID = socket.handshake.auth.userID;

  // await pubClient.hSet("sessions", `session:${userID}`, userID);

  // pubClient.hKeys("sessions").then(console.log);

  if (!userID) {
    return next(new Error("invalid username"));
  }
  socket.userID = userID;
  next();
});

function startServer() {
  mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
  });
  shell.exec("clear");
}

startServer();
