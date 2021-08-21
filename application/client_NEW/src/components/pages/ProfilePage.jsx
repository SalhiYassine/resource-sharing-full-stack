import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { ProfilePictureContext } from "../../Context/ProfilePictureContext";
import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import { ProfileContainer } from "../profile/ProfileContainer.jsx";

function ProfilePage() {
  const history = useHistory();

  const { user } = useContext(AuthContext);
  const { profilePicture, setProfilePicture } = useContext(
    ProfilePictureContext
  );
  const [userData, updateUserData] = useState([]);
  const [studentRank, setStudentRank] = useState(null);
  const [resourcesData, updateResourcesData] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      updateUserData(res.data);
    });
    axios({
      method: "get",
      url: "http://localhost:8080/get-ranks/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      setStudentRank(getRank(res.data));
    });
    axios({
      method: "get",
      url: "http://localhost:8080/api/resources/getOwn",
      headers: authHeader(),
    })
      .then((res) => {
        updateResourcesData(res.data);
      })
      .catch((error) => {
        updateResourcesData([]);
      });
  }, []);

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
        setProfilePicture(res.data);
      });
    }
  }, [history.location, userData]);

  if (userData.profile === null) {
    history.push("/create-profile");
  }

  return (
    <div className="profile-page">
      <div className="profile-container container">
        {userData.length === 0 ||
        resourcesData === null ||
        profilePicture === null ? null : (
          <ProfileContainer
            user={userData}
            profilePicture={profilePicture}
            studentRank={studentRank}
            resources={resourcesData}
          />
        )}
      </div>
    </div>
  );
}

function getRank(ranks) {
  if (ranks.length === 0) {
    return "Unranked";
  } else {
    var sum = 0;
    for (var i = 0; i < ranks.length; i++) {
      switch (ranks[i].rank) {
        case "Bronze":
          sum += 1;
          break;
        case "Silver":
          sum += 2;
          break;
        case "Gold":
          sum += 3;
          break;
        case "Platinum":
          sum += 5;
          break;
        default:
          break;
      }
    }
    var avg = sum / ranks.length;
    if (avg <= 1) {
      return "Bronze";
    } else if (avg < 3) {
      return "Silver";
    } else if (avg < 4) {
      return "Gold";
    } else {
      return "Platinum";
    }
  }
}

export default ProfilePage;
