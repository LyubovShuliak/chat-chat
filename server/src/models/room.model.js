const userDatabase = require("./user.mongo");

async function addChat(email, chat) {
  const user = await userDatabase
    .findOne({ email: email }, { __v: 0, _id: 0 })
    .lean();
  const rooms = new Map(Object.entries(user.rooms));
  if (chat.email) {
    rooms.set(chat.email, { chatData: chat, messages: [] });
    await userDatabase.updateOne(
      { email: email },
      { rooms: Object.fromEntries(rooms) }
    );
    const responder = await userDatabase.findOne({ email: chat.email }).lean();
    const responderRooms = new Map(Object.entries(responder.rooms));
    responderRooms.set(email, { chatData: user, messages: [] });
    await userDatabase.updateOne(
      { email: chat.email },
      { rooms: Object.fromEntries(responderRooms) }
    );
    return await userDatabase
      .findOne({ email: email }, { __v: 0, _id: 0 })
      .lean();
  }
}
async function getChats(email) {
  const user = await userDatabase
    .findOne({ email: email }, { __v: 0, _id: 0 })
    .lean();
  const rooms = new Map(Object.entries(user.rooms));
  return rooms;
}
async function removeChat(email, chat) {
  const user = await userDatabase
    .findOne({ email: email }, { __v: 0, _id: 0 })
    .lean();
  const rooms = new Map(Object.entries(user.rooms));
  rooms.delete(chat.email);
  await userDatabase.updateOne(
    { email: email },
    { rooms: Object.fromEntries(rooms) }
  );
  return await userDatabase
    .findOne({ email: email }, { __v: 0, _id: 0 })
    .lean();
}
module.exports = { addChat, getChats, removeChat };
