import React, { createContext, useState, useEffect } from "react";
import authHeader from "../Services/authHeader";

export const AuthContext = createContext();

export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (userDetails) {
      setUser(userDetails);
      setIsAuthenticated(true);
      setLoaded(true);
    }
    setLoaded(true);
  }, []);

  return (
    <div>
      <AuthContext.Provider
        value={{ user, setUser, isAuthenticated, setIsAuthenticated, loaded }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};
