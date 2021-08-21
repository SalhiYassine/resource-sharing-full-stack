import React, { useContext } from "react";
import * as fa from "react-icons/fa";
import * as ai from "react-icons/ai";
import * as gi from "react-icons/gi";
import * as io5 from "react-icons/io5";

import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

//Import authService
import AuthService from "../../Services/AuthService";

//Import context
import { AuthContext } from "../../Context/AuthContext";

const SideBar = ({ isOpen, toggle }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          <ai.AiFillCloseSquare className="nav-icons" />
        </span>
        <div className="title">
          <img src={logo} />
          <h3>Unifluent</h3>
        </div>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <NavItem>
            <NavLink className="d-flex nav-links" tag={Link} to={"/home"}>
              <fa.FaHome className="nav-icons" />
              <h4 className="nav-links">Home</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="d-flex nav-links" tag={Link} to={"/resources"}>
              <fa.FaFile className="nav-icons" />
              <h4 className="nav-links">Resources</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="d-flex nav-links" tag={Link} to={"/messages"}>
              <fa.FaCommentAlt className="nav-icons" />
              <h4 className="nav-links">Messages</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="d-flex nav-links" tag={Link} to={"/progress"}>
              <io5.IoBarChartSharp className="nav-icons" />

              <h4 className="nav-links">Progress</h4>
            </NavLink>
          </NavItem>
          {user.role !== "ROLE_ADMIN" ? null : (
            <NavItem>
              <NavLink className="d-flex nav-links" tag={Link} to={"/admin"}>
                <fa.FaTools className="nav-icons" />

                <h4 className="nav-links">Admin</h4>
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default SideBar;
