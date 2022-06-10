import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type Message = {
  message: string;
  type: "user" | "responder";
  isRead: boolean;
  id: string;
};

export type SavedMessage = { id: string } & Message;

export type ChatData = {
  avatar: string;
  email: string;
  id: string;
  userName: string;
};

export interface Chat {
  messages: Message;
}
export type Chats = { [key: string]: Chat };

type Contacts = { chats: Chats; isLoading: boolean };
const initialState: Contacts = { chats: {}, isLoading: false };

const roomsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload.messages;
    },
  },
});

export const { setChats } = roomsSlice.actions;

export const rooms = (state: RootState) => state.rooms.chats;

export const isLoading = (state: RootState) => state.rooms.isLoading;

export const { reducer: roomsReducer } = roomsSlice;
