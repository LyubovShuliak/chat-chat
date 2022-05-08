const express = require("express");
const { httpSignUp, httpLoggin } = require("./user.controler");

const userRouter = express.Router();

userRouter.post("/", httpSignUp);
userRouter.post("/login", httpLoggin);

module.exports = userRouter;
