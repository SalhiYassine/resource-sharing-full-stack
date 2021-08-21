import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import * as fa from "react-icons/fa";

import axios from "axios";
import authHeader from "../../Services/authHeader";

export const ChatListItem = (props) => {
  const history = useHistory();
  const [messagesData, updateMessagesData] = useState(null);
  const [chatPictureData, updateChatPictureData] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/messages/" + props.chat.chat_id,
      headers: authHeader(),
    }).then((res) => {
      updateMessagesData(res.data);
    });
    axios({
      method: "get",
      url: "http://localhost:8080/chat-picture/" + props.chat.chat_id,
      responseType: "blob",
      headers: authHeader(),
    }).then((res) => {
      updateChatPictureData(res.data);
    });
  }, [props.chat.chat_id, history.location, props.chatsRequests]);

  let latest_message = {};
  if (messagesData !== null)
    if (messagesData.length !== 0) {
      latest_message = messagesData[messagesData.length - 1];
    } else {
      latest_message.message = "There are no messages in this chat yet";
    }

  return (
    <Link className="chat-list-item" to={"/messages/" + props.chat.chat_id}>
      {chatPictureData === null ? (
        <svg height="50" width="50" className="profilePicture">
          <circle cx="25" cy="25" r="25" />
        </svg>
      ) : (
        <img src={URL.createObjectURL(chatPictureData)} />
      )}
      <ul className="chat-list-item-info">
        <li className="chat-list-item-name">{props.chat.name}</li>
        <li className="chat-list-item-preview">
          <b>
            {latest_message.user !== undefined
              ? latest_message.user.profile.nickname + ": "
              : null}
          </b>
          {latest_message.message === "" ? (
            <>
              {" "}
              <fa.FaImage /> <span>Image</span>{" "}
            </>
          ) : (
            latest_message.message
          )}
        </li>
      </ul>
    </Link>
  );
};
