import { lazy, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import useUserCredentials from "../../hooks/useUserAccessData";

import { socketApi, useSocket } from "../../hooks/socket";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  chatConnection,
  ChatData,
  rooms,
  setChats,
  setCurrentChat,
} from "../../app/rooms/rooms.reducer";

import styles from "./chat_page.module.css";
import { getContacts } from "../../app/contacts/contacts.thunks";

const Messages = lazy(
  () => import("../../components/Messages/Messages.component")
);
const SendMessage = lazy(
  () => import("../../components/SendMessage/SendMessage.component")
);
const Chats = lazy(() => import("../../components/Chats/Chats.component"));
const ChatInfo = lazy(
  () => import("../../components/ChatInfoBar/ChatInfo.component")
);

const ChatPage = () => {
  const { user, isLogged, setUser } = useUserCredentials();
  const {
    handleDisconnect,
    messageListener,
    connectStatusListener,
    messagesListener,
    onDisconnect,
  } = useSocket();

  const location = useLocation();

  const navigation = useNavigate();
  const chats = useAppSelector(rooms);

  const dispatch = useAppDispatch();

  const { id } = useParams();

  const { getContactsStatus } = useSocket();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      getContactsStatus();
    }
  }, [getContactsStatus]);

  useEffect(() => {
    onDisconnect();
  }, [id]);

  useEffect(() => {
    socketApi.on("chats", (chats) => {
      dispatch(setChats(chats));
      dispatch(chatConnection(id));
    });
  }, []);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const email = JSON.parse(currentUser)!.email;

      if (email) {
        dispatch(getContacts(email));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    connectStatusListener();
  }, []);

  useEffect(() => {
    if (id && chats.length) {
      dispatch(setCurrentChat(chats.find((chat) => chat.id === id)));
    }
  }, [id, chats]);

  useEffect(() => {
    setUser(
      location.state as {
        email: string;
        userName: string;
        id: string;
      }
    );
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
  }, []);

  useEffect(() => {
    messageListener();
  }, []);

  useEffect(() => {
    const currentUser = location.state as {
      email: string;
      userName: string;
      id: string;
    };
    if (currentUser) {
      handleDisconnect(currentUser.id);
    }
  }, []);

  return (
    <div className={styles.messages_container}>
      <Chats chats={chats} />
      {id ? (
        <div className={styles.messages_block}>
          <div className={styles.chat_content}>
            <ChatInfo />
            <Messages />
          </div>

          <SendMessage />
        </div>
      ) : null}
    </div>
  );
};

export default ChatPage;
