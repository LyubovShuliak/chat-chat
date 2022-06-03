const userDatabase = require("../models/user.mongo");

async function socketConnected(socket, io) {
  const sender = (await userDatabase.findOne({ id: socket.userID }).lean())
    .contacts;

  let users = {};
  for (let [id, socket] of io.of("/").sockets) {
    const contact = sender.find((contact, i) => contact.id === socket.userID);
    users = { ...users, [socket.userID]: contact };
  }

  socket.emit("users", users);
  socket.emit("session", {
    sessionID: socket.id,
    userID: socket.userID,
  });
  socket.broadcast.emit("user connected", {
    sessionID: socket.id,
    userID: socket.userID,
  });
  socket.on("private message", async ({ content, to }) => {
    const senderID = socket.handshake.auth.userID;

    console.log(`${senderID} sent a private message "${content}" to ${to}`);

    const receiver = await userDatabase
      .findOne({ id: to }, { __v: 0, _id: 0 })
      .lean();

    socket.to(users[to]).emit("private message", {
      content,
      from: socket.id,
    });
  });
}

module.exports = { socketConnected };
