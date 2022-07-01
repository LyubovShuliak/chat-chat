import React, { lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ChatData,
  chats,
  setMessagesRead,
} from "../../app/rooms/rooms.reducer";
import styles from "./chatItem.module.css";

const ListItem = lazy(() => import("@mui/material/ListItem"));
const Divider = lazy(() => import("@mui/material/Divider" as any));
const ListItemText = lazy(() => import("@mui/material/ListItemText"));
const ListItemAvatar = lazy(() => import("@mui/material/ListItemAvatar"));
const Avatar = lazy(() => import("@mui/material/Avatar"));
const Typography = lazy(() => import("@mui/material/Typography" as any));

const ChatItem = (props: { chatdata: ChatData }) => {
  const param = useParams();
  const { userName, email, id } = props.chatdata;
  const messagesPerUser = useAppSelector(chats);
  const dispatch = useAppDispatch();

  const [viget, setViget] = useState<number>(0);
  useEffect(() => {
    messagesPerUser[id]
      ? setViget(messagesPerUser[id][1].filter((el) => !el.isRead).length)
      : setViget(viget);
  }, []);
  useEffect(() => {
    if (param.id === id) {
      setViget(0);
      if (messagesPerUser[id]) {
        dispatch(setMessagesRead(param.id));
      }
    } else {
      if (messagesPerUser[id])
        setViget(messagesPerUser[id][1].filter((el) => !el.isRead).length);
    }
  }, []);

  return (
    <>
      <Divider variant="inset" component="li" />
      <ul>
        <ListItem alignItems="flex-start" style={{ boxSizing: "border-box" }}>
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  sx={{ display: "block" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {userName}
                </Typography>
              </React.Fragment>
            }
            secondary={""}
          />

          {viget && <div className={styles.missed_messages_viget}>{viget}</div>}
        </ListItem>
      </ul>
    </>
  );
};

export default ChatItem;
