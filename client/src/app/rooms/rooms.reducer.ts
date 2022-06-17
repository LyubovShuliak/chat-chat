import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getUserChats } from "./rooms.thunks";

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
    addChat: (state, action) => {
      state.sessions.push(action.payload);
    },

    setMessagesPerChat: (state, action) => {
      console.log(action.payload);

      state.chats.messages = action.payload;
    },
    sendMessage: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getUserChats.fulfilled, (state, action) => {
      state.sessions = action.payload;
    });
  },
});

export const { setChats, setMessagesPerChat, addChat } = roomsSlice.actions;

export const rooms = (state: RootState) => state.rooms.sessions;
export const chats = (state: RootState) => state.rooms.chats.messages;

export const isLoading = (state: RootState) => state.rooms.isLoading;

export const { reducer: roomsReducer } = roomsSlice;
