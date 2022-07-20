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

async function unreadMessagesCounter(id) {
  try {
    const userChats = (await userDatabase.findOne({ id: id }, "sessions"))
      .sessions;

    const unreadMessages = {};
    for (let session of userChats) {
      const unreadMessagesCount = sessions
        .aggregate()
        .match({ id: id })
        .unwind({ path: `$messages.${session.id}` })
        .match({
          [`messages.${session.id}.type`]: "user",
          [`messages.${session.id}.isRead`]: false,
        })
        .group({ _id: session.id, count: { $count: {} } })
        .cursor();
      for await (doc of unreadMessagesCount) {
        if (doc?.count) {
          unreadMessages[session.id] = doc.count;
        }
      }
    }

    return unreadMessages;
  } catch (error) {
    console.log(error);
  }
}

async function getUnreadMessages(id, chat) {
  const userSessions = sessions
    .aggregate()
    .match({ id: id })
    .unwind({ path: `$messages.${chat}` })
    .match({ [`messages.${chat}.isRead`]: false })
    .project({ _id: 0, messages: 1 })
    .cursor();

  let messages = [];
  for await (doc of userSessions) {
    if (doc) {
      messages.push(doc.messages[chat]);
    }
  }

  return messages;
}

async function findSessionChat(id, query, chatId) {
  const { limit, skip } = getPagination(query);

  try {
    const newMessages = {};
    const unReadMessages = await getUnreadMessages(id, chatId);

    if (unReadMessages.length) {
      newMessages[chatId] = {
        [query.page]: unReadMessages,
      };

      return newMessages;
    }

    const paginated = await sessions.findOne({ id: id }).select({
      _id: 0,
      messages: {
        [chatId]: { $slice: [skip, limit] },
      },
    });

    if (
      paginated &&
      paginated["messages"] &&
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

  if (!session.messages[sender]) return;
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
  findSessionChat,
  saveMessage,
  updateMessageStatus,
  unreadMessagesCounter,
};
