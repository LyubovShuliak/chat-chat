import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { checkAccesToken, logIn, signUpUser, addAvatar } from "./user.thunks";

interface Log {
  logStatus: boolean;
  isLoading: boolean;
  errorMesssage: string;
  token: string;
  avatar: string;
  user: {
    email: string;
    userName: string;
    id: string;
  };
}

const initialState: Log = {
  logStatus: false,
  token: "",
  errorMesssage: "",
  isLoading: false,
  avatar: "",
  user: {
    email: "",
    userName: "",
    id: "",
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    signOutUser: (state) => {
      state.logStatus = false;
      state.errorMesssage = "";
      state.token = "";
      state.isLoading = false;
      delete localStorage.access;
      delete localStorage.user;
    },
    checkIsLoged: (state) => {
      const token = localStorage.getItem("access");
      const user = localStorage.getItem("user");

      if (!token && !user) {
        state.logStatus = false;
        state.errorMesssage = "";
        state.token = "";
        state.isLoading = false;
      } else {
        state.logStatus = true;
        state.errorMesssage = "";
        state.token = "";
        state.isLoading = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errorMesssage = action.payload.error;
        state.isLoading = false;
      } else if (action.payload.token) {
        localStorage.setItem("access", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.errorMesssage = "";
        state.token = action.payload.token;
        state.user = action.payload.user;
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
        localStorage.setItem("user", JSON.stringify(action.payload.user));

        state.user = action.payload.user;

        state.token = action.payload.token;
        state.logStatus = true;
        state.errorMesssage = "";
        state.isLoading = false;
      }
    });
    builder.addCase(checkAccesToken.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errorMesssage = "Session is ended. You must log in again.";
        state.isLoading = false;
      } else {
        localStorage.setItem("user", JSON.stringify(action.payload.user));

        state.token = action.payload.token;
        state.user = action.payload.user;
        state.logStatus = true;
        state.errorMesssage = "";
        state.isLoading = false;
      }
    });
    builder.addCase(addAvatar.fulfilled, (state, action) => {
      state.avatar = action.payload;
    });
    builder.addCase(signUpUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logIn.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(checkAccesToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.errorMesssage = action.error as string;
    });
    builder.addCase(logIn.rejected, (state, action) => {
      state.errorMesssage = action.error as string;
    });
  },
});

export const { signOutUser, checkIsLoged } = usersSlice.actions;

export const isLoading = (state: RootState) => state.user.isLoading;
export const error = (state: RootState) => state.user.errorMesssage;
export const token = (state: RootState) => state.user.token;
export const logStatus = (state: RootState) => state.user.logStatus;

export const { reducer: userReducer } = usersSlice;
