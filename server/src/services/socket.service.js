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
  const userChats = (await getSessions(socket.userID)).sessions || [];

  if (userChats.length) {
    socket.emit("chats", userChats);
  }
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

  socket.on("private message", async ({ content, to, time }) => {
    const senderID = socket.handshake.auth.userID;

    console.log(`${senderID} sent a private message "${content}" to ${to}`);

    const recieverIsOnline = users[to] ? true : false;

    const senderSession = await sessions.findOne(
      { id: senderID },
      { __v: 0, _id: 0, sessions: 0 }
    );
    const receiverSession = await sessions.findOne(
      { id: to },
      { __v: 0, _id: 0, sessions: 0 }
    );

    const receiver = await findUserByID(to);
    const sender = await findUserByID(senderID);

    if (!receiver.sessions.find((chat) => chat.id === sender.id)) {
      try {
        await updateUserSessions(to, sender);
        await updateUserSessions(senderID, receiver);
      } catch (error) {
        console.log(error);
      }
    }

    const recieverMessage = {
      message: content,
      type: "responder",
      isRead: recieverIsOnline,
      id: uuid4(),
      time: time,
    };
    const senderMessage = {
      message: content,
      type: "user",
      isRead: true,
      id: uuid4(),
      time: time,
    };
    try {
      await saveMessage(senderSession, senderID, to, senderMessage);
    } catch (error) {
      console.log(error);
    }
    try {
      await saveMessage(receiverSession, to, senderID, recieverMessage);
    } catch (error) {
      console.log(error);
    }

    io.to(senderID).emit("private message", {
      content: senderMessage,
      from: senderID,
      to,
    });

    io.to(to).emit("private message", {
      content: recieverMessage,
      from: senderID,
      to,
    });
  });
}

module.exports = { socketConnected };
