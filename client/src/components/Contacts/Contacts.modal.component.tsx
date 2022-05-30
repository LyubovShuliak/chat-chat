import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import ContactsIcon from "@mui/icons-material/ContactsRounded";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";

import {
  StyledInputBase,
  Search,
  SearchIconWrapper,
} from "../SearchBar/ChatSearchBar.component";
import AllRegisteredUsers from "../AllUsers/AllUsersModal.component";

import useProfileFeatures from "../../hooks/useProfileFeatures";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAllUsers, addContact } from "../../app/contacts/contacts.thunks";
import {
  contacts,
  isLoading,
  allUsers,
  User,
} from "../../app/contacts/contacts.reducer";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ContactsModal() {
  const { handleOpen, handleClose, open, focused } = useProfileFeatures();
  const userContacts = useAppSelector(contacts);

  return (
    <div>
      <Button
        onClick={handleOpen}
        sx={{
          backgroundColor: "transparent",
          color: "black",
          display: "flex",
          flexDirection: "row",
          gap: "15px",
        }}
      >
        <ContactsIcon style={{ color: "#ff4700", pointerEvents: "none" }} />
        Contacts
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
      >
        <Box sx={style}>
          <h1>Contacts</h1>
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
              maxWidth: 360,
              bgcolor: "background.paper",
              height: "600px",
              overflowY: "scroll",
            }}
          >
            {userContacts.map((user: User) => {
              const { id, userName, email } = user;
              return (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={userName}
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText primary={userName} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              );
            })}
          </List>

          <Button
            onClick={handleClose}
            sx={{ float: "left", marginLeft: "40px" }}
          >
            Close
          </Button>

          <AllRegisteredUsers />
        </Box>
      </Modal>
    </div>
  );
}
