import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import useUserCredentials from "../../hooks/useUserAccessData";

import { socketApi, useSocket } from "../../hooks/socket";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  chatConnection,
  ChatData,
  currentChat,
  pagination,
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
    connect,
  } = useSocket();

  const messagesPagination = useAppSelector(pagination);

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
      dispatch(setCurrentChat(chats.find((chat: ChatData) => chat.id === id)));
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
    if (id && !messagesPagination[id]) {
      socketApi.emit("get more messages", 1, id);
    }
  }, [id]);

  useEffect(() => {
    if (!isLogged && !localStorage.getItem("user")) {
      navigation("/signup", { replace: true });
    }
    const user = localStorage.getItem("user");
    if (!user) return;
    if (!JSON.parse(user)) return;
    const currentUser = location.state as {
      email: string;
      userName: string;
      id: string;
    };

    connect(JSON.parse(user)!.id, id ? id : "");
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    if (!JSON.parse(user).id) return;
    messageListener(JSON.parse(user).id, id);
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
      <Suspense>
        <Chats chats={chats} />
      </Suspense>
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
