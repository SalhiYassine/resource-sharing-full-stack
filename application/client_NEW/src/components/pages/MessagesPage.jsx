import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext.jsx";
import authHeader from "../../Services/authHeader";

import { ChatList } from "../messages/ChatList.jsx";

function MessagesPage() {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/" + user.userID,
      headers: authHeader(),
    }).then((res) => {
      if (res.data.profile === null) history.push("/create-profile");
    });
  }, [history]);

  return (
    <div className="messages-page">
      <div className="messages-container container">
        <ChatList />
      </div>
    </div>
  );
}

export default MessagesPage;
