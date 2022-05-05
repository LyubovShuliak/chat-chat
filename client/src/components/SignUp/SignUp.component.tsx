import React from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";
const SignUp = () => {
  return (
    <form className="signup_form" method="post">
      <h1 className="greating">Create account</h1>
      <div className="email">
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" />
      </div>
      <div className="password">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <div className="company">
        <label htmlFor="password">Company or organisation name</label>
        <input id="company" name="company" type="text" />
      </div>

      <button className="signup_button">Sign up</button>
      <Link to="/login"> Already have an account? Sign in</Link>
    </form>
  );
};

export default SignUp;
