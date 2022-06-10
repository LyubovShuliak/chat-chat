import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

import useUserCredentials from "../../hooks/useUserAccessData";

import "./SignUp.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { checkIsLoged, isLoading } from "../../app/user/user.reducer";
import Spinner from "../../components/spiner/Spiner.component";
import { signUpUser } from "../../app/user/user.thunks";
const SignUp = () => {
  const [error, setError] = useState<string>("");
  const isLoaded = useAppSelector(isLoading);

  const { isLogged, submitSignupForm, validateToken } = useUserCredentials();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      const errorMesssage = await submitSignupForm(e);

      if (errorMesssage) {
        setError(errorMesssage);
      }
    },
    [error, setError, submitSignupForm]
  );

  useLayoutEffect(() => {
    validateToken();
  }, []);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const array = ["sender", "receiver", "another"];

    array.forEach((item) => {
      const newUser = {
        email: `${item}@gmail.com`,
        userName: `${item}`,
        password: `${item}123`,
      };
      dispatch(signUpUser(newUser));
    });
  }, []);

  return isLogged && !isLoaded ? null : (
    <form className="signup_form" method="post" onSubmit={handleSubmit}>
      <h1 className="greating">Create account</h1>
      <Link
        to="/login"
        style={{
          margin: "auto",
          textDecoration: "none",
          color: "red",
          marginTop: "20px",
          fontFamily: "var( --light_font)",
          fontSize: "16px",
        }}
      >
        {error}
      </Link>
      <div className="email">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          className={`${error && "email_error"}`}
        />
      </div>
      <div className="password">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <div className="name">
        <label htmlFor="password"> Name</label>
        <input id="name" name="name" type="text" />
      </div>

      <button className="signup_button">Sign up</button>

      <Link
        to="/login"
        style={{
          margin: "auto",
          textDecoration: "none",
          color: "var(--link_color)",
          marginTop: "20px",
          fontFamily: "var( --light_font)",
        }}
      >
        Already have an account? <span>Sign in.</span>
      </Link>
      {isLoaded && <Spinner />}
    </form>
  );
};

export default SignUp;
