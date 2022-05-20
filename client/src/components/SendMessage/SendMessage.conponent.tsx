import Picker from "emoji-picker-react";

import PickEmoji from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import AttachFile from "@mui/icons-material/AttachFile";

import messageInputStyles from "./sendMessage.module.css";
import useHandleMessages from "../../hooks/handleMessages";

const SendMessage = () => {
  const {
    onEmojiClick,

    showEmojiPicker,
    handleInputOnEnter,
    newMessage,
    showPicker,
  } = useHandleMessages();

  return (
    <div className={messageInputStyles.container}>
      {showPicker && (
        <div className={messageInputStyles.picker_container}>
          <Picker
            onEmojiClick={onEmojiClick}
            pickerStyle={{
              height: "600px",
              backgroundColor: "rgb(255, 255, 255)",
              boxShadow: "none",
              border: "none",
            }}
            native={true}
            groupVisibility={{
              flags: false,
            }}
          />
        </div>
      )}
      <div className={messageInputStyles.sendMessage}>
        <div className={messageInputStyles.atachFile}>
          <AttachFile
            style={{
              height: "40px",
              display: "block",
              transform: "rotate(30deg)",
              color: "lightgray",
            }}
          />
        </div>

        <div
          ref={newMessage}
          className={messageInputStyles.messageInput}
          contentEditable
          placeholder="Write a message ..."
          onKeyDown={handleInputOnEnter}
        ></div>
        <button
          onClick={showEmojiPicker}
          className={messageInputStyles.emoji_picker}
        >
          <PickEmoji style={{ width: "40px" }} />
        </button>

        <button className={messageInputStyles.sendBtn}>
          <SendIcon
            style={{
              width: "30px",
              color: "var( --link_color)",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
