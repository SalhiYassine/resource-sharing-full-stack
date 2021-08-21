import React, { useState, useEffect } from "react";
import axios from "axios";

import authHeader from "../../Services/authHeader";

import "../../../node_modules/react-vis/dist/style.css";

function AdminPage(props) {
  const [users, setUsers] = useState(null);

  const [subjects, setSubjects] = useState(null);

  const [resources, setResources] = useState(null);

  const [inputtedSubject, setInputtedSubject] = useState("");

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/users",
      headers: authHeader(),
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        setResources(null);
      });

    axios({
      method: "get",
      url: "http://localhost:8080/api/subjects/getAll/",
      headers: authHeader(),
    })
      .then((res) => {
        setSubjects(res.data);
      })
      .catch(() => {
        setSubjects(null);
      });

    axios({
      method: "get",
      url: "http://localhost:8080/api/resources/getAll/",
      headers: authHeader(),
    })
      .then((res) => {
        setResources(res.data);
      })
      .catch(() => {
        setResources(null);
      });
  }, []);

  function addSubject() {
    axios({
      method: "post",
      url: "http://localhost:8080/api/subjects/addOne/",
      data: { subject: inputtedSubject },
      headers: authHeader(),
    })
      .then(() => {
        setInputtedSubject("");
        axios({
          method: "get",
          url: "http://localhost:8080/api/subjects/getAll/",
          headers: authHeader(),
        })
          .then((res) => {
            setSubjects(res.data);
          })
          .catch(() => {
            setSubjects(null);
          });
      })
      .catch(() => {
        setInputtedSubject("");
      });
  }

  function removeSubject(id) {
    axios({
      method: "post",
      url: "http://localhost:8080/api/subjects/removeOne/ " + id,
      headers: authHeader(),
    })
      .then(() => {
        axios({
          method: "get",
          url: "http://localhost:8080/api/subjects/getAll/",
          headers: authHeader(),
        })
          .then((res) => {
            setSubjects(res.data);
          })
          .catch(() => {
            setSubjects(null);
          });
      })
      .catch(() => {
        axios({
          method: "get",
          url: "http://localhost:8080/api/subjects/getAll/",
          headers: authHeader(),
        })
          .then((res) => {
            setSubjects(res.data);
          })
          .catch(() => {
            setSubjects(null);
          });
      });
  }

  function removeResource(id) {
    axios({
      method: "delete",
      url: "http://localhost:8080/api/resources/deleteOne/ " + id,
      headers: authHeader(),
    }).then(() => {
      axios({
        method: "get",
        url: "http://localhost:8080/api/resources/getAll/",
        headers: authHeader(),
      })
        .then((res) => {
          setResources(res.data);
        })
        .catch(() => {
          setResources(null);
        });
    });
  }

  return (
    <div className="container admin-container">
      <h1 className="text-center">Admin Dashboard</h1>
      <div>
        <div className="container w-100 h-20 admin-glass-styling p-4 m-2">
          <div>
            <p className="h3">Users</p>
          </div>
          <div className="admin-overflow">
            {users === null ? (
              <p>There are no users on Unifluent.</p>
            ) : (
              users.map((user, index) => (
                <div
                  className="d-flex w-85 bg-white p-2 m-2 justify-content-around align-items-center"
                  key={index}
                >
                  <p className="p-2 m-2">{user.username}</p>
                  {user.profile !== null || undefined ? (
                    <p className="p-2 m-2">{user.profile.nickname}</p>
                  ) : null}
                  <div></div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="container w-100 h-20 admin-glass-styling p-4 m-2">
          <div>
            <p className="h3">Subjects</p>
          </div>
          <div className="admin-overflow">
            {subjects === null ? (
              <p>There are no subjects on Unifluent.</p>
            ) : (
              subjects.map((subject, index) => (
                <div
                  className="d-flex w-85 bg-white p-2 m-2 justify-content-around align-items-center"
                  key={index}
                >
                  <p className="p-2 m-2">{subject.subject}</p>
                  <div>
                    <button
                      className="btn btn-danger p-2 m-2"
                      onClick={() => removeSubject(subject.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center admin-input">
            <form className=" w-75 pt-1">
              <input
                type="text"
                placeholder="Search Subject..."
                name="search"
                value={inputtedSubject}
                onChange={(e) => setInputtedSubject(e.target.value)}
              />
            </form>
            <button className="btn btn-primary p-2 m-2" onClick={addSubject}>
              Add Subject
            </button>
          </div>
        </div>

        <div className="container w-100 h-20 admin-glass-styling p-4 m-2">
          <div>
            <p className="h3">Resources</p>
          </div>
          <div className="admin-overflow">
            {resources === null ? (
              <p>There are no resources on Unifluent.</p>
            ) : (
              resources.map((resource, index) => (
                <div
                  className="d-flex w-85 bg-white p-2 m-2 justify-content-around align-items-center"
                  key={index}
                >
                  <p className="p-2 m-2">{resource.title}</p>
                  <p className="p-2 m-2">{resource.subject.subject}</p>
                  <div>
                    <button
                      className="btn btn-danger p-2 m-2"
                      onClick={() => removeResource(resource.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
