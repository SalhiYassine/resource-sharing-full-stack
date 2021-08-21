import React, { useState, useEffect, useContext } from "react";
import "../../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
  HorizontalGridLines,
} from "react-vis";
import ProgressService from "../../Services/ProgressService";
import { ChatList } from "../messages/ChatList.jsx";
import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

function HomePage() {
  const { user } = useContext(AuthContext);

  const [graphData, setGraphData] = useState();
  // const [dataExists, setDataExists] = useState(false);

  useEffect(() => {
    let graphOptions = [];
    ProgressService.getAllAssessments().then((response) => {
      console.log(response.data);
      response.data.map((node, i) => {
        let grade = node.grade;
        if (grade == "A*") {
          grade = 17;
        } else if (grade == "A+") {
          grade = 16;
        } else if (grade == "A") {
          grade = 15;
        } else if (grade == "A-") {
          grade = 14;
        } else if (grade == "B+") {
          grade = 13;
        } else if (grade == "B") {
          grade = 12;
        } else if (grade == "B-") {
          grade = 11;
        } else if (grade == "C+") {
          grade = 10;
        } else if (grade == "C") {
          grade = 9;
        } else if (grade == "C-") {
          grade = 8;
        } else if (grade == "D+") {
          grade = 7;
        } else if (grade == "D") {
          grade = 6;
        } else if (grade == "D-") {
          grade = 5;
        } else if (grade == "E+") {
          grade = 4;
        } else if (grade == "E") {
          grade = 3;
        } else if (grade == "E-") {
          grade = 2;
        } else if (grade == "F") {
          grade = 1;
        }

        if (node.date != null) {
          let dateArray = node.date.split("-");
          let dateFormat = dateArray[1];

          graphOptions.push({ x: i, y: grade });
        } else {
          graphOptions.push({ x: 0, y: 0 });
        }
      });
      setGraphData(graphOptions);
    });
  }, []);

  return (
    <div className="container">
      <div className="glass-styling">
        <div className="container">
          <h1 className="text-center pt-5">Welcome back, {user.username}</h1>
          <img
            src="/static/media/logo.e71c23cd.png"
            className="mt-2 w-25 mx-auto d-block"
          ></img>
        </div>

        <div className="mt-5">
          <div className="d-flex m-2 justify-content-between align-items-center">
            <ChatList />
            <div className="home-graph-background">
              <h2 className="text-center">Your Progress</h2>
              <XYPlot yDomain={[0, 17]} height={500} width={500}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis hideTicks />
                <YAxis hideTicks />
                <LineSeries data={graphData} />
              </XYPlot>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
