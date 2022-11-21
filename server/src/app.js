const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRouter = require("./routes/user/user.router");
const contactsRouter = require("./routes/contacts/contacts.router");
const chatsRouter = require("./routes/chats/chats.router");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(cors({ origin: "*" }));
app.use(helmet());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", userRouter);
app.use("/api/connections", contactsRouter);
app.use("/api/chats", chatsRouter);

// app.get("/", (req, res) => {
//   res.send(path.join(__dirname, "..", "public", "index.html"));
// });

module.exports = app;
