import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteContact from "@mui/icons-material/Delete";
import { contacts, User } from "../../app/contacts/contacts.reducer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "@mui/material/Button";
import { addChat, getChats } from "../../app/rooms/rooms.thunks";
import { useSelector } from "react-redux";
import { rooms } from "../../app/rooms/rooms.reducer";
import { useNavigate } from "react-router-dom";

const Contact = (props: { user: User; handleClose: () => void }) => {
  const { userName, email, id } = props.user;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createChat = () => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      dispatch(
        addChat({
          email: JSON.parse(currentUser)!.email,
          chat: props.user,
        })
      );
      props.handleClose();
      navigate(`/${id}`, { replace: true });
    }
  };

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={userName} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText primary={userName} />
        <Button onClick={createChat}>
          <ChatIcon />
        </Button>
      </ListItem>

      <Divider variant="inset" component="li" />
    </>
  );
};

export { Contact };
