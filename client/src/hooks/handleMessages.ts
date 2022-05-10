import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  deletingMessage,
  sendingMessage,
} from "../app/messages/messages.reducer";

const useHandleMessages = () => {
  const [message, setMessage] = useState<String | "">("");
  const [flag, setFlag] = useState<String[]>([]);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const dispatch = useAppDispatch();

  const onEmojiClick = (event: any, emojiObject: any) => {
    setMessage(message + emojiObject.emoji);
    setChosenEmoji(emojiObject);
  };
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;
    const value = e.target.value;

    setMessage(value);
  };
  const showEmojiPicker = () => {
    setShowPicker(!showPicker);
  };
  const sendMessage = () => {
    dispatch(sendingMessage({ message }));
  };
  const deleteMessage = (id: String) => {
    dispatch(deletingMessage(id));
  };
  return {
    onEmojiClick,
    handleInput,
    showEmojiPicker,
    sendMessage,
    deleteMessage,
    message,
    showPicker,
    flag,
  };
};

export default useHandleMessages;
