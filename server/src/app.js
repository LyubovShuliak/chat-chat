const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./routes/user/user.router");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(helmet());

app.use(express.json());
// app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", userRouter);

// app.get("/*", (req, res) => {
//   res.sendFile(__dirname, "..", "public", "index.html");
// });

module.exports = app;
