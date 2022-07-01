import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getUserChats } from "./rooms.thunks";
import { logout } from "../actions";

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
export type Pagination = { [key: string]: number };
export type UnReadMessages = { [key: string]: number };
export type Chats = {
  messages: {
    [key: string]: { [key: number]: Message[] };
  };
  pagination: Pagination;
  unReadMessages: UnReadMessages;
};

type Contacts = {
  chats: Chats;
  isLoading: boolean;
  sessions: ChatData[];
  currentChat: ChatData | null;
};
const initialState: Contacts = {
  chats: { messages: {}, pagination: {}, unReadMessages: {} },
  isLoading: false,
  sessions: [],
  currentChat: null,
};

const roomsSlice = createSlice({
  name: "rooms",
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
      for (const key in action.payload) {
        state.chats.messages[key] = Object.assign(
          action.payload[key],
          state.chats.messages[key] ? state.chats.messages[key] : {}
        );

        for (const indexKey in action.payload[key]) {
          state.chats.pagination[key] = Number(indexKey);
        }
      }
    },
    setMessagesRead: (state, action) => {
      const readMessages = state.chats.messages[action.payload][1].map(
        (el) => ({
          ...el,
          isRead: true,
        })
      );
      state.chats.messages[action.payload][1] = readMessages;
    },

    sendMessage: (state, action) => {
      if (!state.chats.messages[action.payload.to]) {
        state.chats.messages[action.payload.to] = { 1: [] };
      }
      state.chats.messages[action.payload.to][1] = [
        action.payload,
        ...state.chats.messages[action.payload.to][1],
      ];
    },
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
    builder.addCase(logout, () => initialState);
  },
});

export const {
  sendMessage,
  setChats,
  setMessagesPerChat,
  addChat,
  setCurrentChat,
  chatConnection,
  chatDisconnection,
  setMessagesRead,
} = roomsSlice.actions;

export const rooms = (state: RootState) => state.rooms.sessions;
export const chats = (state: RootState) => state.rooms.chats.messages;

export const pagination = (state: RootState) => state.rooms.chats.pagination;

export const currentChat = (state: RootState) => state.rooms.currentChat;

export const isLoading = (state: RootState) => state.rooms.isLoading;

export const { reducer: roomsReducer } = roomsSlice;
