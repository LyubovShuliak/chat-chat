import React, { ChangeEvent, useState } from "react";
import Picker from "emoji-picker-react";

import PickEmoji from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import AttachFile from "@mui/icons-material/AttachFile";

import "./sendMessage.css";
import useHandleMessages from "../../hooks/handleMessages";

const SendMessage = () => {
  const {
    onEmojiClick,
    handleInput,
    showEmojiPicker,
    sendMessage,
    message,
    showPicker,
  } = useHandleMessages();

  return (
    <div className="send_message">
      <AttachFile
        style={{
          width: "40px",
          transform: "rotate(30deg)",
          color: "lightgray",
        }}
      />
      <input
        type="text"
        className="sendMessage"
        value={message as string}
        placeholder="Write a message ..."
        onChange={(e) => handleInput(e)}
      />
      <button onClick={showEmojiPicker} className="emoji_picker">
        <PickEmoji style={{ width: "40px" }} />
      </button>
      {showPicker && (
        <div className="picker_container">
          <Picker
            onEmojiClick={onEmojiClick}
            pickerStyle={{ height: "600px" }}
          />
        </div>
      )}
      {message.length ? (
        <button onClick={sendMessage}>
          <SendIcon style={{ width: "30px", color: "var( --link_color)" }} />
        </button>
      ) : null}
    </div>
  );
};

export default SendMessage;
