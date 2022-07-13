const { v4: uuid4 } = require("uuid");

const userDatabase = require("../models/user.mongo");
const sessions = require("../models/sessions.mongo");

const { findUserByID } = require("../models/user.model.js");
const {
  getSessions,
  updateUserSessions,
  findSessionChat,
  saveMessage,
  updateMessageStatus,
  unreadMessagesCounter,
} = require("../models/room.model.js");

async function socketConnected(socket, io) {
  socket.join(socket.userID);

  let users = {};

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", { id: socket.userID });
  });

  for (let [id, socket] of io.of("/").sockets) {
    users[socket.userID] = id;
  }

  const Chats = await getSessions(socket.userID);
  const userChats = Chats ? Chats.sessions : [];
  if (socket.chat) {
    console.log();
    const moreMessagesPerChat = await findSessionChat(
      socket.userID,
      {
        limit: 20,
        page: 1,
      },
      socket.chat
    );

    if (Object.keys(moreMessagesPerChat)) {
      socket.emit("messages", moreMessagesPerChat);
    }
  }

  if (userChats.length) {
    socket.emit("chats", userChats);
  }

  console.log(await unreadMessagesCounter(socket.userID));

  socket.on("get more messages", async (page, id) => {
    const moreMessagesPerChat = await findSessionChat(
      socket.userID,
      {
        limit: 20,
        page: page,
      },
      id
    );

    if (moreMessagesPerChat && Object.keys(moreMessagesPerChat)) {
      socket.emit("messages", moreMessagesPerChat);
    }
  });

  socket.emit("users", users);

  socket.emit("session", {
    sessionID: socket.id,
    userID: socket.userID,
  });
  socket.broadcast.emit("user connected", {
    sessionID: socket.id,
    userID: socket.userID,
  });

  socket.on("message is read", async (id, unReadMessages, sender) => {
    await updateMessageStatus(id, unReadMessages, sender);
  });

  socket.on("private message", async ({ content, to, time }) => {
    const senderID = socket.handshake.auth.userID;

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
      isRead: false,
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

    io.to(socket.userID).emit("private message", {
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
