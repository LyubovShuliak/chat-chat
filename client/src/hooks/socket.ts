import { useCallback } from "react";
import { io } from "socket.io-client";
import { contacts } from "../app/contacts/contacts.reducer";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  chatConnection,
  chatDisconnection,
  gettingMessages,
  pagination,
  sendMessage,
  setMessagesPerChat,
  setUnreadMessagesCounter,
} from "../app/rooms/rooms.reducer";

export const url = "http://localhost:3050/";
export const socketApi = io(url, {
  autoConnect: false,
});

function useSocket() {
  const dispatch = useAppDispatch();

  const userContacts = useAppSelector(contacts);

  const connect = useCallback((userID: string) => {
    socketApi.auth = { userID };
    socketApi.connect();
  }, []);

  const messagesListener = useCallback(() => {
    socketApi.on("messages", (messages) => {
      dispatch(setMessagesPerChat(messages));
      dispatch(gettingMessages(false));
    });
  }, []);

  const sendMessageSocket = useCallback((content: string, contact: string) => {
    const user = localStorage.getItem("user");
    const now = new Date();
    const time = now;

    if (user) {
      socketApi.emit("private message", {
        content,
        to: contact,
        from: JSON.parse(user)!.id,
        time,
      });
    }
  }, []);

  const messageListener = useCallback(
    (id: string, sender: string | undefined) => {
      socketApi.on("private message", ({ content, from, to }) => {
        if (from === id) {
          dispatch(sendMessage({ ...content, to: to }));
        } else {
          dispatch(sendMessage({ ...content, to: from }));
        }
      });
    },
    []
  );

  const connectStatusListener = useCallback(() => {
    socketApi.on("user connected", ({ sessionID, userID }) => {
      dispatch(chatConnection(userID));
    });
  }, []);

  const handleDisconnect = useCallback((userID: string) => {
    socketApi.on("disconnect", () => {
      socketApi.connect();
      socketApi.auth = { userID };
    });
  }, []);

  const onDisconnect = useCallback(() => {
    socketApi.on("user disconnected", ({ id }) => {
      dispatch(chatDisconnection(id));
    });
  }, []);

  const getContactsStatus = useCallback(() => {
    socketApi.on("users", (users) => {
      Object.keys(users).forEach((user: any) => {
        dispatch(chatConnection(user));
      });
    });
  }, []);

  const getUnreadMessagesCounter = useCallback(() => {
    socketApi.on("unread messages", (chatCounter) => {
      dispatch(setUnreadMessagesCounter(chatCounter));
    });
  }, []);

  return {
    connect,
    onDisconnect,
    sendMessageSocket,
    handleDisconnect,
    messageListener,
    connectStatusListener,
    getContactsStatus,
    messagesListener,
    getUnreadMessagesCounter,
    userContacts,
  };
}

export { useSocket };
