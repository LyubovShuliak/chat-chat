import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { v4 as uuid4 } from "uuid";
import { Message } from "@mui/icons-material";

export type Message = {
  message: string;
  messageType: "user" | "responder";
  id: string;
};

type Rooms = {
  [key: string]: Message[];
};

const initialState: Rooms = {
  test: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    sendingMessage: (state, action) => {
      state = { ...state, ...action.payload };
    },
    deletingMessage: (state, action) => {
      state.test = state.test.filter((mes) => mes.id === action.payload);
    },
  },
});

export const { sendingMessage, deletingMessage } = messagesSlice.actions;

export const messages = (state: RootState) => state.messages;

export const { reducer: messageReducer } = messagesSlice;
