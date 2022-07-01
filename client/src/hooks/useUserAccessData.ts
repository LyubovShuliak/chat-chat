import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../app/actions";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { store } from "../app/store";
import { isLoading, logStatus } from "../app/user/user.reducer";
import {
  checkAccesToken,
  logIn,
  signUpUser,
  User,
} from "../app/user/user.thunks";
import { socketApi, useSocket } from "./socket";

function useUserCredentials() {
  const { connect } = useSocket();
  const [user, setUser] = useState<{
    email: string;
    userName: string;
    id: string;
  }>({
    email: "",
    userName: "",
    id: "",
  });

  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  const isLogged = useAppSelector(logStatus);
  const loading = useAppSelector(isLoading);

  function navigation(currentUser: {
    email: string;
    userName: string;
    id: string;
  }) {
    if (currentUser) {
      connect(currentUser.id);
    }

    navigate("/", { replace: true, state: currentUser });
  }

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("access");

    if (!token) return;

    await dispatch(checkAccesToken(token));

    if (store.getState().user.logStatus) {
      return navigation(store.getState().user.user);
    } else {
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
          navigation(store.getState().user.user);
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
          navigation(store.getState().user.user);
        } else {
          return errorMesssage;
        }
      }
    }
  }

  function signOut() {
    // dispatch(signOutUser());
    dispatch(logout());
    socketApi.removeAllListeners();
    socketApi.offAny();
    socketApi.disconnect();
  }

  return {
    submitSignupForm,
    submitLogInForm,
    validateToken,
    signOut,
    dispatch,
    user,
    setUser,
    isLogged,
    loading,
  };
}

export default useUserCredentials;
