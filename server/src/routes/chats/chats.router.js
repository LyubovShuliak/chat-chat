const express = require("express");
const { httpGetChats } = require("./chats.controller");

const chatsRouter = express.Router();
const mcache = require("memory-cache");

const chache = (duration) => {
  return (req, res, next) => {
    let key = "_express_" + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 20000);
        res.sendResponse(body);
      };
    }
    next();
  };
};

chatsRouter.get("/", chache(20), httpGetChats);

module.exports = chatsRouter;
