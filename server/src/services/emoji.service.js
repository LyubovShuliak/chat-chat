const EmojiConvertor = require("emoji-js");

const emoji = new EmojiConvertor();
emoji.allow_native = false;

module.exports = emoji;
