import React, { lazy } from "react";
import { ChatData } from "../../app/rooms/rooms.reducer";
import styles from "./chatItem.module.css";

const ListItem = lazy(() => import("@mui/material/ListItem"));
const Divider = lazy(() => import("@mui/material/Divider" as any));
const ListItemText = lazy(() => import("@mui/material/ListItemText"));
const ListItemAvatar = lazy(() => import("@mui/material/ListItemAvatar"));
const Avatar = lazy(() => import("@mui/material/Avatar"));
const Typography = lazy(() => import("@mui/material/Typography" as any));

const ChatItem = (props: { chatdata: ChatData }) => {
  const { userName, email, id } = props.chatdata;
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
          <div className={styles.missed_messages_viget}>{0}</div>
        </ListItem>
      </ul>
    </>
  );
};

export default ChatItem;
