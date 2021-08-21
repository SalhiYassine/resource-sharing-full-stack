import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as fa from "react-icons/fa";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import ResourceSearchBar from "./ResourceSearchBar.jsx";
//import { ChatListItem } from "./ChatListItem.jsx";

export const ResourceList = ({ resValue }) => {
  const { user } = useContext(AuthContext);

  //const [unsortedChatsData, updateUnsortedChatsData] = useState([]);
  //const [chatsData, updateChatsData] = useState(null);
  const history = useHistory();
  const [searchValue, updatesearchValue] = useState("");

  /*useEffect(() => {
    setTimeout(() => {
      axios({
        method: "get",
        url: "http://localhost:8080/recourse/" + user.userID,
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
*/
  return (
    <div
      className={
        window.location.pathname === "/resource" && "resource-list-container"
      }
    >
      <div className="messages-bar">
        <ul className="messages-bar-ul">
          <li className="messages-bar-search">
            <input
              placeholder="Search for resource by name"
              value={searchValue}
              onChange={(value) => {
                updatesearchValue(value);
              }}
            />
            {resValue && (
              <ResSearchResults resValue={resValue} searchValue={searchValue} />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};
export const ResSearchResults = ({ resValue, searchValue }) => {
  var maxCount = 6;
  return (
    <ul className="messages-bar-search-results">
      {resValue.map((res, index) => {
        if (res.name.includes(searchValue) && index < maxCount) {
          return (
            <li key={chat.chat_id}>
              <p>{chat.name}</p>
            </li>
          );
        }
      })}
    </ul>
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
