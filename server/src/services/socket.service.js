const { v4: uuid4 } = require("uuid");

const userDatabase = require("../models/user.mongo");
const sessions = require("../models/sessions.mongo");

const { findUserByID } = require("../models/user.model.js");
const {
  getSessions,
  updateUserSessions,
  findSession,
  saveMessage,
} = require("../models/room.model.js");

async function socketConnected(socket, io) {
  socket.join(socket.userID);
  let users = {};

  for (let [id, socket] of io.of("/").sockets) {
    users[socket.userID] = id;
  }
  const messages = (await findSession(socket.userID)) || [];
  const userChats = (await getSessions(socket.userID)) || [];

  socket.emit("chats", userChats);

  socket.emit("messages", messages);

  socket.emit("users", users);

  socket.emit("session", {
    sessionID: socket.id,
    userID: socket.userID,
  });
  socket.broadcast.emit("user connected", {
    sessionID: socket.id,
    userID: socket.userID,
  });
  socket.on("private message", async ({ content, to, from }) => {
    const senderID = socket.handshake.auth.userID;

    console.log(`${senderID} sent a private message "${content}" to ${to}`);

    const recieverIsOnline = users[to] ? true : false;

    const senderSession = await sessions.findOne({ id: senderID });
    const receiverSession = await sessions.findOne({ id: to });

    const receiver = await findUserByID(to);
    const sender = await findUserByID(senderID);

    if (!receiver.sessions.find((chat) => chat.id === sender.id)) {
      await updateUserSessions(to, sender);
      await updateUserSessions(senderID, receiver);
    }

    const recieverMessage = {
      message: content,
      type: "responder",
      isRead: recieverIsOnline,
      id: uuid4(),
    };
    const senderMessage = {
      message: content,
      type: "user",
      isRead: true,
      id: uuid4(),
    };

    await saveMessage(senderSession, senderID, to, senderMessage);

    await saveMessage(receiverSession, to, senderID, recieverMessage);

    io.to(to).to(senderID).emit("private message", {
      content,
      from: senderID,
      to,
    });
  });
}

module.exports = { socketConnected };
