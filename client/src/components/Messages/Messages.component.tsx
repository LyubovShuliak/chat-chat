import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { chats, Message, pagination } from "../../app/rooms/rooms.reducer";
import { useHandleMessages } from "../../hooks/handleMessages";
import { socketApi } from "../../hooks/socket";

import MessageListItem from "../Message/MessageListItem.component";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Fab from "@mui/material/Fab";

import styles from "./messages.module.css";
const Messages = () => {
  const messagesPerUser = useAppSelector(chats);
  const messagesPagination = useAppSelector(pagination);

  const { messagesContainer, getScrollHeight, needBack, setNeedBack } =
    useHandleMessages();

  const { id } = useParams();

  useEffect(() => {
    if (!messagesContainer.current) return;
    messagesContainer.current.scrollTop = 0;

    setNeedBack(false);
  }, [id]);

  const getMessages = () => {
    if (id && messagesPerUser[id]) {
      let newMessages: Message[] = [];

      for (const key in messagesPerUser[id]) {
        newMessages = newMessages.concat(messagesPerUser[id][key]);
      }

      return newMessages.map((message, i, arr) => {
        const { time } = message;

        const options: {
          month: "short";
          day: "numeric";
        } = {
          month: "short",
          day: "numeric",
        };

        const dayOfThisMessage = new Intl.DateTimeFormat(
          "en-US",
          options
        ).format(new Date(time));

        const dayOfPreviousMessage =
          i !== 0
            ? new Intl.DateTimeFormat("en-US", options).format(
                new Date(arr[i - 1].time)
              )
            : dayOfThisMessage;

        if (dayOfPreviousMessage.toString() !== dayOfThisMessage.toString()) {
          return (
            <div key={message.id} className={styles.date_container}>
              <MessageListItem {...message} />
              <p className={styles.day}>{dayOfPreviousMessage}</p>
            </div>
          );
        }
        if (i === arr.length - 1) {
          return (
            <div key={message.id} className={styles.date_container}>
              <p className={styles.day}>{dayOfThisMessage}</p>
              <MessageListItem {...message} />
            </div>
          );
        }
        return <MessageListItem key={message.id} {...message} />;
      });
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || !JSON.parse(user).id || !id) return;

    if (
      messagesPagination[id] &&
      messagesPerUser[id][messagesPagination[id]].find(
        (message) => !message.isRead
      )
    ) {
      const unReadMessages = messagesPerUser[id][messagesPagination[id]]
        .filter((message) => !message.isRead)
        .map((el) => el.id);

      console.log(unReadMessages);

      socketApi.emit(
        "message is read",
        JSON.parse(user).id,
        unReadMessages,
        id
      );
    }
  }, [id]);

  return (
    <>
      <div
        className={styles.messages_container}
        ref={messagesContainer}
        onScroll={(e) => {
          if (id) {
            getScrollHeight(e, messagesPerUser, id, messagesPagination[id]);
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
