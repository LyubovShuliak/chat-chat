import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { chats } from "../../app/rooms/rooms.reducer";
import { useHandleMessages } from "../../hooks/handleMessages";
import { socketApi, useSocket } from "../../hooks/socket";

import MessageListItem from "../Message/MessageListItem.component";

import styles from "./messages.module.css";
const Messages = () => {
  const messagesPerUser = useAppSelector(chats);

  const { messagesContainer, scrollMessages } = useHandleMessages();

  // const { messagesListener } = useSocket();

  const { id } = useParams();

  useEffect(() => {
    scrollMessages();
  }, [messagesPerUser]);

  return (
    <div className={styles.messages_container}>
      {id && messagesPerUser.messages && messagesPerUser.messages[id]
        ? messagesPerUser.messages[id].map((message) => {
            return <MessageListItem key={message.id} {...message} />;
          })
        : null}

      <div ref={messagesContainer} className={styles.scrollDiv} />
    </div>
  );
};

export default Messages;
