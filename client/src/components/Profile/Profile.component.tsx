import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
} from "react";
import { Link } from "react-router-dom";

import useProfileFeatures from "../../hooks/useProfileFeatures";
import useUserCredentials from "../../hooks/useUserAccessData";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import profile from "./profile.module.css";

const ContactsModal = lazy(
  () => import("../modals_components/Contacts/Contacts.modal.component")
);
const InputLabel = lazy(() => import("@mui/material/InputLabel"));
const LogoutIcon = lazy(() => import("@mui/icons-material/Logout"));
const Typography = lazy(() => import("@mui/material/Typography" as any));
const Input = lazy(() => import("@mui/material/Input"));
const AddAPhotoIcon = lazy(() => import("@mui/icons-material/AddAPhoto"));
const Avatar = lazy(() => import("@mui/material/Avatar"));
const ListItemAvatar = lazy(() => import("@mui/material/ListItemAvatar"));
const ListItemText = lazy(() => import("@mui/material/ListItemText"));
const ListItem = lazy(() => import("@mui/material/ListItem"));
const List = lazy(() => import("@mui/material/List"));
const Box = lazy(() => import("@mui/material/Box"));

export default function Profile() {
  const [changeAvatar, setAvatar] = useState(false);
  const { toggleDrawer, handleUploadFile, avatar } = useProfileFeatures();
  const { signOut, user, setUser } = useUserCredentials();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  useEffect(() => {
    const storage = getStorage();
    if (user.email) {
      const pathReference = ref(storage, `${user.email}/avatar.jpg`);

      getDownloadURL(pathReference)
        .catch((error) => {
          if (error) {
            console.error("Upload failed", error);
          }
        })
        .then((url) => {
          avatar.current.src = url;
        });
    }
  }, [user]);
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
          <ListItemAvatar sx={{ position: "relative", paddingBottom: "60px" }}>
            <Avatar
              sx={{ width: 100, height: 100, position: "relative" }}
              onMouseOver={() => {
                setAvatar(true);
              }}
              onMouseLeave={() => setAvatar(false)}
            >
              <img src="" alt="" ref={avatar} />
              <InputLabel
                className={profile.changeAvatarButton}
                sx={{
                  // backgroundColor: "black",
                  zIndex: 1,
                  position: "absolute",
                  bottom: 0,
                  height: changeAvatar ? "40%" : "0",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  placeItems: "center",
                  placeContent: "center",
                  transition: "height .4s ease-in-out .2s ",
                  cursor: "pointer",
                }}
              >
                <AddAPhotoIcon
                  sx={{
                    height: "60%",
                    color: "white",
                    backgroundColor: "#7f7f7f4a",
                    width: "100%",
                    padding: "20% 0",
                  }}
                />
                <Input
                  sx={{ display: "none" }}
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleUploadFile(e, user.email)
                  }
                />
              </InputLabel>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${user.userName} `}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {user.email}
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
