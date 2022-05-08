import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { store } from "../app/store";
import { logIn, signUpUser, User } from "../app/user/user.thunks";

function useUserCridentials() {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  async function submitSignupForm(e: FormEvent) {
    e.preventDefault();
    if (e.target) {
      const Form = e.target as HTMLFormElement;
      const data = new FormData(Form);
      const email = data.get("email") as String;
      const userName = data.get("name") as String;
      const password = data.get("password") as String;
      if (email && userName && password) {
        const user: User = {
          email,
          userName,
          password,
        };

        dispatch(signUpUser(user)).then(() => {
          navigate("/chat", { replace: true });
        });
      }

      // TODO: Set success basmeed on response.
    }
  }

  async function submitLogInForm(e: FormEvent) {
    e.preventDefault();
    if (e.target) {
      const Form = e.target as HTMLFormElement;
      const data = new FormData(Form);
      const email = data.get("email") as String;
      const password = data.get("password") as String;
      if (email && password) {
        const user = {
          email,
          password,
        };

        await dispatch(logIn(user));

        if (!store.getState().userReducer.errorMesssage) {
          navigate("/chat", { replace: true });
        }
      }

      // TODO: Set success basmeed on response.
    }
  }
  return {
    submitSignupForm,
    submitLogInForm,
  };
}

export default useUserCridentials;
