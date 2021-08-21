import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useLocation, Link } from "react-router-dom";
import ResourceService from "../../Services/ResourceService";

function EditResource() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const [dataChanged, setDataChanged] = useState();
  const [loading, setLoading] = useState(true);
  const [resourceDetails, setResourceDetails] = useState();
  const [titleNew, setTitleNew] = useState();
  const [descriptionNew, setDescriptionNew] = useState();
  const [bodyNew, setBodyNew] = useState();
  const [subjectNew, setSubjectNew] = useState();

  const [errorTitle, setErrorTitle] = useState({
    status: false,
    message: "",
    display: false,
  });
  const [errorDesc, setErrorDesc] = useState({
    status: false,
    message: "",
    display: false,
  });
  const [errorBody, setErrorBody] = useState({
    status: false,
    message: "",
    display: false,
  });
  const [errorSubject, setErrorSubject] = useState({
    status: false,
    message: "",
    display: false,
  });

  const course = [
    { label: "Computer Science", value: 1 },
    { label: "Mathematics", value: 2 },
    { label: "Engineering", value: 3 },
    { label: "Business", value: 4 },
  ];

  const optionSelected = (data) => {
    const course = data.label;
    setSubjectNew(course);
  };

  useEffect(() => {
    ResourceService.getResource(path).then((response) => {
      const { title, description, body, subject } = response.data;
      setResourceDetails({
        title: title,
        description: description,
        body: body,
        subject: subject.subject,
      });

      setTitleNew(title);
      setDescriptionNew(description);
      setBodyNew(body);
      setSubjectNew(subject.subject);
      setLoading(false);
    });
  }, [dataChanged]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(titleNew, bodyNew, descriptionNew);

    if (!(titleNew == resourceDetails.title)) {
      const titleUpdate = await ResourceService.updateResourceTitle(
        path,
        titleNew
      );
      if (titleUpdate.error) {
        setErrorTitle({
          status: true,
          message: "The title must be between 1 - 30 chars!",
          display: true,
        });
      } else {
        setErrorTitle({
          status: false,
          message: "The title has been updated!",
          display: true,
        });
      }
      console.log(titleUpdate);
    }
    if (!(subjectNew == resourceDetails.subject)) {
      const subjectUpdate = await ResourceService.updateResourceSubject(
        path,
        subjectNew
      );
      if (subjectUpdate.error) {
        setErrorSubject({
          status: true,
          message: "The subject must not be blank!",
          display: true,
        });
      } else {
        setErrorSubject({
          status: false,
          message: "The subject has been updated!",
          display: true,
        });
      }
      console.log(subjectUpdate);
    }
    if (!(descriptionNew == resourceDetails.description)) {
      const descUpdate = await ResourceService.updateResourceDescription(
        path,
        descriptionNew
      );
      if (descUpdate.error) {
        setErrorDesc({
          status: true,
          message: "The description must be between 1 - 50 chars!",
          display: true,
        });
      } else {
        setErrorDesc({
          status: false,
          message: "The description has been updated",
          display: true,
        });
      }
    }
    if (!(bodyNew == resourceDetails.body)) {
      const bodyUpdate = await ResourceService.updateResourceBody(
        path,
        bodyNew
      );
      if (bodyUpdate.error) {
        setErrorBody({
          status: true,
          message: "The body must be between 1 - 10,000 chars!",
          display: true,
        });
      } else {
        setErrorBody({
          status: false,
          message: "The body has been updated!",
          display: true,
        });
      }
    }
  };

  return (
    <div className="container text-center">
      {!loading ? (
        <>
          <div className="container create-resource-container d-flex flex-column align-items-center">
            <form
              onSubmit={handleSubmit}
              className="container d-flex flex-column align-items-center"
            >
              <div className="d-flex">
                <Link
                  className="btn btn-secondary text-center m-4"
                  to={`/resources`}
                >
                  Return
                </Link>
                <h2 className="m-4">Edit Resource</h2>
              </div>
              <div class="form-group w-75">
                <label>Title</label>
                <small class="form-text text-muted">
                  Name your resource something eye catching!
                </small>
                <input
                  type="text"
                  class="form-control"
                  value={titleNew}
                  onChange={(e) => setTitleNew(e.target.value)}
                  placeholder="Enter a resource title"
                />
                {errorTitle.display ? (
                  <div
                    class={
                      errorTitle.status
                        ? `alert alert-danger`
                        : `alert alert-success`
                    }
                    role="alert"
                  >
                    {errorTitle.message}
                  </div>
                ) : null}
              </div>
              <div class="form-group w-75">
                <label>Subject</label>
                <small class="form-text text-muted">
                  Which subject is this relevent to?
                </small>
                {/* <input type="text" class="form-control"  placeholder="Enter a resource subject"/> */}
                <Select
                  onChange={optionSelected}
                  options={subjects}
                  placeholder={resourceDetails.subject}
                />
                {errorSubject.display ? (
                  <div
                    class={
                      errorSubject.status
                        ? `alert alert-danger`
                        : `alert alert-success`
                    }
                    role="alert"
                  >
                    {errorSubject.message}
                  </div>
                ) : null}
              </div>
              <div class="form-group w-75">
                <label>Description</label>
                <small class="form-text text-muted">
                  Give your resource a short description
                </small>
                <input
                  type="text"
                  class="form-control"
                  value={descriptionNew}
                  onChange={(e) => setDescriptionNew(e.target.value)}
                  placeholder="Enter a resource description"
                />
                {errorDesc.display ? (
                  <div
                    class={
                      errorDesc.status
                        ? `alert alert-danger`
                        : `alert alert-success`
                    }
                    role="alert"
                  >
                    {errorDesc.message}
                  </div>
                ) : null}
              </div>
              <div class="form-group w-75">
                <label>Resource Body</label>
                <small class="form-text text-muted">
                  This section will comprise the body of your resource
                </small>
                <textarea
                  type="text"
                  class="form-control"
                  value={bodyNew}
                  onChange={(e) => setBodyNew(e.target.value)}
                  placeholder="Enter a resource body"
                />
                {errorBody.display ? (
                  <div
                    class={
                      errorBody.status
                        ? `alert alert-danger`
                        : `alert alert-success`
                    }
                    role="alert"
                  >
                    {errorBody.message}
                  </div>
                ) : null}
              </div>

              <button type="submit" class="btn action-button w-75">
                Submit Changes
              </button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default EditResource;
