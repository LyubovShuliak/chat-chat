const sessions = require("./sessions.mongo");
const userDatabase = require("./user.mongo");

const { getPagination } = require("../services/query");

async function getSessions(id) {
  return await userDatabase
    .findOne({ id: id }, "sessions", { __v: 0, _id: 0 })
    .lean();
}

async function updateUserSessions(id, chatData) {
  return await userDatabase.findOneAndUpdate(
    { id: id },
    { $push: { sessions: chatData } }
  );
}

async function findSession(id, query) {
  const { limit, skip } = getPagination(query);

  try {
    const session = await sessions.findOne({ id: id }, { __v: 0, _id: 0 });

    if (session) {
      if (session.messages) {
        const newMessages = {};
        for (let key in session.messages) {
          const unreadMessagesLenght = session.messages[key].filter(
            (message) => !message.isRead
          ).length;

          console.log(unreadMessagesLenght);

          const paginated = await sessions.findOne({ id: id }).select({
            _id: 0,
            messages: {
              [key]: { $slice: [skip, limit] },
            },
          });

          if (paginated["messages"][key].length) {
            newMessages[key] = {
              [query.page]: paginated["messages"][key],
            };
          }
        }

        return newMessages;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function findSessionChat(id, query, chatId) {
  const { limit, skip } = getPagination(query);

  try {
    const newMessages = {};

    const paginated = await sessions.findOne({ id: id }).select({
      _id: 0,
      messages: {
        [chatId]: { $slice: [skip, limit] },
      },
    });
    const unreadMessages = (await sessions.findOne({ id: id })).messages[
      chatId
    ].filter((message) => !message.isRead);

    if (unreadMessages.length > 20) {
      newMessages[chatId] = {
        [query.page]: unreadMessages,
      };
    }

    if (
      unreadMessages.length < 20 &&
      paginated["messages"][chatId] &&
      paginated["messages"][chatId].length
    ) {
      newMessages[chatId] = {
        [query.page]: paginated["messages"][chatId],
      };
    }

    return newMessages;
  } catch (error) {
    console.log(error);
  }
}

async function saveMessage(session, id, responder, message) {
  if (session) {
    const oldMessages = session.messages[responder]
      ? session.messages[responder]
      : [];
    const messages = [message, ...oldMessages];
    await sessions.updateOne(
      { id: id },
      { messages: { ...session.messages, [responder]: messages } }
    );
  } else {
    const receivedMessage = { [responder]: [message] };
    await sessions.insertMany([{ id: id, messages: receivedMessage }]);
  }
}

async function updateMessageStatus(id, unReadMessages, sender) {
  const session = await sessions.findOne({ id: id }).lean();

  const newMessages = session.messages[sender].map((el) =>
    unReadMessages.includes(el.id) ? { ...el, isRead: true } : el
  );

  await sessions.updateOne(
    { id: id },
    { messages: { ...session.messages, [sender]: newMessages } }
  );
}
// async function saveMessage(session, id, responder, message) {}

module.exports = {
  getSessions,
  updateUserSessions,
  findSession,
  findSessionChat,
  saveMessage,
  updateMessageStatus,
};
