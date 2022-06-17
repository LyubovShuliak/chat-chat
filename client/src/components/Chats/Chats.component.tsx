import { useEffect } from "react";

import List from "@mui/material/List";

import ChatSearchBar from "../SearchBar/ChatSearchBar.component";

import styles from "./chats.module.css";
import { useAppDispatch } from "../../app/hooks";

import { ChatItem } from "../ChatItem/ChatItem.component";
import { Link } from "react-router-dom";
import { socketApi, useSocket } from "../../hooks/socket";
import { ChatData, setChats } from "../../app/rooms/rooms.reducer";
import { getContacts } from "../../app/contacts/contacts.thunks";

export default function Chats(props: { chats: ChatData[] }) {
  const { chats } = props;
  const dispatch = useAppDispatch();

  const { getContactsStatus } = useSocket();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      getContactsStatus();
    }
  }, []);

  useEffect(() => {
    socketApi.on("chats", (chats) => {
      dispatch(setChats(chats));
    });
  }, []);

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
        {chats.map((chat) => {
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
        })}
      </List>
    </div>
  );
}
