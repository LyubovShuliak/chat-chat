import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logIn, signUpUser } from "./user.thunks";

interface Log {
  logStatus: boolean;
  isLoading: boolean;
  errorMesssage: String;
}

const initialState: Log = {
  logStatus: false,
  errorMesssage: "",
  isLoading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.logStatus = action.payload;
      state.isLoading = false;
    });
    builder.addCase(logIn.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errorMesssage = action.payload.error;
        state.isLoading = false;
      } else {
        state.logStatus = action.payload;
        state.errorMesssage = "";
        state.isLoading = false;
      }
    });
    builder.addCase(signUpUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(logIn.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.errorMesssage = action.error as String;
    });
    builder.addCase(logIn.rejected, (state, action) => {
      state.errorMesssage = action.error as String;
    });
  },
});

export const isSignedUp = (state: RootState) => state.userReducer.logStatus;
export const isLoading = (state: RootState) => state.userReducer.isLoading;

export const { reducer: userReducer } = usersSlice;
