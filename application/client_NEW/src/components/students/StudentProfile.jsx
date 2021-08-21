import React, { useContext, useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faUserPlus,
  faUserClock,
  faUserCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../Context/AuthContext";

import authHeader from "../../Services/authHeader";

import axios from "axios";

const StudentProfile = (props) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [colleagues, setColleagues] = useState([]);
  const [sentReqests, setSentRequests] = useState([]);
  const [recievedRequests, setRecievedRequests] = useState([]);
  const [isRanking, setIsRanking] = useState(false);
  const [studentRank, setStudentRank] = useState(null);
  const [markedAs, setMarkedAs] = useState(null);
  const [resources, setResources] = useState(null);

  useEffect(() => {
    getColleagues();
    getSentRequests();
    getRecievedRequest();
    getRankData();
    getResources();
  }, [props.match.params]);

  useEffect(() => {
    getStudentData();
  }, [props.match.params]);

  const getStudentData = () => {
    const studentId = props.match?.params?.student;
    if (studentId) {
      axios({
        type: "get",
        url: `/user/${studentId}`,
        headers: authHeader(),
      })
        .then((resp) => {
          if (resp.data?.id) {
            setStudent(resp.data);
            if (resp.data.profile) {
              getProfilePicture(resp.data.profile?.profile_id);
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const getProfilePicture = (id) => {
    if (id) {
      axios({
        method: "get",
        url: `http://localhost:8080/profile-picture/${id}`,
        responseType: "blob",
        headers: authHeader(),
      }).then((res) => {
        setProfilePicture(res.data);
      });
    }
  };

  const getColleagues = () => {
    axios({
      method: "get",
      url: `http://localhost:8080/colleagues/${user.userID}`,
      headers: authHeader(),
    }).then((res) => {
      setColleagues(res.data);
    });
  };

  const getSentRequests = () => {
    const studentId = props.match?.params?.student;
    if (!studentId) return;
    axios({
      method: "get",
      url: `http://localhost:8080/colleague-requests-sent/${user.userID}`,
      headers: authHeader(),
    }).then((res) => {
      setSentRequests(res.data || []);
    });
  };

  function getRankData() {
    axios({
      method: "get",
      url: "http://localhost:8080/get-ranks/" + props.studentID,
      headers: authHeader(),
    })
      .then((res) => {
        setStudentRank(getRank(res.data));
      })
      .catch((err) => console.log(err));
    axios({
      method: "get",
      url:
        "http://localhost:8080/has-marked/" +
        props.studentID +
        "/" +
        user.userID,
      headers: authHeader(),
    })
      .then((res) => {
        setMarkedAs(res.data);
      })
      .catch((err) => console.log(err));
  }

  function getResources() {
    axios({
      method: "get",
      url:
        "http://localhost:8080/api/resources/getUserResources/" +
        props.studentID,
      headers: authHeader(),
    })
      .then((res) => {
        setResources(res.data);
      })
      .catch((err) => {
        setResources([]);
        console.log(err);
      });
  }

  const checkRequestSent = () => {
    const studentId = props.match?.params?.student;
    if (!studentId) return;
    axios({
      method: "get",
      url: `http://localhost:8080/colleague-requests-sent/${user.userID}`,
    });
  };

  const CloseProfile = () => {
    history.push("/students");
  };

  const RequestColleague = () => {
    const headers = authHeader();
    axios({
      method: "post",
      url: `http://localhost:8080/add-colleague/${user.userID}/${props.studentID}`,
      headers,
    });
  };

  const getRecievedRequest = () => {
    const headers = authHeader();
    axios({
      method: "get",
      url: `http://localhost:8080/colleague-requests-received/${user.userID}`,
      headers,
    }).then((res) => {
      setRecievedRequests(res.data || []);
    });
  };

  const AcceptColleague = () => {
    const headers = authHeader();
    axios({
      method: "post",
      url: `http://localhost:8080/add-colleague/${user.userID}/${props.studentID}`,
      headers,
    })
      .then((res) => {
        history.push("/students");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const RemovePendingColleague = () => {
    const headers = authHeader();
    axios({
      method: "post",
      url: `http://localhost:8080/remove-request-colleague/${user.userID}/${props.studentID}`,
    }).then((res) => {
      getRecievedRequest();
    });
  };
  const RemoveColleague = () => {
    const headers = authHeader();
    axios({
      method: "post",
      url: `http://localhost:8080/remove-colleague/${user.userID}/${props.studentID}`,
      headers,
    });
  };

  const sendRequest = () => {
    const headers = authHeader();
    axios({
      method: "post",
      url: `/add-request-colleague/${user.userID}/${props.studentID}`,
      headers,
    })
      .then((res) => {
        getSentRequests();
      })
      .catch((err) => console.log(err));
  };

  const removeSentRequest = () => {
    const headers = authHeader();
    axios({
      method: "post",
      url: `/remove-request-colleague/${user.userID}/${props.studentID}`,
      headers,
    })
      .then((res) => {
        getSentRequests();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function rankColleague(rank) {
    setIsRanking(false);
    if (markedAs === "") {
      axios({
        method: "post",
        url:
          "http://localhost:8080/rank-user/" +
          props.studentID +
          "/" +
          user.userID +
          "/" +
          rank,
        headers: authHeader(),
      }).then(() => {
        getRankData();
      });
    } else {
      axios({
        method: "put",
        url:
          "http://localhost:8080/change-rank/" +
          props.studentID +
          "/" +
          user.userID +
          "/" +
          rank,
        headers: authHeader(),
      }).then(() => {
        getRankData();
      });
    }
  }

  function goToResource(id) {
    history.push("/resources/" + id);
  }

  var colleagueStatus = faUserPlus;
  var colleagueStatusClassName =
    "students-student-identity-statistics-status students-student-identity-statistics-request";

  return (
    <div className="students-student-container">
      {profilePicture === null || resources === null ? (
        <div className="loading">Loading....</div>
      ) : (
        <>
          <div className="students-student-bar">
            <div className="students-student-bar-back" onClick={CloseProfile}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
            <div className="students-student-identity">
              <img src={URL.createObjectURL(profilePicture)} />
              <ul className="students-student-identity-names">
                <li>{student.profile?.nickname}</li>
                <li>{student.username}</li>
              </ul>
            </div>
          </div>
          <div className="students-student-profile">
            <div className="students-student-identity">
              <img src={URL.createObjectURL(profilePicture)} />
              <ul className="students-student-identity-names">
                <li>{student.profile?.nickname || ""}</li>
                <li>{student.username}</li>
              </ul>
            </div>
            <div className="students-student-identity-statistics">
              {colleagues.findIndex(
                (colleague) => colleague.id === props.studentID
              ) === -1 ? (
                <>
                  {sentReqests.findIndex((a) => a.id === props.studentID) ===
                  -1 ? (
                    <>
                      {recievedRequests.findIndex(
                        (a) => a.id === props.studentID
                      ) >= 0 ? (
                        <FontAwesomeIcon
                          icon={faUserClock}
                          className={colleagueStatusClassName}
                          onClick={AcceptColleague}
                          style={{ width: "1.58em", color: "#00cc00" }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={colleagueStatus}
                          className={colleagueStatusClassName}
                          onClick={sendRequest}
                          style={{ width: "1.58em" }}
                        />
                      )}
                    </>
                  ) : (
                    <FontAwesomeIcon
                      icon={faUserClock}
                      className={colleagueStatusClassName}
                      onClick={removeSentRequest}
                      style={{ width: "1.58em" }}
                    />
                  )}
                </>
              ) : (
                <FontAwesomeIcon
                  icon={faUserCheck}
                  className={colleagueStatusClassName}
                  onClick={RemoveColleague}
                  style={{ width: "1.58em" }}
                />
              )}
              <ul>
                <li>{resources.length}</li>
                <li>Resource{resources.length === 1 ? "" : "s"}</li>
              </ul>
              <ul>
                <li style={studentRankColor(studentRank)}>{studentRank}</li>
                <li>Rank</li>
              </ul>
            </div>
            {colleagues.findIndex(
              (colleague) => colleague.id === props.studentID
            ) === -1 ? null : (
              <div className="students-student-rank-user">
                {isRanking === false ? (
                  <>
                    {markedAs === "" ? (
                      <button onClick={() => setIsRanking(true)}>
                        Rank User
                      </button>
                    ) : (
                      <>
                        <div className="students-student-rank-user-given">
                          <p>
                            You marked{" "}
                            <span className="students-student-rank-user-username">
                              {student.username}
                            </span>{" "}
                            as rank:{" "}
                            <span
                              className="students-student-rank-user-given-rank"
                              style={studentRankColor(markedAs)}
                            >
                              {markedAs}
                            </span>
                          </p>
                        </div>
                        <button onClick={() => setIsRanking(true)}>
                          {" "}
                          Change Rank Given
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="students-student-rank-user-options">
                    <div className="students-student-rank-user-options-title">
                      <button onClick={() => setIsRanking(false)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                      <p>
                        You mark{" "}
                        <span className="students-student-rank-user-username">
                          {student.username}
                        </span>{" "}
                        as rank:
                      </p>
                    </div>
                    <div className="students-student-rank-user-option">
                      <button
                        style={studentRankColor("Platinum")}
                        onClick={() => rankColleague("Platinum")}
                      >
                        Platinum
                      </button>
                    </div>
                    <div className="students-student-rank-user-option">
                      <button
                        style={studentRankColor("Gold")}
                        onClick={() => rankColleague("Gold")}
                      >
                        Gold
                      </button>
                    </div>
                    <div className="students-student-rank-user-option">
                      <button
                        style={studentRankColor("Silver")}
                        onClick={() => rankColleague("Silver")}
                      >
                        Silver
                      </button>
                    </div>
                    <div className="students-student-rank-user-option">
                      <button
                        style={studentRankColor("Bronze")}
                        onClick={() => rankColleague("Bronze")}
                      >
                        Bronze
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="students-student-information">
              <div className="studentInformation">
                <p>Course</p>
                <p>{student.profile?.course}</p>
              </div>
              <div className="studentInformation">
                <p>Strongest Subject</p>
                <p>{student.profile?.strongest_subject}</p>
              </div>
              <div className="studentInformation">
                <p>Description</p>
                <p>{student.profile?.description}</p>
              </div>
            </div>
            <div className="students-student-resources">
              <p className="students-student-resources-title">Resources</p>
              {student.profile.is_private &&
              colleagues.findIndex(
                (colleague) => colleague.id === props.studentID
              ) === -1 ? (
                <>
                  <p>
                    <span className="students-student-rank-user-username">
                      {student.username}
                    </span>{" "}
                    has a private account. Add{" "}
                    <span className="students-student-rank-user-username">
                      {student.username}
                    </span>{" "}
                    as a colleague to view their resources.
                  </p>
                </>
              ) : (
                <>
                  {resources.length === 0 ? (
                    <p>{student.username} has not created any resources.</p>
                  ) : (
                    resources.map((resource, index) => (
                      <>
                        <div
                          className="students-student-resources-resource"
                          onClick={() => goToResource(resource.id)}
                        >
                          {console.log(resource)}
                          <p>{resource.title}</p>
                          <p>{resource.subject.subject}</p>
                        </div>
                      </>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

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

export default withRouter(StudentProfile);
