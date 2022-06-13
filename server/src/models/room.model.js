const sessions = require("./sessions.mongo");
const userDatabase = require("./user.mongo");

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

async function findSession(id) {
  try {
    const session = await sessions.findOne({ id: id }, { __v: 0, _id: 0 });

    if (session) {
      return sessions;
    }
  } catch (error) {
    console.log(error);
  }
}

async function saveMessage(session, id, responder, message) {
  if (session) {
    const oldMessages = session.messages[responder]
      ? session.messages[responder]
      : [];
    const messages = [...oldMessages, message];
    await sessions.updateOne(
      { id: id },
      { $set: { messages: { [responder]: messages } } }
    );
  } else {
    const receivedMessage = { [responder]: [message] };
    await sessions.insertMany([{ id: id, messages: receivedMessage }]);
  }
}
// async function saveMessage(session, id, responder, message) {}

module.exports = { getSessions, updateUserSessions, findSession, saveMessage };
