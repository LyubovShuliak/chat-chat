import React, { useState } from "react";
import Button from "@mui/material/Button";
import SuccessfullyAdded from "@mui/icons-material/CheckCircleRounded";

import { User } from "../../app/contacts/contacts.reducer";
import { addContact } from "../../app/contacts/contacts.thunks";
import { useAppDispatch } from "../../app/hooks";

const CustomButton = (props: { user: User }) => {
  const { user } = props;
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();

  const addNewContact = (contact: User) => {
    const currentUser: string = localStorage.getItem("user") || "";
    const email = JSON.parse(currentUser).email;

    const data = { user: contact, email };
    dispatch(addContact(data));
    setSuccess(true);
  };
  return (
    <Button
      onClick={() => {
        addNewContact(user);
      }}
      disabled={success}
      color={!success ? "primary" : "info"}
    >
      {!success ? "ADD CONTACT" : <SuccessfullyAdded color="success" />}
    </Button>
  );
};

export default CustomButton;
