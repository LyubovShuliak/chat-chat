const sessions = require("./sessions.mongo");
const userDatabase = require("./user.mongo");

async function getSessions(id) {
  return await userDatabase
    .findOne({ id: id }, "sessions", { __v: 0, _id: 0 })
    .lean();
}

async function updateUserSessions(id, chatData) {
  await userDatabase.updateOne({ id: id }, { $push: { sessions: chatData } });
}

async function findSession(id) {
  return await sessions
    .findOne({ id: id }, "messages", { __v: 0, _id: 0 })
    .lean();
}

async function saveMessage(session, id, responder, message) {
  const messages = [...session.messages[responder], message];

  if (session) {
    await sessions.updateOne(
      { id: id },
      { $set: { messages: { [responder]: messages } } }
    );
  } else {
    const receivedMessage = { [responder]: [message] };
    await sessions.insertMany([{ id: to, messages: receivedMessage }]);
  }
}

module.exports = { getSessions, updateUserSessions, findSession, saveMessage };
