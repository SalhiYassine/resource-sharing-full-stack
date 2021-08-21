import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as fa from "react-icons/fa";

import authHeader from "../../Services/authHeader";

export const ChatBar = (props) => {
  const history = useHistory();

  const [chatBarEditButtonAnimation, setChatBarEditButtonAnimation] = useState(
    false
  );
  const [chatPictureData, updateChatPictureData] = React.useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/chat-picture/" + props.chat.chat_id,
      responseType: "blob",
      headers: authHeader(),
    }).then((res) => {
      updateChatPictureData(res.data);
    });
  }, [props.chat.chat_id, history.location]);

  const SetEditChat = () => {
    setChatBarEditButtonAnimation(false);
    history.push("/messages/" + props.chat.chat_id + "/edit");
  };

  const SetClearChat = () => {
    history.push("/messages");
  };

  return (
    <div className="messages-chat-bar">
      <div className="messages-chat-bar-back" onClick={SetClearChat}>
        <fa.FaAngleLeft />
      </div>
      <div
        className={
          props.chat.name != null
            ? "messages-chat-bar-title"
            : "messages-chat-bar-title chatBarTitleNoEdit"
        }
      >
        <div className="messages-chat-bar-title-text">
          {chatPictureData === null ? (
            <svg height="50" width="50" className="profilePicture">
              <circle cx="25" cy="25" r="25" />
            </svg>
          ) : (
            <img src={URL.createObjectURL(chatPictureData)} />
          )}
          <p>{props.chat.name}</p>
        </div>
      </div>
      {props.chat.name != null ? (
        <div
          className={
            chatBarEditButtonAnimation
              ? "messages-chat-bar-edit chatBarEditButtonAnimation"
              : "messages-chat-bar-edit"
          }
          onClick={() => setChatBarEditButtonAnimation(true)}
        >
          <fa.FaEdit onAnimationEnd={SetEditChat} />
        </div>
      ) : null}
    </div>
  );
};
