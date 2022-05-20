import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllUsers } from "./contacts.thunks";

type Contacts = { contacts: string[] };
const initialState: Contacts = { contacts: [] };

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {});
  },
});

export const { reducer: contactReducer } = contactsSlice;
