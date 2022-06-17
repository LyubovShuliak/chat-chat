import React from "react";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import styles from "./chatItem.module.css";
import { User } from "../../app/contacts/contacts.reducer";
import { ChatData } from "../../app/rooms/rooms.reducer";

const ChatItem = (props: ChatData) => {
  const { userName, email, id } = props;
  return (
    <>
      <Divider variant="inset" component="li" />
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
    </>
  );
};

export { ChatItem };
