import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./contacts.reducer";

const API_URL = "http://localhost:3050/api/contacts";

const getAllUsers = createAsyncThunk("users/all", async () => {
  const response = await fetch(`${API_URL}`);

  return response.json();
});
const getContacts = createAsyncThunk("users/contacts", async (data: User) => {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((data) => console.log(data));
});
const addContact = createAsyncThunk(
  "users/add",
  async (data: { user: User; email: string }) => {
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

export { getAllUsers, addContact };
