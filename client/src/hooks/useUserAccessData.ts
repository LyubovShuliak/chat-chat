import { FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { store } from "../app/store";
import { error, logStatus, signOutUser } from "../app/user/user.reducer";
import {
  checkAccesToken,
  logIn,
  signUpUser,
  User,
} from "../app/user/user.thunks";
import { socketApi } from "./socketConfg";

function useUserCridentials() {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  const errorMesssage = useAppSelector(error);
  const isLogged = useAppSelector(logStatus);

  function navigation() {
    navigate("/", { replace: true });
  }

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("access");

    if (!token) return;

    await dispatch(checkAccesToken(token));

    if (store.getState().user.logStatus) {
      socketApi.connect();
      return navigate("/", { replace: true });
    } else {
      socketApi.disconnect();
      return navigate("/login", { replace: true });
    }
  }, []);

  async function submitSignupForm(e: FormEvent) {
    e.preventDefault();
    if (e.target) {
      const Form = e.target as HTMLFormElement;
      const data = new FormData(Form);
      const email = data.get("email") as string;
      const userName = data.get("name") as string;
      const password = data.get("password") as string;
      if (email && userName && password) {
        const user: User = {
          email,
          userName,
          password,
        };

        await dispatch(signUpUser(user));

        const errorMesssage = store.getState().user.errorMesssage;

        if (!errorMesssage) {
          socketApi.connect();
          navigation();
        } else {
          socketApi.disconnect();
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
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      if (email && password) {
        const user = {
          email,
          password,
        };

        await dispatch(logIn(user));

        const errorMesssage = store.getState().user.errorMesssage;

        if (!errorMesssage) {
          socketApi.connect();
          navigation();
          console.log(store.getState().user.user);
        } else {
          return errorMesssage;
        }
      }
    }
  }

  function signOut() {
    dispatch(signOutUser());
    socketApi.disconnect();
  }

  return {
    submitSignupForm,
    submitLogInForm,
    validateToken,
    signOut,
    dispatch,
    isLogged,
  };
}

export default useUserCridentials;
