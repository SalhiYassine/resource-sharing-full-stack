import React, { useState, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/App.scss";

import SideBar from "./components/sidebar/SideBar";
import Content from "./components/content/Content";

import { AuthContext } from "./Context/AuthContext";
import { ThemeContext } from "./Context/ThemeContext";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isLight } = useContext(ThemeContext);
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  return (
    <Router>
      <div className={isLight ? "App wrapper light" : "App wrapper dark"}>
        {isAuthenticated ? (
          <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
        ) : null}
        <Content toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
      </div>
    </Router>
  );
};

export default App;
