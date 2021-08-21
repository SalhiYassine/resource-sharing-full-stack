import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as fa from "react-icons/fa";

import axios from "axios";
import authHeader from "../../Services/authHeader";

export const ColleaguesListItem = (props) => {
  const [profilePicture, updateProfilePicture] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url:
        "http://localhost:8080/profile-picture/" +
        props.colleague.profile.profile_id,
      responseType: "blob",
      headers: authHeader(),
    }).then((res) => {
      updateProfilePicture(res.data);
    });
  }, [props.colleague.id]);

  return (
    <>
      {profilePicture === null ? null : (
        <Link
          className="students-list-item"
          to={"/students/" + props.colleague.id}
        >
          <img src={URL.createObjectURL(profilePicture)} />
          <ul className="students-list-item-info">
            <li>
              <ul className="students-list-item-names">
                <li>{props.colleague.profile.nickname}</li>
                <li>{props.colleague.username}</li>
                <li>
                  <fa.FaUserCheck />
                </li>
              </ul>
            </li>
            <li className="students-list-item-course">
              {props.colleague.profile.course} Student
            </li>
          </ul>
        </Link>
      )}
    </>
  );
};

function studentRankColor(studentRank) {
  switch (studentRank) {
    case "Bronze":
      return "bronze";
    case "Silver":
      return "silver";
    case "Gold":
      return "gold";
    case "Platinum":
      return "platinum";
    default:
      return { color: "#000000" };
  }
}

function getStudentRank(id) {
  var ratings = users.find((user) => user._id === id).profile[0].ratings;
  if (ratings.length === 0) {
    return "Unranked";
  }
  var sum = 0;
  for (var i = 0; i < ratings.length; i++) {
    sum += ratings[i];
  }
  var avg = sum / ratings.length;
  if (avg < 2.5) {
    return "Bronze";
  } else if (avg < 3.5) {
    return "Silver";
  } else if (avg < 4.5) {
    return "Gold";
  } else {
    return "Platinum";
  }
}
