const express = require("express");
const {
  httpGetAllUsers,
  httpAddContact,
  httpGetContacts,
  httpAddAvatar,
} = require("./contacts.controller");

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

const contactsRouter = express.Router();

contactsRouter.get("/", chache(20), httpGetAllUsers);
contactsRouter.get("/friends", chache(20), httpGetContacts);
contactsRouter.post("/", httpAddContact);

module.exports = contactsRouter;
