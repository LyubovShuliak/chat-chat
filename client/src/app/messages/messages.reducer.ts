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
    sendingMessage: (state, action: PayloadAction<{ message: string }>) => {
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
});

export const { sendingMessage, deletingMessage } = messagesSlice.actions;

export const messages = (state: RootState) => state.messages;

export const { reducer: messageReducer } = messagesSlice;
