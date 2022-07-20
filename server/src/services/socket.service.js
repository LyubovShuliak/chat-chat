const { v4: uuid4 } = require("uuid");

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

  for (let [id, socket] of io.of("/").sockets) {
    users[socket.userID] = id;
  }
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", { id: socket.userID });
  });

  const Chats = await getSessions(socket.userID);
  const userChats = Chats ? Chats.sessions : [];
  if (socket.chat) {
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
  const chatCounter = await unreadMessagesCounter(socket.userID);
  if (chatCounter && Object.keys(chatCounter)) {
    socket.emit("unread messages", chatCounter);
  }

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
    console.log(id, unReadMessages, sender);
    await updateMessageStatus(id, unReadMessages, sender);
    await updateMessageStatus(sender, unReadMessages, id);
    socket.emit("recieved");
    const chatCounter = await unreadMessagesCounter(socket.userID);
    if (Object.keys(chatCounter)) {
      socket.emit("unread messages", chatCounter);
    } else {
      socket.emit("unread messages", 0);
    }
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
      isRead: false,
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
    const Chats = await getSessions(to);
    const userChats = Chats ? Chats.sessions : [];

    if (userChats.length) {
      io.to(to).emit("chats", userChats);
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
