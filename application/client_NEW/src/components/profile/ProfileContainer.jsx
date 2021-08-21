import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import * as fa from "react-icons/fa";
import authHeader from "../../Services/authHeader";

export const ProfileContainer = (props) => {
  const history = useHistory();

  var studentRank = props.studentRank;

  return (
    <>
      <div className="profile-bar">
        <div className="profile-identity">
          {props.profilePicture === null ? (
            <svg height="70" width="70">
              <circle cx="35" cy="35" r="35" />
            </svg>
          ) : (
            <img src={URL.createObjectURL(props.profilePicture)} />
          )}
          <ul className="profile-identity-names">
            <li>{props.user.profile.nickname}</li>
            <li>{props.user.username}</li>
          </ul>
        </div>
        <div className="profile-bar-edit">
          {props.user.profile.is_private ? <fa.FaLock /> : <fa.FaLockOpen />}
          <button
            className="profile-bar-edit-button"
            onClick={() => history.push("/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <div className="profile-statistics">
        <ul>
          <li>{props.resources.length}</li>
          {props.resources.length !== 1 ? (
            <li>Resources</li>
          ) : (
            <li>Resource</li>
          )}
        </ul>
        <ul>
          <li style={studentRankColor(studentRank)}>{studentRank}</li>
          <li>Rank</li>
        </ul>
      </div>
      <div className="profile-information-container">
        <div className="profile-information">
          <p>Course</p>
          <p>{props.user.profile.course}</p>
        </div>
        <div className="profile-information">
          <p>Strongest Subject</p>
          <p>{props.user.profile.strongest_subject}</p>
        </div>
        <div className="profile-information">
          <p>Description</p>
          <p>{props.user.profile.description}</p>
        </div>
      </div>
      <div className="profile-resources">
        <p>Resources</p>
        {props.resources.length === 0 ? (
          <p>You have not created any resources.</p>
        ) : null}
        {props.resources.map((resource, index) => {
          return <ResourceItem resource={resource} key={resource.id} />;
        })}
      </div>
    </>
  );
};

const ResourceItem = (props) => {
  var history = useHistory();
  const date = moment(props.resource.date_created).format("DD MMM YYYY");
  const [isDeleted, updateIsDeleted] = useState(false);

  function viewResource(id) {
    history.push("/resources/" + id);
  }

  function editResource(id) {
    history.push("/resources/" + id + "/edit");
  }

  function deleteResource(id) {
    axios({
      method: "delete",
      url: "http://localhost:8080/api/resources/deleteOne/ " + id,
      headers: authHeader(),
    }).then(() => {
      updateIsDeleted(true);
    });
  }

  if (isDeleted) {
    return null;
  } else {
    return (
      <div className="profile-resources-item">
        <div className="profile-resource-item-info">
          <p>{props.resource.title}</p>
          <p>{date}</p>
        </div>
        <div className="profile-resource-item-buttons">
          <button onClick={() => viewResource(props.resource.id)}>View</button>
          <button onClick={() => editResource(props.resource.id)}>Edit</button>
          <button onClick={() => deleteResource(props.resource.id)}>
            Delete
          </button>
        </div>
      </div>
    );
  }
};

function studentRankColor(studentRank) {
  switch (studentRank) {
    case "Bronze":
      return { color: "#ecb580", background: "#b1560f" };
    case "Silver":
      return { color: "#ddddee", background: "#888899" };
    case "Gold":
      return { color: "#ffe700", background: "#c49f27" };
    case "Platinum":
      return { color: "#ffffff", background: "#bba7aa" };
    default:
      return { color: "#000000" };
  }
}
