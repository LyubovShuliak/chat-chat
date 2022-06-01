import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./rooms.reducer";

const API_URL = "http://localhost:3050/api/rooms";

const getChats = createAsyncThunk("chats/all", async (email: string) => {
  const response = await fetch(`${API_URL}/?email=${email}`, {
    method: "GET",
  });

  const result = await response.json();

  return result;
});
const addChat = createAsyncThunk(
  "chats/add",
  async (data: { chat: User; email: string }) => {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  }
);
const deleteChat = createAsyncThunk(
  "chats/delete",
  async (data: { user: User; email: string }) => {
    const response = await fetch(`${API_URL}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  }
);

export { getChats, addChat, deleteChat };
