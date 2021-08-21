import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import { ColleaguesList } from "../colleagues/ColleaguesList.jsx";

function ColleaguesPage() {
  const { user } = useContext(AuthContext);
  const [colleagues, updateColleages] = useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/colleagues/" + user.userID,
      headers: authHeader(),
    }).then((colleagues) => {
      updateColleages(colleagues.data);
    });
  }, []);

  return (
    <div className="colleagues-page">
      {colleagues === null ? null : (
        <div className="colleagues-container container">
          <ColleaguesList colleagues={colleagues} />
        </div>
      )}
    </div>
  );
}

export default ColleaguesPage;
