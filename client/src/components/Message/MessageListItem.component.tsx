import { FC } from "react";
import styles from "./message.module.css";

import MessageRead from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { Message } from "../../app/rooms/rooms.reducer";

const MessageListItem = (props: Message) => {
  const { message, type, time } = props;

  return (
    <div className={styles[type]}>
      <p className={styles.message_text}>{message}</p>

      <div className={styles.messageInformation}>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
};

export default MessageListItem;
