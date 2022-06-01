import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../messages/messages.reducer";
import { RootState } from "../store";
import { addChat, getChats, deleteChat } from "./rooms.thunks";

export type User = {
  userName: string;
  email: string;
  id: string;
};

export interface Chat {
  chatData: User;
  messages: Message;
}
export type Chats = [string, Chat];

type Contacts = { chats: Chats[]; isLoading: boolean };
const initialState: Contacts = { chats: [], isLoading: false };

const roomsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.chats = action.payload;

      state.isLoading = false;
    });
    builder.addCase(getChats.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addChat.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.isLoading = false;
    });
    builder.addCase(addChat.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteChat.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteChat.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const rooms = (state: RootState) => state.rooms.chats;

export const isLoading = (state: RootState) => state.rooms.isLoading;

export const { reducer: roomsReducer } = roomsSlice;
