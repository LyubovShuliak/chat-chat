import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { chats, Message } from "../../app/rooms/rooms.reducer";
import { useHandleMessages } from "../../hooks/handleMessages";
import { socketApi, useSocket } from "../../hooks/socket";

import MessageListItem from "../Message/MessageListItem.component";

import styles from "./messages.module.css";
const Messages = () => {
  const messagesPerUser = useAppSelector(chats);

  const [messages, setMessages] = useState<Message[]>([]);

  const { messagesContainer, scrollMessages } = useHandleMessages();

  const { id } = useParams();

  useEffect(() => {
    scrollMessages();
  }, [messagesPerUser]);

  useEffect(() => {
    if (id) {
      setMessages(messagesPerUser[id]);
    }
  }, [id]);

  return (
    <div className={styles.messages_container}>
      {id && messages
        ? messages.map((message) => {
            return <MessageListItem key={message.id} {...message} />;
          })
        : null}

      <div ref={messagesContainer} className={styles.scrollDiv} />
    </div>
  );
};

export default Messages;
