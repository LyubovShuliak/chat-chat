const { addChat, getChats, removeChat } = require("../../models/room.model");

async function httpAddChat(req, res, next) {
  const { email, chat } = req.body;

  const user = await addChat(email, chat);

  res.status(200).send(user);
}
async function httpGetChats(req, res, next) {
  const { email } = req.query;
  const chats = await getChats(email);
  res.status(200).send([...chats]);
}
async function httpRemoveChat(req, res, next) {
  const { email, chat } = req.body;

  const user = await removeChat(email, chat);

  res.status(200).send(user);
}
module.exports = { httpAddChat, httpGetChats, httpRemoveChat };
