import styles from "./message.module.css";

import MessageRead from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import {
  Message,
  recieved,
  setIsRecieved,
} from "../../app/rooms/rooms.reducer";
import { isScrolledIntoView, sendTime } from "../../utils/helpers";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socketApi } from "../../hooks/socket";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHandleMessages } from "../../hooks/handleMessages";

const MessageListItem = (props: {
  message: Message;
  setReadMessages: Dispatch<SetStateAction<string[]>>;
  responderId: string;
}) => {
  const messageItem = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { isScrolling } = useHandleMessages();

  const [isIntoView, setIsIntoView] = useState(false);
  const { message, type, time, isRead, id } = props.message;

  const messageDate = sendTime(time);
  const isRecieve = useAppSelector(recieved);

  useEffect(() => {
    if (isIntoView && !isRecieve && isScrolling) {
      const userId = localStorage.getItem("user");
      if (
        !userId ||
        !JSON.parse(userId) ||
        !JSON.parse(userId).id ||
        !props.responderId
      )
        return;

      dispatch(setIsRecieved(true));
      socketApi.emit(
        "message is read",
        props.responderId,
        id,
        JSON.parse(userId).id
      );
    }
  }, [isRecieve, isScrolling]);

  useEffect(() => {
    if (
      messageItem.current &&
      isScrolledIntoView(messageItem.current) &&
      isScrolling
    ) {
      setIsIntoView(true);
    }
  }, [isScrolling]);

  return (
    <div className={styles[type]} data-id={id} data-read={isRead}>
      <p className={styles.message_text}>{message}</p>

      <div className={styles.messageInformation}>
        <span className={styles.time}>{messageDate}</span>

        {type === "user" && !isRead ? (
          <DoneIcon color="action" sx={{ height: "20px" }} />
        ) : null}
        {type === "user" && isRead ? (
          <MessageRead color="primary" sx={{ height: "20px" }} />
        ) : null}
      </div>
    </div>
  );
};

export default MessageListItem;
