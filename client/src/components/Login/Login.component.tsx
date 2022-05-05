import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";
const Login = () => {
  return (
    <form action="/" method="post" className="login_form">
      <Link to="/"> Back to signup page</Link>
      <h1 className="greating">Welcome</h1>
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
