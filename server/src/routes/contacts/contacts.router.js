const express = require("express");
const {
  httpGetAllUsers,
  httpAddContact,
  httpGetContacts,
  httpAddAvatar,
} = require("./contacts.controller");

const contactsRouter = express.Router();

contactsRouter.get("/", httpGetAllUsers);
contactsRouter.get("/friends", httpGetContacts);
contactsRouter.post("/", httpAddContact);

module.exports = contactsRouter;
