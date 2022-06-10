import { useEffect } from "react";

import List from "@mui/material/List";

import ChatSearchBar from "../SearchBar/ChatSearchBar.component";

import styles from "./chats.module.css";
import { SimpleSlider } from "../Carousel/Carousel.component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { ChatItem } from "../ChatItem/ChatItem.component";
import { Link } from "react-router-dom";
import { socketApi, useSocket } from "../../hooks/socket";
import { rooms, setChats } from "../../app/rooms/rooms.reducer";
import { contacts } from "../../app/contacts/contacts.reducer";
import { getContacts } from "../../app/contacts/contacts.thunks";
import { User } from "../../app/contacts/contacts.reducer";

export default function Chats() {
  const dispatch = useAppDispatch();
  const userChats = useAppSelector(rooms);
  const userContacts = useAppSelector(contacts);

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
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("user") || "";
    const email = JSON.parse(currentUser).email;

    if (email) {
      dispatch(getContacts(email));
    }
  }, []);
  useEffect(() => {
    console.log("userContacts", userContacts);
    console.log("userChats", userChats);
    if (userChats) {
      console.log("Object.values(userChats)", ...Object.values(userChats));
    }
  }, [userContacts, userChats]);

  return (
    <div className={styles.chat_block}>
      <ChatSearchBar />

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {/* {Object.keys(userChats).length !== 0 && userContacts.length !== 0
          ? Object.values(userChats)
              .flat(1)
              .map((chat, i, arr) => {
                if()
                return (
                  <Link
                    key={chat.user.id}
                    to={{
                      pathname: `/${chat.user.id}`,
                    }}
                  >
                    <ChatItem {...chat.user} />
                  </Link>
                );
              })
          : null} */}
      </List>
    </div>
  );
}
