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
  connected: boolean;
};

export type Chats = { messages: { [key: string]: Message[] } };

type Contacts = {
  chats: Chats;
  isLoading: boolean;
  sessions: ChatData[];
  currentChat: ChatData | null;
};
const initialState: Contacts = {
  chats: { messages: {} },
  isLoading: false,
  sessions: [],
  currentChat: null,
};

const roomsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.sessions = action.payload;
    },
    addChat: (state, action) => {
      if (state.sessions.find((chat) => chat.id === action.payload.id)) {
        return;
      }
      state.sessions.push(action.payload);
    },

    setMessagesPerChat: (state, action) => {
      state.chats.messages = action.payload;
    },

    sendMessage: (state, action) => {},
    chatConnection: (state, action) => {
      state.sessions = state.sessions.map((u) =>
        u.id === action.payload ? { ...u, connected: true } : u
      );
      if (state.currentChat && state.currentChat.id === action.payload) {
        state.currentChat.connected = true;
      }
    },
    chatDisconnection: (state, action) => {
      state.sessions = state.sessions.map((u) =>
        u.id === action.payload ? { ...u, connected: false } : u
      );
      if (state.currentChat && state.currentChat.id === action.payload) {
        state.currentChat.connected = false;
      }
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserChats.fulfilled, (state, action) => {
      state.sessions = action.payload.map((user: ChatData) => ({
        ...user,
        connected: false,
      }));
    });
  },
});

export const {
  setChats,
  setMessagesPerChat,
  addChat,
  setCurrentChat,
  chatConnection,
  chatDisconnection,
} = roomsSlice.actions;

export const rooms = (state: RootState) => state.rooms.sessions;
export const chats = (state: RootState) => state.rooms.chats.messages;
export const currentChat = (state: RootState) => state.rooms.currentChat;

export const isLoading = (state: RootState) => state.rooms.isLoading;

export const { reducer: roomsReducer } = roomsSlice;
