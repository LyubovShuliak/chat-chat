import { FC } from "react";
import { Message } from "../../app/messages/messages.reducer";
import styles from "./message.module.css";

import MessageRead from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

const MessageListItem: FC<Message> = (props) => {
  const { message, messageType, id } = props;
  const now = new Date();
  const current = now.getHours() + ":" + now.getMinutes();

  return (
    <div>
      <div className={styles[messageType]}>
        <p className={styles.message_text}>{message}</p>

        <div className={styles.messageInformation}>
          <span className={styles.time}>{current}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageListItem;
