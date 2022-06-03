import { useCallback, useEffect } from "react";
import { io } from "socket.io-client";
export const url = "http://localhost:3050/";
export const socketApi = io(url, {
  autoConnect: false,
});

function useSocket() {
  const connect = useCallback((userID: string) => {
    socketApi.auth = { userID };
    socketApi.connect();
  }, []);

  const socketEventListener = useCallback(() => {
    socketApi.onAny((event, ...args) => {
      console.log(event, args);
    });
  }, []);

  const sendMessageSocket = useCallback((content: string, contact: string) => {
    socketApi.emit("private message", {
      content,
      to: contact,
    });
  }, []);

  const messageListener = useCallback(() => {
    socketApi.on("private message", ({ content, from }) => {
      console.log(content, from);
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
    });
  }, []);

  return {
    connect,
    sendMessageSocket,
    handleDisconnect,
    messageListener,
    socketEventListener,
  };
}

export { useSocket };
