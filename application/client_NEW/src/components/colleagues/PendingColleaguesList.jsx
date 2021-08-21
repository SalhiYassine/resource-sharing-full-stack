import React from "react";
import { useHistory } from "react-router-dom";

import ColleaguesBar from "./ColleaguesBar.jsx";
import { PendingColleaguesListItem } from "./PendingColleaguesListItem.jsx";

export const PendingColleaguesList = (props) => {
  const history = useHistory();
  const colleagueRequests = props.colleagueRequestsRecieved.concat(
    props.colleagueRequestsSent
  );

  return (
    <div
      className={
        window.location.pathname === "/colleagues/pending"
          ? null
          : "colleagues-list-container"
      }
    >
      <ColleaguesBar history={history} colleagues={colleagueRequests} />
      {props.colleagueRequestsRecieved.map((student, i) => {
        return (
          <PendingColleaguesListItem
            student={student}
            index={i}
            key={i}
            history={history}
            status={"received"}
          />
        );
      })}
      {props.colleagueRequestsSent.map((student, i) => {
        return (
          <PendingColleaguesListItem
            student={student}
            index={i}
            key={i}
            history={history}
            status={"sent"}
          />
        );
      })}
    </div>
  );
};
