import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3050/contacts";
export interface User {
  userName?: string;
  password: string;
  email?: string;
}

const getAllUsers = createAsyncThunk("signup", async (data: User) => {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result;
});

export { getAllUsers };
