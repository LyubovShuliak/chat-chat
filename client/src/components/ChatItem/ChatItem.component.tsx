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

const ChatItem = (props: { chatdata: ChatData; viget: number }) => {
  const param = useParams();
  const { userName, email, id } = props.chatdata;
  const { viget } = props;
  const messagesPerUser = useAppSelector(chats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (param.id === id) {
      if (messagesPerUser[id]) {
        dispatch(setMessagesRead(param.id));
      }
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

          {viget > 0 ? (
            <div className={styles.missed_messages_viget}>{viget}</div>
          ) : null}
        </ListItem>
      </ul>
    </>
  );
};

export default ChatItem;
