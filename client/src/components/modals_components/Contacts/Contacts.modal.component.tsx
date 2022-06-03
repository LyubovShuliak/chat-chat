import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import ContactsIcon from "@mui/icons-material/ContactsRounded";

import List from "@mui/material/List";

import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";

import {
  StyledInputBase,
  Search,
  SearchIconWrapper,
} from "../../SearchBar/ChatSearchBar.component";
import AllRegisteredUsers from "../AllUsers/AllUsersModal.component";

import useProfileFeatures from "../../../hooks/useProfileFeatures";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  getAllUsers,
  addContact,
  getContacts,
} from "../../../app/contacts/contacts.thunks";

import {
  allUsers,
  contacts,
  isLoading,
  User,
} from "../../../app/contacts/contacts.reducer";
import { Contact } from "../Contact/Contact.component";
import { useEffect, useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export default function ContactsModal() {
  const { handleOpenContacts, handleCloseContacts, open, focused } =
    useProfileFeatures();
  const userContacts = useAppSelector(contacts);
  const dispatch = useAppDispatch();
  const users = useAppSelector(allUsers);

  const loading = useAppSelector(isLoading);

  const [openAllUsers, setOpenAllUsers] = useState(false);
  const handleClose = () => {
    const currentUser = localStorage.getItem("user") || "";
    const email = JSON.parse(currentUser).email;
    dispatch(getContacts(email));
    setOpenAllUsers(false);
  };
  const handleOpen = () => {
    const currentUser = localStorage.getItem("user") || "";
    const email = JSON.parse(currentUser).email;
    dispatch(getAllUsers(email));
    setOpenAllUsers(true);
  };
  useEffect(() => {
    console.log("userContacts", userContacts);
  }, [userContacts]);

  return (
    <div>
      <Button
        onClick={handleOpenContacts}
        sx={{
          backgroundColor: "transparent",
          color: "black",
          display: "flex",
          flexDirection: "row",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <ContactsIcon style={{ color: "#ff4700", pointerEvents: "none" }} />
        Contacts
      </Button>

      <Modal
        open={open}
        onClose={handleCloseContacts}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
      >
        <Box sx={[style, { opacity: openAllUsers ? 0 : 1 }]}>
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
              bgcolor: "background.paper",
              height: "600px",
              overflowY: "scroll",
              scrollbarWidth: "thin",
              scrollbarColor: "transparent",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {userContacts.map((user: User) => {
              return (
                <Contact
                  key={user.id}
                  handleClose={handleCloseContacts}
                  user={user}
                />
              );
            })}
          </List>

          <Grid
            container
            spacing={2}
            flexDirection={"row"}
            sx={{ justifyContent: "space-between" }}
          >
            <Grid item xs={4}>
              <Button onClick={handleCloseContacts}>Close</Button>
            </Grid>
            <Grid item xs={4}>
              <AllRegisteredUsers
                openAllUsers={openAllUsers}
                handleClose={handleClose}
                handleOpen={handleOpen}
                users={users}
                loading={loading}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
