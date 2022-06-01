const express = require("express");

const {
  httpAddChat,
  httpGetChats,
  httpRemoveChat,
} = require("./rooms.controller");

const roomsRouter = express.Router();

roomsRouter.get("/", httpGetChats);
roomsRouter.post("/", httpAddChat);
roomsRouter.patch("/", httpRemoveChat);

module.exports = roomsRouter;
