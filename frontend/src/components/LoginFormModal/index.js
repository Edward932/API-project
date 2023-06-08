import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e, demo) => {
    let login = { credential, password };
    if(demo) login = { credential: 'Demo-lition', password: 'password' };

    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login(login))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id="login-form-div">
      <div id="title-logo-login">
        <h1>Log In</h1>
      </div>
      {errors.credential && (
          <p id="login-errors">{errors.credential}</p>
        )}
      <form id="login-form" onSubmit={handleSubmit}>
        <label className="login-labels">
          Username or Email
          <input
            className="login-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="login-labels">
          Password
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="login-button" type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
      </form>
      <button id='demo-login' onClick={(e) => handleSubmit(e, true)}>Log In as Demo</button>
    </div>
  );
}

export default LoginFormModal;
