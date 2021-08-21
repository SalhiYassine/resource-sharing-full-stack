import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as fa from "react-icons/fa";

import axios from "axios";
import authHeader from "../../Services/authHeader";

export const PendingColleaguesListItem = (props) => {
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
                <li>{props.student.profile.nickname}</li>
                <li>{props.student.username}</li>
                <li
                  className={
                    props.status === "received"
                      ? "received-request"
                      : "sent-request"
                  }
                >
                  <fa.FaUserClock />
                </li>
              </ul>
            </li>
            <li className="students-list-item-course">
              {props.student.profile.course} Student
            </li>
          </ul>
        </Link>
      )}
    </>
  );
};
