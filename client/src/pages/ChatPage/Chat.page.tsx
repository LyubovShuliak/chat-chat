import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Messages from "../../components/Messages/Messages.component";
import SendMessage from "../../components/SendMessage/SendMessage.component";
import Chats from "../../components/Chats/Chats.component";

import useUserCredentials from "../../hooks/useUserAccessData";

import styles from "./chat_page.module.css";
import { useSocket } from "../../hooks/socket";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addChat, rooms } from "../../app/rooms/rooms.reducer";
import { allUsers } from "../../app/contacts/contacts.reducer";
import { getAllUsers } from "../../app/contacts/contacts.thunks";

const ChatPage = () => {
  const { user, isLogged, setUser } = useUserCredentials();
  const {
    handleDisconnect,
    messageListener,
    socketEventListener,
    userContacts,
  } = useSocket();

  const navigation = useNavigate();
  // const dispatch = useAppDispatch();
  const { id } = useParams();
  const chats = useAppSelector(rooms);
  const all = useAppSelector(allUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogged && id) {
      // dispatch(getAllUsers(user.email));
      const newChat = chats.find((chat) => chat.id === id);
      if (!newChat) {
        const chat = all.find((chat) => chat.id === id);
        console.log(chat);

        dispatch(addChat(chat));
      }
    }
  }, [user]);

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
