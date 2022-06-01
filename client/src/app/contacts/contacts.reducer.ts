import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAllUsers, addContact, getContacts } from "./contacts.thunks";

export type User = {
  userName: string;
  email: string;
  id: string;
};

type Contacts = { contacts: User[]; isLoading: boolean; allUsers: User[] };
const initialState: Contacts = { contacts: [], allUsers: [], isLoading: false };

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.allUsers = action.payload.filter((user: User) => {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          return user.email !== JSON.parse(currentUser).email;
        }
      });
      state.isLoading = false;
    });
    builder.addCase(getAllUsers.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addContact.fulfilled, (state, action) => {
      console.log(action.payload);
    });
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contacts = action.payload;
    });
  },
});

export const contacts = (state: RootState) => state.contacts.contacts;
export const allUsers = (state: RootState) => state.contacts.allUsers;

export const isLoading = (state: RootState) => state.contacts.isLoading;

export const { reducer: contactReducer } = contactsSlice;
