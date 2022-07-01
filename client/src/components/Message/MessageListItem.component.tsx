import styles from "./message.module.css";

import MessageRead from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { Message } from "../../app/rooms/rooms.reducer";
import { useEffect } from "react";

const MessageListItem = (props: Message) => {
  const { message, type, time, isRead, id } = props;

  const messageDate = new Intl.DateTimeFormat("en-UA", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(new Date(time));

  return (
    <div className={styles[type]}>
      <p className={styles.message_text}>{message}</p>

      <div className={styles.messageInformation}>
        <span className={styles.time}>{messageDate}</span>
      </div>
    </div>
  );
};

export default MessageListItem;
