import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { v4 as uuid4 } from "uuid";

export interface Message {
  message: String;
  messageType: "user" | "responder";
  id: String;
}

type Rooms = {
  [key: string]: Message[];
};

const initialState: Rooms = { test: [] };

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    sendingMessage: (state, action: PayloadAction<{ message: String }>) => {
      state.test.push({
        message: action.payload.message,
        id: uuid4(),
        messageType: "user",
      });
    },
    deletingMessage: (state, action) => {
      state.test = state.test.filter((mes) => mes.id === action.payload);
    },
  },
  extraReducers: (builder) => {},
});

export const { sendingMessage, deletingMessage } = messagesSlice.actions;

export const messages = (state: RootState) => state.messages;

export const { reducer: messageReducer } = messagesSlice;
