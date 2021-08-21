import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import ResourceService from "../../Services/ResourceService";

function CreateResourcePage() {
  var history = useHistory();
  const [subjects, setSubjects] = useState();
  useEffect(() => {
    let subjectOptions = [];
    ResourceService.getAllSubjects().then((response) => {
      response.data.map((subject, i) => {
        subjectOptions.push({ label: subject.subject, value: subject.id });
      });
      setSubjects(subjectOptions);
    });
  }, []);

  const [formData, setFormData] = useState({});

  const onFormSubmit = async (event) => {
    event.preventDefault();
    await ResourceService.postResource(formData).then(() => {
      history.push("/resources");
    });
  };

  const resetData = () => {
    setData(title, "");
    setData(subject, "");
    setData(description, "");
    setData(body, "");
  };

  // get Data
  const getData = (key) => {
    return formData.hasOwnProperty(key) ? formData[key] : "";
  };

  // Set data
  const setData = (key, value) => {
    return setFormData({ ...formData, [key]: value });
  };

  const optionSelected = (data) => {
    const course = data.label;
    setData("subject", course);
  };

  return (
    <div className="container create-resource-container d-flex flex-column align-items-center">
      <form
        onSubmit={onFormSubmit}
        className="container d-flex flex-column align-items-center"
      >
        <h2>Create Resource: </h2>
        <div class="form-group w-75">
          <label>Title</label>
          <small class="form-text text-muted">
            Name your resource something eye catching!
          </small>
          <input
            type="text"
            class="form-control"
            value={getData("title")}
            onChange={(e) => setData("title", e.target.value)}
            placeholder="Enter a resource title"
          />
        </div>
        <div class="form-group w-75">
          <label>Subject</label>
          <small class="form-text text-muted">
            Which subject is this relevent to?
          </small>
          {/* <input type="text" class="form-control" value={getData('subject')} onChange={(e) => setData('subject', e.target.value)}  placeholder="Enter a resource subject"/> */}
          <Select onChange={optionSelected} options={subjects} />
        </div>
        <div class="form-group w-75">
          <label>Description</label>
          <small class="form-text text-muted">
            Give your resource a short description
          </small>
          <input
            type="text"
            class="form-control"
            value={getData("description")}
            onChange={(e) => setData("description", e.target.value)}
            placeholder="Enter a resource description"
          />
        </div>
        <div class="form-group w-75">
          <label>Resource Body</label>
          <small class="form-text text-muted">
            This section will comprise the body of your resource
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

export default CreateResourcePage;
