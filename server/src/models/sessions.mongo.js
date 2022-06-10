const mongoose = require("mongoose");

const sessions = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  messages: {
    type: Object,
    required: true,
  },
  // chats: { type: mongoose.SchemaTypes.Mixed, required: true },
});

module.exports = mongoose.model("Session", sessions);
