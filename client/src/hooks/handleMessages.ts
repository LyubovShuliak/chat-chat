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
import { useSocket } from "./socket";

const useHandleMessages = () => {
  const { sendMessageSocket } = useSocket();

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const newMessage = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  // const sentMessages = useAppSelector(messages);

  const scrollMessages = useCallback(() => {
    const messagesScroll = messagesContainer.current;

    if (messagesScroll) {
      messagesScroll.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  const onEmojiClick = useCallback((event: any, emojiObject: any) => {
    const messageInput = newMessage.current;

    if (messageInput) {
      messageInput.innerText = messageInput?.innerText + emojiObject.emoji;
    }

    setChosenEmoji(emojiObject);
  }, []);

  const handleInputOnEnter = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, id: string | undefined) => {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();

        const value = e.currentTarget.innerText;
        if (id) {
          console.log(id);

          sendMessageSocket(value, id);
        }

        e.currentTarget.innerText = "";
        scrollMessages();
      }
    },
    []
  );
  const handleInputOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, id: string | undefined) => {
      const value = newMessage.current!.innerText;

      if (id) {
        sendMessageSocket(value, id);
      }

      newMessage.current!.innerText = "";
      scrollMessages();
    },
    []
  );

  const showEmojiPicker = useCallback(() => {
    setShowPicker(!showPicker);
  }, []);

  // const deleteMessage = useCallback((id: string) => {
  //   dispatch(deletingMessage(id));
  // }, []);
  return {
    onEmojiClick,

    showEmojiPicker,
    handleInputOnEnter,
    scrollMessages,
    handleInputOnClick,
    messagesContainer,
    newMessage,
    showPicker,
  };
};

export { useHandleMessages };
