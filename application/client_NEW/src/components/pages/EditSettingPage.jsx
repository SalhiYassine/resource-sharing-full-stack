import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";
import SettingPage from "./SettingPage";
import { ThemeContext } from "../../Context/ThemeContext";

function EditSettingPage() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [userData, updateUserData] = useState([]);
  const { isLight, setIsLight } = useContext(ThemeContext);

  const onClickThemeHandler = () => {
    setIsLight(!isLight);
  };
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      console.log(res.data);
      updateUserData(res.data);
    });
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container container">
        {userData.length !== 0 ? (
          <SettingPage
            user={userData}
            history={history}
            setIsLight={setIsLight}
          />
        ) : null}
      </div>
    </div>
  );
}

export default EditSettingPage;
