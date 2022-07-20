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
import { isScrolledIntoView } from "../utils/helpers";
import { socketApi, useSocket } from "./socket";

const useHandleMessages = () => {
  const { sendMessageSocket } = useSocket();

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrolledMesssagesCount, setScrolledMesssagesCount] =
    useState<number>(0);
  const [currentScrollTop, setCurrentScrollTop] = useState<number>(0);

  const newMessage = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);

  const childrenHeight = 80;

  const { id } = useParams();

  const dispatch = useAppDispatch();

  const scrollMessages = () => {
    const messagesScroll = messagesContainer.current;

    if (messagesScroll) {
      // messagesScroll.scrollTop = 0;
      // messagesScroll.style.scrollBehavior = "smooth";
      //   const messagesReadedInview = messagesScroll.clientHeight / childrenHeight;
      //   setScrolledMesssagesCount(messagesReadedInview);
      //   setCurrentScrollTop(Math.abs(messagesScroll.scrollTop));
      //   const arr = messagesScroll.querySelectorAll("div");
      //   for (let i = 0; i < arr.length; i++) {
      //     if (isScrolledIntoView(arr[i]) && arr[i].dataset.read) {
      //       arr[i].dataset.view = "1";
      //     }
      //   }
    }
  };
  const getScrollHeight = useCallback(
    (
      e: React.UIEvent<HTMLElement>,
      messagesPerUser: { [key: string]: { [key: number]: Message[] } },
      id: string | undefined,
      loading: boolean,
      page: number,

      setNeedBack: (arg: boolean) => void
    ) => {
      // console.log(Math.abs(e.currentTarget.scrollTop) - currentScrollTop);

      // if (
      //   Math.abs(e.currentTarget.scrollTop) - currentScrollTop >=
      //     childrenHeight &&
      //   messagesContainer.current
      // ) {
      //   const element = messagesContainer.current.querySelector(
      //     `div[data-read="false"]`
      //   ) as HTMLDivElement;
      //   if (element) {
      //     element.dataset.view = "true";
      //   }
      //   console.log(messagesContainer.current.querySelectorAll("div")[0]);

      //   setCurrentScrollTop(e.currentTarget.scrollTop);
      // }
      if (id && messagesPerUser[id][page].length < 20) return;
      const isScrolledToTop =
        Number(e.currentTarget.scrollTop) +
          Number(e.currentTarget.scrollHeight) -
          Number(e.currentTarget.clientHeight) ===
        0;

      if (
        isScrolledToTop &&
        id &&
        messagesPerUser[id][page].length === 20 &&
        !loading
      ) {
        dispatch(gettingMessages(true));
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
    isScrolling,
  };
};

export { useHandleMessages };
