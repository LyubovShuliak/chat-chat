const express = require("express");
const {
  httpSignUp,
  httpLoggin,
  httpCheckToken,
  httpAddAvatar,
} = require("./user.controler");

const userRouter = express.Router();

userRouter.post("/", httpSignUp);
userRouter.post("/login", httpLoggin);
userRouter.post("/token", httpCheckToken);
userRouter.post("/avatar", httpAddAvatar);
module.exports = userRouter;
