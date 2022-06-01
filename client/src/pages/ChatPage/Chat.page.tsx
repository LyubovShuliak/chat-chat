import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Messages from "../../components/Messages/Messages.component";
import SendMessage from "../../components/SendMessage/SendMessage.component";
import Chats from "../../components/Chats/Chats.component";

import useUserCredentials from "../../hooks/useUserAccessData";

import useHandleMessages from "../../hooks/handleMessages";
import styles from "./chat_page.module.css";

const ChatPage = () => {
  const { user, isLogged, socketApi, setUser } = useUserCredentials();
  const { sendMessage, setMessage } = useHandleMessages();

  const navigation = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    socketApi.auth = { email: user.email };
    socketApi.connect();
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
    socketApi.on("disconnect", () => {
      socketApi.connect();
      socketApi.auth = { email: user.email };
    });
  });
  useEffect(() => {
    socketApi.on("chat message", ({ content, from }) => {
      setMessage(content);
      sendMessage(content);
    });
  }, []);

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
