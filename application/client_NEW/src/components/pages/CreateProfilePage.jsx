import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import CreateProfileContainer from "../profile/CreateProfileContainer.jsx";

function EditProfilePage() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [userData, updateUserData] = React.useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      updateUserData(res.data);
    });
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container container">
        {userData.length !== 0 ? (
          <CreateProfileContainer user={userData} history={history} />
        ) : null}
      </div>
    </div>
  );
}

export default EditProfilePage;
