import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export default ({ children }) => {
  const [isLight, setIsLight] = useState(true);

  return (
    <ThemeContext.Provider value={{ isLight, setIsLight }}>
      {children}
    </ThemeContext.Provider>
  );
};
