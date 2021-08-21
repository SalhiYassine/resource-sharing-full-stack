import React, { useState, useContext, useEffect } from "react";
import * as fa from "react-icons/fa";
import {
  Navbar,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";

import { AuthContext } from "../../Context/AuthContext";
import AuthService from "../../Services/AuthService";
import { ThemeContext } from "../../Context/ThemeContext";
import { ProfilePictureContext } from "../../Context/ProfilePictureContext";

import axios from "axios";
import authHeader from "../../Services/authHeader";

const Topbar = ({ toggleSidebar }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { isLight, setIsLight } = useContext(ThemeContext);
  const { profilePicture, setProfilePicture } = useContext(
    ProfilePictureContext
  );

  const toggleTopbar = () => {
    setTopbarOpen(!topbarIsOpen);
  };

  const onClickToggleThemeHandler = () => {
    setIsLight(!isLight);
  };

  const onClickLogoutHandler = (props) => {
    AuthService.logout();
    window.location.reload(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (
        isAuthenticated === true &&
        JSON.parse(localStorage.getItem("token")) !== null
      ) {
        axios({
          method: "get",
          url: "http://localhost:8080/user/" + user.userID,
          headers: authHeader(),
        }).then((user) => {
          if (user.data.profile !== null) {
            axios({
              method: "get",
              url:
                "http://localhost:8080/profile-picture/" +
                user.data.profile.profile_id,
              responseType: "blob",
              headers: authHeader(),
            }).then((picture) => {
              setProfilePicture(picture.data);
            });
          }
        });
      }
    }, 100);
  }, [isAuthenticated]);

  return (
    <Navbar
      className={
        isAuthenticated
          ? "navbar p-3 mb-5 top-bar"
          : "navbar p-lg-3 mb-5 isPublic"
      }
      expand={isAuthenticated ? "md" : false}
    >
      {isAuthenticated ? (
        <Button color="primary" onClick={toggleSidebar}>
          <fa.FaAlignLeft />
        </Button>
      ) : null}

      <NavbarToggler onClick={toggleTopbar} />
      <Collapse isOpen={topbarIsOpen} navbar />
      {isAuthenticated ? (
        <Nav className="ml-auto">
          <div className="top-bar-profile-button">
            <NavLink className="d-flex nav-links">
              {isAuthenticated && profilePicture === null ? (
                <svg height="1.6em" width="1.6em" style={{ fill: "#2331f5" }}>
                  <circle cx="0.8em" cy="0.8em" r="0.8em" />
                </svg>
              ) : (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  className="top-bar-profile-picture"
                />
              )}
            </NavLink>
            <div className="top-bar-profile-dropdown">
              <ul>
                <Link to={"/profile"}>
                  <li>
                    <fa.FaUser style={{ fontSize: "1.4em" }} />
                    Profile
                  </li>
                </Link>
                <Link to={"/colleagues"}>
                  <li>
                    <fa.FaUserCheck style={{ fontSize: "1.75em" }} />
                    Colleagues
                  </li>
                </Link>
                <Link to={"/students"}>
                  <li>
                    <fa.FaUserPlus style={{ fontSize: "1.75em" }} />
                    Students
                  </li>
                </Link>
              </ul>
            </div>
          </div>
          <NavLink
            className="d-flex nav-links"
            onClick={onClickToggleThemeHandler}
          >
            <fa.FaAdjust />
          </NavLink>
          <NavLink className="d-flex nav-links" tag={Link} to={"/settings"}>
            <fa.FaCog />
          </NavLink>
          <NavLink
            onClick={onClickLogoutHandler}
            className="d-flex nav-links"
            tag={Link}
            to={"/home"}
          >
            <fa.FaSignOutAlt />
          </NavLink>
        </Nav>
      ) : (
        <Nav className="ml-auto unauthorizedNavBar" navbar>
          <NavLink className="d-flex nav-links" tag={Link} to={"/"}>
            Home
          </NavLink>
          <NavLink className="d-flex nav-links" tag={Link} to={"/login"}>
            Login
          </NavLink>
          <NavLink className="d-flex nav-links" tag={Link} to={"/register"}>
            Register
          </NavLink>
        </Nav>
      )}
    </Navbar>
  );
};

export default Topbar;
