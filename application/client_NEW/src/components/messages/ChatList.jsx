import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as fa from "react-icons/fa";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import MessagesBar from "./MessagesBar.jsx";
import { ChatListItem } from "./ChatListItem.jsx";

export const ChatList = (props) => {
  const { user } = useContext(AuthContext);

  const [unsortedChatsData, updateUnsortedChatsData] = useState([]);
  const [chatsData, updateChatsData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      axios({
        method: "get",
        url: "http://localhost:8080/chats/" + user.userID,
        headers: authHeader(),
      }).then((res) => {
        updateUnsortedChatsData(res.data);
        if (props.chat_id !== undefined) props.updateChatsRequests(false);
      });
    }, 200);
  }, [history.location, props.chatsRequests]);

  useEffect(() => {
    updateChatsData(sortChatsArray(unsortedChatsData));
  }, [unsortedChatsData]);

  return (
    <div
      className={
        window.location.pathname === "/messages"
          ? null
          : "messages-list-container"
      }
    >
      {chatsData === null ? (
        <ChatListPlaceholder />
      ) : (
        <div>
          <MessagesBar history={history} chatListData={chatsData} />
          {chatsData.map((chat, i) => {
            return (
              <ChatListItem
                chat={chat}
                index={i}
                key={chat.chat_id}
                chatsRequests={props.chatsRequests}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const ChatListPlaceholder = () => {
  return (
    <div className="chat-list-placeholder">
      <div className="messages-bar">
        <ul>
          <li className="messages-bar-search">
            <input placeholder="Search for Chats by Name or Username" />
          </li>
          <li className="messages-bar-button">
            <fa.FaPlus style={{ width: "1.25em" }} />
          </li>
        </ul>
      </div>
    </div>
  );
};

function sortChatsArray(chatsArray) {
  var array = chatsArray.slice();
  for (let i = 0; i < array.length; i++) {
    for (let j = 1; j < array.length; j++) {
      if (array[j - 1].date_updated < array[j].date_updated) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array.slice();
}
