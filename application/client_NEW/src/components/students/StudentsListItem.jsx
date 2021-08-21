import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import authHeader from "../../Services/authHeader";

export const StudentsListItem = (props) => {
  const [profilePicture, updateProfilePicture] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url:
        "http://localhost:8080/profile-picture/" +
        props.student.profile.profile_id,
      responseType: "blob",
      headers: authHeader(),
    }).then((res) => {
      updateProfilePicture(res.data);
    });
  }, [props.student.id]);

  return (
    <>
      {profilePicture === null ? null : (
        <Link
          className="students-list-item"
          to={"/students/" + props.student.id}
        >
          <img src={URL.createObjectURL(profilePicture)} />
          <ul className="students-list-item-info">
            <li>
              <ul className="students-list-item-names">
                {props.student.profile === null ? null : (
                  <li>{props.student.profile.nickname}</li>
                )}
                <li>{props.student.username}</li>
              </ul>
            </li>
            {props.student.profile === null ? null : (
              <li className="students-list-item-course">
                {props.student.profile.course} Student
              </li>
            )}
          </ul>
          {/*  
      <div className="students-list-item-rank">
        <p>
          <span className={studentRankColor(studentRank)}>{studentRank}</span>
        </p>
      </div>
      */}
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
