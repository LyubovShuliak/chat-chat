import * as React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import ChatSearchBar from "../SearchBar/ChatSearchBar.component";

import styles from "./chats.module.css";
import { SimpleSlider } from "../Carousel/Carousel.component";

export default function Chats() {
  return (
    <div className={styles.chat_block}>
      <ChatSearchBar />

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
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
                  Sandra Adams
                </Typography>
              </React.Fragment>
            }
            secondary={"Wish I could come, but I'm out of town this…"}
          />
          <div className={styles.missed_messages_viget}>6</div>
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </div>
  );
}
