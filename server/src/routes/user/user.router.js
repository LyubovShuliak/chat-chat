const express = require("express");
const { httpSignUp } = require("./user.controler");

const userRouter = express.Router();

userRouter.post("/", httpSignUp);

module.exports = userRouter;
