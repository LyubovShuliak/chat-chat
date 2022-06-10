const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },

  contacts: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  sessions: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
