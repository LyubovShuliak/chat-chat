import Picker from "emoji-picker-react";

import PickEmoji from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import AttachFile from "@mui/icons-material/AttachFile";

import messageInputStyles from "./sendMessage.module.css";

import { useHandleMessages } from "../../hooks/handleMessages";
import useUserAccessData from "../../hooks/useUserAccessData";
import { useParams } from "react-router-dom";

const SendMessage = () => {
  const {
    onEmojiClick,
    handleInputOnClick,
    showEmojiPicker,
    handleInputOnEnter,

    newMessage,
    showPicker,
  } = useHandleMessages();
  const { id } = useParams();

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
          onKeyDown={(e) => handleInputOnEnter(e, id)}
        ></div>
        <button
          onClick={showEmojiPicker}
          className={messageInputStyles.emoji_picker}
        >
          <PickEmoji style={{ width: "40px" }} />
        </button>

        <button
          className={messageInputStyles.sendBtn}
          onClick={(e) => handleInputOnClick(e, id)}
        >
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
