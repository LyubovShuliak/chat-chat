import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { logIn, signUpUser } from "./user.thunks";

interface Log {
  logStatus: boolean;

  errorMesssage: String;
}
// First, create the thunk
const initialState: Log = {
  logStatus: false,
  errorMesssage: "",
};

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.logStatus = action.payload;
    });
    builder.addCase(logIn.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errorMesssage = action.payload.error;
      } else {
        state.logStatus = action.payload;
        state.errorMesssage = "";
      }
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      console.log(action.error);
    });
    builder.addCase(logIn.rejected, (state, action) => {
      console.log(action.error);
    });
  },
});

export const isSignedUp = (state: RootState) => state.userReducer.logStatus;

export const { reducer: userReducer } = usersSlice;
