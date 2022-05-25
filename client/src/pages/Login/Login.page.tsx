import React, {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

import { isLoading } from "../../app/user/user.reducer";

import useUserCredentials from "../../hooks/useUserAccessData";
import Spinner from "../../components/spiner/Spiner.component";

import "./Login.css";
const Login = () => {
  const [error, setError] = useState<string>("");

  const isLoaded = useAppSelector(isLoading);

  const { submitLogInForm, isLogged } = useUserCredentials();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      const errorMesssage = await submitLogInForm(e);

      if (errorMesssage) {
        setError(errorMesssage);
      }
    },
    [error, setError, submitLogInForm]
  );
  const { validateToken } = useUserCredentials();

  useEffect(() => {
    validateToken();
  }, []);

  return isLoaded && isLogged ? null : (
    <div className="login_container">
      <form onSubmit={handleSubmit} method="post" className="login_form">
        <Link to="/signup" className="link_back">
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
