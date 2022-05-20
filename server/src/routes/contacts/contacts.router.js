const express = require("express");
const { httpGetAllUsers } = require("./contacts.controler");

const contactsRouter = express.Router();

contactsRouter.get("/", httpGetAllUsers);

module.exports = contactsRouter;
