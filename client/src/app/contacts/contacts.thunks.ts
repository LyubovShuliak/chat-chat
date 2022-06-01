import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./contacts.reducer";

const API_URL = "http://localhost:3050/api/connections";

const getAllUsers = createAsyncThunk("users/all", async (email: string) => {
  const response = await fetch(`${API_URL}/?email=${email}`);
  const data = await response.json();
  return data;
});
const getContacts = createAsyncThunk(
  "users/contacts",
  async (email: string) => {
    const response = await fetch(`${API_URL}/friends/?email=${email}`, {
      method: "GET",
    });

    const result = await response.json();

    return result;
  }
);
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

export { getAllUsers, addContact, getContacts };
