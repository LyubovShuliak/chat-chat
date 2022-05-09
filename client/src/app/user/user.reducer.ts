import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { checkAccesToken, logIn, signUpUser } from "./user.thunks";

interface Log {
  logStatus: boolean;
  isLoading: boolean;
  errorMesssage: String;
  token: String;
}

const initialState: Log = {
  logStatus: false,
  token: "",
  errorMesssage: "",
  isLoading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errorMesssage = action.payload.error;
        state.isLoading = false;
      } else {
        localStorage.setItem("access", action.payload.token);
        state.errorMesssage = "";
        state.token = action.payload.token;
        state.logStatus = true;
        state.isLoading = false;
      }
    });
    builder.addCase(logIn.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errorMesssage = action.payload.error;
        state.isLoading = false;
      } else {
        localStorage.setItem("access", action.payload.token);
        state.token = action.payload.token;
        state.logStatus = true;
        state.errorMesssage = "";
        state.isLoading = false;
      }
    });
    builder.addCase(checkAccesToken.fulfilled, (state, action) => {
      if (action.payload.error) {
        console.log(action.payload.error);

        state.errorMesssage = "Session is ended. You must log in again.";
        state.isLoading = false;
      } else {
        localStorage.setItem("access", action.payload.token);
        state.token = action.payload.token;
        state.logStatus = true;
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
    builder.addCase(checkAccesToken.pending, (state, action) => {
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
export const error = (state: RootState) => state.userReducer.errorMesssage;
export const token = (state: RootState) => state.userReducer.token;

export const { reducer: userReducer } = usersSlice;
