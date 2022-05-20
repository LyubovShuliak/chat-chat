import { Navigate, useNavigate } from "react-router-dom";

import Messages from "../../components/Messages/Messages.component";
import SendMessage from "../../components/SendMessage/SendMessage.conponent";
import Chats from "../../components/Chats/Chats.component";

import useUserCridentials from "../../hooks/useUserAccessData";
import { useAppSelector } from "../../app/hooks";
import { isLoading } from "../../app/user/user.reducer";

import styles from "./chat_page.module.css";
import { useEffect, useState } from "react";
import { socketApi } from "../../hooks/socketConfg";

const ChatPage = () => {
  const { isLogged } = useUserCridentials();

  const navigation = useNavigate();

  useEffect(() => {
    if (
      !window.performance
        .getEntriesByType("navigation")
        .map((nav: any) => nav.type)
        .includes("reload") &&
      !isLogged
    ) {
      navigation("/signup", { replace: true });
    }
  }, []);

  useEffect(() => {
    socketApi.on("disconnect", () => {
      socketApi.connect();
    });
  });

  return (
    <div className={styles.messages_container}>
      <Chats />

      <div className={styles.messages_block}>
        <Messages />
        <SendMessage />
      </div>
    </div>
  );
};

export default ChatPage;
