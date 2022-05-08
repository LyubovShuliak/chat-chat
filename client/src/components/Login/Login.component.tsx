import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

import { isLoading } from "../../app/user/user.reducer";

import useUserCridentials from "../../hooks/useUserData";
import Spinner from "../spiner/Spiner.component";

import "./Login.css";
const Login = () => {
  const [error, setError] = useState<String>("");

  const isLoaded = useAppSelector(isLoading);

  const { submitLogInForm } = useUserCridentials();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      const errorMesssage = await submitLogInForm(e);

      if (errorMesssage) {
        setError(errorMesssage);
      }
    },
    [error, setError, submitLogInForm]
  );

  return (
    <div className="login_container">
      <form onSubmit={handleSubmit} method="post" className="login_form">
        <Link to="/" className="link_back">
          Back to signup page
        </Link>
        <p className="error"> {error}</p>

        <div className="email">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
        </div>
        <div className="stay_logged">
          <label className="container">
            Stay logged in
            <input className="check" type="checkbox" />
            <span className="checkmark"></span>
          </label>
        </div>
        <button className="login_button">Log in</button>
      </form>
      {isLoaded && <Spinner />}
    </div>
  );
};

export default Login;
