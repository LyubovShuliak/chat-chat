import * as React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import List from "@mui/material/List";

import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import LogoutIcon from "@mui/icons-material/Logout";

import ContactsModal from "../Contacts/Contacts.modal.component";

import useProfileFeatures from "../../hooks/useProfileFeatures";
import useUserCridentials from "../../hooks/useUserAccessData";

export default function Profile() {
  const { toggleDrawer, handleOpen } = useProfileFeatures();
  const { signOut } = useUserCridentials();

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Link
        to="/login"
        onClick={signOut}
        style={{
          color: "red",
          width: "fit-content",

          display: "flex",
          flexDirection: "row",
          placeItems: "center",
          padding: "10px 10px",
          gap: 10,
        }}
      >
        <LogoutIcon />
        Log out
      </Link>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ListItem
          alignItems="flex-start"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Ali Connors"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  shuliak.lyubov@gmail.com
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
      <ContactsModal />
    </Box>
  );
}
