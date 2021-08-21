import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route, Redirect } from "react-router-dom";

import Topbar from "./Topbar";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegisterPage";

import ProfilePage from "../pages/ProfilePage";
import CreateProfilePage from "../pages/CreateProfilePage";
import EditProfilePage from "../pages/EditProfilePage";

import ColleaguesPage from "../pages/ColleaguesPage";
import PendingColleaguesPage from "../pages/PendingColleaguesPage";

import StudentsPage from "../pages/StudentsPage";
import StudentPage from "../pages/StudentPage";

import ResourcesPage from "../pages/ResourcesPage";
import ResourcePage from "../pages/ResourcePage";
import CreateResourcePage from "../pages/CreateResourcePage";
import EditResourcePage from "../pages/EditResourcePage";

import MessagesPage from "../pages/MessagesPage";
import ChatPage from "../pages/ChatPage";
import CreateChatPage from "../pages/CreateChatPage";
import EditChatPage from "../pages/EditChatPage";

//import SettingPage from "../pages/SettingPage";
import EditSettingPage from "../pages/EditSettingPage";

import ProgressPage from "../pages/ProgressPage";

import AdminPage from "../pages/AdminPage";

import HomePage from "../pages/HomePage";

//Import HOCS
//Routes only authenticated users can hit
import PrivateRoute from "../hocs/PrivateRoute";
//Routes only unauthenticated users can hit
import UnPrivateRoute from "../hocs/UnPrivateRoute";

import "bootstrap/dist/css/bootstrap.min.css";

const Content = ({ sidebarIsOpen, toggleSidebar }) => (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
  >
    <Topbar toggleSidebar={toggleSidebar} />
    <Switch>
      <UnPrivateRoute exact path="/login" component={LoginPage} />
      <UnPrivateRoute exact path="/register" component={RegistrationPage} />
      <UnPrivateRoute exact path="/" component={LandingPage} />

      <PrivateRoute
        exact
        path="/profile"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={ProfilePage}
      />
      <PrivateRoute
        path="/admin"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={AdminPage}
      />
      <PrivateRoute
        exact
        path="/create-profile"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={CreateProfilePage}
      />
      <PrivateRoute
        exact
        path="/profile/edit"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={EditProfilePage}
      />
      <PrivateRoute
        exact
        path="/colleagues"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={ColleaguesPage}
      />
      <PrivateRoute
        exact
        path="/colleagues/pending"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={PendingColleaguesPage}
      />
      <PrivateRoute
        exact
        path="/students"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={StudentsPage}
      />
      <PrivateRoute
        exact
        path="/students/:student"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={StudentPage}
      />

      <PrivateRoute
        exact
        path="/resources"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={ResourcesPage}
      />
      <PrivateRoute
        path="/resources/create"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={CreateResourcePage}
      />
      <PrivateRoute
        exact
        path="/resources/:resource"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={ResourcePage}
      />
      <PrivateRoute
        exact
        path="/resources/:resource/edit"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={EditResourcePage}
      />

      <PrivateRoute
        exact
        path="/messages"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={MessagesPage}
      />
      <PrivateRoute
        exact
        path="/messages/create"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={CreateChatPage}
      />
      <PrivateRoute
        exact
        path="/messages/:chat/edit"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={EditChatPage}
      />
      <PrivateRoute
        exact
        path="/messages/:chat"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={ChatPage}
      />

      <PrivateRoute
        path="/progress"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={ProgressPage}
      />
      <PrivateRoute
        path="/settings"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={EditSettingPage}
      />
      <PrivateRoute
        path="/home"
        roles={["ROLE_ADMIN", "ROLE_USER"]}
        component={HomePage}
      />

      <Redirect to="/" />
    </Switch>
  </Container>
);

export default Content;
