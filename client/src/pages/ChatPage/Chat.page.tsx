import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Messages from "../../components/Messages/Messages.component";
import SendMessage from "../../components/SendMessage/SendMessage.component";
import Chats from "../../components/Chats/Chats.component";

import useUserCredentials from "../../hooks/useUserAccessData";

import styles from "./chat_page.module.css";
import { useAppDispatch } from "../../app/hooks";
import { useSocket } from "../../hooks/socket";

const ChatPage = () => {
  const { user, isLogged, setUser } = useUserCredentials();
  const { handleDisconnect, messageListener, socketEventListener } =
    useSocket();

  const navigation = useNavigate();
  // const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [setUser]);
  useEffect(() => {
    socketEventListener();
  }, [socketEventListener]);

  useEffect(() => {
    messageListener();

    if (
      !window.performance
        .getEntriesByType("navigation")
        .map((nav: any) => nav.type)
        .includes("reload") &&
      !isLogged
    ) {
      navigation("/signup", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    handleDisconnect(user.id);
  });

  return (
    <div className={styles.messages_container}>
      <Chats />
      {id ? (
        <div className={styles.messages_block}>
          <Messages />
          <SendMessage />
        </div>
      ) : null}
    </div>
  );
};

export default ChatPage;
