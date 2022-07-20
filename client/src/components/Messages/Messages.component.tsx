import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  chats,
  isLoading,
  Message,
  pagination,
} from "../../app/rooms/rooms.reducer";
import { useHandleMessages } from "../../hooks/handleMessages";
import { socketApi } from "../../hooks/socket";

import MessageListItem from "../Message/MessageListItem.component";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Fab from "@mui/material/Fab";

import styles from "./messages.module.css";
import { timeFormationInMessage } from "../../utils/helpers";
const Messages = () => {
  const messagesPerUser = useAppSelector(chats);
  const messagesPagination = useAppSelector(pagination);
  const loading = useAppSelector(isLoading);
  const [needBack, setNeedBack] = useState(false);
  const [readMessages, setReadMessages] = useState<string[]>([]);

  const messageItems = useRef<HTMLDivElement[]>(null);
  const { messagesContainer, getScrollHeight, scrollMessages } =
    useHandleMessages();

  const { id } = useParams();

  useEffect(() => {
    scrollMessages();
  }, [messagesPerUser]);

  useEffect(() => {
    if (!messagesContainer.current) return;
    messagesContainer.current.scrollTop = 0;
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (!userId || !JSON.parse(userId) || !JSON.parse(userId).id) return;

    readMessages.forEach((message) => {
      socketApi.emit("message is read", id, message, JSON.parse(userId).id);
    });
  }, [readMessages]);

  const getMessages = () => {
    if (id && messagesPerUser[id]) {
      let newMessages: Message[] = [];

      for (const key in messagesPerUser[id]) {
        newMessages = newMessages.concat(messagesPerUser[id][key]);
      }

      return newMessages.map((message, i, arr) => {
        const { time } = message;

        const dayOfThisMessage = timeFormationInMessage(time);

        const dayOfPreviousMessage =
          i !== 0 ? timeFormationInMessage(arr[i - 1].time) : dayOfThisMessage;

        if (dayOfPreviousMessage.toString() !== dayOfThisMessage.toString()) {
          return (
            <div key={message.id} className={styles.date_container}>
              <MessageListItem
                message={message}
                setReadMessages={setReadMessages}
                responderId={id}
              />
              <p className={styles.day}>{dayOfPreviousMessage}</p>
            </div>
          );
        }
        if (i === arr.length - 1) {
          return (
            <div key={message.id} className={styles.date_container}>
              <p className={styles.day}>{dayOfThisMessage}</p>
              <MessageListItem
                message={message}
                setReadMessages={setReadMessages}
                responderId={id}
              />
            </div>
          );
        }
        return (
          <MessageListItem
            key={message.id}
            responderId={id}
            message={message}
            setReadMessages={setReadMessages}
          />
        );
      });
    }
  };

  useEffect(() => {
    setNeedBack(false);
  }, [id]);

  return (
    <>
      <div
        className={styles.messages_container}
        ref={messagesContainer}
        onScroll={(e) => {
          if (id && messagesPerUser && messagesPagination[id]) {
            getScrollHeight(
              e,
              messagesPerUser,
              id,
              loading,
              messagesPagination[id],
              setNeedBack
            );
          }
        }}
      >
        {getMessages()}
        {needBack ? (
          <Fab
            sx={{
              right: "60px",
              position: "absolute",
            }}
            onClick={() => {
              if (!messagesContainer.current) return;
              messagesContainer.current.scrollTop = 0;
              setNeedBack(false);
            }}
          >
            <ArrowBackIosIcon
              key={"arrow"}
              shapeRendering="circle"
              htmlColor="grey"
              fontSize="large"
              viewBox="0 0 16 24"
              sx={{
                transform: "rotate(-90deg)",

                right: 60,
                color: "grey",
                padding: "10px",
              }}
            />
          </Fab>
        ) : null}
      </div>
    </>
  );
};

export default Messages;
