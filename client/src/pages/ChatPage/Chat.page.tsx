import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import useUserCridentials from "../../hooks/useUserAccessData";
const ChatPage = () => {
  const { signOut, validateToken } = useUserCridentials();
  const handleValidation = useCallback(async () => {
    await validateToken();
  }, []);

  useLayoutEffect(() => {
    handleValidation();
  }, [handleValidation]);

  return (
    <div>
      <Link to="/login" onClick={signOut}>
        Log out
      </Link>
    </div>
  );
};

export default ChatPage;
