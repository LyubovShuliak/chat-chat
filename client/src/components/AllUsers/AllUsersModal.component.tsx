import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import ContactsIcon from "@mui/icons-material/ContactsRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";

import useProfileFeatures from "../../hooks/useProfileFeatures";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAllUsers, addContact } from "../../app/contacts/contacts.thunks";
import {
  contacts,
  isLoading,
  allUsers,
  User,
} from "../../app/contacts/contacts.reducer";

import {
  StyledInputBase,
  Search,
  SearchIconWrapper,
} from "../SearchBar/ChatSearchBar.component";

import styles from "./profile.module.css";
import CustomButton from "../Button/Button.component";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  padding: "20px",
};

export default function AllRegisteredUsers() {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const users = useAppSelector(allUsers);

  const loading = useAppSelector(isLoading);

  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    const currentUser = localStorage.getItem("user") || "";
    const email = JSON.parse(currentUser).email;
    dispatch(getAllUsers(email));
    setOpen(true);
  };

  return (
    <div>
      <Button onClick={handleOpen}>ADD CONTACT</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
        hideBackdrop={true}
      >
        <Box sx={style}>
          <h1>Users</h1>
          <Search
            sx={{
              flexGrow: 1,
              backgroundColor: !focused ? "#deedf2" : "transparent",
              border: focused ? "2px solid lightblue" : "none",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon sx={{ fill: "grey" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              height: "60vh",
              overflowY: "scroll",
              padding: "30px",
              boxSizing: "border-box",
            }}
          >
            {users.length && !loading
              ? users.map((user) => {
                  const { userName, email, id } = user;

                  return (
                    <ListItem key={id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={userName}></Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={userName} />
                      <CustomButton user={user} />
                    </ListItem>
                  );
                })
              : null}
          </List>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
