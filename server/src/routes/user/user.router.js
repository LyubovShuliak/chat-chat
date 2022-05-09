const express = require("express");
const { httpSignUp, httpLoggin, httpCheckToken } = require("./user.controler");

const userRouter = express.Router();

userRouter.post("/", httpSignUp);
userRouter.post("/login", httpLoggin);
userRouter.post("/token", httpCheckToken);

module.exports = userRouter;
