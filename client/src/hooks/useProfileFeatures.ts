import React, { ChangeEvent, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "../firebase/firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllUsers, getContacts } from "../app/contacts/contacts.thunks";
import { addAvatar } from "../app/user/user.thunks";

const useProfileFeatures = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState({
    left: false,
  });
  const [focused, setFocused] = useState(false);

  const avatar = useRef<any>(null);

  const focusSearchBar = () => {
    setFocused(!focused);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpenContacts = () => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      dispatch(getContacts(JSON.parse(currentUser).email));
    }

    setOpen(true);
  };
  const handleCloseContacts = () => {
    setOpen(false);
  };

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

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
          case "storage/object-not-found":
            console.log("no image");

            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          dispatch(addAvatar({ email, avatar: downloadURL }));
        });
      }
    );
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
    handleOpenContacts,
    handleCloseContacts,
    handleUploadFile,
    addContact,
    avatar,
    open,
    focused,
    state,
  };
};

export default useProfileFeatures;
