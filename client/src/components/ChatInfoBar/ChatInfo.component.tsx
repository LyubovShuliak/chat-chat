import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { currentChat } from "../../app/rooms/rooms.reducer";
import { store } from "../../app/store";
import styles from "./chatInfo.module.css";

const ChatInfo = () => {
  const chat = useSelector(currentChat);
  useEffect(() => {
    console.log("ChatInfo", chat);
  }, [chat]);
  return (
    <div className={styles.info_bar}>
      <p className={styles.name}>{chat?.userName}</p>
      <p
        className={`${styles.info_connected} ${
          chat?.connected ? styles.online : styles.offline
        }`}
      >
        {chat?.connected ? "online" : "offline"}
      </p>
    </div>
  );
};

export default ChatInfo;
