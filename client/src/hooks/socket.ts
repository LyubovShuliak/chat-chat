import { useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import { connection, contacts } from "../app/contacts/contacts.reducer";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setChats,
  setMessagesPerChat,
  addChat,
} from "../app/rooms/rooms.reducer";
import { getUserChats } from "../app/rooms/rooms.thunks";
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

  const socketEventListener = useCallback(() => {
    socketApi.onAny((event, ...args) => {
      console.log(event, args);
    });
  }, []);

  const messagesListener = useCallback(() => {
    socketApi.on("messages", (messages) => {
      console.log(messages);
      dispatch(setMessagesPerChat(messages));
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

  const messageListener = useCallback(() => {
    socketApi.on("private message", ({ content, from }) => {
      console.log(content, from);
    });
  }, []);

  const connectStatusListener = useCallback(() => {
    socketApi.on("user connected", ({ sessionID, userID }) => {
      dispatch(connection(userID));
      console.log(userContacts);
    });
  }, []);

  const handleDisconnect = useCallback((userID: string) => {
    socketApi.on("disconnect", () => {
      socketApi.connect();

      socketApi.auth = { userID };
    });
  }, []);

  const getContactsStatus = useCallback(() => {
    socketApi.on("users", (users) => {
      console.log(users);

      userContacts.forEach((user) => {
        if (users[user.id]) {
          dispatch(connection(user.id));
        }
      });
      console.log(userContacts);
    });
  }, []);

  return {
    connect,
    sendMessageSocket,
    handleDisconnect,
    messageListener,
    socketEventListener,
    connectStatusListener,
    getContactsStatus,
    messagesListener,
    userContacts,
  };
}

export { useSocket };
