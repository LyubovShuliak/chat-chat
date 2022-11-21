import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3050/api";
export interface User {
  userName?: string;
  password: string;
  email?: string;
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
  console.log(result);

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
const checkAccesToken = createAsyncThunk("token", async (token: string) => {
  const response = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const result = await response.json();

  return result;
});
const addAvatar = createAsyncThunk("user/avatar", async (data: any) => {
  const response = await fetch(`${API_URL}/avatar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result;
});

export { signUpUser, logIn, checkAccesToken, addAvatar };
