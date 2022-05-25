import React, { ChangeEvent, useRef, useState } from "react";
import { ref, uploadBytes } from "@firebase/storage";
import { storage } from "../firebase/firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllUsers } from "../app/contacts/contacts.thunks";
import { contacts } from "../app/contacts/contacts.reducer";

const useProfileFeatures = () => {
  const [state, setState] = useState({
    left: false,
  });
  const [focused, setFocused] = useState(false);

  const avatar = useRef<any>(null);

  const focusSearchBar = () => {
    setFocused(!focused);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ left: open });
    };
  function previewFile(file: any, email: string) {
    const storageRef = ref(storage, `${email}/avatar.jpg`);

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (avatar.current.src) {
          avatar.current.src = reader.result;
        }
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const handleUploadFile = (
    e: ChangeEvent<HTMLInputElement>,
    email: string
  ) => {
    if (e.target.files) {
      previewFile(e.target.files[0], email);
    }
  };
  const addContact = () => {};
  return {
    toggleDrawer,
    focusSearchBar,
    handleOpen,
    handleClose,
    handleUploadFile,
    addContact,
    avatar,
    open,
    focused,
    state,
  };
};

export default useProfileFeatures;
