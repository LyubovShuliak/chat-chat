const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./routes/user/user.router");
const contactsRouter = require("./routes/contacts/contacts.router");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", userRouter);
app.use("/api/connections", contactsRouter);

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
