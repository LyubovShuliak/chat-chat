import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { contactReducer } from "./contacts/contacts.reducer";
import { roomsReducer } from "./rooms/rooms.reducer";

import { userReducer } from "./user/user.reducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactReducer,
    rooms: roomsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
