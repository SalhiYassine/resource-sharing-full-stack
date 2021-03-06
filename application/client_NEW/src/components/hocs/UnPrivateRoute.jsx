import React, { useContext } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const UnPrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  let location = useLocation();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated)
          return (
            <Redirect
              to={{ pathname: "/home", state: { from: props.location } }}
            />
          );

        return <Component {...props} />;
      }}
    />
  );
};

export default UnPrivateRoute;
