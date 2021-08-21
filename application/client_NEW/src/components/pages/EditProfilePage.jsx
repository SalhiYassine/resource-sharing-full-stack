import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import EditProfileContainer from "../profile/EditProfileContainer.jsx";

function EditProfilePage() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [userData, updateUserData] = React.useState([]);
  const [profilePictureData, updateProfilePictureData] = React.useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      updateUserData(res.data);
    });
  }, [history.location]);

  useEffect(() => {
    if (userData.length != 0 && userData.profile != null) {
      axios({
        method: "get",
        url:
          "http://localhost:8080/profile-picture/" +
          userData.profile.profile_id,
        responseType: "blob",
        headers: authHeader(),
      }).then((res) => {
        updateProfilePictureData(res.data);
      });
    }
  }, [history.location, userData]);

  return (
    <div className="profile-page">
      <div className="profile-container container">
        {userData.length !== 0 && profilePictureData !== null ? (
          <EditProfileContainer
            user={userData}
            profilePicture={profilePictureData}
            history={history}
          />
        ) : null}
      </div>
    </div>
  );
}

export default EditProfilePage;
