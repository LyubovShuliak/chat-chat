import { lazy } from "react";
import { useHandleMessages } from "../../hooks/handleMessages";
import { useParams } from "react-router-dom";

import Picker from "emoji-picker-react";

import messageInputStyles from "./sendMessage.module.css";

const PickEmoji = lazy(
  () => import("@mui/icons-material/SentimentSatisfiedAlt")
);
const SendIcon = lazy(() => import("@mui/icons-material/Send"));
const AttachFile = lazy(() => import("@mui/icons-material/AttachFile"));

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
          onKeyUp={(e) => {
            if (e.code === "Enter" && !e.shiftKey && showPicker) {
              e.preventDefault();
              showEmojiPicker();
            }
          }}
        ></div>
        <button
          onClick={showEmojiPicker}
          className={messageInputStyles.emoji_picker}
        >
          <PickEmoji style={{ width: "40px" }} />
        </button>

        <button
          className={messageInputStyles.sendBtn}
          onClick={(e) => {
            handleInputOnClick(e, id);
            showEmojiPicker();
          }}
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
