import React, { useState, useContext } from "react";
import AuthService from "../../Services/AuthService";
import Message from "../NotificationMSG";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await AuthService.login(username, password);
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      setUser({
        username: response.data.username,
        email: response.data.email,
        userID: response.data.id,
        role: response.data.roles[0],
      });
      localStorage.setItem(
        "userDetails",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          userID: response.data.id,
          role: response.data.roles[0],
        })
      );
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="container form-container glass-styling">
      <img src={Logo} className="authentication-logo" />
      <h2 className="text-primary m-5">Unifluent</h2>
      <form className="container glass-style" onSubmit={onSubmit}>
        <h4>Sign In</h4>
        <label htmlFor="username" className="sr-only">
          Username:{" "}
        </label>
        <input
          type="text"
          name="username"
          onChange={onChangeUsername}
          className="form-control m-1"
          placeholder="Enter Username"
        />
        <label htmlFor="password" className="sr-only">
          Password:{" "}
        </label>
        <input
          type="password"
          name="password"
          onChange={onChangePassword}
          className="form-control m-1"
          placeholder="Enter Password"
        />
        <div className="d-flex">
          <h6 className="m-1">Need to make an account?</h6>
          <Link className="badge badge-info m-1 " to="/register">
            register
          </Link>
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Log in{" "}
        </button>
        {message ? <Message message={message} /> : null}
      </form>
    </div>
  );
};

export default Login;
