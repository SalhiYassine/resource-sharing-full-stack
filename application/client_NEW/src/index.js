import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import AuthProvider from "./Context/AuthContext";
import ThemeProvider from "./Context/ThemeContext";
import ProfilePictureProvider from "./Context/ProfilePictureContext";

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider>
      <ProfilePictureProvider>
        <App />
      </ProfilePictureProvider>
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
registerServiceWorker();
