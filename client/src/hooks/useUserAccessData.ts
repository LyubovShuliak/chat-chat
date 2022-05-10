import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { store } from "../app/store";
import { error, token } from "../app/user/user.reducer";
import {
  checkAccesToken,
  logIn,
  signUpUser,
  User,
} from "../app/user/user.thunks";

function useUserCridentials() {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const errorMesssage = useAppSelector(error);

  function navigation() {
    navigate("/chat", { replace: true });
  }

  async function validateToken() {
    const token = localStorage.getItem("access");

    if (!token) return navigate("/login", { replace: true });

    await dispatch(checkAccesToken(token));
    if (!errorMesssage) {
      navigate("/chat", { replace: true });
    } else {
      return errorMesssage;
    }
  }

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

        await dispatch(signUpUser(user));

        const errorMesssage = store.getState().user.errorMesssage;

        if (!errorMesssage) {
          navigation();
        } else {
          return errorMesssage;
        }
      }
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

        const errorMesssage = store.getState().user.errorMesssage;

        if (!errorMesssage) {
          navigation();
        } else {
          return errorMesssage;
        }
      }
    }
  }

  function signOut() {
    delete localStorage.access;
  }

  return {
    submitSignupForm,
    submitLogInForm,
    validateToken,
    signOut,
  };
}

export default useUserCridentials;
