const { getAllUsers, addContact } = require("./../../models/user.model");
const { getPagination } = require("../../services/query");

async function httpGetAllUsers(req, res) {
  const { skip, limit, email } = getPagination(req.query);

  const contacts = await getAllUsers(skip, limit);

  return res.status(200).json(contacts);
}
async function httpAddContact(req, res) {
  const { user, email } = req.body;

  const contacts = await addContact(user, email);

  if (contacts.error) return res.status(409).json(contacts);
  return res.status(200).json(contacts.contacts);
}
module.exports = {
  httpGetAllUsers,
  httpAddContact,
};
