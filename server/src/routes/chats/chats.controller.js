const { getSessions } = require("../../models/room.model");

async function httpGetChats(req, res) {
  const { id } = req.query;
  try {
    const chats = await getSessions(id);
    res.status(200).json(chats.sessions);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { httpGetChats };
