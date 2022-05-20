const { getAllUsers } = require("./../../models/user.model");
const { getPagination } = require("../../services/query");

async function httpGetAllUsers(req, res) {
  const { skip, limit } = getPagination(req.query);

  const contacts = await getAllUsers(skip, limit);

  return res.status(200).json(contacts);
}

module.exports = {
  httpGetAllUsers,
};
