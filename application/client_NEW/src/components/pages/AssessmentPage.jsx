import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/react-vis/dist/style.css";
import axios from "axios";
import { Link } from "react-router-dom";

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
  { label: "Predicted", value: 1 },
  { label: "Actual", value: 2 },
];

// const [course, setCourse] = useState({})
// const [subject, setSubject] = useState({})
// const [grade, setGrade] - useState({})

function ProgressPage() {
  return (
    <div className="container create-resource-container d-flex flex-column align-items-center">
      <form
        onSubmit={onFormSubmit}
        className="container d-flex flex-column align-items-center"
      >
        <h2>Add Assessment Title </h2>
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
          {/* <input type="text" class="form-control" value={getData('subject')} onChange={(e) => setData('subject', e.target.value)}  placeholder="Enter an assessment course"/> */}
          <Select onChange={optionSelected} options={course} />
        </div>
        <div class="form-group w-75">
          <label>Assessment Subject</label>
          <small class="form-text text-muted">Which subject?</small>
          {/* <input type="text" class="form-control" value={getData('subject')} onChange={(e) => setData('subject', e.target.value)}  placeholder="Enter an assessment subject"/> */}
          <Select onChange={optionSelected} options={subject} />
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
            placeholder="Add a date for the Assessment"
          />
        </div>
        <div class="form-group w-75">
          <label>Assessment Grade Type</label>
          <small class="form-text text-muted">
            Predicted Grade or Actual Grade?
          </small>
          <Select onChange={optionSelected} options={grade} />
        </div>
        <div class="form-group w-75">
          <label>Assessment Result</label>
          <small class="form-text text-muted">
            What grade did you receieve
          </small>
          <textarea
            type="text"
            class="form-control"
            value={getData("body")}
            onChange={(e) => setData("body", e.target.value)}
            placeholder="Enter a resource body"
          />
        </div>

        <button type="submit" class="btn action-button w-75">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ProgressPage;
