import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type Message = {
  message: string;
  type: "user" | "responder";
  isRead: boolean;
  id: string;
  time: string;
};

export type SavedMessage = { id: string } & Message;

export type ChatData = {
  avatar: string;
  email: string;
  id: string;
  userName: string;
};

export type Chats = { messages: { [key: string]: Message[] } };

type Contacts = { chats: Chats; isLoading: boolean; sessions: ChatData[] };
const initialState: Contacts = {
  chats: { messages: {} },
  isLoading: false,
  sessions: [],
};

const roomsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.sessions = action.payload;
    },
    setMessagesPerChat: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const { setChats, setMessagesPerChat } = roomsSlice.actions;

export const rooms = (state: RootState) => state.rooms.sessions;
export const chats = (state: RootState) => state.rooms.chats;

export const isLoading = (state: RootState) => state.rooms.isLoading;

export const { reducer: roomsReducer } = roomsSlice;
