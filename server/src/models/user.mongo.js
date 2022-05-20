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
  // avatar: {
  //   type: Blob,
  //   required: false,
  // },

  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rooms: {
    type: [
      {
        message: String,
        messageType: "user" | "responder",
      },
    ],
    required: false,
  },
  contacts: {
    type: [String],
    required: false,
  },
  sessions: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
