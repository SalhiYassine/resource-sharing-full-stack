import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import { PendingColleaguesList } from "../colleagues/PendingColleaguesList.jsx";

function ColleaguesPage() {
  const { user } = useContext(AuthContext);
  const [colleagueRequestsRecieved, updateColleagueRequestsRecieved] = useState(
    null
  );
  const [colleagueRequestsSent, updateColleagueRequestsSent] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/colleague-requests-received/" + user.userID,
      headers: authHeader(),
    }).then((requests) => {
      updateColleagueRequestsRecieved(requests.data);
    });
    axios({
      method: "get",
      url: "http://localhost:8080/colleague-requests-sent/" + user.userID,
      headers: authHeader(),
    }).then((requests) => {
      updateColleagueRequestsSent(requests.data);
    });
  }, []);

  return (
    <div className="colleagues-page">
      {colleagueRequestsRecieved === null ||
      colleagueRequestsSent === null ? null : (
        <div className="colleagues-container container">
          <PendingColleaguesList
            colleagueRequestsRecieved={colleagueRequestsRecieved}
            colleagueRequestsSent={colleagueRequestsSent}
          />
        </div>
      )}
    </div>
  );
}

export default ColleaguesPage;
