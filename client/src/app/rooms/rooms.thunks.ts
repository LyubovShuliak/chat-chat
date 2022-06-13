import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3050/api/chats/";

const getUserChats = createAsyncThunk("get/chats", async (id: string) => {
  const response = await fetch(`${API_URL}?id=${id}`, {
    method: "GET",
  });

  const result = await response.json();

  return result.sessions;
});

export { getUserChats };
