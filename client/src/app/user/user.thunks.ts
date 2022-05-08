import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3050/api";
export interface User {
  userName?: String;
  password: String;
  email?: String;
}

const signUpUser = createAsyncThunk("signup", async (data: User) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result;
});
const logIn = createAsyncThunk("login", async (data: User) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result;
});

export { signUpUser, logIn };
