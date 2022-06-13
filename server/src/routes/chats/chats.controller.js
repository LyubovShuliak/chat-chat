const { getSessions } = require("../../models/room.model");

async function httpGetChats(req, res) {
  const { id } = req.query;
  console.log(id);
  try {
    const chats = await getSessions(id);
    console.log("httpGetChats fsff", chats.sessions);
    res.status(200).json(chats.sessions);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { httpGetChats };
