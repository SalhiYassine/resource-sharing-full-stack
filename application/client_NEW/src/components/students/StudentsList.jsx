import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import StudentsBar from "./StudentsBar.jsx";
import { StudentsListItem } from "./StudentsListItem.jsx";

export const StudentsList = () => {
  const { user } = useContext(AuthContext);
  const [dataLoading, setDataLoading] = useState(false);
  const [students, updateStudents] = useState([]);
  const [rankedUsers, setRankedUsers] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/users/",
      headers: authHeader(),
    }).then((res) => {
      getRanks(res.data);
    });
  }, []);

  async function getRanks(users) {
    var usersArray = users.slice();
    for (var i = 0; i < usersArray.length; i++) {
      await axios({
        method: "get",
        url: "http://localhost:8080/get-ranks/" + usersArray[i].id,
        headers: authHeader(),
      }).then((res) => {
        usersArray[i].rank = getRank(res.data);
        if (i == usersArray.length - 1) setRankedUsers(usersArray);
      });
    }
  }

  useEffect(() => {
    if (rankedUsers.length !== 0) {
      axios({
        method: "get",
        url: "http://localhost:8080/colleagues/" + user.userID,
        headers: authHeader(),
      }).then((colleagues) => {
        var studentsArray = sortStudentsArray(
          rankedUsers,
          colleagues.data,
          user
        );
        updateStudents(studentsArray);
      });
    }
  }, [rankedUsers]);

  const history = useHistory();

  return (
    <div
      className={
        window.location.pathname === "/students"
          ? "students-list-container"
          : "students-list-container students-list-container-profile-page"
      }
    >
      {dataLoading ? (
        <div className="loading">Loading....</div>
      ) : (
        <>
          <StudentsBar history={history} studentsArrayData={students} />
          <div className="students-list">
            {students.map((student, i) => {
              return (
                <StudentsListItem
                  student={student}
                  index={i}
                  key={i}
                  history={history}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

function sortStudentsArray(users, colleagues, user) {
  var platinumStudents = [];
  var goldStudents = [];
  var silverStudents = [];
  var unrankedStudents = [];
  var bronzeStudents = [];
  for (var i = 0; i < users.length; i++) {
    if (
      users[i].id !== user.userID &&
      colleagues.findIndex((col) => col.id == users[i].id) < 0 &&
      users[i].profile !== null
    ) {
      switch (users[i].rank) {
        case "Platinum":
          platinumStudents.push(users[i]);
          break;
        case "Gold":
          goldStudents.push(users[i]);
          break;
        case "Silver":
          silverStudents.push(users[i]);
          break;
        case "Bronze":
          bronzeStudents.push(users[i]);
          break;
        default:
          unrankedStudents.push(users[i]);
          break;
      }
    }
  }
  var students = platinumStudents.concat(
    goldStudents.concat(
      silverStudents.concat(unrankedStudents.concat(bronzeStudents))
    )
  );
  return students;
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
