import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import Messages from "../../components/Messages/Messages.component";

import "./chat_page.css";

import useUserCridentials from "../../hooks/useUserAccessData";
import useHandleMessages from "../../hooks/handleMessages";
import SendMessage from "../../components/SendMessage/SendMessage.conponent";
const ChatPage = () => {
  const { signOut, validateToken } = useUserCridentials();
  const handleValidation = useCallback(async () => {
    await validateToken();
  }, []);

  useLayoutEffect(() => {
    handleValidation();
  }, [handleValidation]);
  const { flag } = useHandleMessages();

  return (
    <div className="messages_container">
      <Link to="/login" onClick={signOut}>
        Log out
      </Link>
      <div>
        <span className="fi fi-gr"></span>
        <span className="fi fi-gr fis"></span>
      </div>

      <Messages />
      <SendMessage />
    </div>
  );
};

export default ChatPage;
