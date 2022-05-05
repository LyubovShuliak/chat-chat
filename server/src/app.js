const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./routes/user/user.router");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", userRouter);

app.get("/*", (req, res) => {
  res.sendFile(__dirname, "..", "public", "index.html");
});

module.exports = app;
