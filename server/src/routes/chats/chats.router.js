const express = require("express");
const { httpGetChats } = require("./chats.controller");

const chatsRouter = express.Router();

chatsRouter.get("/", httpGetChats);

module.exports = chatsRouter;
