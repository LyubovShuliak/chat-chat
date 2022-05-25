const express = require("express");
const { httpGetAllUsers, httpAddContact } = require("./contacts.controler");

const contactsRouter = express.Router();

contactsRouter.get("/", httpGetAllUsers);
contactsRouter.post("/", httpAddContact);

module.exports = contactsRouter;
