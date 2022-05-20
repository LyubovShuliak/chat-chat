import { useEffect, useState } from "react";
import { Message } from "../../app/messages/messages.reducer";
import { store } from "../../app/store";
import useHandleMessages from "../../hooks/handleMessages";
import { socketApi } from "../../hooks/socketConfg";

import MessageListItem from "../Message/MessageListItem.component";

import styles from "./messages.module.css";
const Messages = () => {
  const { messagesContainer, sentMessages, sendMessage, setMessage } =
    useHandleMessages();
  useEffect(() => {
    socketApi.on("chat message", (msg) => {
      setMessage(msg);
      sendMessage(msg);
    });
  }, []);

  return (
    <div className={styles.messages_container}>
      {sentMessages.test.length
        ? sentMessages.test.map((message: Message) => {
            return <MessageListItem key={message.id} {...message} />;
          })
        : null}

      <div ref={messagesContainer} className={styles.scrollDiv} />
    </div>
  );
};

export default Messages;
