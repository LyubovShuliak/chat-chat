import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import useUserCridentials from "../../hooks/useUserData";

import "./SignUp.css";
const SignUp = () => {
  const { submitSignupForm } = useUserCridentials();

  return (
    <form
      className="signup_form"
      method="post"
      onSubmit={(e) => {
        submitSignupForm(e);
      }}
    >
      <h1 className="greating">Create account</h1>
      <div className="email">
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" />
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
    </form>
  );
};

export default SignUp;
