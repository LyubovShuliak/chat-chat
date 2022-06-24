import styles from "./message.module.css";

import MessageRead from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { Message } from "../../app/rooms/rooms.reducer";
import { useHandleMessages } from "../../hooks/handleMessages";
import { useEffect } from "react";

const MessageListItem = (props: Message) => {
  const { message, type, time } = props;

  const { scrollMessages } = useHandleMessages();

  const messageDate =
    new Date(time).getHours() + ":" + new Date(time).getMinutes();

  useEffect(() => {
    scrollMessages();
  }, []);

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
