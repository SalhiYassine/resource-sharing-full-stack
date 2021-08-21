import React, { useState, useEffect } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
  HorizontalGridLines,
} from "react-vis";
import axios from "axios";
import { Link } from "react-router-dom";
import ProgressService from "../../Services/ProgressService";

// const [course, setCourse] = useState({})
// const [subject, setSubject] = useState({})

function ProgressPage() {
  const [graphData, setGraphData] = useState();

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
      setLoading(false);
    });
  }, []);

  const [loading, setLoading] = useState(true);

  const course = [
    { label: "Computer Science", value: 1 },
    { label: "Mathematics", value: 2 },
    { label: "Engineering", value: 3 },
    { label: "Business", value: 4 },
  ];

  const subject = [
    { label: "Artificial Intelligence", value: 1 },
    { label: "Software Engineering", value: 2 },
    { label: "Networking", value: 3 },
    { label: "Project Management", value: 4 },
  ];

  const grade = [
    { label: "A*", value: 7 },
    { label: "A+", value: 6 },
    { label: "A", value: 5 },
    { label: "A-", value: 4 },
    { label: "B+", value: 3 },
    { label: "B", value: 2 },
    { label: "B-", value: 1 },
  ];

  const gradeType = [
    { label: "Actual", value: 1 },
    { label: "Predicted", value: 2 },
  ];

  const [formData, setFormData] = useState({});

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const response = await ProgressService.addAssessment(formData);
    console.log(response);
  };

  const getData = (key) => {
    return formData.hasOwnProperty(key) ? formData[key] : "";
  };

  // Set data
  const setData = (key, value) => {
    return setFormData({ ...formData, [key]: value });
  };

  const optionSelectedAssessmentCourse = (data) => {
    const course = data.label;
    setData("course", course);
  };
  const optionSelectedAssessmentSubject = (data) => {
    const subject = data.label;
    setData("subject", subject);
  };
  const optionSelectedAssessmentGradeType = (data) => {
    const course = data.label;
    setData("grade type", gradeType);
  };
  const optionSelectedAssessmentGrade = (data) => {
    const grade = data.label;
    setData("grade", grade);
  };

  return (
    <div className="progress-page container-fluid d-flex glass-styling justify-content-between h-60">
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div className="progress-container container rounded  w-75 m-1 ">
            <h2 className="progress-title m-2">Progress</h2>

            {/* <div className="progress-selectors container ">
          <p className="m-3">Select a Course</p>
          <Select options={course} className="m-3" />

          <p className="m-3">Select a Subject</p>
          <Select options={subject} className="m-3" />
        </div> */}

            <div className="progress-data con container d-flex  justify-content-between m-50">
              <div className="progress-graph container rounded w-60 m-1">
                <XYPlot yDomain={[0, 17]} height={700} width={750}>
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis hideTicks />
                  <YAxis />
                  <LineSeries data={graphData} />
                </XYPlot>
              </div>

              {/* <div
            className="progress-data-numeric container  "
            class="rounded m-1 w-30"
          >
            <h2>Assessment</h2>
            <p>Result: A</p>
            <p>Type: Exam</p>
            <p>Date: 00/00/0000</p>
          </div> */}
            </div>
          </div>

          <div
            class="rounded  w-50 h-60  p-4"
            className="assessment-container container"
          >
            <form
              onSubmit={onFormSubmit}
              className="container d-flex flex-column align-items-center"
            >
              <h2>Add Assessment</h2>
              <div class="form-group w-75">
                <label>Title</label>
                <small class="form-text text-muted">
                  Enter the title for your assessment
                </small>
                <input
                  type="text"
                  class="form-control"
                  value={getData("title")}
                  onChange={(e) => setData("title", e.target.value)}
                  placeholder="Enter a assessment title"
                />
              </div>
              <div class="form-group w-75">
                <label>Assessment Course</label>
                <small class="form-text text-muted">Which course?</small>
                <Select
                  onChange={optionSelectedAssessmentCourse}
                  options={course}
                />
              </div>
              <div class="form-group w-75">
                <label>Assessment Subject</label>
                <small class="form-text text-muted">Which subject?</small>
                {/* <input type="text" class="form-control" value={getData('subject')} onChange={(e) => setData('subject', e.target.value)}  placeholder="Enter an assessment subject"/> */}
                <Select
                  onChange={optionSelectedAssessmentSubject}
                  options={subject}
                />
              </div>
              <div class="form-group w-75">
                <label for="AssessmentDate">Assessment Date</label>
                <small class="form-text text-muted">
                  When did this Assessment happen?
                </small>
                <input
                  type="date"
                  class="form-control"
                  id="assessment-date"
                  onChange={(e) => setData("date", e.target.value)}
                  placeholder="Add a date for the Assessment"
                />
              </div>
              <div class="form-group w-75">
                <label>Assessment Grade Type</label>
                <small class="form-text text-muted">
                  Predicted Grade or Actual Grade?
                </small>
                <Select
                  onChange={optionSelectedAssessmentGradeType}
                  options={gradeType}
                />
              </div>
              <div class="form-group w-75">
                <label>Assessment Result</label>
                <small class="form-text text-muted">
                  What grade did you receieve
                </small>
                <Select
                  onChange={optionSelectedAssessmentGrade}
                  options={grade}
                />
              </div>

              <button type="submit" class="btn action-button w-75">
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ProgressPage;
