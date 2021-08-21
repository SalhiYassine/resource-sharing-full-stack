import React from "react";
import { useHistory } from "react-router-dom";

import ColleaguesBar from "./ColleaguesBar.jsx";
import { ColleaguesListItem } from "./ColleaguesListItem.jsx";

export const ColleaguesList = (props) => {
  const history = useHistory();

  return (
    <div
      className={
        window.location.pathname === "/colleagues"
          ? null
          : "colleagues-list-container"
      }
    >
      <ColleaguesBar history={history} colleagues={props.colleagues} />
      {props.colleagues.map((colleague, i) => {
        return (
          <ColleaguesListItem
            colleague={colleague}
            index={i}
            key={i}
            history={history}
          />
        );
      })}
    </div>
  );
};
