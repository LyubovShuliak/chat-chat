import styles from "./message.module.css";

import MessageRead from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { Message } from "../../app/rooms/rooms.reducer";
import { isScrolledIntoView, sendTime } from "../../utils/helpers";
import { useEffect, useRef } from "react";

const MessageListItem = (props: Message) => {
  const messageItem = useRef<HTMLDivElement>(null);
  const { message, type, time, isRead, id } = props;

  const messageDate = sendTime(time);

  useEffect(() => {
    if (messageItem.current) {
      console.log(isScrolledIntoView(messageItem.current));
    }
  }, [messageItem]);

  return (
    <div className={styles[type]} ref={messageItem}>
      <p className={styles.message_text}>{message}</p>

      <div className={styles.messageInformation}>
        <span className={styles.time}>{messageDate}</span>
        <DoneIcon color="action" sx={{ height: "20px" }} />
      </div>
    </div>
  );
};

export default MessageListItem;
