import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import { ChatBar } from "./ChatBar";
import Chat from "./Chat";

export const ChatContainer = (props) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [chatData, updateChatData] = useState([]);
  const [messagesData, updateMessagesData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      axios({
        method: "get",
        url: "http://localhost:8080/chat/" + props.chat_id,
        headers: authHeader(),
      }).then((res) => {
        if (res.data === null) {
          history.push("/messages");
        }
        updateChatData(res.data);
      });
      axios({
        method: "get",
        url: "http://localhost:8080/messages/" + props.chat_id,
        headers: authHeader(),
      }).then((res) => {
        updateMessagesData(res.data);
        props.updateMessagesRequests(false);
      });
    }, 100);
  }, [props.chat_id, props.messagesRequests]);

  return (
    <div className="messages-chat-container">
      {chatData.length === 0 ? (
        <div className="loading">Loading....</div>
      ) : (
        <>
          <ChatBar chat={chatData} messages={messagesData} />
          <Chat
            user={user}
            chat={chatData}
            messages={messagesData}
            webSocket={props.webSocket}
          />
        </>
      )}
    </div>
  );
};
