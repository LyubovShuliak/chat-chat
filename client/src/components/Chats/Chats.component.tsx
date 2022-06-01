import { useEffect } from "react";

import List from "@mui/material/List";

import ChatSearchBar from "../SearchBar/ChatSearchBar.component";

import styles from "./chats.module.css";
import { SimpleSlider } from "../Carousel/Carousel.component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { rooms } from "../../app/rooms/rooms.reducer";
import { getChats } from "../../app/rooms/rooms.thunks";
import { ChatItem } from "../ChatItem/ChatItem.component";
import { Link } from "react-router-dom";

export default function Chats() {
  const chats = useAppSelector(rooms);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(getChats(JSON.parse(user).email));
    }
  }, []);

  return (
    <div className={styles.chat_block}>
      <ChatSearchBar />

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {chats.length
          ? chats.map((chat) => {
              return (
                <Link
                  key={chat[1].chatData.id}
                  to={{
                    pathname: `/${chat[1].chatData.id}`,
                  }}
                >
                  <ChatItem {...chat[1].chatData} />
                </Link>
              );
            })
          : null}
      </List>
    </div>
  );
}
