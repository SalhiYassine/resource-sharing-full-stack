import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as ai from "react-icons/ai";
import axios from "axios";
import "../resources/ResourceItem";
import ResourceItem from "../resources/ResourceItem";
import resourceService from "../../Services/ResourceService";
import Select from "react-select";
import ResourceService from "../../Services/ResourceService";

import { ResourceList } from "../resources/ResourceList";

function ResourcesPage() {
  const [dataLoading, setDataLoading] = useState(true);
  const [resourceData, setResourceData] = useState([]);
  const [initialResourceData, setInitialResourceData] = useState([]);
  const [resourceExist, setResourceExist] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);

  const [subjects, setSubjects] = useState();
  useEffect(() => {
    let subjectOptions = [];
    subjectOptions.push({ label: "All", value: 0 });
    ResourceService.getAllSubjects().then((response) => {
      console.log(response);
      if (!response.error) {
        response.data.map((subject, i) => {
          subjectOptions.push({ label: subject.subject, value: subject.id });
        });
      }
      setSubjects(subjectOptions);
    });
  }, []);

  useEffect(() => {
    resourceService.getAllResources().then((response) => {
      if (!response.error) {
        setResourceData(response.data.reverse());
        setInitialResourceData(response.data);
        setDataLoading(false);
      }
    });
  }, [dataChanged]);

  const onSelectSubject = (data) => {
    const subject = data.label;
    setDataLoading(true);
    if (subject == "All") {
      setResourceData(initialResourceData);
      setDataLoading(false);
    } else {
      ResourceService.getAllBySubject(subject).then((response) => {
        if (!response.error) {
          setResourceData(response.data.reverse());
          setDataLoading(false);
        }
      });
    }
  };

  return (
    <div className="resource-page">
      <div className="resource-container container">
        {/* <div className="resource-filter-container container glass-styling p-2">
          <ResourceList resValues={resourceData} />
        </div> */}

        <div className="resource-filter-container container glass-styling p-2 m-3">
          <div className="resource-filter-container">
            <h5>Filter by Subject</h5>
            <Select
              options={subjects}
              onChange={onSelectSubject}
              className="w-50"
            />
          </div>
          <div className="resource-create-button-container">
            <Link to={"/resources/create"}>Create Resource</Link>
          </div>
        </div>

        {dataLoading ? (
          <div className="loading">Loading....</div>
        ) : (
          Object.keys(resourceData).map((i) => {
            return (
              <ResourceItem
                key={i}
                resource={resourceData[i]}
                dataChanged={dataChanged}
                setDataChanged={setDataChanged}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
