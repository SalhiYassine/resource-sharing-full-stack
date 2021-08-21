import React, { useContext, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import * as fa from "react-icons/fa";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import { ChatList } from "../messages/ChatList.jsx";
import EditChat from "../messages/EditChat.jsx";

import defaultChatIcon from "../../assets/defaultChatIcon.png";

function EditChatPage() {
  const location = useLocation();
  const history = useHistory();
  const chat_id = location.pathname.split("/")[2];
  const { user } = useContext(AuthContext);

  const [chatData, updateChatData] = useState([]);
  const [chatPictureData, updateChatPictureData] = useState(null);
  const [participantsList, updateParticipantsList] = useState([]);
  const [colleaguesData, updateColleaguesData] = React.useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/chat/" + chat_id,
      headers: authHeader(),
    }).then((res) => {
      updateChatData(res.data);
      if (res.data.length != 0) {
        var list = [];
        for (let i = 0; i < res.data.users.length; i++) {
          list.push(res.data.users[i].id);
        }
        updateParticipantsList(list);
      }
    });
    axios({
      method: "get",
      url: "http://localhost:8080/chat-picture/" + chat_id,
      responseType: "blob",
      headers: authHeader(),
    }).then((res) => {
      updateChatPictureData(res.data);
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
        {chatData.length === 0 ||
        chatPictureData === null ||
        participantsList.length !== chatData.users.length ? (
          <div className="messages-edit-chat-container">
            <div className="messages-chat-bar-back">
              <fa.FaAngleLeft />
            </div>
            <div className="messages-edit-chat-title">
              <fa.FaEdit className="nav-icons" />
              <h1>Edit Chat</h1>
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
          <EditChat
            history={history}
            chat={chatData}
            chatPicture={chatPictureData}
            chat_id={chat_id}
            participantsList={participantsList}
            colleagues={colleaguesData}
            webSocket={webSocket}
          />
        )}
      </div>
    </div>
  );
}

export default EditChatPage;
