import React, { FormEvent, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import useUserCridentials from "../../hooks/useUserData";

import "./Login.css";
const Login = () => {
  const [error, setError] = useState<String>("");
  const { submitLogInForm } = useUserCridentials();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      const errorMessage = await submitLogInForm(e);

      if (errorMessage) {
        setError(errorMessage);
      }
    },
    [error, setError, submitLogInForm]
  );

  return (
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
  );
};

export default Login;
