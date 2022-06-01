import {
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
} from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deletingMessage,
  messages,
  sendingMessage,
} from "../app/messages/messages.reducer";
import useUserCredentials from "./useUserAccessData";

const useHandleMessages = () => {
  const { id } = useParams();
  const { socketApi } = useUserCredentials();

  const [message, setMessage] = useState<string>("");

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const newMessage = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const sentMessages = useAppSelector(messages);

  function socket(content: string, contact: string) {
    socketApi.emit("private message", {
      content,
      to: contact,
    });
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
      if (id) {
        socket(value, id);
      }

      e.currentTarget.innerText = "";
      scrollMessages();
    }
  };
  const handleInputOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    const value = newMessage.current!.innerText;

    if (id) {
      socket(value, id);
    }

    newMessage.current!.innerText = "";
    scrollMessages();
  };

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
    handleInputOnClick,
    sentMessages,
    messagesContainer,
    newMessage,
    message,
    showPicker,
  };
};

export default useHandleMessages;
