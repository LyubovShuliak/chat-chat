import { useEffect } from "react";

import List from "@mui/material/List";

import ChatSearchBar from "../SearchBar/ChatSearchBar.component";

import styles from "./chats.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { ChatItem } from "../ChatItem/ChatItem.component";
import { Link } from "react-router-dom";
import { socketApi, useSocket } from "../../hooks/socket";
import { rooms, setChats } from "../../app/rooms/rooms.reducer";
import { getContacts } from "../../app/contacts/contacts.thunks";

export default function Chats() {
  const dispatch = useAppDispatch();
  const userChats = useAppSelector(rooms);

  const { getContactsStatus } = useSocket();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      getContactsStatus();
    }
  }, []);

  useEffect(() => {
    socketApi.on("chats", (chats) => {
      console.log("chats :>> ", chats);

      dispatch(setChats(chats));
    });
  }, []);
  useEffect(() => {
    console.log("userChats", userChats);
  }, [userChats]);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const email = JSON.parse(currentUser)!.email;

      if (email) {
        dispatch(getContacts(email));
      }
    }
  }, []);

  return (
    <div className={styles.chat_block}>
      <ChatSearchBar />

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {userChats && userChats.length !== 0
          ? userChats.map((chat) => {
              return (
                <Link
                  key={chat.id}
                  to={{
                    pathname: `/${chat.id}`,
                  }}
                >
                  <ChatItem {...chat} />
                </Link>
              );
            })
          : null}
      </List>
    </div>
  );
}
