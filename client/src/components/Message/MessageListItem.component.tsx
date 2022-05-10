import React, { FC } from "react";
import { Message } from "../../app/messages/messages.reducer";

const MessageListItem = ({ ...props }: Message) => {
  const { message, messageType } = props;
  const now = new Date();
  const current = now.getHours() + ":" + now.getMinutes();
  return (
    <li className={`${messageType}`}>
      <p>{message}</p>
      <span>{current}</span>
    </li>
  );
};

export default MessageListItem;
