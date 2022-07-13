import {
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
} from "react";
import { useParams } from "react-router-dom";
import { isLoading } from "../app/contacts/contacts.reducer";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ChatData, Message, gettingMessages } from "../app/rooms/rooms.reducer";
import { socketApi, useSocket } from "./socket";

const useHandleMessages = () => {
  const { sendMessageSocket } = useSocket();

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const newMessage = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);

  const { id } = useParams();

  const dispatch = useAppDispatch();

  const scrollMessages = () => {
    const messagesScroll = messagesContainer.current;

    if (messagesScroll) {
      messagesScroll.scrollTop = 0;
      messagesScroll.style.scrollBehavior = "smooth";
    }
  };
  const getScrollHeight = useCallback(
    (
      e: React.UIEvent<HTMLElement>,
      messagesPerUser: { [key: string]: { [key: number]: Message[] } },
      id: string | undefined,
      page: number,

      setNeedBack: (arg: boolean) => void
    ) => {
      if (id && !messagesPerUser[id]) {
        return;
      }
      if (id && messagesPerUser[id][page].length < 20) return;
      const isScrolledToTop =
        Number(e.currentTarget.scrollTop) +
          Number(e.currentTarget.scrollHeight) -
          Number(e.currentTarget.clientHeight) ===
        0;

      if (isScrolledToTop && id && messagesPerUser[id][page].length === 20) {
        console.log("getScrollHeight");

        socketApi.emit("get more messages", page + 1, id);
      }

      if (e.currentTarget && e.currentTarget.scrollTop < -200) {
        setNeedBack(true);
      } else {
        setNeedBack(false);
      }
    },
    []
  );
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
  }, [showPicker]);

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
    getScrollHeight,
  };
};

export { useHandleMessages };
