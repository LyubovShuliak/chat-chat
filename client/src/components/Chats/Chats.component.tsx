import { useEffect, lazy } from "react";

import { useAppDispatch } from "../../app/hooks";

import { Link, useParams } from "react-router-dom";
import { socketApi, useSocket } from "../../hooks/socket";
import {
  chatConnection,
  ChatData,
  setChats,
} from "../../app/rooms/rooms.reducer";
import { getContacts } from "../../app/contacts/contacts.thunks";
import styles from "./chats.module.css";

const ChatItem = lazy(() => import("../ChatItem/ChatItem.component"));
const ChatSearchBar = lazy(
  () => import("../SearchBar/ChatSearchBar.component")
);
const List = lazy(() => import("@mui/material/List"));

export default function Chats(props: { chats: ChatData[] }) {
  const { chats } = props;
  const dispatch = useAppDispatch();

  const { getContactsStatus } = useSocket();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      getContactsStatus();
    }
  }, [getContactsStatus]);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const email = JSON.parse(currentUser)!.email;

      if (email) {
        dispatch(getContacts(email));
      }
    }
  }, [dispatch]);

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
              <ChatItem chatdata={chat} />
            </Link>
          );
        })}
      </List>
    </div>
  );
}
