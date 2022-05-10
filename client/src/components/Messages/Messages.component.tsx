import { keyboard } from "@testing-library/user-event/dist/types/keyboard";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Message, messages } from "../../app/messages/messages.reducer";
import SendMessage from "../../components/SendMessage/SendMessage.conponent";
import MessageListItem from "../Message/MessageListItem.component";
const Messages = () => {
  const sentMessages = useAppSelector(messages);

  return (
    <ul>
      {sentMessages.test.length
        ? sentMessages.test.map((message: Message) => {
            const { id, message: messageText, messageType } = message;
            return (
              <MessageListItem
                message={messageText}
                id={id}
                messageType={messageType}
              />
            );
          })
        : null}
    </ul>
  );
};

export default Messages;
