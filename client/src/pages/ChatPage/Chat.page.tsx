import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Messages from "../../components/Messages/Messages.component";
import SendMessage from "../../components/SendMessage/SendMessage.component";
import Chats from "../../components/Chats/Chats.component";

import useUserCredentials from "../../hooks/useUserAccessData";

import styles from "./chat_page.module.css";
import { useSocket } from "../../hooks/socket";
import { useAppSelector } from "../../app/hooks";
import { rooms } from "../../app/rooms/rooms.reducer";

const ChatPage = () => {
  const { user, isLogged, setUser } = useUserCredentials();
  const {
    handleDisconnect,
    messageListener,
    socketEventListener,
    messagesListener,
  } = useSocket();

  const navigation = useNavigate();
  // const dispatch = useAppDispatch();
  const { id } = useParams();
  const chats = useAppSelector(rooms);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [setUser]);
  useEffect(() => {
    if (isLogged) {
      socketEventListener();
    }
  }, []);
  useEffect(() => {
    messagesListener();
  }, []);

  useEffect(() => {
    if (!isLogged && !localStorage.getItem("user")) {
      navigation("/signup", { replace: true });
    }

    if (
      window.performance
        .getEntriesByType("navigation")
        .map((nav: any) => nav.type)
        .includes("reload")
    ) {
      console.log("reload");
    }
  }, [user]);

  useEffect(() => {
    messageListener();
  }, []);

  useEffect(() => {
    handleDisconnect(user.id);
  }, []);

  return (
    <div className={styles.messages_container}>
      <Chats chats={chats} />
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
