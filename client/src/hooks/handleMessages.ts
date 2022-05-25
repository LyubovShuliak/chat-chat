import { useState, KeyboardEvent, useRef, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deletingMessage,
  messages,
  sendingMessage,
} from "../app/messages/messages.reducer";
import useUserCredentials from "./useUserAccessData";

const useHandleMessages = () => {
  const { socketApi } = useUserCredentials();

  const [message, setMessage] = useState<string>("");

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const newMessage = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const sentMessages = useAppSelector(messages);

  function socket(message: string) {
    socketApi.emit("chat message", message);
  }

  const scrollMessages = () => {
    const messagesScroll = messagesContainer.current;

    if (messagesScroll) {
      messagesScroll.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const onEmojiClick = (event: any, emojiObject: any) => {
    const messageInput = newMessage.current;

    if (messageInput) {
      messageInput.innerText = messageInput?.innerText + emojiObject.emoji;
    }

    setMessage(message + emojiObject.emoji);
    setChosenEmoji(emojiObject);
  };

  const handleInputOnEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const value = e.currentTarget.innerText;

      socket(value);

      e.currentTarget.innerText = "";
      scrollMessages();
    }
  };
  const sendOnClick = () => {};

  const showEmojiPicker = () => {
    setShowPicker(!showPicker);
  };
  const sendMessage = (message: string) => {
    if (!message) return;
    dispatch(sendingMessage({ message }));
  };

  useEffect(() => {
    scrollMessages();
  }, [sendMessage]);

  const deleteMessage = (id: string) => {
    dispatch(deletingMessage(id));
  };
  return {
    onEmojiClick,

    showEmojiPicker,
    sendMessage,
    deleteMessage,
    handleInputOnEnter,
    setMessage,
    sentMessages,
    messagesContainer,
    newMessage,
    message,
    showPicker,
  };
};

export default useHandleMessages;
