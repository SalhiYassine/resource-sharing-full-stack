import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import * as fa from "react-icons/fa";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import { ChatList } from "../messages/ChatList.jsx";
import CreateChat from "../messages/CreateChat.jsx";

import defaultChatIcon from "../../assets/defaultChatIcon.png";

function CreateChatPage() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [userData, updateUserData] = React.useState([]);
  const [colleaguesData, updateColleaguesData] = React.useState([]);

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
      url: "http://localhost:8080/colleagues/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      axios({
        method: "get",
        url: "http://localhost:8080/user/" + user.userID,
        headers: authHeader(),
      }).then((res2) => {
        res.data.push(res2.data);
        updateColleaguesData(res.data);
      });
    });
  }, []);

  var webSocket = Stomp.over(
    new WebSocket("ws://localhost:8080/websocket-messages")
  );
  webSocket.debug = null;

  return (
    <div className="messages-page">
      <div className="messages-container container chat-page">
        <ChatList />
        {userData.length === 0 || colleaguesData.length === 0 ? (
          <div className="messages-edit-chat-container">
            <div className="messages-chat-bar-back">
              <fa.FaAngleLeft />
            </div>
            <div className="messages-edit-chat-title">
              <fa.FaPlus className="nav-icons" />
              <h1>Add Chat</h1>
            </div>
            <div className="form-input-container form-text-input-container">
              <p>Chat Name</p>
              <TextareaAutosize placeholder={"Add a name for the chat"} />
            </div>
            <div className="form-input-container form-file-input-container edit-profile-input-container edit-profile-file-input-container">
              <p>Chat Icon</p>
              <label id="chatPictureFileLabel">
                <img src={defaultChatIcon} />
              </label>
            </div>
            <div className="form-input-container form-participants-container">
              <p>Participants</p>
              <div className="form-participants">
                <p>No Participants</p>
              </div>
              <div className="form-participants-input">
                <input placeholder="Search for Students by Username"></input>
                <button>
                  <fa.FaPlus />
                </button>
              </div>
            </div>
            <div className="form-submit-container">
              <button className="iconButton">
                <fa.FaPlus />
              </button>
            </div>
          </div>
        ) : (
          <CreateChat
            history={history}
            user={userData}
            colleagues={colleaguesData}
            webSocket={webSocket}
          />
        )}
      </div>
    </div>
  );
}

export default CreateChatPage;
