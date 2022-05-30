const {
  getAllUsers,
  addContact,
  getContacts,
  addAvatar,
} = require("../../models/user.model");
const { getPagination } = require("../../services/query");

async function httpGetAllUsers(req, res) {
  const { skip, limit } = getPagination(req.query);

  const { email } = req.query;

  const contacts = await getAllUsers(skip, limit, email);

  return res.status(200).json(contacts);
}
async function httpGetContacts(req, res) {
  const { email } = req.query;

  const contacts = await getContacts(email);

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
  httpGetContacts,
};
