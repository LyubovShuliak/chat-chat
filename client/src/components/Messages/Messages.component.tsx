import { Message } from "../../app/messages/messages.reducer";
import { useHandleMessages } from "../../hooks/handleMessages";

import MessageListItem from "../Message/MessageListItem.component";

import styles from "./messages.module.css";
const Messages = () => {
  const { messagesContainer, sentMessages } = useHandleMessages();

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
